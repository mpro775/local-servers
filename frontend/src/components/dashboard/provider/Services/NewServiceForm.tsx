import {  useMutation } from "@apollo/client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleMap,  Marker, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { 
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Category } from "@/types";
import { CREATE_SERVICE } from "@/lib/repositories/ServiceRepository";



const center = { lat: 24.7136, lng: 46.6753 };

interface FormData {
  title: string;
  price: string;
  categoryId: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
}
interface Props {
  onSuccess(): void;
  onCancel(): void;
  categories: Category[];
}

export const NewServiceForm: React.FC<Props> = ({
  onSuccess,
  onCancel,
  categories
}) => {
  const [createService, { loading }] = useMutation(CREATE_SERVICE);
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  });

  const onPlaceChanged = useCallback(() => {
    const ac = autocompleteRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setValue('latitude', lat.toString());
      setValue('longitude', lng.toString());
      setValue('address', place.formatted_address || '');
    }
  }, [setValue]);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['geocode'] }
      );
      const listener = autocompleteRef.current.addListener('place_changed', onPlaceChanged);
      
      return () => {
        if (autocompleteRef.current) {
          window.google.maps.event.removeListener(listener);
        }
      };
    }
  }, [isLoaded, onPlaceChanged]);

  // التصحيح 3: إضافة دالة تحميل الملفات
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createService({
        variables: {
          input: {
            title: data.title,
            price: parseFloat(data.price),
            categoryId: data.categoryId,
            description: data.description,
            address: data.address,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            images: files
          }
        },
        context: { hasUpload: true }
      });
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  if (loadError) return <p className="text-red-600">فشل تحميل الخريطة</p>;
  if (!isLoaded) return <div className="p-8 text-center">جارٍ تحميل الخريطة...</div>;

  const currentLat = parseFloat(watch('latitude') || center.lat.toString());
  const currentLng = parseFloat(watch('longitude') || center.lng.toString());

   return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl p-8 space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* القسم الأول */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">معلومات أساسية</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الخدمة</label>
              <input
                {...register('title', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ر.س)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
              <select
                {...register('categoryId', { required: true })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              >
{categories?.map(category => (
  <option key={category.id} value={category.id}>
    {category.name}
  </option>
))}
              </select>
            </div>
          </div>
        </div>

        {/* القسم الثاني */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">الموقع الجغرافي</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ابحث عن الموقع</label>
              <input
                ref={inputRef}
                placeholder="اكتب العنوان..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="h-96 rounded-xl overflow-hidden shadow-lg">
                <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                center={{ lat: currentLat, lng: currentLng }}
                zoom={15}
              >
                <Marker
                  position={{ lat: currentLat, lng: currentLng }}
                  draggable={true}
                  icon={{
                    url: '/marker-icon.svg',
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />
              </GoogleMap>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">تفاصيل إضافية</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                {...register('description', { required: true })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">صور الخدمة</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="p-3 bg-blue-50 rounded-full">
                    <ArrowUpTrayIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-blue-600 font-medium">اختر ملفات أو اسحبها هنا</span>
                  <span className="text-sm text-gray-500">الحد الأقصى 10 صور (JPEG, PNG)</span>
                </label>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="h-32 w-full object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {loading && <Spinner />}
          {loading ? 'جاري الحفظ...' : 'إضافة الخدمة'}
        </button>
      </div>
    </motion.form>
  );
};

const Spinner = () => (
  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
);