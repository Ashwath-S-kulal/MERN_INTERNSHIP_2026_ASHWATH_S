import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, ChevronLeft,
  User, ShieldCheck, CreditCard, Wrench,
  Phone, Mail, Info, AlertCircle, Loader2,
  HardHat, MessageSquare, CheckCircle2, XCircle, X, Check, Star,
  Download
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


  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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


  useEffect(() => {
    const fetchReview = async () => {
      if (id && booking?.status === "completed") {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/reviews/booking/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data && res.data._id) {
            setReviewRating(res.data.rating);
            setReviewComment(res.data.comment);
            setHasReviewed(true);
            setIsEditing(false);
          } else {
            setHasReviewed(false);
          }
        } catch (err) {
          console.error("Error fetching review:", err);
          console.log("No existing review found.");
          setHasReviewed(false);
        }
      }
    };
    fetchReview();
  }, [id, booking?.status, token]);



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
        `http://localhost:8000/api/booking/cancel/${booking._id}`,
        {
          status: "rejected",
          cancellationReason: finalReason,
          cancelledBy: "user"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooking((prev) => ({
        ...prev,
        status: "rejected",
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


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return alert("Please add a comment");

    try {
      setReviewLoading(true);

      const url = hasReviewed
        ? `http://localhost:8000/api/reviews/update/booking/${booking._id}`
        : `http://localhost:8000/api/reviews/create`;

      const method = hasReviewed ? "put" : "post";
      const res = await axios[method](
        url,
        {
          bookingId: booking._id,
          rating: reviewRating,
          comment: reviewComment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setHasReviewed(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  if (!booking) {
    return (
      <div className="p-10 text-center font-bold">Booking not found.</div>
    )
  }

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

              {selectedReason === "Other" && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Please specify your reason
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
              <img onClick={() => navigate(`/service/${booking.provider._id}`)} src={booking.provider?.user?.profilePic || "https://ui-avatars.com/api/?name=P"} className="cursor-pointer w-14 h-14 rounded-full object-cover border border-gray-100" alt="Provider" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">{booking.provider?.user?.firstName} {booking.provider?.user?.lastName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><Mail size={12} /> {booking.provider?.user?.email}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium"><MapPin size={12} /> {booking.provider?.city}</div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Info size={16} className="text-blue-500" /> Job Requirements
            </h2>
            <div className="space-y-4">
              <DetailRow label="Service Type" value={booking.serviceType || "General"} />
              <DetailRow label="Urgency" value={booking.urgency} isPill />

              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Problem Description</p>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">
                    "{booking.problemDescription}"
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" /> Appointment Info
            </h2>
            <div className="space-y-3 mb-4">
              <DetailRow label="Requested Date" value={new Date(booking.date).toLocaleDateString('en-GB')} />
              <DetailRow label="Payment Status" value={booking.paymentStatus} isPill />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2 flex items-center gap-1">
                <MapPin size={10} /> Service Address
              </p>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">
                  {booking.address?.houseNo}
                </p>
                <p className="text-xs font-medium text-slate-600">
                  {booking.address?.landmark && `Near ${booking.address.landmark}, `}
                  {booking.address?.area}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  {booking.address?.city} - {booking.address?.pincode}
                </p>
              </div>
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

        {workerDetails && booking.status !== "rejected" && (
          <section className="bg-indigo-600 rounded-2xl p-6 shadow-lg shadow-indigo-100 text-white relative overflow-hidden">
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

        {booking.status === "rejected" && (
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
                <XCircle size={20} strokeWidth={3} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-red-400 tracking-widest leading-none mb-1">Status Update</p>
                <h3 className="font-black text-red-800 uppercase text-sm">Order Rejected</h3>
              </div>
            </div>

            {booking.cancellationReason && (
              <div className="bg-white/60 p-4 rounded-2xl border border-red-50">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-wider">Reason for rejection</p>
                <p className="text-sm font-bold text-slate-700 italic">
                  "{booking.cancellationReason}"
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-red-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-400 uppercase">Closed on</span>
              <span className="text-[10px] font-black text-red-800">{new Date(booking.updatedAt).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        )}


        {booking.status === "completed" && booking.hoursWorked > 0 && (
          <div className="bg-emerald-50 p-8 rounded-md border border-emerald-100 shadow-sm animate-in zoom-in-95 duration-300 relative group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Invoice</p>
                </div>
                <p className="text-sm text-emerald-800 font-bold italic">
                  Service Completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-emerald-950 leading-none">
                  ₹{booking.totalAmount?.toLocaleString()}
                </p>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full mt-3 inline-block shadow-sm transition-all duration-500 ${booking.paymentStatus === 'paid'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 text-white animate-pulse'
                  }`}>
                  {booking.paymentStatus === 'paid' ? 'Transaction Paid' : 'Awaiting Payment'}
                </span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-white/60 rounded-2xl border border-emerald-200/50 space-y-4">
              <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest border-b border-emerald-100 pb-2">Final Job Summary</h4>
              <div className="grid grid-cols-2 gap-y-3">
                <SummaryItem label="Service Rendered" value={booking.serviceType} />
                <SummaryItem label="Professional" value={workerDetails?.fullname || "Assigned Tech"} />
                <SummaryItem
                  label="Quantity"
                  value={`${booking.hoursWorked} ${booking.unit}${booking.hoursWorked > 1 ? 's' : ''}`}
                />
                <SummaryItem
                  label="Rate"
                  value={`₹${booking.price}/${booking.unit}`}
                />
                <SummaryItem label="Location" value={booking.city} className="col-span-2" />
                {booking.extraCharges?.length > 0 && (
                  <div className="col-span-2 space-y-1 mt-2 pt-2 border-t border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-800 uppercase">Additional Parts</p>
                    {booking.extraCharges.map((ex, i) => (
                      <div key={i} className="flex justify-between text-[11px] font-bold text-emerald-700">
                        <span>• {ex.name}</span>
                        <span>₹{ex.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="col-span-2 pt-2 border-t border-emerald-100 mt-1 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Grand Total</span>
                  <span className="text-lg font-black text-emerald-900">₹{booking.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {booking.paymentStatus === 'paid' ? (
              <div className="flex flex-col items-center justify-center gap-2 py-4 bg-white/50 rounded-2xl border border-emerald-100/50 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <Check size={20} strokeWidth={3} />
                </div>
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">Closed & Settled</span>
              </div>
            ) : (
              <div className="py-4 text-center border-2 border-dashed border-emerald-200 rounded-2xl">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  Waiting for provider to confirm cash receipt...
                </p>
              </div>
            )}
          </div>
        )}
      </div>


      {booking.status === "completed" && booking.paymentStatus === "paid" && (
        <section className="bg-white p-8 mt-10 rounded-2xl border border-blue-100 shadow-sm mb-6 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
                  {hasReviewed && !isEditing ? "Your Review" : "Rate your Experience"}
                </h2>
              </div>
            </div>

            {hasReviewed && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
              >
                Edit Review
              </button>
            )}
          </div>

          {hasReviewed && !isEditing ? (
            <div className="space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={reviewRating >= star ? "#fbbf24" : "none"}
                    className={reviewRating >= star ? "text-amber-400" : "text-slate-200"}
                  />
                ))}
              </div>
              <p className="text-slate-600 text-sm font-medium italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{reviewComment}"
              </p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="group transition-all transform hover:scale-110 active:scale-95 outline-none"
                  >
                    <Star
                      size={32}
                      fill={reviewRating >= star ? "#fbbf24" : "none"}
                      className={`transition-colors duration-200 ${reviewRating >= star
                        ? "text-amber-400"
                        : "text-slate-200 group-hover:text-amber-200"
                        }`}
                      strokeWidth={reviewRating >= star ? 0 : 2}
                    />
                  </button>
                ))}
              </div>

              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Share your thoughts..."
                rows="3"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />

              <div className="flex gap-3">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                  {reviewLoading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} strokeWidth={3} />}
                  {isEditing ? "Update Review" : "Submit Verification & Review"}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

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

function SummaryItem({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-[9px] font-black text-emerald-700/50 uppercase leading-none mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-800 truncate">{value}</p>
    </div>
  );
}