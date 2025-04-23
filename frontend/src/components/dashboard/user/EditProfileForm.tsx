"use client"
import { useQuery, useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PencilSquareIcon, CheckIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { GET_ME, UPDATE } from '@/lib/repositories/UserRepository'


export default function EditProfileForm() {
  const { data, loading } = useQuery(GET_ME)
  const [updateProfile, { loading: updating }] = useMutation(UPDATE)
  interface ProfileFormData {
  name: string;
  phone: string;
  address: string;
  description?: string; // Optional
}

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (data?.me) {
      reset({
        name: data.me.name,
        ...data.me.profile
      })
    }
  }, [data, reset])

const onSubmit = async (formData: ProfileFormData) => {
    try {
      await updateProfile({
        variables: {
          input: {
            name: formData.name,
            profile: {
              phone: formData.phone,
              address: formData.address,
              description: formData.description
            }
          }
        }
      })
      toast.success('تم تحديث الملف الشخصي بنجاح!', {
        icon: <CheckIcon className="w-6 h-6 text-green-500" />
      })
    } catch  {
      toast.error('حدث خطأ أثناء التحديث، يرجى المحاولة لاحقاً')
    }
  }

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-8">
        <UserCircleIcon className="w-8 h-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">الملف الشخصي</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* اسم المستخدم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل
            </label>
            <input
              {...register('name', { required: 'هذا الحقل مطلوب' })}
              className={`w-full p-3 border rounded-lg ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message?.toString()}
              </p>
            )}
          </div>

          {/* رقم الهاتف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الجوال
            </label>
            <input
              {...register('phone', {
                required: 'هذا الحقل مطلوب',
                pattern: {
                  value: /^05\d{8}$/,
      message: 'رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام'
                }
              })}
              className={`w-full p-3 border rounded-lg ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message?.toString()}
              </p>
            )}
          </div>

          {/* العنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان
            </label>
            <input
              {...register('address', { required: 'هذا الحقل مطلوب' })}
              className={`w-full p-3 border rounded-lg ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message?.toString()}
              </p>
            )}
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نبذة عنك
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {updating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الحفظ...
            </>
          ) : (
            <>
              <PencilSquareIcon className="w-5 h-5" />
              حفظ التعديلات
            </>
          )}
        </button>
      </form>

      {/* معاينة البيانات */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckIcon className="w-5 h-5 text-green-500" />
          البيانات الحالية:
        </h2>
        <dl className="space-y-3">
          <div className="flex gap-4">
            <dt className="w-24 text-gray-600">الاسم:</dt>
            <dd className="flex-1 font-medium">{data?.me?.name}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 text-gray-600">الجوال:</dt>
            <dd className="flex-1 font-medium">{data?.me?.profile?.phone || 'غير محدد'}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 text-gray-600">العنوان:</dt>
            <dd className="flex-1 font-medium">{data?.me?.profile?.address || 'غير محدد'}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 text-gray-600">الوصف:</dt>
            <dd className="flex-1 text-gray-700 whitespace-pre-line">
              {data?.me?.profile?.description || 'لا يوجد وصف'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}