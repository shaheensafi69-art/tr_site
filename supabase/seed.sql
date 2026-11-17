-- ====================================================================
-- TehranRoom Platform Initial Seed Data
-- ====================================================================

-- 1. CURRENCIES & RATES (Base: 1 unit of foreign currency = X Toman)
INSERT INTO public.currencies (code, name_fa, name_en, symbol, rate_to_toman, is_active)
VALUES
    ('TOMAN', 'تومان', 'Toman', 'تومان', 1.0000, true),
    ('USD', 'دلار آمریکا', 'US Dollar', '$', 95000.0000, true),
    ('EUR', 'یورو', 'Euro', '€', 102000.0000, true),
    ('AFN', 'افغانی', 'Afghan Afghani', '؋', 1320.0000, true)
ON CONFLICT (code) DO UPDATE
SET rate_to_toman = EXCLUDED.rate_to_toman, name_fa = EXCLUDED.name_fa;

-- 2. SITE SETTINGS
INSERT INTO public.site_settings (
    id, brand_name, tagline, phone, whatsapp, telegram, email, address, commission_rate_default, hold_duration_minutes
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'TehranRoom',
    'اقامت ایده‌آل شما، فقط چند کلیک فاصله دارد',
    '021-91008899',
    '+989123456789',
    'tehranroom_admin',
    'support@tehranroom.com',
    'تهران، خیابان ولیعصر، نرسیده به پارک ملت، برج تابان، طبقه ۴',
    10.00,
    30
) ON CONFLICT (id) DO NOTHING;

-- 3. BANK ACCOUNTS (For Card-to-Card Payment)
INSERT INTO public.bank_accounts (
    id, bank_name, card_number, account_number, iban, account_holder, currency, is_active
) VALUES 
(
    'b0000000-0000-0000-0000-000000000001',
    'بانک سامان',
    '6219-8610-8888-9999',
    '888-800-123456-1',
    'IR880560088880001234567801',
    'پلتفرم رزرو آنلاین تهران‌روم (TehranRoom)',
    'TOMAN',
    true
),
(
    'b0000000-0000-0000-0000-000000000002',
    'بانک ملت',
    '6104-3378-5555-7777',
    '4433221100',
    'IR120120000000004433221100',
    'پلتفرم رزرو آنلاین تهران‌روم (TehranRoom)',
    'TOMAN',
    true
) ON CONFLICT (id) DO NOTHING;

