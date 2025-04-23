import { GraphQLError } from "graphql";
import Review from "../../models/Review";
import Booking from "../../models/Booking";
import Service from "../../models/Service";
import { Context } from "../../types";

const reviewResolvers = {
  Query: {
    reviews: async (_: any, { serviceId }: { serviceId: string }) => {
      return Review.find({ service: serviceId })
        .populate("user", "id name")
        .sort({ createdAt: -1 });
    },
  },

  Mutation: {
    addReview: async (
      _: any,
      {
        input,
      }: { input: { bookingId: string; rating: number; comment?: string } },
      { user }: Context
    ) => {
      if (!user) throw new GraphQLError("Not authenticated");
      const booking = await Booking.findById(input.bookingId);
      if (!booking) throw new GraphQLError("Booking not found");
      if (booking.user.toString() !== user.id)
        throw new GraphQLError("Not allowed");

      if (booking.status !== "COMPLETED")
        throw new GraphQLError("Can only review completed bookings");

      const exists = await Review.findOne({ booking: booking.id });
      if (exists) throw new GraphQLError("Review already submitted");

      const review = await Review.create({
        service: booking.service,
        user: user.id,
        booking: booking.id,
        rating: input.rating,
        comment: input.comment,
      });

      const agg = await Review.aggregate([
        { $match: { service: booking.service } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]);
      await Service.findByIdAndUpdate(booking.service, {
        avgRating: agg[0]?.avg ?? 0,
      });

      return review.populate("user", "id name");
    },
  },
};

export default reviewResolvers;
