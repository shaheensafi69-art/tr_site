import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function performTracking(booking_code: string, phone: string) {
  if (!booking_code) {
    return NextResponse.json(
      { success: false, message: 'کد پیگیری رزرو الزامی است.', error: 'کد پیگیری رزرو الزامی است.' },
      { status: 400 }
    );
  }

  const cleanCode = booking_code.trim().toUpperCase();
  const cleanPhone = phone ? phone.trim() : '';

  const supabase = createAdminClient();

  // 1. Fetch booking by booking_code
  const { data: booking, error: bError } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_code', cleanCode)
    .single();

  if (bError || !booking) {
    return NextResponse.json(
      { success: false, message: 'رزروی با این کد پیگیری یافت نشد.', error: 'رزروی با این کد پیگیری یافت نشد.' },
      { status: 404 }
    );
  }

  // 2. Fetch customer
  const { data: customer, error: cError } = await supabase
    .from('customers')
    .select('id, full_name, phone, email, national_id, nationality_type, nationality_country')
    .eq('id', booking.customer_id)
    .single();

  if (cError || !customer) {
    return NextResponse.json(
      { success: false, message: 'اطلاعات مسافر یافت نشد.', error: 'اطلاعات مسافر یافت نشد.' },
      { status: 404 }
    );
  }

  // If phone was supplied, verify it matches
  if (cleanPhone) {
    const rawDbDigits = String(customer.phone || '').replace(/[^0-9]/g, '');
    const rawInputDigits = String(cleanPhone).replace(/[^0-9]/g, '');

    const last8Db = rawDbDigits.slice(-8);
    const last8Input = rawInputDigits.slice(-8);

    if (last8Db && last8Input && last8Db !== last8Input) {
      return NextResponse.json(
        {
          success: false,
          message: 'شماره موبایل وارد شده با اطلاعات این رزرو همخوانی ندارد.',
          error: 'شماره موبایل وارد شده با اطلاعات این رزرو همخوانی ندارد.',
        },
        { status: 403 }
      );
    }
  }

  // 3. Fetch hotel, room, payment, bank account
  const [
    { data: hotel },
    { data: room },
    { data: payment },
    { data: bankAccounts },
  ] = await Promise.all([
    supabase.from('hotels').select('*').eq('id', booking.hotel_id).single(),
    supabase.from('rooms').select('*').eq('id', booking.room_id).single(),
    supabase.from('payments').select('*').eq('booking_id', booking.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('bank_accounts').select('*').eq('is_active', true).limit(2),
  ]);

  const fullBooking = {
    ...booking,
    customer,
    hotel,
    room,
    payment,
  };

  return NextResponse.json({
    success: true,
    booking: fullBooking,
    data: {
      booking: {
        ...booking,
        customer,
      },
      hotel,
      room,
      payment,
      bankAccounts,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code') || searchParams.get('booking_code') || '';
    const phone = searchParams.get('phone') || '';
    return await performTracking(code, phone);
  } catch (err: any) {
    console.error('Track GET error:', err);
    return NextResponse.json(
      { success: false, message: 'خطا در بازیابی اطلاعات رزرو', error: 'خطا در بازیابی اطلاعات رزرو' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = body.booking_code || body.code || '';
    const phone = body.phone || '';
    return await performTracking(code, phone);
  } catch (err: any) {
    console.error('Track POST error:', err);
    return NextResponse.json(
      { success: false, message: 'خطا در بازیابی اطلاعات رزرو', error: 'خطا در بازیابی اطلاعات رزرو' },
      { status: 500 }
    );
  }
}
