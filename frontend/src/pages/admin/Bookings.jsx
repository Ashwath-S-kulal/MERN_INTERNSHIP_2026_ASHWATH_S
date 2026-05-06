import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar, Clock, User, Briefcase, Mail,
  CheckCircle, XCircle, AlertCircle, ExternalLink,
  Database
} from "lucide-react";
import Loader from "../../components/Loading";


export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllBookings = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/booking/allbookings`, {
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

  if (loading) return <Loader />


  return (
    <div className="bg-[#F8FAFC] font-sans min-h-screen">
      <div className="max-w-7xl mx-auto py-4 md:py-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Admin Oversight</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Management</h1>
            <p className="text-slate-500 font-medium text-sm">Monitor and manage all platform transactions.</p>
          </div>

          <div className="hidden md:table-cell bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Database size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Total Volume</span>
              <span className="text-xl font-black text-slate-900 leading-none">{bookings.length} Bookings</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 hidden md:table-row">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Profile</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service & Provider</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="group flex flex-col md:table-row hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-4 py-5 md:table-cell">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {booking.user?.profilePic ? (
                            <img
                              src={booking.user.profilePic}
                              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white shadow-md border border-slate-100"
                              alt=""
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                              <span className="text-[11px] font-black text-slate-500">
                                {booking.user?.firstName?.charAt(0)}{booking.user?.lastName?.charAt(0) || "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 mb-0.5">
                            {booking.user?.firstName} {booking.user?.lastName}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                            <Mail size={10} className="text-indigo-400" /> {booking.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-2 py-2 md:py-5 md:table-cell">
                      <div
                        onClick={() => navigate(`/servicedetails/${booking.provider?._id}`)}
                        className="inline-flex items-center gap-3 cursor-pointer group/prov bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-xl"
                      >
                        <div className="relative">
                          <img
                            src={booking.provider?.images?.[0]?.url || booking.provider?.user?.profilePic || "https://ui-avatars.com/api/?name=SP&background=eff6ff&color=2563eb"}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm transition-all group-hover/prov:ring-indigo-500"
                            alt=""
                          />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-700 group-hover/prov:text-indigo-600 transition-colors leading-tight">
                            {booking.provider?.title}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                            SP: {booking.provider?.user?.firstName} {booking.provider?.user?.lastName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2 md:py-5 md:table-cell">
                      <div className="flex items-center gap-3 bg-indigo-50/50 md:bg-transparent px-3 py-2 md:p-0 rounded-lg">
                        <Calendar size={14} className="text-indigo-500" />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700">{new Date(booking.date).toLocaleDateString('en-GB')}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Booked Date</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 md:py-5 md:table-cell text-left md:text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${booking.status === 'completed' ? 'bg-emerald-500' :
                          booking.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></span>
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 md:table-cell text-left md:text-right">
                      <div className="inline-flex flex-col md:items-end">
                        <p className="text-lg font-black text-slate-900 leading-none">₹{booking.price}</p>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                          Per {booking?.unit || 'Unit'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div className="py-24 text-center bg-slate-50/30">
                <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-300 mb-4">
                  <Database size={32} />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">
                  Vault Empty: No bookings found.
                </p>
              </div>
            )}
          </div>

          <div className="hidden md:table-cell px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Ledger Status: Synced</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-900 uppercase">{bookings.length} Verified Entries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}