import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  // ✅ Fetch booking
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/booking/single/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooking(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooking();
  }, [id]);

  // ✅ Cancel booking
  const cancelBooking = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      setCancelLoading(true);

      await axios.put(
        `http://localhost:8000/api/booking/status/${booking._id}`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("❌ Booking cancelled");

      // update UI instantly
      setBooking((prev) => ({
        ...prev,
        status: "cancelled",
      }));

    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  // 🎨 Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-purple-100 text-purple-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (!booking)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold">Loading booking...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <h1 className="text-2xl font-black">Booking Details</h1>

          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status.toUpperCase()}
          </span>
        </div>

        {/* CUSTOMER */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-4">Customer Info</h2>

          <div className="flex items-center gap-4">
            <img
              src={
                booking.user?.profilePic ||
                "https://ui-avatars.com/api/?name=U"
              }
              className="w-16 h-16 rounded-full"
              alt=""
            />
            <div>
              <p className="font-bold">
                {booking.user?.firstName} {booking.user?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {booking.user?.email}
              </p>
              <p className="text-sm text-gray-500">
                {booking.user?.phoneNo}
              </p>
            </div>
          </div>
        </div>

        {/* PROVIDER */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-4">Service Provider</h2>

          <div className="flex items-center gap-4">
            <img
              src={
                booking.provider?.user?.profilePic ||
                "https://ui-avatars.com/api/?name=P"
              }
              className="w-16 h-16 rounded-full"
              alt=""
            />
            <div>
              <p className="font-bold">
                {booking.provider?.user?.firstName}{" "}
                {booking.provider?.user?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {booking.provider?.user?.email}
              </p>
              <p className="text-sm text-gray-500">
                {booking.provider?.city}
              </p>
            </div>
          </div>
        </div>

        {/* SERVICE DETAILS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-4">Service Details</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Service:</strong>{" "}
              {booking.provider?.services?.join(", ")}
            </p>
            <p>
              <strong>Title:</strong> {booking.provider?.title}
            </p>
            <p>
              <strong>Experience:</strong>{" "}
              {booking.provider?.experience} yrs
            </p>
            <p>
              <strong>Rate:</strong> ₹
              {booking.provider?.hourlyRate}/hr
            </p>
          </div>
        </div>

        {/* BOOKING DETAILS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-4">Booking Info</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Date:</strong> {booking.date}
            </p>
            <p>
              <strong>Time:</strong> {booking.time}
            </p>
            <p>
              <strong>Price:</strong> ₹{booking.price}
            </p>
            <p>
              <strong>Payment:</strong> {booking.paymentStatus}
            </p>
          </div>

          <div className="mt-4 bg-gray-100 p-4 rounded-xl">
            <strong>Address:</strong> {booking.address}
          </div>
        </div>

        {/* CANCEL BUTTON */}
        {(booking.status === "pending" ||
          booking.status === "accepted") && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <button
              onClick={cancelBooking}
              disabled={cancelLoading}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {cancelLoading ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}