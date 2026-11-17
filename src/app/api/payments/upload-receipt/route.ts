import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramNotification } from '@/lib/telegram/telegram-service';
import { uploadToR2 } from '@/lib/cloudflare/r2';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const bookingId = formData.get('booking_id') as string;
    const trackingNumber = formData.get('tracking_number') as string;
    const bankAccountId = formData.get('bank_account_id') as string;
    const notes = formData.get('notes') as string;
    const receiptFile = formData.get('receipt_file') as File | null;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: 'شناسه رزرو الزامی است.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify booking
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bErr || !booking) {
      return NextResponse.json(
        { success: false, message: 'رزرو مورد نظر یافت نشد.' },
        { status: 404 }
      );
    }

    let receiptUrl: string | null = null;

    if (receiptFile && receiptFile.size > 0) {
      try {
        const fileExt = receiptFile.name.split('.').pop() || 'jpg';
        const fileName = `${booking.booking_code}_${Date.now()}.${fileExt}`;
        const buffer = Buffer.from(await receiptFile.arrayBuffer());

        // Upload to Cloudflare R2 dedicated bucket
        const { url } = await uploadToR2(
          buffer,
          fileName,
          'receipts',
          receiptFile.type || 'image/jpeg'
        );
        receiptUrl = url;
      } catch (uploadErr) {
        console.error('Cloudflare R2 Receipt upload error:', uploadErr);
      }
    }

    // Upsert or update payment
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let paymentId: string;

    if (existingPayment) {
      paymentId = existingPayment.id;
      await supabase
        .from('payments')
        .update({
          bank_account_id: bankAccountId || null,
          tracking_number: trackingNumber || null,
          receipt_url: receiptUrl || null,
          notes: notes || null,
          status: 'awaiting_verification',
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId);
    } else {
      const { data: newPayment } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          amount: booking.total_amount_currency,
          currency: booking.currency,
          bank_account_id: bankAccountId || null,
          tracking_number: trackingNumber || null,
          receipt_url: receiptUrl,
          notes: notes || null,
          status: 'awaiting_verification',
        })
        .select('id')
        .single();
      paymentId = newPayment?.id || '';
    }

    // Fetch details for telegram notification
    const [{ data: customer }, { data: hotel }, { data: room }] = await Promise.all([
      supabase.from('customers').select('*').eq('id', booking.customer_id).single(),
      supabase.from('hotels').select('*').eq('id', booking.hotel_id).single(),
      supabase.from('rooms').select('*').eq('id', booking.room_id).single(),
    ]);

    // Dispatch Telegram notification
    sendTelegramNotification(
      'receipt_uploaded',
      {
        bookingCode: booking.booking_code,
        customerName: customer?.full_name || 'مسافر',
        customerPhone: customer?.phone || '-',
        customerEmail: customer?.email || undefined,
        nationalId: customer?.national_id || booking?.national_id || undefined,
        hotelName: hotel?.name || 'هتل تابان',
        roomName: room?.name || 'اتاق اختصاصی',
        checkInDate: booking.check_in_date,
        checkOutDate: booking.check_out_date,
        bookingType: booking.booking_type,
        adultsCount: booking.adults_count,
        breakfastIncluded: booking.breakfast_included,
        totalAmountToman: Number(booking.total_amount),
        totalAmountCurrency: Number(booking.total_amount_currency),
        currency: booking.currency,
        paymentStatus: 'در انتظار تأیید رسید فیش بانکی',
        trackingNumber: trackingNumber || 'ثبت نشده',
        receiptUrl: receiptUrl,
      },
      booking.id
    ).catch((err) => console.error('Telegram dispatch error on receipt upload:', err));

    return NextResponse.json({
      success: true,
      message: 'رسید پرداخت با موفقیت ثبت شد و در صف تأیید کارشناسان رزرواسیون قرار گرفت.',
      receipt_url: receiptUrl,
    });
  } catch (err: any) {
    console.error('Payment upload error:', err);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری رسید پرداخت' },
      { status: 500 }
    );
  }
}

