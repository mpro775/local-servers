export default function FAQPage() {
  const faqs = [
    {
      question: "كيف يمكنني طلب خدمة؟",
      answer: "اختر الخدمة المطلوبة من القائمة، املئ النموذج وانتظر تأكيد المزود."
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل الدفع نقداً عند الاستلام أو عبر البطاقات الإلكترونية."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">الأسئلة الشائعة</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">{faq.question}</h2>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}