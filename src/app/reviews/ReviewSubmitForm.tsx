'use client';

import React, { useState } from 'react';
import { Star, Send, CheckCircle2, Building } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface HotelOption {
  id: string;
  name: string;
  stars?: number;
}

interface ReviewSubmitFormProps {
  hotels?: HotelOption[];
  defaultHotelId?: string;
}

export default function ReviewSubmitForm({
  hotels = [
    { id: 'e0000000-0000-0000-0000-000000000002', name: 'هتل اسپیناس پالاس تهران', stars: 5 },
    { id: 'e0000000-0000-0000-0000-000000000003', name: 'هتل پارسیان آزادی تهران', stars: 5 },
    { id: 'e0000000-0000-0000-0000-000000000001', name: 'هتل تابان تهران', stars: 4 },
  ],
  defaultHotelId,
}: ReviewSubmitFormProps) {
  const [selectedHotelId, setSelectedHotelId] = useState(
    defaultHotelId || (hotels[0]?.id || 'e0000000-0000-0000-0000-000000000001')
  );
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !selectedHotelId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertErr } = await supabase.from('reviews').insert({
        hotel_id: selectedHotelId,
        customer_name: name.trim(),
        rating,
        comment: comment.trim(),
        is_verified_stay: false,
        is_published: false, // Requires admin approval
      });

      if (insertErr) {
        setError('خطا در ثبت نظر. لطفاً مجدداً تلاش فرمایید.');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت نظر');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel-dark rounded-3xl p-6 border border-white/10 shadow-xl text-white">
      <h3 className="text-sm font-black text-white mb-3">
        ثبت دیدگاه درباره هتل
      </h3>

      {isSuccess ? (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="text-xs font-bold text-emerald-300">
            نظر شما با موفقیت ثبت شد
          </h4>
          <p className="text-[11px] text-emerald-400/80">
            دیدگاه شما پس از بررسی و تایید کارشناسان منتشر خواهد شد. از همراهی شما سپاسگزاریم.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Hotel Selector (User Request) */}
          <div>
            <label className="block text-[11px] font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>انتخاب اقامتگاه مورد نظر:</span>
            </label>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-bold text-white bg-[#0a0f1d] border border-white/10 cursor-pointer"
              required
            >
              {hotels.map((h) => (
                <option key={h.id} value={h.id} className="bg-[#0b101d] text-white">
                  {h.name} {h.stars ? `(${h.stars} ستاره)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 mb-1">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold"
              placeholder="مثال: مهدی حسینی"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 mb-1">
              امتیاز شما به هتل
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      s <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 mb-1">
              متن نظر و تجربه اقامت
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs"
              placeholder="نقاط قوت هتل، کیفیت صبحانه، نظافت و برخورد پرسنل..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full gold-glow-btn py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ارسال نظر جهت بررسی</span>
          </button>
        </form>
      )}
    </div>
  );
}