-- 4. ALL 31 PROVINCES OF IRAN (Only Tehran is active initially)
INSERT INTO public.provinces (id, name, slug, is_active, display_order, description)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'تهران', 'tehran', true, 1, 'پایتخت و قطب اداری، تجاری و فرهنگی ایران'),
    ('c0000000-0000-0000-0000-000000000002', 'اصفهان', 'isfahan', false, 2, 'نصف جهان، مهد تاریخ و معماری باشکوه'),
    ('c0000000-0000-0000-0000-000000000003', 'فارس', 'fars', false, 3, 'شیراز، دیار حافظ و سعدی و تخت جمشید'),
    ('c0000000-0000-0000-0000-000000000004', 'خراسان رضوی', 'khorasan-razavi', false, 4, 'مشهد، پایتخت معنوی و گردشگری مذهبی'),
    ('c0000000-0000-0000-0000-000000000005', 'خوزستان', 'khuzestan', false, 5, 'سرزمین نخل و آفتاب و تاریخ کهن'),
    ('c0000000-0000-0000-0000-000000000006', 'آذربایجان شرقی', 'east-azerbaijan', false, 6, 'تبریز، شهر اولین‌ها و بازار ثبت جهانی'),
    ('c0000000-0000-0000-0000-000000000007', 'آذربایجان غربی', 'west-azerbaijan', false, 7, 'ارومیه، شهر آب و باغ‌های پربار'),
    ('c0000000-0000-0000-0000-000000000008', 'مازندران', 'mazandaran', false, 8, 'طبیعت سرسبز البرز و سواحل خزر'),
    ('c0000000-0000-0000-0000-000000000009', 'گیلان', 'gilan', false, 9, 'رشت، شهر خلاق خوراک‌شناسی یونسکو'),
    ('c0000000-0000-0000-0000-000000000010', 'البرز', 'alborz', false, 10, 'کرج و دامنه‌های زیبای جاده چالوس'),
    ('c0000000-0000-0000-0000-000000000011', 'کرمان', 'kerman', false, 11, 'دیار کویر لوت و باغ شازده'),
    ('c0000000-0000-0000-0000-000000000012', 'یزد', 'yazd', false, 12, 'شهر بادگیرها و نخستین شهر خشتی ثبت جهانی'),
    ('c0000000-0000-0000-0000-000000000013', 'قم', 'qom', false, 13, 'قطب زیارتی و گردشگری مذهبی مرکز کشور'),
    ('c0000000-0000-0000-0000-000000000014', 'مرکزی', 'markazi', false, 14, 'اراک و دیار مفاخر و صنایع بزرگ'),
    ('c0000000-0000-0000-0000-000000000015', 'همدان', 'hamedan', false, 15, 'پایتخت تاریخ و تمدن ایران زمین و غار علیصدر'),
    ('c0000000-0000-0000-0000-000000000016', 'کرمانشاه', 'kermanshah', false, 16, 'طاق بستان، بیستون و دیار پهلوانان'),
    ('c0000000-0000-0000-0000-000000000017', 'کردستان', 'kurdistan', false, 17, 'سنندج و دریاچه زریبار و اورامانات'),
    ('c0000000-0000-0000-0000-000000000018', 'لرستان', 'lorestan', false, 18, 'سرزمین آبشارها و دژ فلک‌الافلاک'),
    ('c0000000-0000-0000-0000-000000000019', 'ایلام', 'ilam', false, 19, 'عروس زاگرس و طبیعت کوهستانی بکر'),
    ('c0000000-0000-0000-0000-000000000020', 'بوشهر', 'bushehr', false, 20, 'کرانه نیلگون خلیج فارس و موسیقی گرم جنوب'),
    ('c0000000-0000-0000-0000-000000000021', 'هرمزگان', 'hormozgan', false, 21, 'بندرعباس، قشم و کیش مرواریدهای خلیج فارس'),
    ('c0000000-0000-0000-0000-000000000022', 'سیستان و بلوچستان', 'sistan-baluchestan', false, 22, 'چابهار، تنها بندر اقیانوسی و شهر سوخته'),
    ('c0000000-0000-0000-0000-000000000023', 'خراسان جنوبی', 'south-khorasan', false, 23, 'بیرجند، دیار زعفران و زرشک و روستاهای تاریخی'),
    ('c0000000-0000-0000-0000-000000000024', 'خراسان شمالی', 'north-khorasan', false, 24, 'بجنورد، باب‌الرضا و سرزمین اسب‌های اصیل'),
    ('c0000000-0000-0000-0000-000000000025', 'گلستان', 'golestan', false, 25, 'گرگان، دشت ترکمن و جنگل‌های هیرکانی'),
    ('c0000000-0000-0000-0000-000000000026', 'سمنان', 'semnan', false, 26, 'دروازه کویر و شاهوار با آسمان پرستاره'),
    ('c0000000-0000-0000-0000-000000000027', 'زنجان', 'zanjan', false, 27, 'پایتخت شور و شعور حسینی و گنبد سلطانیه'),
    ('c0000000-0000-0000-0000-000000000028', 'قزوین', 'qazvin', false, 28, 'پایتخت خوشنویسی و کاروانسراهای تاریخی'),
    ('c0000000-0000-0000-0000-000000000029', 'اردبیل', 'ardabil', false, 29, 'سرعین، چشمه‌های آبگرم سبلان و بقعه شیخ صفی'),
    ('c0000000-0000-0000-0000-000000000030', 'چهارمحال و بختیاری', 'chaharmahal-bakhtiari', false, 30, 'بام ایران و سرچشمه زاینده‌رود و کارون'),
    ('c0000000-0000-0000-0000-000000000031', 'کهگیلویه و بویراحمد', 'kohgiluyeh-boyerahmad', false, 31, 'سرزمین بلوط‌های زاگرس و یاسوج پایتخت طبیعت')
