import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import React from "react";

interface Props {
  view: "grid" | "list";
  onToggle: (view: "grid" | "list") => void;
}

const ViewToggle = ({ view, onToggle }: Props) => (
  <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
    <button
      onClick={() => onToggle("grid")}
      className={`p-2 rounded-md transition-colors ${
        view === "grid"
          ? "bg-white text-blue-500 shadow-sm border border-gray-200"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <Squares2X2Icon className="w-5 h-5" />
      <span className="sr-only">عرض شبكي</span>
    </button>
    
    <button
      onClick={() => onToggle("list")}
      className={`p-2 rounded-md transition-colors ${
        view === "list"
          ? "bg-white text-blue-500 shadow-sm border border-gray-200"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <ListBulletIcon className="w-5 h-5" />
      <span className="sr-only">عرض قائمة</span>
    </button>
  </div>
);

export default React.memo(ViewToggle);