import React, { useState, useEffect } from 'react';

type FilterProps = {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
  ratingMin?: number;
  onRatingChange?: (rating: number | undefined) => void;
};

const Filters: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  location = "",
  onLocationChange,
  ratingMin,
  onRatingChange,
}) => {
  const [localPrice, setLocalPrice] = useState(priceRange[1]);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    setLocalPrice(priceRange[1]);
  }, [priceRange]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const newRange: [number, number] = [0, Math.min(newValue, 100000)];
    setLocalPrice(newRange[1]);
    onPriceChange(newRange);
  };

  const handleRating = (selectedRating: number) => {
    if (ratingMin === selectedRating) {
      onRatingChange?.(undefined);
    } else {
      onRatingChange?.(selectedRating);
    }
  };

  const resetFilters = () => {
    onCategoryChange('');
    onPriceChange([0, 100000]);
    onLocationChange?.('');
    onRatingChange?.(undefined);
  };

  const currentRating = hoverRating ?? ratingMin;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-6 w-full max-w-xs mx-auto rtl">
      <h3 className="text-xl font-bold text-gray-800 text-right">تصفية النتائج</h3>

      {/* الفئة */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 text-right">الفئة</label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-right"
          >
            <option value="">جميع الفئات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="absolute left-2 top-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* السعر */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 text-right">نطاق السعر (ر.س)</label>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={localPrice}
          onChange={handlePriceChange}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>0 ر.س</span>
          <span>{localPrice.toLocaleString()} ر.س</span>
        </div>
      </div>

      {/* الموقع */}
      {onLocationChange && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">الموقع</label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="ابحث حسب المدينة أو الحي"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
          />
        </div>
      )}

      {/* التقييم */}
      {onRatingChange && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">الحد الأدنى للتقييم</label>
          <div className="flex flex-row-reverse gap-1 justify-end">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleRating(num)}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(null)}
                className={`text-xl transition-colors ${
                  num <= (currentRating || 0) ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-300`}
                aria-label={`${num} نجوم`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}

      {/* إعادة التعيين */}
      <button
        onClick={resetFilters}
        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
      >
        إعادة التعيين
      </button>
    </div>
  );
};

export default React.memo(Filters);