ON CONFLICT (id) DO UPDATE SET is_active = EXCLUDED.is_active, name = EXCLUDED.name;

-- 5. CITIES (Tehran is active)
INSERT INTO public.cities (id, province_id, name, slug, is_active, display_order)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'تهران', 'tehran', true, 1)
ON CONFLICT (id) DO NOTHING;

-- 6. HOTEL TABAN (هتل تابان تهران)
INSERT INTO public.hotels (
    id,
    name,
    slug,
    province_id,
    city_id,
    stars,
    rating,
    review_count,
    address,
    cover_image,
    images,
    short_description,
    description,
    phone,
    email,
    latitude,
    longitude,
    check_in_time,
    check_out_time,
    rules,
    faq,
    commission_rate,
    is_featured,
    is_published
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'هتل تابان تهران',
    'hotel-taban',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    4,
    4.8,
    42,
    'تهران، خیابان نجات‌اللهی (ویلا)، کوچه مراغه‌ای، پلاک ۱۲',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
    '[
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ]'::jsonb,
    'اقامتی لوکس و آرامش‌بخش در قلب تجاری و دیپلماتیک پایتخت با دسترسی فوق‌العاده به مترو و جاذبه‌های مرکزی تهران.',
    'هتل تابان تهران با موقعیت مکانی بی‌نظیر در مرکز شهر، دسترسی سریع به سفارتخانه‌ها، مراکز تجاری، بیمارستان‌ها و ایستگاه‌های مترو را برای مسافران گرامی فراهم ساخته است. این هتل با رعایت بالاترین استانداردهای هتلداری بین‌المللی، اتاق‌های مجهز با عایق صوتی کامل، اینترنت پرسرعت رایگان، رستوران با غذاهای لذیذ ایرانی و فرنگی و کافی‌شاپ دنج ۲۴ ساعته، اقامتی فراموش‌نشدنی را برای سفرهای کاری و خانوادگی شما رقم می‌زند.',
    '021-88901234',
    'taban@tehranroom.com',
    35.7042,
    51.4168,
    '14:00',
    '12:00',
    '[
        "همراه داشتن اصل کارت ملی و شناسنامه هوشمند برای پذیرش کلیه مسافران ایرانی الزامی است.",
        "پذیرش زوجین محترم تنها با ارائه صیغه‌نامه معتبر با مهر برجسته به همراه مدارک هویتی امکان‌پذیر می‌باشد.",
        "استعمال دخانیات در داخل اتاق‌ها اکیداً ممنوع بوده و فقط در فضاهای باز تعیین‌شده مجاز است.",
        "امکان پذیرش حیوانات خانگی در هتل وجود ندارد.",
        "ورود ساعت ۱۴:۰۰ و خروج ساعت ۱۲:۰۰ ظهر می‌باشد. هزینه نیم‌شارژ خروج پس از ساعت ۱۴ محاسبه می‌گردد."
    ]'::jsonb,
    '[
        {"question": "آیا صبحانه روی تمام اتاق‌ها رایگان است؟", "answer": "بله، بوفه صبحانه گرم و سرد هتل تابان برای میهمانان اقامت روزانه به صورت رایگان و سلف‌سرویس سرو می‌شود."},
        {"question": "آیا امکان رزرو ساعتی اتاق وجود دارد؟", "answer": "بله، اتاق‌های منتخب هتل تابان برای اقامت‌های کوتاه ۳، ۶ و ۱۲ ساعته با قیمت ویژه در دسترس هستند."},
        {"question": "فاصله هتل تا ایستگاه مترو چقدر است؟", "answer": "هتل کمتر از ۵ دقیقه پیاده‌روی تا ایستگاه مترو فردوسی و میدان ولیعصر فاصله دارد."},
        {"question": "روش پرداخت و نهایی شدن رزرو چگونه است؟", "answer": "پرداخت به شیوه کارت‌به‌کارت انجام شده و پس از بارگذاری فیش واریزی در سامانه، رزرو قطعی صادر می‌گردد."}
    ]'::jsonb,
    10.00,
    true,
    true
) ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, address = EXCLUDED.address, cover_image = EXCLUDED.cover_image;

