import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  // ✅ Fetch bookings
  const fetchBookings = async () => {
    console.log(token)
    try {
      const res = await axios.get(
        "http://localhost:8000/api/booking/provider",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8000/api/booking/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // 🎨 Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "accepted":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "completed":
        return "text-purple-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold">Loading bookings...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-black mb-8">Provider Bookings</h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl text-center shadow">
          <h2 className="text-xl font-bold mb-2">No Bookings Yet</h2>
          <p className="text-gray-500">
            You will see new service requests here
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition"
            >
              {/* USER INFO */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    b.user?.profilePic ||
                    `https://ui-avatars.com/api/?name=${b.user?.firstName || "U"}`
                  }
                  className="w-14 h-14 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <h3 className="font-bold text-lg">
                    {b.user?.firstName} {b.user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {b.user?.email}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <p><strong>Date:</strong> {b.date}</p>
                <p><strong>Time:</strong> {b.time}</p>
                <p><strong>Address:</strong> {b.address}</p>
                <p><strong>Price:</strong> ₹{b.price}</p>

                <p className="col-span-2">
                  <strong>Status:</strong>{" "}
                  <span className={`font-bold ${getStatusColor(b.status)}`}>
                    {b.status.toUpperCase()}
                  </span>
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 flex-wrap mt-4">

                {b.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(b._id, "accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(b._id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}

                {b.status === "accepted" && (
                  <button
                    onClick={() => updateStatus(b._id, "in_progress")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Start Work
                  </button>
                )}

                {b.status === "in_progress" && (
                  <button
                    onClick={() => updateStatus(b._id, "completed")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Mark Complete
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}