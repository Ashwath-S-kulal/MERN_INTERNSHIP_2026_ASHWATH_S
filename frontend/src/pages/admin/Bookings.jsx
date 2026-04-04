import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar, Clock, User, Briefcase, Mail,
  CheckCircle, XCircle, AlertCircle, ExternalLink
} from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchAllBookings = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get("http://localhost:8000/api/booking/allbookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching admin bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] font-sans">
      <div className="max-w-screen mx-auto">

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Management</h1>
            <p className="text-slate-500 font-medium">Monitor and manage all platform transactions.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Volume</span>
            <span className="text-xl font-black text-indigo-600">{bookings.length} Bookings</span>
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service & Provider</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50/30 transition-colors group">

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {booking.user?.profilePic ? (
                        <img
                          src={booking.user.profilePic}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm"
                          alt=""
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                          <span className="text-[11px] font-black text-slate-500 uppercase">
                            {booking.user?.firstName?.substring(0, 1)}
                            {booking.user?.lastName?.substring(0, 1) || "U"}
                          </span>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                          {booking.user?.firstName} {booking.user?.lastName}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Mail size={10} /> {booking.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div
                      onClick={() => navigate(`/servicedetails/${booking.provider?._id}`)}
                      className="flex items-center gap-3 cursor-pointer group/prov"
                    ><div className="relative">
                        {(booking.provider?.images?.[0]?.url || booking.provider?.user?.profilePic) ? (
                          <img
                            src={booking.provider?.images?.[0]?.url || booking.provider?.user?.profilePic}
                            className="w-10 h-10 rounded-xl object-cover border border-indigo-100 group-hover/prov:ring-2 ring-indigo-500 transition-all"
                            alt=""
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover/prov:ring-2 ring-indigo-500 transition-all">
                            <span className="text-[11px] font-black text-indigo-600 uppercase">
                              {booking.provider?.user?.firstName?.substring(0, 2) || "SP"}
                            </span>
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/prov:opacity-100 transition-opacity border border-slate-100">
                          <ExternalLink size={8} className="text-indigo-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 group-hover/prov:text-indigo-600 transition-colors">
                          {booking.provider?.title}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                          by {booking.provider?.user?.firstName} {booking.provider?.user?.lastName}
                        </p>
                      </div>
                    </div>
                  </td>


                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-xs font-bold">{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                  </td>


                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      booking.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                      {booking.status === 'completed' ? <CheckCircle size={10} /> :
                        booking.status === 'pending' ? <AlertCircle size={10} /> : <XCircle size={10} />}
                      {booking.status}
                    </span>
                  </td>


                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-slate-900">₹{booking.price}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">/ {booking?.unit}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold italic">No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}