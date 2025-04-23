export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">سياسة الخصوصية</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">جمع المعلومات</h2>
          <p className="text-gray-600 leading-relaxed">
            نجمع المعلومات الضرورية لتقديم الخدمات وتحسين تجربة المستخدم، مع الحفاظ على خصوصيتك.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">حماية البيانات</h2>
          <p className="text-gray-600 leading-relaxed">
            نستخدم تقنيات تشفير متقدمة لحماية بياناتك من الوصول غير المصرح به.
          </p>
        </section>
      </div>
    </div>
  );
}