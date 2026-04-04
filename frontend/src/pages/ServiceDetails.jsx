import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar, MapPin, Star, ShieldCheck,
  Briefcase, Wrench, Navigation, Info,
  ChevronRight, ArrowLeft, CheckCircle, Hash, Zap, Loader2
} from "lucide-react";

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

  const today = new Date().toISOString().split("T")[0];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const [serviceRes, reviewRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/user/getservicebyid/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8000/api/reviews/provider/${id}`, {
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
      await axios.post("http://localhost:8000/api/booking/create", {
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
      alert("✅ Service Request Sent Successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Request failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
    </div>
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Describe the Problem (Optional)</label>
                <textarea
                  placeholder="e.g. My AC is making a loud noise..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[12px] font-medium h-24 resize-none outline-none focus:border-blue-400"
                />
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
    </div>
  );
}