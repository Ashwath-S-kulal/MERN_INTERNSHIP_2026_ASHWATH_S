import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar, Clock, MapPin, Star, ShieldCheck,
  Briefcase, Wrench, Navigation, Info,
  ChevronRight, ArrowRight, Globe,
  CheckCircle, Hash, Zap, CalendarDays,
  ArrowLeft
} from "lucide-react";

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [activeImg, setActiveImg] = useState("");
  const [reviews, setReviews] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const navigate = useNavigate();



  useEffect(() => {
    const fetchService = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`http://localhost:8000/api/user/getservicebyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setService(res.data);
        if (res.data.images?.length > 0) setActiveImg(res.data.images[0].url);
      } catch (err) { console.error(err); }
    };
    fetchService();
  }, [id]);



  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`http://localhost:8000/api/booking/slots?providerId=${id}&date=${date}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookedSlots(res.data);
      } catch (err) { console.error(err); }
    };
    fetchSlots();
  }, [date, id]);



  const handleBooking = async () => {
    if (!date || !time || !address) return alert("Please fill all details");

    const token = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/booking/create",
        { providerId: service._id, date, time, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Booking Successful!");
      setDate(""); setTime(""); setAddress("");
    } catch (err) {
      console.log(err)
      alert("❌ Booking failed");
    }
    finally { setLoading(false); }
  };



  const isDayAvailable = (dateString) => {
    if (!dateString || !service) return false;
    const dayName = daysOfWeek[new Date(dateString).getDay()];
    return service.availability.includes(dayName);
  };


  useEffect(() => {
    const fetchServiceAndReviews = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`http://localhost:8000/api/user/getservicebyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setService(res.data);
        if (res.data.images?.length > 0) setActiveImg(res.data.images[0].url);

        const reviewRes = await axios.get(`http://localhost:8000/api/reviews/provider/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(reviewRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServiceAndReviews();
  }, [id]);



  if (!service) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];


  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
    : service.rating;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-12 font-sans text-slate-800">

      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <NavLink to={"/service"} className="hover:text-slate-600 transition-colors underline-offset-4 hover:underline">
                Services
              </NavLink>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-blue-600 font-black">{service.services?.[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${service.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${service.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {service.isActive ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </nav>


      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
            <div className="aspect-[16/9] rounded-md overflow-hidden bg-slate-50 mb-3">
              <img src={activeImg} className="w-full h-full object-cover" alt="Main" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {service.images?.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(img.url)} className={`w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border transition-all ${activeImg === img.url ? 'border-blue-500 ring-2 ring-blue-50' : 'border-transparent opacity-50'}`}>
                  <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border border-slate-100 shadow-sm">
            <h1 className="text-2xl font-black text-slate-900 mb-1">{service.title}</h1>
            <div className="flex flex-wrap gap-4 text-[12px] text-slate-400 mb-6">
              <span className="flex items-center gap-1"><MapPin size={13} /> {service.city}, {service.address}</span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star size={13} className="fill-amber-500" />
                {averageRating}
                <span className="text-slate-400 font-medium ml-0.5">
                  ({reviews.length > 0 ? reviews.length : 0})
                </span>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { label: "Exp.", value: `${service.experience}y`, icon: Briefcase },
                { label: "Radius", value: `${service.serviceRadius}km`, icon: Navigation },
                { label: "Tools", value: service.hasTools ? "Yes" : "No", icon: Wrench },
                { label: "Zip", value: service.zipCode, icon: Hash }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[8px] font-black text-slate-300 uppercase mb-0.5">{stat.label}</p>
                  <p className="text-[11px] font-bold text-slate-700">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar size={12} /> Weekly Schedule
              </p>
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((day) => {
                  const isAvailable = service.availability.includes(day);
                  return (
                    <div key={day} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all 
                      ${isAvailable ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-transparent text-slate-300'}`}>
                      {day.slice(0, 3)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Info size={12} /> About Service</h3>
            <p className="text-slate-600 text-[14px] leading-relaxed italic">"{service.bio}"</p>
          </div>


          <div className="bg-white p-6 rounded-md border border-slate-100 shadow-sm mx-auto mt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  Client Feedback
                </h3>
                <p className="text-lg font-black text-slate-900">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </p>
              </div>
              <div className="bg-slate-50 px-3 py-2 rounded-2xl flex items-center gap-2 border border-slate-100">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xl font-black text-slate-800 leading-none">
                    {averageRating}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                    Average
                  </span>
                </div>

                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      fill={i < Math.round(averageRating) ? "#f59e0b" : "#e2e8f0"}
                      stroke="none"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="p-4 rounded-2xl bg-slate-50/30 border border-slate-50 group hover:border-blue-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={review.user?.profilePic || `https://ui-avatars.com/api/?name=${review.user?.firstName}&background=6366f1&color=fff`}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                            alt="Reviewer"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white">
                            <CheckCircle size={8} fill="currentColor" />
                          </div>
                        </div>
                        <div>
                          <p className="text-[12px] font-black text-slate-800 leading-none mb-1">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < review.rating ? "#f59e0b" : "#e2e8f0"} stroke="none" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-[13px] leading-relaxed font-medium pl-1 underline-offset-4 decoration-blue-100 group-hover:underline">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Zap size={24} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No ratings yet</p>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-md shadow-xl shadow-slate-200/40 border border-slate-100 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase">Hourly Price</p>
                <p className="text-3xl font-black text-slate-900">₹{service.hourlyRate}<span className="text-[10px] font-medium text-slate-400 ml-1">/hr</span></p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">{service.status}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Choose Date</label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (!isDayAvailable(selectedDate)) {
                      alert(`Provider is not available on ${daysOfWeek[new Date(selectedDate).getDay()]}s`);
                      setDate("");
                      return;
                    }
                    setDate(selectedDate);
                    setTime("");
                  }}
                  className={`w-full bg-slate-50/50 border p-3 rounded-xl font-bold text-[13px] focus:ring-2 outline-none transition-all ${date && !isDayAvailable(date)
                    ? 'border-rose-500 ring-rose-50'
                    : 'border-slate-100 focus:ring-blue-500/10'
                    }`}
                />
                <p className="text-[9px] text-slate-400 mt-1 ml-1 italic">
                  Available: {service.availability.map(d => d.slice(0, 3)).join(", ")}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Select Time</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      disabled={bookedSlots.includes(slot) || !date}
                      onClick={() => setTime(slot)}
                      className={`py-2 rounded-lg text-[11px] font-bold border transition-all
                        ${time === slot ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'}
                        ${(bookedSlots.includes(slot) || !date) && 'opacity-20 cursor-not-allowed'}
                      `}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Work Address</label>
                <textarea
                  placeholder="Where is the service needed?"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-[12px] font-medium h-20 resize-none outline-none"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || !date || !time}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Booking..." : "Confirm Booking"}
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-1.5 opacity-30 mt-4">
                <ShieldCheck size={12} />
                <span className="text-[8px] font-bold uppercase tracking-tighter">Verified Provider & Secure Payment</span>
              </div>

            </div>

          </div>
        </div>



      </div>

    </div>
  );
}