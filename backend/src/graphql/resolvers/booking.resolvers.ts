// src/resolvers/booking.resolvers.ts
import { GraphQLError } from "graphql";
import Booking, { IBooking } from "../../models/Booking";
import Service, { IService, PopulatedService } from "../../models/Service";
import { RequestStatus, Context } from "../../types";
import User, { IUser } from "../../models/User";
import { paymentService } from "../../services/payment.service";

const bookingResolvers = {
  Query: {
    getMyBookingForService: async (
      _: unknown,
      { serviceId }: { serviceId: string },
      { user }: Context
    ): Promise<IBooking | null> => {
      if (!user) throw new GraphQLError("غير مصرح");

      const existing = await Booking.findOne({
        user: user.id,
        service: serviceId,
        status: { $in: ["PENDING", "ACCEPTED", "PAID"] },
      })
        .populate("service")
        .populate("user");

      return existing;
    },

    myBookings: async (_: any, __: any, { user }: Context) => {
      const bookings = await Booking.find({ user: user?.id }).populate<{
        service: PopulatedService;
      }>({
        path: "service",
        populate: { path: "provider" },
      });

      return bookings.map((booking) => ({
        id: booking.id.toString(),
        service: {
          id: booking.service.id.toString(),
          title: booking.service.title,
          price: booking.service.price, // التأكد من وجود هذا الحقل

          provider: {
            id: booking.service.provider._id.toString(),
            name: booking.service.provider.name,
          },
        },
        bookingDate: booking.bookingDate,
        status: booking.status,
        isPaid: booking.isPaid,
      }));
    },

    providerBookings: async (
      _: unknown,
      { status }: { status?: RequestStatus },
      { user }: Context
    ): Promise<IBooking[]> => {
      if (!user || user.role !== "PROVIDER")
        throw new GraphQLError("Not authorized");
      const serviceIds = await Service.find({ provider: user.id }).distinct(
        "_id"
      );
      const filter: any = { service: { $in: serviceIds } };
      if (status) filter.status = status;
      return await Booking.find(filter).populate("service").populate("user");
    },
    allBookings: async (
      _: unknown,
      { status }: { status?: RequestStatus },
      { user }: Context
    ): Promise<IBooking[]> => {
      if (!user || user.role !== "ADMIN")
        throw new GraphQLError("Not authorized");
      const filter: any = {};
      if (status) filter.status = status;
      return await Booking.find(filter).populate("service").populate("user");
    },
  },

  Mutation: {
    createBooking: async (
      _: unknown,
      { serviceId }: { serviceId: string },
      { user }: Context
    ): Promise<IBooking> => {
      if (!user) throw new GraphQLError("Not authenticated");

      const existingBooking = await Booking.findOne({
        user: user.id,
        service: serviceId,
        status: { $in: ["PENDING", "ACCEPTED"] },
      });

      if (existingBooking) {
        throw new GraphQLError("لديك حجز سابق لهذه الخدمة قيد المعالجة.", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const booking = new Booking({
        service: serviceId,
        user: user.id,
        bookingDate: new Date(),
        status: RequestStatus.PENDING,
      });
      return await booking.save();
    },

    processDummyPayment: async (_: unknown, { id }: { id: string }) => {
      const booking = await Booking.findByIdAndUpdate(
        id,
        {
          status: "PAID",
          isPaid: true,
          paymentDate: new Date(),
        },
        { new: true }
      );

      if (!booking) throw new Error("الحجز غير موجود");
      return booking;
    },

    acceptBooking: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ): Promise<IBooking> => {
      if (!user || user.role !== "PROVIDER")
        throw new GraphQLError("Not authorized");
      const booking = await Booking.findById(id);
      if (!booking) throw new GraphQLError("Booking not found");
      const service = await Service.findById(booking.service);
      if (!service || service.provider.toString() !== user.id)
        throw new GraphQLError("Not authorized to accept");
      booking.status = RequestStatus.ACCEPTED;
      return await booking.save();
    },

    rejectBooking: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ): Promise<IBooking> => {
      if (!user || user.role !== "PROVIDER")
        throw new GraphQLError("Not authorized");
      const booking = await Booking.findById(id);
      if (!booking) throw new GraphQLError("Booking not found");
      const service = await Service.findById(booking.service);
      if (!service || service.provider.toString() !== user.id)
        throw new GraphQLError("Not authorized to reject");
      booking.status = RequestStatus.REJECTED;
      return await booking.save();
    },

    completeBooking: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ): Promise<IBooking> => {
      if (!user || user.role !== "PROVIDER")
        throw new GraphQLError("Not authorized");
      const b = await Booking.findById(id);
      if (!b || b.user.toString() !== user.id)
        throw new GraphQLError("Not authorized");
      if (b.status !== RequestStatus.ACCEPTED || !b.isPaid)
        throw new GraphQLError("Cannot complete");
      b.status = RequestStatus.COMPLETED;
      return b.save();
    },

    cancelBooking: async (
      _: unknown,
      { id }: { id: string },
      { user }: Context
    ): Promise<IBooking> => {
      if (!user) throw new GraphQLError("Not authenticated");
      const booking = await Booking.findById(id);
      if (!booking) throw new GraphQLError("Booking not found");
      if (
        booking.user.toString() !== user.id ||
        booking.status !== RequestStatus.PENDING
      ) {
        throw new GraphQLError("Not authorized to cancel");
      }
      booking.status = RequestStatus.CANCELLED;
      return await booking.save();
    },

    payBooking: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new GraphQLError("غير مصرح");

      const booking = await Booking.findById(id).populate<{
        service: IService;
      }>("service");

      if (!booking) throw new GraphQLError("الحجز غير موجود");
      if (booking.user.toString() !== user.id)
        throw new GraphQLError("غير مصرح");

      booking.status = RequestStatus.PAID;
      booking.isPaid = true;
      await booking.save();

      await User.findByIdAndUpdate(booking.service.provider, {
        $inc: { walletBalance: booking.service.price },
      });

      return booking;
    },
    startPayment: async (
      _: any,
      { bookingId }: { bookingId: string },
      { user }: Context
    ) => {
      if (!user) throw new GraphQLError("غير مصرح");

      const booking = await Booking.findById(bookingId).populate<{
        service: { price: number };
      }>("service");

      if (!booking) throw new GraphQLError("الحجز غير موجود");
      if (booking.user.toString() !== user.id)
        throw new GraphQLError("غير مصرح");

      return paymentService.createPaymentIntent(
        bookingId,
        booking.service.price
      );
    },

    confirmPayment: async (
      _: any,
      { paymentId }: { paymentId: string },
      { user }: Context
    ) => {
      if (!user) throw new GraphQLError("غير مصرح");
      return paymentService.confirmPayment(paymentId);
    },
  },
};

export default bookingResolvers;
