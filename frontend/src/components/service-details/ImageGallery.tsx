// components/ImageGallery.tsx
'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type SwiperType from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ImageGalleryProps {
  images: Array<{ url: string }>;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) return null;

  return (
    <div className="group relative">
      {/* الصورة الرئيسية مع Swiper */}
      <Swiper
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs, FreeMode]}
        onActiveIndexChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="mb-4 h-96 w-full rounded-2xl shadow-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={img.url}
                alt={`صورة ${index + 1}`}
                
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* معرض الصور المصغرة */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={12}
        slidesPerView="auto"
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="!static"
      >
        <div className="flex gap-2 px-2">
          {images.map((img, index) => (
            <SwiperSlide
              key={index}
              className="!w-24 !h-24 cursor-pointer relative rounded-lg overflow-hidden border-2 transition-all"
              style={{
                borderColor: activeIndex === index ? '#3B82F6' : 'transparent',
              }}
            >
              <img
                src={img.url}
                alt={`صورة مصغرة ${index + 1}`}
                className="object-cover"
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      {/* عدّاد الصور */}
      <div className="absolute bottom-4 right-4 bg-black/40 text-white px-3 py-1 rounded-full text-sm z-10">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
}