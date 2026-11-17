-- ====================================================================
-- TehranRoom Platform Initial Schema Migration
-- Designed for standalone public website + future independent admin panel
-- PostgreSQL 15+ / 17
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROVINCES TABLE (All 31 provinces of Iran)
CREATE TABLE IF NOT EXISTS public.provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    display_order INT DEFAULT 99,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. CITIES TABLE
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province_id UUID NOT NULL REFERENCES public.provinces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    display_order INT DEFAULT 99,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (province_id, slug)
);

-- 3. HOTELS TABLE
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    province_id UUID NOT NULL REFERENCES public.provinces(id),
    city_id UUID NOT NULL REFERENCES public.cities(id),
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5) DEFAULT 4,
    rating NUMERIC(3, 1) NOT NULL DEFAULT 4.8,
    review_count INT NOT NULL DEFAULT 0,
    address TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    check_in_time VARCHAR(10) NOT NULL DEFAULT '14:00',
    check_out_time VARCHAR(10) NOT NULL DEFAULT '12:00',
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    faq JSONB NOT NULL DEFAULT '[]'::jsonb,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. HOTEL AMENITIES
CREATE TABLE IF NOT EXISTS public.hotel_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false
);

-- 5. ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50),
    room_type VARCHAR(50) NOT NULL, -- single, double, triple, quad, family, suite
    bed_type VARCHAR(100) NOT NULL,
    standard_capacity INT NOT NULL DEFAULT 2,
    max_capacity INT NOT NULL DEFAULT 2,
    size_sqm INT NOT NULL DEFAULT 25,
    cover_image TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available', -- available, reserved, occupied, cleaning, maintenance, unavailable
    breakfast_type VARCHAR(50) NOT NULL DEFAULT 'included', -- included, optional, none
    breakfast_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    is_hourly_available BOOLEAN NOT NULL DEFAULT true,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. ROOM AMENITIES
CREATE TABLE IF NOT EXISTS public.room_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

-- 7. ROOM PRICING (Multi-tier & Daily/Hourly)
CREATE TABLE IF NOT EXISTS public.room_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    daily_price NUMERIC(14, 2) NOT NULL,
    hourly_price NUMERIC(14, 2) NOT NULL,
    hourly_min_hours INT NOT NULL DEFAULT 3,
    discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    special_price NUMERIC(14, 2),
    breakfast_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'TOMAN',
    valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_to TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. ROOM BLOCKS (Maintenance, cleaning, manual out-of-order)
