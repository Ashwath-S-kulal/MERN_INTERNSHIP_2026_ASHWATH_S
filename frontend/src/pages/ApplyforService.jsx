import { useState } from "react";
import axios from "axios";
import {
  Briefcase, MapPin, ChevronRight, Check, Info,
  ToolCase, Clock, ShieldCheck, Globe, Calendar, Camera
} from "lucide-react";
import logo from "../assets/logo1.png";

export default function SimpleApplyForService() {
  const initialForm = {
    services: "",
    title: "",
    bio: "",
    experience: "",
    rate: "",
    unit: "hour",
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
      formData.append("serviceRadius", form.serviceRadius);
      formData.append("hasTools", form.hasTools);
      formData.append("rate", form.rate);
      formData.append("unit", form.unit);
      formData.append("services", JSON.stringify([form.services]));
      formData.append("availability", JSON.stringify(form.availability));
      formData.append("languages", JSON.stringify(form.languages.split(",").map(l => l.trim())));

      images.forEach((file) => formData.append("files", file));

      await axios.post("http://localhost:8000/api/serviceProvider/applyprovider", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Success! Application submitted.");
    } catch (err) {
      alert(err.response?.data?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const SKILL_OPTIONS = [
    {
      group: "Home Maintenance & Civil",
      skills: ["Plumber", "Electrician", "Carpenter", "Painter", "Mason", "Pest Control", "Locksmith", "Waterproofing Expert", "Welder", "Tile & Marble layer", "Interior Designer"]
    },
    {
      group: "Appliance & Digital Tech",
      skills: ["AC Repair Technician", "Washing Machine Repair", "Refrigerator Technician", "Mobile Repair Technician", "Laptop/PC Specialist", "CCTV Installer", "TV Repair", "Micro-oven Repair", "Chimney Cleaning/Repair", "Solar Panel Technician"]
    },
    {
      group: "Cleaning & Hygiene",
      skills: ["Home Cleaning Service", "Water Tank Cleaning", "Deep Kitchen Cleaning", "Sofa & Carpet Cleaning", "Disinfection Service", "Bathroom Specialist", "Window/Glass Cleaning", "Pool Maintenance"]
    },
    {
      group: "Automotive & Transport",
      skills: ["Car Mechanic", "Bike Mechanic", "Car Detailing/Wash", "Tire/Puncture Specialist", "EV Charging Installer", "Professional Driver", "Packers & Movers"]
    },
    {
      group: "Personal, Wellness & Events",
      skills: ["Professional Grooming/Barber", "Beauty & Makeup Artist", "Yoga Instructor", "Fitness Trainer", "Event Decorator", "Event Photographer", "Henna/Mehendi Artist", "Home Cook/Chef", "Nanny/Babysitter", "Elderly Care Taker"]
    },
    {
      group: "Outdoor & Specialized",
      skills: ["Gardener/Landscaper", "Pet Groomer", "Dog Walker", "Laundry/Dry Cleaning", "Tailor/Alterations", "Legal Document Assistant", "Notary Service", "Vaastu Consultant"]
    }
  ];

  const UNIT_OPTIONS = [
    { value: "hour", label: "per Hour" },
    { value: "visit", label: "per Visit (Flat Rate)" },
    { value: "sqft", label: "per Sq. Feet" },
    { value: "item", label: "per Item / Appliance" },
    { value: "day", label: "per Day" },
    { value: "point", label: "per Electrical Point" },
    { value: "km", label: "per Kilometer" },
    { value: "month", label: "per Month (Subscription)" },
    { value: "project", label: "per Project (Custom)" },
    { value: "person", label: "per Person / Head" },
    { value: "load", label: "per Load (Laundry/Movers)" },
    { value: "service", label: "per Service Session" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">
      <div className="lg:w-[400px] bg-white lg:h-screen lg:sticky lg:top-0 p-10 flex flex-col border-r border-slate-100">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <img src={logo} alt="S" className="object-cover rounded-full" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">ServiceMate</span>
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Ready to <br /> <span className="text-blue-600">Start Earning?</span>
          </h1>
          <p className="mt-6 text-slate-500 font-medium leading-relaxed">
            Fill out your professional profile. Once verified, you'll start receiving local service bookings.
          </p>
        </div>

        <div className="space-y-6 mt-auto">
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

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 lg:py-20">
        <form onSubmit={submit} className="space-y-16">
          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={16} /> 01. Services Offered
            </h3>
            <div className="relative">
              <select
                name="services"
                value={form.services}
                onChange={handleChange}
                className="w-full h-14 px-5 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer"
                required
              >
                <option value="">Select your specific skill...</option>
                {SKILL_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group} className="text-blue-600 font-black uppercase text-[10px] tracking-widest bg-slate-50">
                    {category.skills.map((skill) => (
                      <option key={skill} value={skill} className="text-slate-900 font-bold">
                        {skill}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight size={20} className="rotate-90" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} /> 02. Pricing & Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <span className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase">Rate (₹)</span>
                <input
                  type="number"
                  name="rate"
                  value={form.rate}
                  placeholder="500"
                  onChange={handleChange}
                  className="w-full h-16 pt-5 px-5 bg-white border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase">Billing Logic</span>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="w-full h-16 pt-5 px-5 bg-white border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-blue-600 appearance-none cursor-pointer"
                >
                  {UNIT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase">Years of Experience</span>
              <input
                type="number"
                name="experience"
                value={form.experience}
                placeholder="e.g. 5"
                onChange={handleChange}
                className="w-full h-16 pt-5 px-5 bg-white border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-blue-600"
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ToolCase size={16} /> 03. About You
            </h3>
            <input name="title" value={form.title} placeholder="Professional Title (e.g. Expert Home Painter)" onChange={handleChange} className="w-full h-14 px-5 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-600" required />
            <textarea name="bio" value={form.bio} placeholder="Briefly describe your expertise..." maxLength="500" rows="3" onChange={handleChange} className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl font-medium outline-none focus:border-blue-600" />
            <div className="flex items-center gap-3 p-5 bg-white border-2 border-slate-100 rounded-2xl">
              <Globe size={18} className="text-slate-400" />
              <input name="languages" value={form.languages} placeholder="Languages (e.g. English, Kannada)" onChange={handleChange} className="flex-1 bg-transparent font-bold outline-none" />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={16} /> 04. Weekly Availability
            </h3>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day} type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-5 py-3 rounded-xl text-xs font-black border-2 transition-all ${form.availability.includes(day) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-400'}`}
                >
                  {day.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} /> 05. Logistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl">
                <span className="text-sm font-black text-slate-500">Service Radius (KM)</span>
                <input type="number" name="serviceRadius" value={form.serviceRadius} onChange={handleChange} className="w-16 bg-transparent text-right font-black text-blue-600 outline-none" />
              </div>
              <input name="address" value={form.address} placeholder="Street Address" onChange={handleChange} className="w-full h-14 px-5 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" value={form.city} placeholder="City" onChange={handleChange} className="w-full h-14 px-5 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none" />
                <input name="zipCode" value={form.zipCode} placeholder="Zip Code" onChange={handleChange} className="w-full h-14 px-5 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-2">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.hasTools ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                  <input type="checkbox" name="hasTools" checked={form.hasTools} onChange={handleChange} className="hidden" />
                  {form.hasTools && <Check size={14} className="text-white" />}
                </div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-wide">I own all necessary tools</span>
              </label>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Camera size={16} /> 06. Work Portfolio
            </h3>
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:border-blue-300 transition-all text-center">
              <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <span className="text-blue-600 font-black text-sm">UPLOAD PHOTOS</span>
                  <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{images.length} FILES SELECTED</span>
                </div>
              </label>
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-20 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-3xl shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-200"
            >
              {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
              {!loading && <ChevronRight size={20} />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}