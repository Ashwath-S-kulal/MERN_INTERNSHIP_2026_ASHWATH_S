import { useState } from "react";
import axios from "axios";
import { 
  Briefcase, MapPin, 
  ChevronRight, Check, 
  ArrowLeft, Info,
  ToolCase,
  Clock,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function SimpleApplyForService() {
  const [form, setForm] = useState({
    services: "", title: "", bio: "", experience: "",
    hourlyRate: "", serviceRadius: 10, address: "",
    city: "", zipCode: "", hasTools: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return alert("Please login first");

    try {
      setLoading(true);
      const cleanData = {
        ...form,
        experience: Number(form.experience),
        hourlyRate: Number(form.hourlyRate),
        serviceRadius: Number(form.serviceRadius),
        services: [form.services],
      };

      const res = await axios.post(
        "http://localhost:8000/api/serviceProvider/applyprovider",
        cleanData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans selection:bg-blue-100">
      
      {/* --- LEFT SIDE: THE PITCH --- */}
      <div className="lg:w-[400px] bg-slate-50 lg:h-fit lg:sticky lg:top-0 p-10 flex flex-col justify-between border-r border-slate-100">
        <div>
     
          
          <div className="w-12 h-12 bg-blue-600 rounded-2xl mb-6 flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <Zap size={24} fill="currentColor" />
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Ready to <br /> 
            <span className="text-blue-600">Start Earning?</span>
          </h1>
          <p className="mt-6 text-slate-500 font-medium leading-relaxed">
            Fill out your professional profile. Once verified, you'll appear in local searches and start receiving bookings.
          </p>
        </div>

        <div className="mt-36 space-y-6">
          <div className="flex gap-4 items-start">
            <ShieldCheck className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Secure Verification</p>
          </div>
          <div className="flex gap-4 items-start">
            <Clock className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fast Approval (24h)</p>
          </div>
        </div>
      </div>


      <main className="max-w-2xl mx-auto px-6 pb-20 mt-8">
        <header className="mb-12">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Become a Partner</h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">Fill in your details to start receiving service requests.</p>
        </header>

        <form onSubmit={submit} className="space-y-10">
          
          {/* Section 1: Specialization */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={16} /> 01. Specialization
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <select
                name="services"
                value={form.services}
                onChange={handleChange}
                className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-bold appearance-none"
                required
              >
                <option value="">Select your primary service</option>
                <option value="plumber">Plumbing</option>
                <option value="electrician">Electrical</option>
                <option value="cleaning">Cleaning</option>
                <option value="ac_repair">AC Repair</option>
                <option value="painting">Painting</option>
              </select>
            </div>
          </section>

          {/* Section 2: Experience */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ToolCase size={16} /> 02. Professional Info
            </h3>
            <div className="space-y-4">
              <input 
                name="title" 
                placeholder="Job Title (e.g. Senior Plumber)" 
                onChange={handleChange}
                className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-bold"
              />
              <textarea 
                name="bio" 
                placeholder="Briefly describe your work background..." 
                rows="3"
                onChange={handleChange}
                className="w-full p-5 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-5 top-2 text-[10px] font-bold text-slate-400 uppercase">Years Exp.</span>
                  <input type="number" name="experience" onChange={handleChange} className="w-full h-16 pt-5 px-5 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold outline-none" required />
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-2 text-[10px] font-bold text-slate-400 uppercase">Hourly Rate (₹)</span>
                  <input type="number" name="hourlyRate" onChange={handleChange} className="w-full h-16 pt-5 px-5 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold outline-none" required />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Location */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} /> 03. Service Area
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-300 rounded-2xl">
                <span className="text-sm font-bold text-slate-700">Service Radius</span>
                <div className="flex items-center gap-3">
                  <input type="number" name="serviceRadius" value={form.serviceRadius} onChange={handleChange} className="w-12 bg-transparent text-right font-black text-blue-600 outline-none" />
                  <span className="text-xs font-bold text-slate-400 uppercase">KM</span>
                </div>
              </div>
              
              <input name="address" placeholder="Street Address" onChange={handleChange} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold outline-none" />
              
              <div className="grid grid-cols-2 gap-4">
                <input name="city" placeholder="City" onChange={handleChange} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold outline-none" />
                <input name="zipCode" placeholder="Zip Code" onChange={handleChange} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-300 rounded-2xl font-bold outline-none" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-2 ml-1">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.hasTools ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                  <input type="checkbox" name="hasTools" checked={form.hasTools} onChange={handleChange} className="hidden" />
                  {form.hasTools && <Check size={14} className="text-white" />}
                </div>
                <span className="text-sm font-bold text-slate-600">I have my own tools and equipment</span>
              </label>
            </div>
          </section>

          {/* Action Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-200"
            >
              {loading ? "Processing..." : "Submit Application"}
              {!loading && <ChevronRight size={18} />}
            </button>
            <div className="mt-8 p-4 bg-slate-50 rounded-xl flex items-start gap-3">
               <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
               <p className="text-xs text-slate-500 leading-relaxed font-medium">
                 By submitting, you agree to our provider terms. Our team will review your application and respond within 48 hours.
               </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}