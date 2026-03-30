import { useState } from "react";
import axios from "axios";
import {
  Briefcase, MapPin, ChevronRight, Check, Info,
  ToolCase, Clock, ShieldCheck, Globe, Calendar
} from "lucide-react";

export default function SimpleApplyForService() {
  const initialForm = {
    services: "",
    title: "",
    bio: "",
    experience: "",
    hourlyRate: "",
    serviceRadius: 10,
    address: "",
    city: "",
    zipCode: "",
    hasTools: true,
    languages: "",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleDayToggle = (day) => {
    const newDays = form.availability.includes(day)
      ? form.availability.filter(d => d !== day)
      : [...form.availability, day];
    setForm({ ...form, availability: newDays });
  };

  const submit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("bio", form.bio);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("zipCode", form.zipCode);
      formData.append("experience", form.experience);
      formData.append("hourlyRate", form.hourlyRate);
      formData.append("serviceRadius", form.serviceRadius);
      formData.append("hasTools", form.hasTools);
      formData.append("services", JSON.stringify([form.services]));
      formData.append("availability", JSON.stringify(form.availability));
      formData.append("languages", JSON.stringify(form.languages.split(",").map(l => l.trim())));

      images.forEach((file) => {
        formData.append("files", file);
      });

      await axios.post("http://localhost:8000/api/serviceProvider/applyprovider", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Success!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Check server console for errors");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">
      <div className="lg:w-[400px] bg-slate-50 lg:h-screen lg:sticky lg:top-0 p-10 flex flex-col border-r border-slate-100">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Ready to <br /> <span className="text-blue-600">Start Earning?</span>
          </h1>
          <p className="mt-6 text-slate-500 font-medium leading-relaxed">
            Fill out your professional profile. Once verified, you'll start receiving local service bookings.
          </p>
        </div>

        <div className="space-y-6 mt-44">
          <div className="flex gap-4 items-start">
            <ShieldCheck className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Secure Verification</p>
          </div>
          <div className="flex gap-4 items-start">
            <Clock className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">48h Approval Window</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Professional Application</h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">Complete all fields to ensure a smooth verification process.</p>
        </header>

        <form onSubmit={submit} className="space-y-12">
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={16} /> 01. Services Offered
            </h3>
            <select
              name="services"
              value={form.services}
              onChange={handleChange}
              className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-bold appearance-none"
              required
            >
              <option value="">Select your category</option>
              <option value="plumber">Plumbing</option>
              <option value="electrician">Electrical</option>
              <option value="cleaning">Cleaning</option>
              <option value="ac_repair">AC Repair</option>
              <option value="painting">Painting</option>
              <option value="carpentry">Carpentry</option>
              <option value="pest_control">Pest Control</option>
            </select>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ToolCase size={16} /> 02. Professional Info
            </h3>
            <div className="space-y-4">
              <input name="title" value={form.title} placeholder="Professional Title (e.g. Master Electrician)" onChange={handleChange} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-bold" required />
              <textarea name="bio" value={form.bio} placeholder="Bio (Max 500 characters)" maxLength="500" rows="3" onChange={handleChange} className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-5 top-2 text-[10px] font-bold text-slate-400 uppercase">Years Experience</span>
                  <input type="number" value={form.experience} name="experience" onChange={handleChange} className="w-full h-16 pt-5 px-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none" required />
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-2 text-[10px] font-bold text-slate-400 uppercase">Hourly Rate (₹)</span>
                  <input type="number" value={form.hourlyRate} name="hourlyRate" onChange={handleChange} className="w-full h-16 pt-5 px-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none" required />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                <Globe size={18} className="text-slate-400" />
                <input name="languages" value={form.languages} placeholder="Languages (e.g. English, Kannada, Hindi)" onChange={handleChange} className="flex-1 bg-transparent font-bold outline-none" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} /> 03. Weekly Availability
            </h3>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.availability.includes(day) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} /> 04. Logistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                <span className="text-sm font-bold text-slate-700">Service Radius (KM)</span>
                <input type="number" name="serviceRadius" value={form.serviceRadius} onChange={handleChange} className="w-16 bg-transparent text-right font-black text-blue-600 outline-none" />
              </div>
              <input name="address" value={form.address} placeholder="Street Address" onChange={handleChange} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" value={form.city} placeholder="City" onChange={handleChange} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none" />
                <input name="zipCode" value={form.zipCode} placeholder="Zip Code" onChange={handleChange} className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold outline-none" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-2">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.hasTools ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                  <input type="checkbox" name="hasTools" checked={form.hasTools} onChange={handleChange} className="hidden" />
                  {form.hasTools && <Check size={14} className="text-white" />}
                </div>
                <span className="text-sm font-bold text-slate-600">I own all necessary tools/equipment</span>
              </label>
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe size={16} /> 05. Portfolio Images
            </h3>
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-white transition-colors text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-blue-600 font-bold">Click to upload photos</span>
                  <span className="text-xs text-slate-400 mt-1">{images.length} files selected</span>
                </div>
              </label>
            </div>
          </section>

          <div className="space-y-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-200"
            >
              {loading ? "Submitting..." : "Submit Application"}
              {!loading && <ChevronRight size={18} />}
            </button>
            <div className="p-4 bg-blue-50/50 rounded-xl flex items-start gap-3 border border-blue-100">
              <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                By applying, you agree to our Service Terms. Applications are typically reviewed within 48 hours.
                Ensure your contact details are correct.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}