"use client";
import { useQuery } from "@apollo/client";
import { GET_REVIEWS } from "@/lib/repositories/ReviewRepository";
import { StarIcon } from "@heroicons/react/24/solid";
import { Review } from "@/types";

export default function ReviewList({ serviceId }: { serviceId: string }) {
  const { data, loading } = useQuery(GET_REVIEWS, {
    variables: { serviceId },
  });
  if (loading) return <p>Loading reviews…</p>;
  return (
    <div className="space-y-4">
      {data.reviews.map((r: Review) => (
        <div key={r.id} className="p-4 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i <= r.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="font-medium">{r.user.name}</span>
          </div>
          {r.comment && <p className="mt-2 text-gray-700">{r.comment}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
      {data.reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}
