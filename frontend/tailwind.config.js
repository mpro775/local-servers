/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // إذا كنت تستخدم مجلد pages أيضاً
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
