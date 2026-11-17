import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramNotification } from '@/lib/telegram/telegram-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      booking_code,
      phone,
      refund_method = 'card',
      refund_card_number,
      refund_account_holder,
      cancellation_reason,
    } = body;

    if (!booking_code || !phone) {
      return NextResponse.json(
        { error: 'کد پیگیری رزرو و شماره تماس مسافر الزامی است.' },
        { status: 400 }
      );
    }

    const cleanCode = String(booking_code).trim().toUpperCase();
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');

    const supabase = createAdminClient();

    // 1. Fetch booking with customer, hotel, room
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:customers(*),
        hotel:hotels(*),
        room:rooms(*)
      `)
      .eq('booking_code', cleanCode)
      .single();

    if (fetchErr || !booking) {
      return NextResponse.json(
        { error: 'رزروی با این مشخصات یافت نشد.' },
        { status: 404 }
      );
    }

    // Verify phone matches customer phone
    const dbPhone = String(booking.customer?.phone || '').replace(/[^0-9]/g, '');
    if (!dbPhone.endsWith(cleanPhone.slice(-8)) && !cleanPhone.endsWith(dbPhone.slice(-8))) {
      return NextResponse.json(
        { error: 'شماره تماس وارد شده با شماره ثبت‌شده در رزرو مطابقت ندارد.' },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (booking.status === 'cancelled' || booking.status === 'cancellation_requested') {
      return NextResponse.json(
        {
          error: 'درخواست لغو این رزرو قبلاً ثبت شده است و در صف پردازش می‌باشد.',
          booking,
        },
        { status: 400 }
      );
    }

    // 2. Enforce the 3-Tier Cancellation Policy (User Specification):
    // - Over 24 hours before check-in (>24h): 100% Full refund (پول مکمل عودت می‌شود)
    // - Within 24 hours before check-in (0h - 24h): 50% Refund (۵۰٪ جریمه کنسلی)
    // - On arrival day / after check-in (<=0h): Non-refundable (غیرقابل استرداد)
    let checkInDateTime: Date;
    if (booking.booking_type === 'hourly' && booking.check_in_time) {
      const [h, m] = booking.check_in_time.split(':').map(Number);
      checkInDateTime = new Date(`${booking.check_in_date}T${String(h || 14).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`);
    } else {
      const checkInHour = booking.hotel?.check_in_time ? parseInt(booking.hotel.check_in_time.split(':')[0]) : 14;
      checkInDateTime = new Date(`${booking.check_in_date}T${String(checkInHour).padStart(2, '0')}:00:00`);
    }

    const now = new Date();
    const diffHours = (checkInDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 0) {
      return NextResponse.json(
        {
          eligible: false,
          error: 'طبق قوانین رسمی رزرواسیون تهران‌روم، در روز ورود و پس از موعد تحویل اتاق (ساعت ورود)، به دلیل مسدود ماندن ظرفیت اقامتگاه، رزرو غیرقابل کنسلی و استرداد می‌باشد.',
          diffHours: Math.round(diffHours),
        },
        { status: 400 }
      );
    }

    const isCashPickup = refund_method === 'cash';
    if (!isCashPickup && (!refund_card_number || !refund_account_holder)) {
      return NextResponse.json(
        { error: 'شماره کارت بانکی ۱۶ رقمی و نام صاحب حساب جهت عودت وجه الزامی است.' },
        { status: 400 }
      );
    }

    // 3. Refund Amount Calculation
    const totalAmount = Number(booking.total_amount) || 0;
    const isFullRefund = diffHours > 24;
    const refundPercentage = isFullRefund ? 100 : 50;
    const refundAmount = isFullRefund ? totalAmount : Math.round(totalAmount * 0.5);

    const finalCardNumber = isCashPickup
      ? 'دریافت نقدی در باجه پذیرش هتل'
      : String(refund_card_number).trim();
    const finalAccountHolder = isCashPickup
      ? (refund_account_holder ? String(refund_account_holder).trim() : booking.customer?.full_name || 'مسافر')
      : String(refund_account_holder).trim();

    // 4. Update booking record
    const { data: updatedBooking, error: updateErr } = await supabase
      .from('bookings')
      .update({
        status: 'cancellation_requested',
        refund_amount: refundAmount,
        refund_card_number: finalCardNumber,
        refund_account_holder: finalAccountHolder,
        cancellation_reason: cancellation_reason ? String(cancellation_reason).trim() : null,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id)
      .select()
      .single();

    if (updateErr) {
      throw updateErr;
    }

    // 5. Send Rich Telegram and Rubika notification to admins with ALL customer data
    const statusNote = isFullRefund
      ? (isCashPickup ? 'استرداد ۱۰۰٪ کامل (دریافت نقدی در پذیرش هتل)' : 'استرداد ۱۰۰٪ کامل کل وجه (کارت‌به‌کارت)')
      : (isCashPickup ? 'استرداد ۵۰٪ وجه (دریافت نقدی در پذیرش هتل - ۵۰٪ جریمه کنسلی)' : 'استرداد ۵۰٪ وجه (کارت‌به‌کارت - ۵۰٪ جریمه کنسلی)');

    await sendTelegramNotification(
      'booking_cancelled',
      {
        bookingCode: booking.booking_code,
        customerName: booking.customer?.full_name || 'مسافر گرامی',
        customerPhone: booking.customer?.phone || cleanPhone,
        customerEmail: booking.customer?.email,
        nationalId: booking.national_id || booking.customer?.national_id,
        nationalityType: booking.nationality_type || booking.customer?.nationality_type,
        nationalityCountry: booking.nationality_country || booking.customer?.nationality_country,
        hotelName: booking.hotel?.name || 'هتل تهران‌روم',
        roomName: booking.room?.name || 'اتاق رزرو شده',
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        checkInTime: booking.check_in_time,
        durationHours: booking.duration_hours,
        bookingType: booking.booking_type,
        adultsCount: booking.adults_count,
        breakfastIncluded: booking.breakfast_included,
        totalAmountToman: totalAmount,
        totalAmountCurrency: Number(booking.total_amount_currency) || totalAmount,
        currency: booking.currency || 'TOMAN',
        paymentStatus: statusNote,
        refundAmount: refundAmount,
        refundCardNumber: finalCardNumber,
        refundAccountHolder: finalAccountHolder,
        cancellationReason: `${cancellation_reason || 'انصراف مسافر'} (میزان بازپرداخت: ${refundPercentage}٪)`,
      },
      booking.id
    );

    return NextResponse.json({
      success: true,
      eligible: true,
      refund_percentage: refundPercentage,
      message: isFullRefund
        ? 'درخواست لغو با موفقیت ثبت شد. با توجه به اینکه بیش از ۲۴ ساعت به زمان ورود باقی مانده است، ۱۰۰٪ مبلغ پرداختی عودت داده خواهد شد.'
        : 'درخواست لغو با موفقیت ثبت شد. با توجه به ورود به بازه ۲۴ ساعت قبل از اقامت، طبق قوانین ۵۰٪ مبلغ پرداختی عودت داده خواهد شد.',
      refund_amount: refundAmount,
      booking_code: booking.booking_code,
    });
  } catch (error: any) {
    console.error('Cancellation error:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت درخواست لغو: ' + (error.message || 'خطای ناشناخته') },
      { status: 500 }
    );
  }
}