-- 7. HOTEL TABAN AMENITIES
INSERT INTO public.hotel_amenities (hotel_id, name, icon, is_featured)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'اینترنت پرسرعت وای‌فای نامحدود', 'wifi', true),
    ('e0000000-0000-0000-0000-000000000001', 'رستوران سنتی و بین‌المللی', 'utensils', true),
    ('e0000000-0000-0000-0000-000000000001', 'کافی‌شاپ ۲۴ ساعته', 'coffee', true),
    ('e0000000-0000-0000-0000-000000000001', 'پارکینگ اختصاصی سرپوشیده', 'car', true),
    ('e0000000-0000-0000-0000-000000000001', 'خدمات روم‌سرویس ۲۴ ساعته', 'bell', true),
    ('e0000000-0000-0000-0000-000000000001', 'ترانسفر فرودگاهی (امام خمینی و مهرآباد)', 'plane', true),
    ('e0000000-0000-0000-0000-000000000001', 'لاندری و خشکشویی', 'sparkles', false),
    ('e0000000-0000-0000-0000-000000000001', 'صندوق امانات در لابی', 'shield-check', false),
    ('e0000000-0000-0000-0000-000000000001', 'سیستم تهویه مطبوع پیشرفته چیلر', 'wind', false)
ON CONFLICT DO NOTHING;

-- 8. ROOMS FOR HOTEL TABAN
INSERT INTO public.rooms (
    id, hotel_id, name, room_number, room_type, bed_type,
    standard_capacity, max_capacity, size_sqm, cover_image, images,
    description, status, breakfast_type, breakfast_price, is_hourly_available, is_published, display_order
) VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'اتاق یک‌تخته سینگل کلاسیک',
    '102',
    'single',
    'یک تخت یک‌نفره استاندارد ارگونومیک',
    1, 1, 18,
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
    '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    'ایده‌آل برای سفرهای کاری و اقامت انفرادی با میز کار استاندارد، نور طبیعی عالی، کمد دیواری و سرویس بهداشتی لوکس.',
    'available',
    'included',
    0,
    true,
    true,
    1
),
(
    'f0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'اتاق دوتخته دبل دلوکس',
    '205',
    'double',
    'یک تخت دونفره کینگ‌سایز با تشک طبی فنری',
    2, 2, 28,
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    '["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    'طراحی مدرن با نورپردازی آرامش‌بخش، تلویزیون هوشمند ۵۰ اینچ، مینی‌بار اختصاصی، بالکن با چشم‌انداز شهر و حمام با دوش بارانی.',
    'available',
    'included',
    0,
    true,
    true,
    2
),
(
    'f0000000-0000-0000-0000-000000000003',
    'e0000000-0000-0000-0000-000000000001',
    'اتاق دوتخته توئین استاندارد',
    '208',
    'double',
    'دو تخت تک‌نفره مجزا',
    2, 2, 26,
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    '["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    'مناسب برای همکاران، دوستان و همراهان تجاری با چیدمان جادار، میز مطالعه اختصاصی و اینترنت وای‌فای پرسرعت اختصاصی.',
    'available',
    'included',
    0,
    true,
    true,
    3
),
(
    'f0000000-0000-0000-0000-000000000004',
    'e0000000-0000-0000-0000-000000000001',
    'اتاق سه‌تخته سوپریور',
    '304',
    'triple',
    'یک تخت کینگ دونفره + یک تخت تک‌نفره',
    3, 3, 36,
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
    '["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    'فضای بزرگ و ایده‌آل برای خانواده‌های کم‌جمعیت یا گروه‌های سه‌نفره با نشیمن دنج، کتری برقی، چای و نسکافه روزانه.',
    'available',
    'included',
    0,
    true,
    true,
    4
),
(
    'f0000000-0000-0000-0000-000000000005',
    'e0000000-0000-0000-0000-000000000001',
    'سوئیت رویال امپریال VIP',
    '401',
    'suite',
    'تخت خواب مستر سوپر کینگ + کاناپه تخت‌خواب‌شو لوکس',
    2, 4, 55,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    'تجربه اقامت ۵ ستاره در مجهزترین سوئیت هتل با سالن پذیرایی مجزا، جکوزی اختصاصی، ویو پانوراما از شهر و خدمات VIP ویژه.',
    'available',
    'included',
    0,
    false,
    true,
    5
) ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, cover_image = EXCLUDED.cover_image;

