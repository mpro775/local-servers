import { useQuery } from '@apollo/client';
import { Service } from '@/types';
import Link from 'next/link';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { GET_LATEST_SERVICES } from '@/lib/repositories/ServiceRepository';
import ServiceCard from '../service/ServicesCard';

const ServicesSection = () => {
  const { loading, error, data } = useQuery(GET_LATEST_SERVICES, {
    variables: { limit: 4 }
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="فشل في تحميل الخدمات" />;

  const services: Service[] = data?.services?.services || [];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            أحدث الخدمات المضافة
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service}  layout="grid"/>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/services"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm"
          >
            عرض الكل
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;