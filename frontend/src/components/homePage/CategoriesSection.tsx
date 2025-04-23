"use client";

import { useQuery } from "@apollo/client";
import { Category } from "@/types";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { GET_CATEGORIES } from "@/lib/repositories/CategoryRepository";

export default function CategoriesSection() {
  const { data, loading, error } = useQuery<{ allCategories: Category[] }>(
    GET_CATEGORIES
  );
  const searchParams = useSearchParams();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="فشل في جلب الفئات" />;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          الفئات
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {data?.allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/services`}
              className="group relative block  rounded-xl   transition-all duration-300 "
            >
              <div className="flex flex-col items-center p-4 md:p-6">
                <div className="mb-3 md:mb-4 w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center">
                  {cat.image?.url ? (
                    <img
                      src={cat.image.url}
                      alt={cat.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h4 className="text-sm md:text-base font-medium text-gray-700 text-center">
                  {cat.name}
                </h4>
              </div>

              {/* Active indicator */}
              {searchParams.get("category") === cat.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
