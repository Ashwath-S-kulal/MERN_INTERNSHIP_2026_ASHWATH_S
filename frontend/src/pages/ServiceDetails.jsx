import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar, Clock, MapPin, Star, ShieldCheck,
  Briefcase, CheckCircle2, Globe, Wrench,
  Navigation, Info, Check, Image as LucideImage
} from "lucide-react";

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  // State for the interactive gallery
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`http://localhost:8000/api/user/getservicebyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setService(res.data);
        // Set initial large image
        if (res.data.images?.length > 0) {
          setActiveImg(res.data.images[0].url);
        }
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
    if (!date || !time || !address) {
      alert("Please fill all fields (Date, Time, and Address)");
      return;
    }
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
      console.error(err);
      alert("❌ Booking failed");
    } finally { setLoading(false); }
  };

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="max-w-6xl mx-auto px-4 pt-24">

        {/* 1. INTERACTIVE GALLERY SECTION */}
        <div className="space-y-4">
          <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={activeImg} className="w-full h-full object-cover" alt="Main" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {service.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(img.url)}
                className={`w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImg === img.url ? 'border-blue-600' : 'border-transparent opacity-60'}`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* 2. MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-4">{service.title}</h1>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold">
                  <Star size={16} className="fill-blue-600" /> {service.rating || "0.0"} Rating
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin size={18} /> {service.city}, {service.address}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Info size={20} className="text-blue-600" /> Provider Biography</h3>
              <p className="text-slate-600 leading-relaxed text-lg italic">"{service.bio}"</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</p>
                  <p className="font-bold text-slate-800">{service.experience} Years</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radius</p>
                  <p className="font-bold text-slate-800">{service.serviceRadius} KM</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tools</p>
                  <p className="font-bold text-slate-800">{service.hasTools ? "Yes" : "No"}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Languages</p>
                  <p className="font-bold text-slate-800">{service.languages?.[0] || "English"}</p>
                </div>
              </div>
            </div>

            {/* 3. SELECTABLE SLOT BUTTONS */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar size={22} className="text-blue-600" /> 1. Select Appointment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-400 mb-3 uppercase">Choose Date</p>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setTime(""); }}
                    className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold outline-none ring-2 ring-transparent focus:ring-blue-500/20"
                  />
                </div>

                <div className="bg-white border rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-400 mb-3 uppercase">Available Slots</p>
                  {!date ? (
                    <p className="text-sm text-slate-400 italic py-2">Please select a date first</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = time === slot;
                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setTime(slot)}
                            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border-2
                              ${isBooked ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed' :
                                isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' :
                                  'bg-white text-slate-700 border-slate-100 hover:border-blue-200 hover:bg-blue-50'}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold flex items-center gap-2 pt-4">
                  <Navigation size={22} className="text-blue-600" /> 2. Service Address
                </h3>
                <textarea
                  placeholder="Street name, Building, Flat No..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none h-32 transition-all"
                />
              </div>
            </div>
          </div>

          {/* PROVIDER INFO CARD (Side) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center sticky top-24 shadow-sm">
              <img src={service.user?.profilePic} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-slate-50 mb-4" alt="user" />
              <h4 className="text-xl font-bold text-slate-900">{service.user?.firstName} {service.user?.lastName}</h4>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">Verified Specialist</p>
              <div className="space-y-4 text-left border-t pt-6">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Identity Verified
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Wrench size={16} className="text-emerald-500" /> Professional Tools Included
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Clock size={16} className="text-emerald-500" /> On-time Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FIXED BOTTOM BOOKING BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="hidden md:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Hourly Rate</p>
            <p className="text-2xl font-black text-slate-900">₹{service.hourlyRate}<span className="text-sm font-normal text-slate-500"> /hr</span></p>
          </div>

          <div className="flex-1 flex items-center gap-4 justify-end">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">
                {date ? date : "Pick a date"}
                {time ? ` @ ${time}` : ""}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Selected Schedule</p>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50 min-w-[200px]"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}