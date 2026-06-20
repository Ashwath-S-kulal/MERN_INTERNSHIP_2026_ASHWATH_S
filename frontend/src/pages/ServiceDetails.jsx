import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar, MapPin, Star, ShieldCheck,
  Briefcase, Wrench, Navigation, Info,
  ChevronRight, ArrowLeft, CheckCircle, Hash, Zap, Loader2, Sparkles, Award, X
} from "lucide-react";
import Loader from "../components/Loading";
import AiDescriptionInput from "@/components/GenerateDesc";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeImg, setActiveImg] = useState("");
  const [reviews, setReviews] = useState([]);
  const [problem, setProblem] = useState("");
  const [address, setAddress] = useState({
    houseNo: "",
    landmark: "",
    area: "",
    pincode: ""
  });
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [animateDrawer, setAnimateDrawer] = useState(false);
  const [aiError, setAiError] = useState("");


  const today = new Date().toISOString().split("T")[0];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const [serviceRes, reviewRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URI}/api/user/getservicebyid/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BASE_URI}/api/reviews/provider/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setService(serviceRes.data);
        if (serviceRes.data.images?.length > 0) setActiveImg(serviceRes.data.images[0].url);
        setReviews(reviewRes.data.data || []);
      } catch (err) {
        console.error("Error fetching service details:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setDate("");
    setProblem("");
    setAddress({
      houseNo: "",
      landmark: "",
      area: "",
      pincode: ""
    });
  };

  const handleBooking = async () => {
    if (!date || !address.houseNo || !address.area) {
      return alert("Please fill in all mandatory fields (Date, House No, and Area).");
    }
    const token = localStorage.getItem("accessToken");
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BASE_URI}/api/booking/create`, {
        providerId: service._id,
        date,
        problemDescription: problem || "No specific problem described",
        address: {
          ...address,
          city: service.city
        },
        unit: service.pricing.unit,
        price: service.pricing.rate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      resetForm();
      navigate("/bookingsuccess");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Request failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAiInsights = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      setAiLoading(true);
      setAiError("");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/ai/ai-summary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAiData(res.data);
      }
    } catch (err) {
      console.error("Error generating AI data:", err);
      setAiError("Could not build analytical review insights right now. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const openAiDrawer = () => {
    setIsAiDrawerOpen(true);
    setTimeout(() => {
      setAnimateDrawer(true);
    }, 10);

    if (!aiData && !aiLoading) {
      handleFetchAiInsights();
    }
  };

  const closeAiDrawer = () => {
    setAnimateDrawer(false);
    setTimeout(() => {
      setIsAiDrawerOpen(false);
    }, 300);
  };

  if (!service) return (
    <Loader />
  );

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-12 font-sans text-slate-800">

      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <NavLink to="/service" className="hover:text-slate-600">Services</NavLink>
              <ChevronRight size={10} />
              <span className="text-blue-600 font-black">{service.services?.[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
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
            <div className="flex items-center justify-between mb-8">
              <div onClick={() => navigate(`/provideralljobs/${service.user._id}`)} className="flex items-center gap-4 cursor-pointer">
                <div className="relative">
                  <img
                    src={service.user?.profilePic || `https://ui-avatars.com/api/?name=${service.user?.firstName}&background=6366f1&color=fff`}
                    className="w-16 h-16 rounded-[22px] border-4 border-white shadow-md object-cover ring-1 ring-slate-100"
                    alt="avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white">
                    <CheckCircle size={10} className="text-white" fill="currentColor" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">
                    {service.user?.firstName} {service.user?.lastName}
                  </h3>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {service.services?.[0] || "Verified Professional"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 px-3 py-2 rounded-2xl flex flex-col items-center border border-amber-100">
                <div className="flex items-center gap-1 text-amber-600 font-black text-sm">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  {averageRating}
                </div>
                <span className="text-[8px] font-black text-amber-400 uppercase tracking-tighter">{reviews.length} reviews</span>
              </div>
            </div>


            <h1 className="text-2xl font-black text-slate-900 mb-1">{service.title}</h1>
            <div className="flex flex-wrap gap-4 text-[12px] text-slate-400 mb-6">
              <span className="flex items-center gap-1"><MapPin size={13} /> {service.city}, {service.address}</span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star size={13} className="fill-amber-500" stroke="none" />
                {averageRating} ({reviews.length})
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
                {daysOfWeek.map((day) => (
                  <div key={day} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all 
                    ${service.availability.includes(day) ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-transparent text-slate-300'}`}>
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Info size={12} /> About Service</h3>
            <p className="text-slate-600 text-[14px] leading-relaxed italic">"{service.bio}"</p>
          </div>


          <div className="bg-white p-6 rounded-md border border-slate-100 shadow-sm mx-auto mt-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Feedback</h3>
            <div className="space-y-5">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review._id} className="p-4 rounded-2xl bg-slate-50/30 border border-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <img src={review.user?.profilePic || `https://ui-avatars.com/api/?name=${review.user?.firstName}&background=6366f1&color=fff`} className="w-8 h-8 rounded-lg object-cover" alt="User" />
                      <p className="text-[12px] font-black text-slate-800">{review.user?.firstName} {review.user?.lastName}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < review.rating ? "#f59e0b" : "#e2e8f0"} stroke="none" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-[13px]">"{review.comment}"</p>
                </div>
              )) : (
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
                <p className="text-[9px] font-black text-slate-300 uppercase">Price</p>
                <p className="text-3xl font-black text-slate-900">₹{service.pricing.rate}<span className="text-[20px] font-medium text-slate-400 ml-1">/{service.pricing.unit}</span></p>
              </div>
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Preferred Date *</label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl font-bold text-[13px] outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Describe the Problem (Optional)
                  </label>
                    <AiDescriptionInput
                      value={problem}
                      onChange={setProblem}
                    />
                </div>

                <div className="relative">  
                  <textarea
                    placeholder="Write Problem in Short, AI will generate a detailed description for you.."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-[12px] font-medium h-24 resize-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  />
                  {problem.length === 0 && (
                    <span className="absolute bottom-4 right-4 text-[9px] text-slate-300 font-bold uppercase tracking-widest pointer-events-none">
                      Max 10000 chars
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Service Location *</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="houseNo"
                    value={address.houseNo}
                    placeholder="House/Flat No."
                    onChange={handleAddressChange}
                    className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[12px] outline-none focus:border-blue-400"
                  />
                  <input
                    name="pincode"
                    value={address.pincode}
                    placeholder="Pincode"
                    onChange={handleAddressChange}
                    className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[12px] outline-none focus:border-blue-400"
                  />
                </div>
                <input
                  name="area"
                  value={address.area}
                  placeholder="Area / Street Name"
                  onChange={handleAddressChange}
                  className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[12px] outline-none focus:border-blue-400"
                />
                <input
                  name="landmark"
                  value={address.landmark}
                  placeholder="Landmark (Optional)"
                  onChange={handleAddressChange}
                  className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[12px] outline-none focus:border-blue-400"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || !date || !address.houseNo || !address.area}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : "Request Service"}
              </button>
            </div>
          </div>


        </div>
      </div>

      <button
        onClick={isAiDrawerOpen ? closeAiDrawer : openAiDrawer}
        className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 text-white p-4 rounded-full shadow-[0_4px_25px_rgba(37,99,235,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 group ${isAiDrawerOpen ? 'bg-slate-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}
        title={isAiDrawerOpen ? "Close AI Insights" : "Open AI Engine Insights"}
      >
        {isAiDrawerOpen ? (
          <X size={18} />
        ) : (
          <>
            <span className="max-w-xs overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-[10px] font-black uppercase tracking-wider pl-0 group-hover:pl-1">
              AI Review Engine
            </span>
            <Zap size={18} className="fill-white text-white animate-pulse" />
          </>
        )}
      </button>

      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${animateDrawer ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={closeAiDrawer}
          />

          {/* Popup Container: Add mb-20 to push it above the button */}
          <div
            className={`w-full max-w-sm bg-white rounded-xl mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col max-h-[70vh] pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${animateDrawer ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
              }`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-0.5">Profile Insights</h3>
                </div>
              </div>
              <button
                onClick={closeAiDrawer}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content - Same as before */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4.5 rounded-md border border-slate-150 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={service.user?.profilePic || `https://ui-avatars.com/api/?name=${service.user?.firstName}&background=6366f1&color=fff`}
                    className="w-11 h-11 rounded-md object-cover border border-white shadow-sm"
                    alt="Provider Avatar"
                  />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Provider Profile</p>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                      {service.user?.firstName} {service.user?.lastName}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold capitalize">{service.services?.[0]}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeAiDrawer();
                    navigate(`/provideralljobs/${service.user._id}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-850 text-[10px] font-black  tracking-wider py-3 px-4 rounded-md shadow-md transition-all active:scale-[0.98]"
                >
                  <Briefcase size={12} />
                  Explore Portfolio &amp; All Jobs
                </button>
              </div>

              {aiLoading && (
                <div className="space-y-4 animate-pulse pt-2">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="text-blue-500 animate-spin" />
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                      {aiData ? "Re-scanning telemetry..." : "Assembling feedback telemetry..."}
                    </span>
                  </div>
                  <div className="h-32 bg-slate-100 rounded-2xl w-full"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 bg-slate-100 rounded-xl"></div>
                    <div className="h-20 bg-slate-100 rounded-xl"></div>
                  </div>
                </div>
              )}

              {!aiLoading && aiData && (
                <div className="space-y-6 fade-in">
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-md border border-slate-100 shadow-sm flex flex-col justify-center">
                      <div className="text-center mb-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          <Star size={11} className="fill-amber-400 text-amber-400" /> Ratings Matrix
                        </span>
                        <h5 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                          {aiData.metrics?.average || averageRating}
                        </h5>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Average Performance Rating</p>
                      </div>

                      <div className="space-y-2.5">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = aiData.metrics?.distribution?.[stars] || 0;
                          const percentage = aiData.metrics?.total > 0 ? (count / aiData.metrics.total) * 100 : 0;
                          return (
                            <div key={stars} className="flex items-center gap-2 text-[11px]">
                              <span className="w-6 font-black text-slate-500 text-right">{stars}★</span>
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="w-10 text-right font-black text-slate-400 text-[10px]">{count} count</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                          Behavioral Trend Report
                        </span>
                        <p className="text-slate-600 text-[13px] leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 italic">
                          "{aiData.summary}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-emerald-50/50 p-3.5 rounded-md border border-emerald-100/50 flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] font-black text-emerald-600 uppercase block mb-1">
                              Core Strength
                            </span>
                            <p className="text-[12px] font-extrabold text-slate-700 capitalize leading-tight">
                              {aiData.primaryStrength || "Steady Performance"}
                            </p>
                          </div>
                          <Award size={14} className="text-emerald-500 mt-2 self-end" />
                        </div>

                        <div className="bg-rose-50/50 p-3.5 rounded-md border border-rose-100/50 flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] font-black text-rose-500 uppercase block mb-1">
                              Target Improvement
                            </span>
                            <p className="text-[12px] font-extrabold text-slate-700 capitalize leading-tight">
                              {aiData.improvementArea || "Maintain SLA"}
                            </p>
                          </div>
                          <Info size={14} className="text-rose-400 mt-2 self-end" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                        Assigned Profile Badges
                      </span>
                      {aiData.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {aiData.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide flex items-center gap-1.5 shadow-sm"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-medium italic">No behavioral tags compiled</div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          closeAiDrawer();
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black  tracking-widest text-[11px] py-4 rounded-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} />
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!aiLoading && aiError && (
                <div className="p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-semibold">
                  {aiError}
                </div>
              )}

              {!aiData && !aiLoading && (
                <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Zap size={24} className="mx-auto text-slate-300 mb-3" />
                  <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-1">Telemetry Offline</h5>
                  <p className="text-xs text-slate-400 mb-4 px-6">Click below to query our AI analytical network database.</p>
                  <button
                    onClick={handleFetchAiInsights}
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all"
                  >
                    <Zap size={11} className="fill-current" />
                    Initialize Summary
                  </button>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/30 text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">
              ServiceMate AI Engine
            </div>
          </div>
        </div>
      )}
    </div>
  );
}