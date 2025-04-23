"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Service, Category } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "@/components/service/SearchBar";
import Filters from "@/components/service/Filters";
import ViewToggle from "@/components/service/ViewToggle";
import Pagination from "@/components/service/Pagination";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ServiceCard from "@/components/service/ServicesCard";
import { GET_SERVICES } from "@/lib/repositories/ServiceRepository";
import { GET_CATEGORIES } from "@/lib/repositories/CategoryRepository";

const ServicesPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    ratingMin: undefined as number | undefined,
    priceRange: [0, 100000] as [number, number],
    view: "grid" as "grid" | "list",
    page: 1,
    perPage: 6,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: servicesData, loading: servicesLoading } = useQuery(
    GET_SERVICES,
    {
      variables: {
        search: filters.search,
        category: filters.category,
        location: filters.location,
        ratingMin: filters.ratingMin,
        priceMin: filters.priceRange[0],
        priceMax: filters.priceRange[1],
        page: filters.page,
        limit: filters.perPage,
      },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_CATEGORIES,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );

  const handleFilterChange = <K extends keyof typeof filters>(
    name: K,
    value: (typeof filters)[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const services = servicesData?.services || [];
  const totalPages = Math.ceil(
    (servicesData?.totalCount || 0) / filters.perPage
  );
  const categories = categoriesData?.allCategories || [];

  if (servicesLoading || categoriesLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-center">
            اكتشف أفضل الخدمات المهنية
          </h1>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={filters.search}
              onChange={(val) => handleFilterChange("search", val)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden mb-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showMobileFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
            </button>

            <div
              className={`${showMobileFilters ? "block" : "hidden"} lg:block`}
            >
              <Filters
                categories={categories.map((cat: Category) => ({
                  id: cat.id,
                  name: cat.name,
                }))}
                selectedCategory={filters.category}
                onCategoryChange={(val) => handleFilterChange("category", val)}
                priceRange={filters.priceRange}
                onPriceChange={(val) => handleFilterChange("priceRange", val)}
                onRatingChange={(val) => handleFilterChange("ratingMin", val)}
                onLocationChange={(val) => handleFilterChange("location", val)}
              />
            </div>
          </div>

          {/* Services Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {filters.category || "جميع الخدمات"}
                  <span className="text-gray-500 ml-2 text-base md:text-lg">
                    ({services.length} نتيجة)
                  </span>
                </h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  اعثر على ما تحتاجه بسهولة مع فلاتر البحث المتقدمة
                </p>
              </div>
              <ViewToggle
                view={filters.view}
                onToggle={(val) => handleFilterChange("view", val)}
              />
            </div>

            {/* Services Grid/List */}
            <AnimatePresence mode="wait">
              {servicesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(filters.perPage)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-200 rounded-lg h-64"
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  key={filters.view}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={
                    filters.view === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6"
                      : "space-y-4 md:space-y-6"
                  }
                >
                  {services.services.map((service: Service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ServiceCard service={service} layout={filters.view} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!servicesLoading && services.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">لم يتم العثور على خدمات</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 md:mt-12">
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onChangePage={(val) => handleFilterChange("page", val)}
                  perPage={filters.perPage}
                  onChangePerPage={(val) => handleFilterChange("perPage", val)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;