-- 9. PRICING FOR ROOMS (In Toman)
INSERT INTO public.room_pricing (
    room_id, daily_price, hourly_price, hourly_min_hours, discount_percentage, special_price, breakfast_price, currency, is_active
) VALUES
    ('f0000000-0000-0000-0000-000000000001', 1950000, 350000, 3, 0, NULL, 0, 'TOMAN', true),
    ('f0000000-0000-0000-0000-000000000002', 2850000, 480000, 3, 10, 2565000, 0, 'TOMAN', true),
    ('f0000000-0000-0000-0000-000000000003', 2700000, 450000, 3, 0, NULL, 0, 'TOMAN', true),
    ('f0000000-0000-0000-0000-000000000004', 3600000, 600000, 3, 5, 3420000, 0, 'TOMAN', true),
    ('f0000000-0000-0000-0000-000000000005', 5400000, 950000, 3, 15, 4590000, 0, 'TOMAN', true)
ON CONFLICT DO NOTHING;

-- 10. ROOM AMENITIES
INSERT INTO public.room_amenities (room_id, name, icon)
VALUES
    ('f0000000-0000-0000-0000-000000000002', 'تلویزیون هوشمند ۴K', 'tv'),
    ('f0000000-0000-0000-0000-000000000002', 'مینی‌بار مجهز و یخچال', 'refrigerator'),
    ('f0000000-0000-0000-0000-000000000002', 'سیستم تهویه هوای هوشمند', 'air-vent'),
    ('f0000000-0000-0000-0000-000000000002', 'صندوق امانات الکترونیکی', 'lock'),
    ('f0000000-0000-0000-0000-000000000002', 'حمام با دوش بارانی لوکس', 'shower-head'),
    ('f0000000-0000-0000-0000-000000000002', 'چای‌ساز و قهوه‌ساز برقی', 'coffee'),
    ('f0000000-0000-0000-0000-000000000002', 'عایق صوتی کامل دوجداره', 'volume-x'),
    ('f0000000-0000-0000-0000-000000000002', 'حوله و دمپایی اختصاصی', 'shirt')
ON CONFLICT DO NOTHING;

-- 11. SAMPLE VERIFIED REVIEWS FOR HOTEL TABAN
INSERT INTO public.reviews (
    hotel_id, customer_name, rating, comment, is_verified_stay, is_published, created_at
) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'علیرضا محمدی',
    5,
    'اقامتی فوق‌العاده داشتم. نظافت اتاق‌ها بی‌نقص بود و کارکنان هتل بسیار مؤدب و حرفه‌ای بودند. دسترسی هتل به مرکز شهر و مترو هم کارم را در سفر کاری خیلی راحت کرد.',
    true,
    true,
    now() - interval '4 days'
),
(
    'e0000000-0000-0000-0000-000000000001',
    'سارا فرهادی',
    5,
    'صبحانه سلف‌سرویس بسیار باکیفیت و تازه بود. رزرو از طریق تهران‌روم در کمتر از چند دقیقه انجام شد و فیش واریزی سریعاً تایید گردید. قطعاً دوباره انتخابم خواهد بود.',
    true,
    true,
    now() - interval '9 days'
),
(
    'e0000000-0000-0000-0000-000000000001',
    'پرهام ناصری',
    4,
    'اتاق دوتخته دبل بسیار جادار با تشک طبی راحت و عایق صوتی عالی بود به طوری که هیچ صدایی از خیابان شنیده نمی‌شد. سرعت اینترنت وای‌فای هم مطلوب بود.',
    true,
    true,
    now() - interval '15 days'
) ON CONFLICT DO NOTHING;