CREATE TABLE IF NOT EXISTS public.room_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    block_type VARCHAR(50) NOT NULL, -- cleaning, maintenance, manual_block
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. CURRENCIES & EXCHANGE RATES
CREATE TABLE IF NOT EXISTS public.currencies (
    code VARCHAR(10) PRIMARY KEY, -- TOMAN, AFN, USD, EUR
    name_fa VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    rate_to_toman NUMERIC(14, 4) NOT NULL, -- 1 unit of this currency = X Toman
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL UNIQUE,
    country_code VARCHAR(10) NOT NULL DEFAULT '+98',
    email VARCHAR(150),
    is_repeat_customer BOOLEAN NOT NULL DEFAULT false,
    total_bookings INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id),
    room_id UUID NOT NULL REFERENCES public.rooms(id),
    booking_type VARCHAR(20) NOT NULL DEFAULT 'daily', -- daily, hourly
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    check_in_time VARCHAR(10), -- e.g. "14:00" for hourly
    duration_hours INT,        -- e.g. 3, 6, 12 for hourly
    start_timestamp TIMESTAMPTZ NOT NULL,
    end_timestamp TIMESTAMPTZ NOT NULL,
    adults_count INT NOT NULL DEFAULT 1,
    children_count INT NOT NULL DEFAULT 0,
    rooms_count INT NOT NULL DEFAULT 1,
    breakfast_included BOOLEAN NOT NULL DEFAULT true,
    currency VARCHAR(10) NOT NULL DEFAULT 'TOMAN',
    exchange_rate_used NUMERIC(14, 4) NOT NULL DEFAULT 1.0,
    daily_rate_base NUMERIC(14, 2) NOT NULL,
    hotel_net_amount NUMERIC(14, 2) NOT NULL,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    commission_amount NUMERIC(14, 2) NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    total_amount_currency NUMERIC(14, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled, expired
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 minutes'),
    special_requests TEXT,
    qr_data TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. BANK ACCOUNTS
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(30) NOT NULL,
    account_number VARCHAR(50),
    iban VARCHAR(50),
    account_holder VARCHAR(150) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'TOMAN',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES public.bank_accounts(id),
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'TOMAN',
    tracking_number VARCHAR(100),
    receipt_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'unpaid', -- unpaid, awaiting_verification, paid, rejected, refunded
    payment_method VARCHAR(50) NOT NULL DEFAULT 'card_to_card',
    notes TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_verified_stay BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(100) NOT NULL DEFAULT 'TehranRoom',
    tagline VARCHAR(255) NOT NULL DEFAULT 'اقامت ایده‌آل شما، فقط چند کلیک فاصله دارد',
    phone VARCHAR(50) NOT NULL DEFAULT '021-91001234',
    whatsapp VARCHAR(50) NOT NULL DEFAULT '+989120000000',
    telegram VARCHAR(50) NOT NULL DEFAULT 'tehranroom_support',
    email VARCHAR(100) NOT NULL DEFAULT 'info@tehranroom.com',
    address TEXT NOT NULL DEFAULT 'تهران، خیابان ولیعصر',
    commission_rate_default NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    hold_duration_minutes INT NOT NULL DEFAULT 30,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. TELEGRAM NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.telegram_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- new_booking, receipt_uploaded, booking_cancelled, status_changed
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, sent, failed
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_provinces_is_active ON public.provinces(is_active);
CREATE INDEX IF NOT EXISTS idx_cities_province ON public.cities(province_id, is_active);
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON public.hotels(slug);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON public.hotels(city_id, is_published);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel ON public.rooms(hotel_id, is_published);
CREATE INDEX IF NOT EXISTS idx_room_pricing_room ON public.room_pricing(room_id, is_active);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_dates ON public.bookings(room_id, start_timestamp, end_timestamp, status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel ON public.reviews(hotel_id, is_published);

-- ====================================================================
-- POSTGRES FUNCTION: GENERATE UNIQUE BOOKING CODE (TR-XXXXXX)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.generate_booking_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := 'TR-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM public.bookings WHERE booking_code = new_code) INTO code_exists;
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ====================================================================
-- POSTGRES FUNCTION: CHECK ROOM AVAILABILITY
-- Avoids double bookings by verifying no active overlapping booking exists
-- ====================================================================
CREATE OR REPLACE FUNCTION public.check_room_availability(
    p_room_id UUID,
    p_start TIMESTAMPTZ,
    p_end TIMESTAMPTZ,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_conflict_count INT;
    v_block_count INT;
    v_room_status VARCHAR(50);
BEGIN
    -- 1. Check room static status
    SELECT status INTO v_room_status FROM public.rooms WHERE id = p_room_id;
    IF v_room_status IS NULL OR v_room_status IN ('cleaning', 'maintenance', 'unavailable') THEN
        RETURN false;
    END IF;

    -- 2. Check room blocks
    SELECT COUNT(*) INTO v_block_count
    FROM public.room_blocks
    WHERE room_id = p_room_id
      AND (start_time < p_end AND end_time > p_start);

    IF v_block_count > 0 THEN
        RETURN false;
    END IF;

    -- 3. Check conflicting bookings:
    -- Overlap exists if: (start_timestamp < p_end AND end_timestamp > p_start)
    -- Ignore cancelled or expired pending bookings
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.bookings
    WHERE room_id = p_room_id
      AND (p_exclude_booking_id IS NULL OR id <> p_exclude_booking_id)
      AND (start_timestamp < p_end AND end_timestamp > p_start)
      AND (
          status IN ('confirmed', 'completed')
          OR (status = 'pending' AND expires_at > now())
      );

    RETURN (v_conflict_count = 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- ====================================================================
-- POSTGRES FUNCTION: ATOMIC RESERVATION (LOCK & PREVENT RACE CONDITIONS)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
    p_customer_name VARCHAR(150),
    p_customer_phone VARCHAR(30),
    p_customer_country_code VARCHAR(10),
    p_customer_email VARCHAR(150),
    p_hotel_id UUID,
    p_room_id UUID,
    p_booking_type VARCHAR(20),
    p_check_in_date DATE,
    p_check_out_date DATE,
    p_check_in_time VARCHAR(10),
    p_duration_hours INT,
    p_start_timestamp TIMESTAMPTZ,
    p_end_timestamp TIMESTAMPTZ,
    p_adults INT,
    p_children INT,
    p_breakfast_included BOOLEAN,
    p_currency VARCHAR(10),
    p_special_requests TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_room_record RECORD;
    v_pricing_record RECORD;
    v_customer_id UUID;
    v_is_repeat BOOLEAN := false;
    v_is_available BOOLEAN;
    v_booking_id UUID;
    v_booking_code TEXT;
    v_commission_rate NUMERIC(5, 2);
    v_daily_base NUMERIC(14, 2);
    v_total_base NUMERIC(14, 2);
    v_commission_amount NUMERIC(14, 2);
    v_hotel_net NUMERIC(14, 2);
    v_rate_to_toman NUMERIC(14, 4);
    v_total_in_currency NUMERIC(14, 2);
    v_qr_data TEXT;
    v_days INT;
BEGIN
    -- 1. Explicitly LOCK the room row to prevent race conditions
    SELECT * INTO v_room_record
    FROM public.rooms
    WHERE id = p_room_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'اتاق مورد نظر یافت نشد.');
    END IF;

    -- 2. Verify availability inside the locked transaction
    v_is_available := public.check_room_availability(p_room_id, p_start_timestamp, p_end_timestamp);
    IF NOT v_is_available THEN
        RETURN jsonb_build_object('success', false, 'error', 'این اتاق در بازه زمانی انتخابی در دسترس نیست یا توسط مسافر دیگری رزرو شده است.');
    END IF;

    -- 3. Fetch pricing
    SELECT * INTO v_pricing_record
    FROM public.room_pricing
    WHERE room_id = p_room_id AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'اطلاعات قیمت‌گذاری این اتاق تنظیم نشده است.');
    END IF;

    -- 4. Calculate pricing in base currency (TOMAN)
    IF p_booking_type = 'hourly' THEN
        v_daily_base := v_pricing_record.hourly_price;
        v_total_base := v_pricing_record.hourly_price * GREATEST(COALESCE(p_duration_hours, 3), 3);
    ELSE
        v_days := GREATEST((p_check_out_date - p_check_in_date), 1);
        v_daily_base := v_pricing_record.daily_price;
        v_total_base := v_pricing_record.daily_price * v_days;
    END IF;

    -- Add breakfast cost if optional and requested
    IF p_breakfast_included AND v_room_record.breakfast_type = 'optional' THEN
        v_total_base := v_total_base + (COALESCE(v_pricing_record.breakfast_price, 0) * GREATEST(p_adults, 1));
    END IF;

    -- Apply discount if any
    IF v_pricing_record.discount_percentage > 0 THEN
        v_total_base := v_total_base * (1 - (v_pricing_record.discount_percentage / 100));
    END IF;

    -- Fetch hotel commission rate
    SELECT commission_rate INTO v_commission_rate FROM public.hotels WHERE id = p_hotel_id;
    IF v_commission_rate IS NULL THEN
        v_commission_rate := 10.00;
    END IF;

    v_commission_amount := ROUND((v_total_base * (v_commission_rate / 100)), 2);
    v_hotel_net := v_total_base - v_commission_amount;

    -- Fetch currency rate
    SELECT rate_to_toman INTO v_rate_to_toman
    FROM public.currencies
    WHERE code = p_currency AND is_active = true;

    IF v_rate_to_toman IS NULL OR v_rate_to_toman <= 0 THEN
        v_rate_to_toman := 1.0;
    END IF;

    -- Calculate total in selected currency
    -- (Rate is defined as: 1 selected_currency = rate_to_toman Toman)
    -- So selected_currency_amount = total_toman / rate_to_toman
    v_total_in_currency := ROUND((v_total_base / v_rate_to_toman), 2);

    -- 5. Customer resolution / creation
    SELECT id, true INTO v_customer_id, v_is_repeat
    FROM public.customers
    WHERE phone = p_customer_phone;

    IF v_customer_id IS NULL THEN
        INSERT INTO public.customers (full_name, phone, country_code, email, is_repeat_customer, total_bookings)
        VALUES (p_customer_name, p_customer_phone, p_customer_country_code, p_customer_email, false, 1)
        RETURNING id INTO v_customer_id;
    ELSE
        UPDATE public.customers
        SET full_name = p_customer_name,
            email = COALESCE(p_customer_email, email),
            is_repeat_customer = true,
            total_bookings = total_bookings + 1,
            updated_at = now()
        WHERE id = v_customer_id;
    END IF;

    -- 6. Generate unique booking code
    v_booking_code := public.generate_booking_code();
    v_qr_data := 'https://tehranroom.com/booking/track?code=' || v_booking_code || '&phone=' || p_customer_phone;

    -- 7. Insert booking
    INSERT INTO public.bookings (
        booking_code,
        customer_id,
        hotel_id,
        room_id,
        booking_type,
        check_in_date,
        check_out_date,
        check_in_time,
        duration_hours,
        start_timestamp,
        end_timestamp,
        adults_count,
        children_count,
        rooms_count,
        breakfast_included,
        currency,
        exchange_rate_used,
        daily_rate_base,
        hotel_net_amount,
        commission_rate,
        commission_amount,
        total_amount,
        total_amount_currency,
        status,
        expires_at,
        special_requests,
        qr_data
    ) VALUES (
        v_booking_code,
        v_customer_id,
        p_hotel_id,
        p_room_id,
        p_booking_type,
        p_check_in_date,
        p_check_out_date,
        p_check_in_time,
        p_duration_hours,
        p_start_timestamp,
        p_end_timestamp,
        p_adults,
        p_children,
        1,
        p_breakfast_included,
        p_currency,
        v_rate_to_toman,
        v_daily_base,
        v_hotel_net,
        v_commission_rate,
        v_commission_amount,
        v_total_base,
        v_total_in_currency,
        'pending',
        now() + interval '30 minutes',
        p_special_requests,
        v_qr_data
    ) RETURNING id INTO v_booking_id;

    -- 8. Create initial payment record
    INSERT INTO public.payments (
        booking_id,
        amount,
        currency,
        status,
        payment_method
    ) VALUES (
        v_booking_id,
        v_total_in_currency,
        p_currency,
        'unpaid',
        'card_to_card'
    );

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'booking_code', v_booking_code,
        'customer_id', v_customer_id,
        'total_amount', v_total_base,
        'total_amount_currency', v_total_in_currency,
        'currency', p_currency,
        'expires_at', (now() + interval '30 minutes'),
        'qr_data', v_qr_data
    );
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_notifications ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ POLICIES (Anonymous & Authenticated)
CREATE POLICY "Public can read provinces" ON public.provinces FOR SELECT USING (true);
CREATE POLICY "Public can read cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public can read published hotels" ON public.hotels FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read hotel amenities" ON public.hotel_amenities FOR SELECT USING (true);
CREATE POLICY "Public can read published rooms" ON public.rooms FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read room amenities" ON public.room_amenities FOR SELECT USING (true);
CREATE POLICY "Public can read active room pricing" ON public.room_pricing FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read currencies" ON public.currencies FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active bank accounts" ON public.bank_accounts FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published reviews" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);

-- 2. PROTECTED TABLES (Customers, Bookings, Payments, Room Blocks, Notifications)
-- These are accessed via Server Actions and API routes with Supabase Service Role
-- Public cannot freely dump other users' phone numbers, bookings, or receipts.
CREATE POLICY "Public can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

