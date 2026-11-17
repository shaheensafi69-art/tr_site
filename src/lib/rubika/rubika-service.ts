export interface RubikaBookingPayload {
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

export async function sendRubikaNotification(
  text: string,
  chatId?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const token =
    process.env.RUBIKA_BOT_TOKEN ||
    'CJFFJC0OAUVJPINPXESUNWLFWAIYFYONBAHGOLEPFXICQBQAKWXYIZEQHTURIELM';
  const targetChatId =
    chatId ||
    process.env.RUBIKA_CHAT_ID ||
    'b0DtjUc0BS1m03e2739480186618e1d4';

  if (!token || !targetChatId) {
    return { success: false, error: 'Rubika bot token or chat ID is missing.' };
  }

  try {
    const url = `https://botapi.rubika.ir/v3/${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
      }),
    });

    const result = await res.json();
    return { success: result.status === 'OK', data: result };
  } catch (err: any) {
    console.error('Rubika notification request error:', err);
    return { success: false, error: err.message };
  }
}

export function buildRubikaMessage(
  eventType: 'new_booking' | 'receipt_uploaded' | 'booking_cancelled' | 'status_changed',
  payload: RubikaBookingPayload
): string {
  const titles = {
    new_booking: '🔔 رزرو جدید ثبت شد (در انتظار پرداخت)',
    receipt_uploaded: '💳 فیش بانکی جدید بارگذاری شد (جهت بررسی و تایید)',
    booking_cancelled: '⚠️ درخواست لغو رزرو و استرداد وجه (قانون ۲۴ ساعت)',
    status_changed: '🔄 تغییر وضعیت رزرو در سامانه',
  };

  const bookingTypeText =
    payload.bookingType === 'hourly'
      ? `ساعتی (${payload.durationHours || 3} ساعت - ساعت ورود ${payload.checkInTime || '۱۴:۰۰'})`
      : `روزانه (از ${payload.checkInDate} تا ${payload.checkOutDate})`;

  const idText =
    payload.nationalityType === 'foreigner'
      ? `🛂 پاسپورت: ${payload.nationalId || 'ثبت نشده'} (اتباع ${payload.nationalityCountry || 'خارجی'})`
      : `🆔 کد ملی: ${payload.nationalId || 'ثبت نشده'} (ایرانی)`;

  let refundDetails = '';
  if (payload.refundAmount) {
    refundDetails = `
---------------------------------
💸 مبلغ استردادی ۵۰٪: ${payload.refundAmount.toLocaleString()} تومان
💳 نحوه بازپرداخت: ${payload.refundCardNumber || 'دریافت نقدی در پذیرش هتل'}
👤 نام گیرنده وجه: ${payload.refundAccountHolder || payload.customerName}
${payload.cancellationReason ? `❓ علت درخواست لغو: ${payload.cancellationReason}\n` : ''}`;
  }

  return `
${titles[eventType] || 'اطلاعیه رزرواسیون تهران‌روم'}
---------------------------------
🔖 کد پیگیری: ${payload.bookingCode}
👤 نام مسافر: ${payload.customerName}
${idText}
📞 شماره تماس: ${payload.customerPhone}
${payload.customerEmail ? `✉️ ایمیل: ${payload.customerEmail}\n` : ''}🏨 هتل / اقامتگاه: ${payload.hotelName}
🛏️ نوع واحد: ${payload.roomName}
📅 نوع اقامت: ${bookingTypeText}
👥 تعداد مسافرین: ${payload.adultsCount} نفر
🍳 صبحانه بوفه: ${payload.breakfastIncluded ? 'رایگان (همراه اقامت)' : 'بدون صبحانه'}
${payload.specialRequests ? `📝 درخواست ویژه: ${payload.specialRequests}\n` : ''}---------------------------------
💰 مبلغ کل سفارش: ${payload.totalAmountCurrency.toLocaleString()} ${payload.currency} (${payload.totalAmountToman.toLocaleString()} تومان)
💳 وضعیت پرداخت: ${payload.paymentStatus}
${payload.trackingNumber ? `🔢 شماره پیگیری فیش: ${payload.trackingNumber}\n` : ''}${payload.receiptUrl ? `📎 لینک فیش: ${payload.receiptUrl}\n` : ''}${refundDetails}---------------------------------
🌐 سامانه هوشمند رزرواسیون تهران‌روم
https://tehranroom.com
`.trim();
}
