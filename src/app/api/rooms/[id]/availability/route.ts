import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: roomId } = await params;
    const supabase = createServerClient();

    const now = new Date();
    const futureLimit = new Date();
    futureLimit.setDate(futureLimit.getDate() + 90);

    // 1. Fetch active bookings for this room
    const { data: bookings, error: bErr } = await supabase
      .from('bookings')
      .select('id, start_timestamp, end_timestamp, check_in_date, check_out_date, status, expires_at')
      .eq('room_id', roomId)
      .neq('status', 'cancelled')
      .neq('status', 'expired')
      .gte('end_timestamp', now.toISOString())
      .lte('start_timestamp', futureLimit.toISOString());

    if (bErr) {
      console.error('Availability fetch error:', bErr);
      return NextResponse.json({ success: false, message: 'خطا در بررسی موجودی' }, { status: 500 });
    }

    // 2. Fetch room blocks (maintenance/cleaning)
    const { data: blocks } = await supabase
      .from('room_blocks')
      .select('id, start_time, end_time, block_type, reason')
      .eq('room_id', roomId)
      .gte('end_time', now.toISOString())
      .lte('start_time', futureLimit.toISOString());

    // Filter out pending bookings that have expired
    const activeBookings = (bookings || []).filter((b: any) => {
      if (b.status === 'pending') {
        const exp = new Date(b.expires_at).getTime();
        return exp > now.getTime();
      }
      return true;
    });

    const busyRanges = [
      ...activeBookings.map((b: any) => ({
        start: b.check_in_date || b.start_timestamp.slice(0, 10),
        end: b.check_out_date || b.end_timestamp.slice(0, 10),
        type: 'booked',
      })),
      ...(blocks || []).map((bl: any) => ({
        start: bl.start_time.slice(0, 10),
        end: bl.end_time.slice(0, 10),
        type: bl.block_type,
      })),
    ];

    return NextResponse.json({
      success: true,
      busyRanges,
    });
  } catch (err: any) {
    console.error('Availability API error:', err);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}

