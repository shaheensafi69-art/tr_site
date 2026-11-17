import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';
import { sendTelegramNotification } from '@/lib/telegram/telegram-service';

const bookingSchema = z.object({
  hotel_id: z.string().min(1, 'شناسه هتل الزامی است'),
  room_id: z.string().min(1, 'شناسه اتاق الزامی است'),
  booking_type: z.enum(['daily', 'hourly']),
  check_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ ورود نامعتبر است'),
  check_out_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ خروج نامعتبر است'),
  check_in_time: z.string().optional().nullable(),
  duration_hours: z.number().min(3).max(24).optional().nullable(),
  adults_count: z.number().min(1).max(10),
  children_count: z.number().min(0).max(10).optional().nullable().default(0),
  breakfast_included: z.boolean().default(true),
  currency: z.enum(['TOMAN', 'IRR', 'USD', 'EUR', 'AFN']).default('TOMAN'),
  customer_name: z.string().min(2, 'نام و نام خانوادگی را وارد نمایید'),
  customer_phone: z.string().min(10, 'شماره تلفن همراه معتبر وارد نمایید'),
  national_id: z.string().min(5, 'کد ملی یا شماره پاسپورت را وارد نمایید'),
  nationality_type: z.enum(['iranian', 'foreigner']).default('iranian'),
  nationality_country: z.string().optional().nullable().default('ایران'),
  customer_country_code: z.string().default('+98'),
  customer_email: z.string().email().optional().nullable().or(z.literal('')).or(z.null()),
  special_requests: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = bookingSchema.parse(body);

    const supabase = createAdminClient();

    // Construct full start and end timestamps
    let startTimestamp: string;
    let endTimestamp: string;

    if (validated.booking_type === 'hourly') {
      const time = validated.check_in_time || '14:00';
      startTimestamp = `${validated.check_in_date}T${time}:00+03:30`;
      const startDate = new Date(startTimestamp);
      const hours = validated.duration_hours || 3;
      const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
      endTimestamp = endDate.toISOString();
    } else {
      startTimestamp = `${validated.check_in_date}T14:00:00+03:30`;
      endTimestamp = `${validated.check_out_date}T12:00:00+03:30`;
    }

    // Call PostgreSQL atomic booking function
    const { data, error } = await supabase.rpc('create_booking_atomic', {
      p_customer_name: validated.customer_name,
      p_customer_phone: validated.customer_phone,
      p_customer_country_code: validated.customer_country_code,
      p_customer_email: validated.customer_email || null,
      p_hotel_id: validated.hotel_id,
      p_room_id: validated.room_id,
      p_booking_type: validated.booking_type,
      p_check_in_date: validated.check_in_date,
      p_check_out_date: validated.check_out_date,
      p_check_in_time: validated.check_in_time || null,
      p_duration_hours: validated.duration_hours || null,
      p_start_timestamp: startTimestamp,
      p_end_timestamp: endTimestamp,
      p_adults: validated.adults_count,
      p_children: validated.children_count || 0,
      p_breakfast_included: validated.breakfast_included,
      p_currency: validated.currency,
      p_special_requests: validated.special_requests || null,
    });

    if (error) {
      console.error('Supabase RPC Error:', error);
      return NextResponse.json(
        { success: false, message: 'خطا در ثبت رزرو در سیستم رزرواسیون', error: error.message },
        { status: 500 }
      );
    }

    if (!data || !data.success) {
      return NextResponse.json(
        { success: false, message: data?.error || 'امکان ثبت رزرو برای این اتاق وجود ندارد.' },
        { status: 400 }
      );
    }

    // Persist national_id and nationality in bookings and customers
    await Promise.all([
      supabase.from('customers').update({
        national_id: validated.national_id,
        nationality_type: validated.nationality_type,
        nationality_country: validated.nationality_country,
      }).eq('phone', validated.customer_phone),
      supabase.from('bookings').update({
        national_id: validated.national_id,
        nationality_type: validated.nationality_type,
        nationality_country: validated.nationality_country,
      }).eq('id', data.booking_id),
    ]);

    // Fetch hotel and room names for telegram dispatch
    const [{ data: hotelData }, { data: roomData }] = await Promise.all([
      supabase.from('hotels').select('name').eq('id', validated.hotel_id).single(),
      supabase.from('rooms').select('name').eq('id', validated.room_id).single(),
    ]);

    // Dispatch Telegram notification asynchronously
    sendTelegramNotification(
      'new_booking',
      {
        bookingCode: data.booking_code,
        customerName: validated.customer_name,
        customerPhone: validated.customer_phone,
        customerEmail: validated.customer_email || undefined,
        nationalId: validated.national_id,
        nationalityType: validated.nationality_type,
        nationalityCountry: validated.nationality_country,
        specialRequests: validated.special_requests || undefined,
        hotelName: hotelData?.name || 'هتل تابان',
        roomName: roomData?.name || 'اتاق اختصاصی',
        checkInDate: validated.check_in_date,
        checkOutDate: validated.check_out_date,
        checkInTime: validated.check_in_time,
        durationHours: validated.duration_hours,
        bookingType: validated.booking_type,
        adultsCount: validated.adults_count,
        breakfastIncluded: validated.breakfast_included,
        totalAmountToman: data.total_amount,
        totalAmountCurrency: data.total_amount_currency,
        currency: data.currency,
        paymentStatus: 'در انتظار پرداخت (کارت‌به‌کارت)',
      },
      data.booking_id
    ).catch((err) => console.error('Background telegram error:', err));

    return NextResponse.json({
      success: true,
      booking_id: data.booking_id,
      booking_code: data.booking_code,
      total_amount: data.total_amount,
      total_amount_currency: data.total_amount_currency,
      currency: data.currency,
      expires_at: data.expires_at,
      qr_data: data.qr_data,
    });
  } catch (err: any) {
    console.error('Booking API Error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: (err as any).issues?.[0]?.message || (err as any).errors?.[0]?.message || 'اطلاعات فرم نامعتبر است' },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'خطای غیرمنتظره در سرور' },
      { status: 500 }
    );
  }
}
