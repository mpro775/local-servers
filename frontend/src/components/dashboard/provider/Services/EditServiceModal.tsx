import { UPDATE_SERVICE } from '@/lib/repositories/ServiceRepository';
import { Category, Service } from '@/types';
import {  useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


interface EditServiceModalProps {
  service: Service;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description: string;
  price: number;
  address: string;
  categoryId: string;
  status: string;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({ service, categories, onClose, onSuccess }) => {
  const [updateService, { loading }] = useMutation(UPDATE_SERVICE);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (service) {
      reset({
        title: service.title,
        description: service.description || '',
        price: service.price,
        address: service.address || '',
        categoryId: service.category.id,
        status: service.status,
      });
    }
  }, [service, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateService({ variables: { id: service.id, input: data } });
      toast.success('تم تحديث الخدمة بنجاح');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('فشل في تحديث الخدمة');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">تعديل الخدمة</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('title')} placeholder="عنوان الخدمة" className="w-full p-2 border rounded" />
          <textarea {...register('description')} placeholder="الوصف" className="w-full p-2 border rounded" rows={3} />
          <input type="number" {...register('price', { valueAsNumber: true })} placeholder="السعر" className="w-full p-2 border rounded" />
          <input {...register('address')} placeholder="العنوان" className="w-full p-2 border rounded" />
          <select {...register('categoryId')} className="w-full p-2 border rounded">
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select {...register('status')} className="w-full p-2 border rounded">
            <option value="ACTIVE">نشط</option>
            <option value="BUSY">مشغول</option>
            <option value="INACTIVE">غير نشط</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">إلغاء</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? '...' : 'حفظ'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
