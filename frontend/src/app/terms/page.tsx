export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">الشروط والأحكام</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. قبول الشروط</h2>
          <p className="text-gray-600 leading-relaxed">
            باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام المذكورة هنا.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. المسؤوليات</h2>
          <p className="text-gray-600 leading-relaxed">
            المستخدم مسؤول عن دقة المعلومات المقدمة والحفاظ على سرية الحساب.
          </p>
        </section>
      </div>
    </div>
  );
}