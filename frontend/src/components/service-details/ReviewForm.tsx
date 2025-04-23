"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_REVIEW, GET_REVIEWS } from "@/lib/repositories/ReviewRepository";
import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewForm({
  serviceId,
  bookingId,
  onSuccess,
}: {
  serviceId: string;
  bookingId: string;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [addReview, { loading }] = useMutation(ADD_REVIEW, {
    refetchQueries: [{ query: GET_REVIEWS, variables: { serviceId } }],
  });

  const handleSubmit = async () => {
    if (rating < 1) return alert("Please select a rating");
    await addReview({ variables: { input: { bookingId, rating, comment } } });
    onSuccess?.();
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg space-y-4">
      <h3 className="font-semibold">Leave a Review</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            className={`h-6 w-6 cursor-pointer ${
              i <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => setRating(i)}
          />
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded p-2"
        placeholder="Optional comment…"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
