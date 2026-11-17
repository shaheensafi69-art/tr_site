import { createAdminClient } from '@/lib/supabase/admin';
import { sendRubikaNotification, buildRubikaMessage } from '@/lib/rubika/rubika-service';

export interface TelegramBookingPayload {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  nationalId?: string | null;
  nationalityType?: string | null;
  nationalityCountry?: string | null;
  hotelName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime?: string | null;
  durationHours?: number | null;
  bookingType: string;
  adultsCount: number;
  breakfastIncluded: boolean;
  totalAmountToman: number;
  totalAmountCurrency: number;
  currency: string;
  paymentStatus: string;
  trackingNumber?: string | null;
  receiptUrl?: string | null;
  specialRequests?: string | null;
  refundAmount?: number | null;
  refundCardNumber?: string | null;
  refundAccountHolder?: string | null;
  cancellationReason?: string | null;
}

export async function sendTelegramNotification(
  eventType: 'new_booking' | 'receipt_uploaded' | 'booking_cancelled' | 'status_changed',
  payload: TelegramBookingPayload,
  bookingId?: string
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // Support multiple chat IDs (e.g. from TELEGRAM_CHAT_IDS or TELEGRAM_CHAT_ID + TELEGRAM_CHAT_ID_2)
  const chatIds: string[] = [];
  if (process.env.TELEGRAM_CHAT_IDS) {
    process.env.TELEGRAM_CHAT_IDS.split(',').map((id) => id.trim()).forEach((id) => {
      if (id) chatIds.push(id);
    });
  }
  if (process.env.TELEGRAM_CHAT_ID && !chatIds.includes(process.env.TELEGRAM_CHAT_ID)) {
    chatIds.push(process.env.TELEGRAM_CHAT_ID);
  }
  if (process.env.TELEGRAM_CHAT_ID_2) {
    chatIds.push(process.env.TELEGRAM_CHAT_ID_2);
  }
  if (chatIds.length === 0) {
    chatIds.push('5195615040'); // Default Safi Academy Chat ID
  }

  const eventTitleMap = {
    new_booking: '🔔 <b>رزرو جدید ثبت شد (در انتظار پرداخت)</b>',
    receipt_uploaded: '💳 <b>رسید پرداخت جدید بارگذاری شد (جهت تایید پذیرش)</b>',
    booking_cancelled: '⚠️ <b>درخواست لغو رزرو و استرداد وجه (قانون ۲۴ ساعت)</b>',
    status_changed: '🔄 <b>وضعیت رزرو به‌روزرسانی شد</b>',
  };

  const bookingTypeText = payload.bookingType === 'hourly'
    ? `ساعتی (${payload.durationHours || 3} ساعت - ساعت ورود ${payload.checkInTime || '۱۴:۰۰'})`
    : `روزانه (از ${payload.checkInDate} تا ${payload.checkOutDate})`;

  const refundDetails = payload.refundAmount ? `
---------------------------------
💸 <b>مبلغ استردادی ۵۰٪:</b> <b>${payload.refundAmount.toLocaleString()} تومان</b>
💳 <b>نحوه و مشخصات استرداد:</b> <code>${payload.refundCardNumber || 'ثبت نشده'}</code>
👤 <b>نام گیرنده وجه / صاحب حساب:</b> ${payload.refundAccountHolder || 'ثبت نشده'}
${payload.cancellationReason ? `❓ <b>علت انصراف:</b> ${payload.cancellationReason}` : ''}
` : '';

  const messageText = `
${eventTitleMap[eventType] || 'اطلاعیه رزرواسیون تهران‌روم'}
---------------------------------
🔖 <b>کد رهگیری:</b> <code>${payload.bookingCode}</code>
👤 <b>نام مسافر:</b> ${payload.customerName}
${payload.nationalityType === 'foreigner' ? `🛂 <b>شماره پاسپورت:</b> <code>${payload.nationalId || 'ثبت نشده'}</code> (کشور: ${payload.nationalityCountry || 'اتباع غیرایرانی'})` : `🆔 <b>کد ملی:</b> <code>${payload.nationalId || 'ثبت نشده'}</code> (ایرانی)`}
📞 <b>شماره تماس:</b> <code>${payload.customerPhone}</code>
${payload.customerEmail ? `✉️ <b>ایمیل:</b> ${payload.customerEmail}\n` : ''}🏨 <b>هتل:</b> ${payload.hotelName}
🛏️ <b>نوع اتاق:</b> ${payload.roomName}
📅 <b>نوع و بازه اقامت:</b> ${bookingTypeText}
👥 <b>تعداد مهمانان:</b> ${payload.adultsCount} نفر
🍳 <b>صبحانه بوفه:</b> ${payload.breakfastIncluded ? 'رایگان (روی اتاق)' : 'بدون صبحانه'}
${payload.specialRequests ? `📝 <b>درخواست ویژه:</b> ${payload.specialRequests}\n` : ''}---------------------------------
💰 <b>مبلغ نهایی رزرو:</b> <b>${payload.totalAmountCurrency.toLocaleString()} ${payload.currency}</b> (${payload.totalAmountToman.toLocaleString()} تومان / ${(payload.totalAmountToman * 10).toLocaleString()} ریال)
💳 <b>وضعیت پرداخت:</b> ${payload.paymentStatus}
${payload.trackingNumber ? `🔢 <b>شماره پیگیری فیش:</b> <code>${payload.trackingNumber}</code>\n` : ''}${payload.receiptUrl ? `📎 <b>تصویر فیش:</b> <a href="${payload.receiptUrl}">مشاهده فیش بانکی</a>\n` : ''}${refundDetails}---------------------------------
🌐 <b>سامانه رزرواسیون هتل‌های تهران‌روم</b>
https://tehranroom.com
  `.trim();

  // 1. Log notification in database
  try {
    const supabase = createAdminClient();
    await supabase.from('telegram_notifications').insert({
      booking_id: bookingId || null,
      event_type: eventType,
      message: messageText,
      status: botToken ? 'sent' : 'pending',
      error_message: botToken ? null : 'Telegram credentials not set in environment',
    });
  } catch (logErr) {
    console.error('Failed to log telegram notification in DB:', logErr);
  }

  // 2. If botToken is missing, exit
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN is missing in environment.');
    return { success: false, error: 'Telegram bot token missing' };
  }

  // 3. Dispatch to all configured chat IDs
  let anySuccess = false;
  for (const cid of chatIds) {
    try {
      if (payload.receiptUrl) {
        // Send Photo with caption if possible
        const photoRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cid,
            photo: payload.receiptUrl,
            caption: messageText.substring(0, 1024),
            parse_mode: 'HTML',
          }),
        });

        const photoData = await photoRes.json();
        if (photoRes.ok && photoData.ok) {
          anySuccess = true;
          continue;
        }
      }

      // Fallback or Standard Message
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cid,
          text: messageText,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.ok) {
        anySuccess = true;
      } else {
        console.error(`Telegram API error for chat_id ${cid}:`, resData);
      }
    } catch (err: any) {
      console.error(`Telegram network error for chat_id ${cid}:`, err);
    }
  }

  // 4. Also dispatch to Rubika Bot (User Request)
  try {
    const rubikaText = buildRubikaMessage(eventType, payload);
    await sendRubikaNotification(rubikaText);
  } catch (rubikaErr) {
    console.error('Failed to send Rubika notification:', rubikaErr);
  }

  return { success: anySuccess };
}

