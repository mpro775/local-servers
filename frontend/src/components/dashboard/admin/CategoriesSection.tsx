"use client";

import { useState, FormEvent, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Category } from "@/types";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
} from "@/lib/repositories/CategoryRepository";

interface FormState {
  id: string;
  name: string;
  image: File | null;
  existingImage?: {
    url: string;
    key?: string; // ← هنا أضف علامة الاستفهام
  };
}
interface CategoryInput {
  name: string;
  image?: File; // اختياري للتحديث
}

export default function CategoriesSection() {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => refetch(),
    refetchQueries: [{ query: GET_CATEGORIES }],
    onError: (error) => console.error("Update error:", error.graphQLErrors),
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onError: (error) => {
      alert("فشل الحذف: " + error.message);
    },
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const [formState, setFormState] = useState<FormState>({
    id: "",
    name: "",
    image: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!formState.name.trim()) {
        alert("يرجى إدخال اسم الفئة صحيح");
        return;
      }

      const input: CategoryInput = {
        name: formState.name,
      };

      if (formState.image) {
        input.image = formState.image;
      }

      if (isEditing) {
        await updateCategory({
          variables: {
            id: formState.id,
            input,
          },
        });
      } else {
        if (!formState.image) {
          alert("يرجى اختيار صورة الفئة");
          return;
        }
        await createCategory({
          variables: { input },
          refetchQueries: [{ query: GET_CATEGORIES }],
        });
      }

      resetForm();
    } catch (err) {
      console.error("حدث خطأ تفصيلي:", JSON.stringify(err, null, 2));
      alert("فشل في العملية: " + (err as Error).message);
    }
  };

  const handleEdit = (cat: Category) => {
    setFormState({
      id: cat.id,
      name: cat.name,
      image: null,
      existingImage: cat.image,
    });
    setIsEditing(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      try {
        await deleteCategory({
          variables: { id },
          context: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        });
      } catch (err) {
        console.error("Full Delete Error:", JSON.stringify(err, null, 2));
      }
    }
  };

  const resetForm = () => {
    setFormState({ id: "", name: "", image: null });
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading) return <div className="text-center py-8">جار التحميل...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        حدث خطأ في جلب البيانات
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? "تعديل الفئة" : "إضافة فئة جديدة"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              اسم الفئة
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              صورة الفئة
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  image: e.target.files?.[0] || null,
                })
              }
              className="w-full p-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {isEditing && formState.existingImage?.url && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">الصورة الحالية:</span>
                <img
                  src={formState.existingImage.url}
                  alt="الصورة الحالية"
                  className="w-20 h-20 object-cover mt-1 border rounded"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? "حفظ التعديلات" : "إضافة فئة"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-6 border-b">الفئات الحالية</h3>
        <div className="divide-y">
          {data?.allCategories?.map((cat: Category) => (
            <div
              key={cat.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                {cat.image?.url && (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}
                <span className="text-gray-800 font-medium">{cat.name}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {(!data?.allCategories || data.allCategories.length === 0) && (
            <p className="p-6 text-center text-gray-500">لا توجد فئات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}
