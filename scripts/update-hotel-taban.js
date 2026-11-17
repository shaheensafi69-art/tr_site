const { Client } = require("pg");

async function run() {
  const client = new Client({ connectionString: process.env.DIRECT_URL });
  await client.connect();

  console.log("Connected to Supabase PostgreSQL.");

  await client.query(`
    ALTER TABLE public.hotels
    ADD COLUMN IF NOT EXISTS hourly_start_time VARCHAR(10) DEFAULT '08:00',
    ADD COLUMN IF NOT EXISTS hourly_end_time VARCHAR(10) DEFAULT '22:00',
    ADD COLUMN IF NOT EXISTS min_hourly_duration INT DEFAULT 3,
    ADD COLUMN IF NOT EXISTS max_hourly_duration INT DEFAULT 12,
    ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

    UPDATE public.hotels
    SET
      latitude = 35.7021541,
      longitude = 51.417652,
      google_maps_url = 'https://www.google.com/maps/dir//Taban+Hotel,+PC29%2BV56+District+6,+Tehran,+Iran/@48.2202331,16.3796425,10z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x3f8e0177aca75b8b:0x5a08a4ccdba697f5!2m2!1d51.417652!2d35.7021541?entry=ttu',
      hourly_start_time = '08:00',
      hourly_end_time = '22:00',
      min_hourly_duration = 3,
      max_hourly_duration = 12,
      address = 'تهران، منطقه ۶، خیابان نجات‌اللهی (ویلا)، کوچه مراغه‌ای، پلاک ۱۲'
    WHERE slug = 'hotel-taban';
  `);

  console.log("Hotels schema and Hotel Taban data updated successfully!");

  const res = await client.query("SELECT name, latitude, longitude, google_maps_url, hourly_start_time, hourly_end_time FROM public.hotels WHERE slug = 'hotel-taban'");
  console.log("Taban in DB:", res.rows[0]);

  await client.end();
}

run().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});

