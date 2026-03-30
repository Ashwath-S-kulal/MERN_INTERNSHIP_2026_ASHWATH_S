import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Clock, ChevronRight, Circle,
  User, HardHat, ArrowUpRight
} from "lucide-react";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/booking/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-2 text-gray-500 font-medium italic">
        <Circle size={10} className="animate-ping fill-blue-500 text-blue-500" />
        Loading bookings...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900">
      <div className="max-w-screen mx-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 font-medium">No service history found</p>
          </div>
        ) : (
          <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/50 px-6 py-4 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <div className="col-span-4">Service & Professional</div>
              <div className="col-span-3">Schedule</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2 text-right">Price & Action</div>
            </div>

            <div className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-blue-50/30 transition-colors items-center group"
                >
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="relative shrink-0">
                      {b.provider?.user?.profilePic ? (
                        <img
                          onClick={() => navigate(`/service/${b.provider._id}`)}
                          src={b.provider.user.profilePic}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm  cursor-pointer"
                          alt="Provider"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 cursor-pointer" onClick={() => navigate(`/service/${b.provider._id}`)}>
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                        {b.provider?.services?.[0] || "General Service"}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {b.provider?.user?.firstName} {b.provider?.user?.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 flex flex-row md:flex-col gap-4 md:gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Calendar size={14} className="text-blue-500" /> {b.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      <Clock size={14} /> {b.time}
                    </div>
                  </div>

                  <div className="col-span-3 space-y-2">
                    <StatusDot status={b.status} />
                    {b.status === "in_progress" && (
                      <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 w-fit px-2 py-1 rounded-lg border border-indigo-100 animate-pulse">
                        <HardHat size={12} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Expert assigned • View info</span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2">
                    <div className="text-left md:text-right">
                      <p className="text-lg font-black text-slate-900">₹{b.price}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/userdashboard/booking/${b._id}`)}
                      className="bg-slate-100 group-hover:bg-blue-600 text-slate-600 group-hover:text-white p-2 md:px-4 md:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span className="hidden md:inline tracking-tighter">Details</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const colors = {
    pending: "text-amber-500 bg-amber-50 border-amber-100",
    accepted: "text-blue-500 bg-blue-50 border-blue-100",
    in_progress: "text-indigo-600 bg-indigo-50 border-indigo-100",
    completed: "text-emerald-500 bg-emerald-50 border-emerald-100",
    rejected: "text-red-500 bg-red-50 border-red-100",
    cancelled: "text-gray-400 bg-gray-50 border-gray-100",
  };

  return (
    <div className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full border ${colors[status] || "text-gray-400 bg-gray-50 border-gray-100"}`}>
      <Circle size={6} fill="currentColor" />
      <span className="text-[10px] font-black uppercase tracking-widest">{status.replace('_', ' ')}</span>
    </div>
  );
}