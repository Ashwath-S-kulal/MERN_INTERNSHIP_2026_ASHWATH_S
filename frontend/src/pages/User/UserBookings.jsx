import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/booking/user",
        {
          headers: { Authorization: `Bearer ${token}` },
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

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-black mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Date</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-4">
                    {b.provider?.services?.[0]}
                  </td>

                  <td className="p-4">
                    {b.provider?.user?.firstName}
                  </td>

                  <td className="p-4">{b.date}</td>

                  <td className="p-4">₹{b.price}</td>

                  <td className="p-4 capitalize">{b.status}</td>

                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/booking/${b._id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}