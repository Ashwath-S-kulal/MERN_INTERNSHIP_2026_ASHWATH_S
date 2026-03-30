import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, ChevronLeft,
  User, ShieldCheck, CreditCard, Wrench,
  Phone, Mail, Info, AlertCircle, Loader2,
  HardHat, MessageSquare, CheckCircle2, XCircle, X, Check
} from "lucide-react";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [workerDetails, setWorkerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const quickReasons = [
    "Schedule Conflict",
    "Found better price",
    "Service no longer needed",
    "Provider is unresponsive",
    "Other"
  ];

  useEffect(() => {
    const fetchBookingFlow = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/api/booking/single/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const bookingData = res.data;
        setBooking(bookingData);

        if (bookingData.assignedWorker) {
          try {
            const workerRes = await axios.get(
              `http://localhost:8000/api/member/getbyid/${bookingData.assignedWorker}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (workerRes.data && workerRes.data.member) {
              setWorkerDetails(workerRes.data.member);
            }
          } catch (workerErr) {
            console.error("Error fetching worker:", workerErr);
          }
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBookingFlow();
  }, [id, token]);

  const handleCancelSubmit = async () => {
    const finalReason = selectedReason === "Other"
      ? cancelReason
      : (selectedReason + (cancelReason ? `: ${cancelReason}` : ""));

    if (!selectedReason) {
      alert("Please select a reason.");
      return;
    }

    try {
      setCancelLoading(true);
      await axios.put(
        `http://localhost:8000/api/booking/status/${booking._id}`,
        {
          status: "cancelled",
          cancellationReason: finalReason,
          cancelledBy: "user"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooking((prev) => ({
        ...prev,
        status: "cancelled",
        cancellationReason: finalReason
      }));
      setShowCancelModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "accepted": return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "cancelled": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  if (!booking) return <div className="p-10 text-center font-bold">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12 font-sans text-slate-900 relative">
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-black text-lg text-slate-800">Cancel Booking</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block">Why are you cancelling?</label>
                <div className="flex flex-wrap gap-2">
                  {quickReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${selectedReason === reason
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      {selectedReason === reason && <Check size={12} />}
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedReason === "Other" || selectedReason !== "") && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    {selectedReason === "Other" ? "Please specify your reason" : "Additional Details (Optional)"}
                  </label>
                  <textarea
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Tell us more..."
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors text-sm"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={cancelLoading || !selectedReason}
                className="flex-[2] bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-200 px-4 py-4 ">
        <div className="max-w-screen mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-black font-semibold transition-colors">
            <ChevronLeft size={20} /> Back
          </button>
          <h1 className="text-lg font-bold">Booking Details</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-screen mx-auto pt-6 space-y-6 ">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white"><Wrench size={24} /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Status</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</p>
            <p className="text-3xl font-black text-slate-900">₹{booking.price}</p>
          </div>
        </div>

        {booking.status === "cancelled" && booking.cancellationReason && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
            <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-1">Cancellation Reason</p>
              <p className="text-sm font-bold text-red-700 italic">"{booking.cancellationReason}"</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2"><User size={16} className="text-blue-500" /> Customer Info</h2>
            <div className="flex items-center gap-4">
              <img src={booking.user?.profilePic || "https://ui-avatars.com/api/?name=U"} className="w-14 h-14 rounded-full object-cover border border-gray-100" alt="User" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">{booking.user?.firstName} {booking.user?.lastName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Mail size={12} /> {booking.user?.email}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Phone size={12} /> {booking.user?.phoneNo || "N/A"}</div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> Service Provider</h2>
            <div className="flex items-center gap-4">
              <img src={booking.provider?.user?.profilePic || "https://ui-avatars.com/api/?name=P"} className="w-14 h-14 rounded-full object-cover border border-gray-100" alt="Provider" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">{booking.provider?.user?.firstName} {booking.provider?.user?.lastName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Mail size={12} /> {booking.provider?.user?.email}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><MapPin size={12} /> {booking.provider?.city}</div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2"><Info size={16} className="text-blue-500" /> Service Details</h2>
            <div className="space-y-3">
              <DetailRow label="Service Type" value={booking.provider?.services?.join(", ")} />
              <DetailRow label="Title" value={booking.provider?.title} />
              <DetailRow label="Experience" value={`${booking.provider?.experience} yrs`} />
              <DetailRow label="Hourly Rate" value={`₹${booking.provider?.hourlyRate}/hr`} />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> Appointment Info</h2>
            <div className="space-y-3 mb-4">
              <DetailRow label="Date" value={booking.date} />
              <DetailRow label="Time" value={booking.time} />
              <DetailRow label="Payment Status" value={booking.paymentStatus} isPill />
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Service Address</p>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{booking.address}</p>
            </div>
          </section>
        </div>

        {(booking.status === "pending" || booking.status === "accepted") && (
          <div className="pt-4">
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full bg-red-50 text-red-600 border border-red-100 py-4 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <AlertCircle size={18} /> Cancel My Booking
            </button>
          </div>
        )}

        {workerDetails && booking.status !== "cancelled" && (
          <section className="bg-indigo-600 rounded-2xl p-6 shadow-lg shadow-indigo-100 text-white relative overflow-hidden">
            <HardHat size={120} className="absolute -right-4 -bottom-4 text-white/10 rotate-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white/20 p-1.5 rounded-lg"><CheckCircle2 size={18} /></div>
                <h2 className="text-sm font-black uppercase tracking-[0.1em]">Assigned Service Expert</h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <img src={workerDetails.profilePic || `https://ui-avatars.com/api/?background=fff&color=4f46e5&name=${workerDetails.fullname}`} className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-md bg-white" alt="Worker" />
                <div className="flex-grow">
                  <p className="text-2xl font-black">{workerDetails.fullname}</p>
                  <p className="text-indigo-100 text-sm font-bold mb-2">{workerDetails.role}</p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <a href={`tel:${workerDetails.phonenumber}`} className="flex items-center gap-1.5 text-white bg-white/10 px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/20"><Phone size={14} /> {workerDetails.phonenumber}</a>
                    <div className="flex items-center gap-1.5 text-indigo-100 text-sm font-bold"><Mail size={14} /> {workerDetails.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, isPill }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      {isPill ? (
        <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
          {value || "N/A"}
        </span>
      ) : (
        <span className="text-sm font-bold text-slate-800">{value || "N/A"}</span>
      )}
    </div>
  );
}