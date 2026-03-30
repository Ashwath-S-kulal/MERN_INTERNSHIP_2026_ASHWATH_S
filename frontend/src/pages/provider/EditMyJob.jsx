import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    MapPin, Wrench, Save, Image as ImageIcon, Briefcase,
    Check, Globe, Navigation, ToolCase, ArrowLeft, X,
    User, Clock, Camera, Home, Star, Activity, Loader2,
    Calendar
} from "lucide-react";

export default function ProviderProfile() {
    const { proid } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [activeTab, setActiveTab] = useState("Information");

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const token = localStorage.getItem("accessToken");

    useEffect(() => { if (proid) fetchProfile(); }, [proid]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/serviceprovider/singleprovider/${proid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.provider || (res.data.providers ? res.data.providers[0] : null);
            if (data) {
                setProfile(data);
                setExistingImages(data.images || []);
                setEditForm({
                    ...data,
                    languages: Array.isArray(data.languages) ? data.languages.join(", ") : data.languages,
                    services: Array.isArray(data.services) ? data.services.join(", ") : data.services
                });
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm({ ...editForm, [name]: type === "checkbox" ? checked : (value === "true" ? true : value === "false" ? false : value) });
    };

    const removeExistingImage = (publicId) => {
        setExistingImages(existingImages.filter(img => img.public_id !== publicId));
    };

    const removeNewImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const toggleDay = (day) => {
        const currentDays = editForm.availability || [];
        const newDays = currentDays.includes(day) ? currentDays.filter(d => d !== day) : [...currentDays, day];
        setEditForm({ ...editForm, availability: newDays });
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            const formData = new FormData();
            const remainingImagesIds = existingImages.map(img => img.public_id);
            formData.append("existingImages", JSON.stringify(remainingImagesIds));
            images.forEach(file => formData.append("files", file));

            const submissionData = {
                ...editForm,
                services: typeof editForm.services === 'string' ? editForm.services.split(",").map(s => s.trim()).filter(Boolean) : editForm.services,
                languages: typeof editForm.languages === 'string' ? editForm.languages.split(",").map(l => l.trim()).filter(Boolean) : editForm.languages,
            };

            Object.keys(submissionData).forEach(key => {
                if (['user', 'images', '_id', 'createdAt', 'updatedAt', '__v', 'rating', 'totalReviews'].includes(key)) return;
                if (Array.isArray(submissionData[key])) formData.append(key, JSON.stringify(submissionData[key]));
                else formData.append(key, submissionData[key]);
            });

            const res = await axios.put(`http://localhost:8000/api/serviceprovider/update/${proid}`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                setImages([]);
                fetchProfile();
                alert("Profile updated successfully!");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        } finally { setSaving(false); }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white text-slate-400 font-medium">Loading Professional Profile...</div>;

    return (
        <div className="min-h-screen bg-[#FBFBFB] text-slate-900 font-sans pb-20">
            <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-md ">
                <div className="max-w-screen mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-semibold transition-all">
                        <ArrowLeft size={16} /> Go Back
                    </button>

                    <div className="flex items-center gap-4">

                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="bg-slate-900 text-white px-5 py-3 rounded-full font-bold text-xs hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-screen mx-auto px-12 mt-10">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{editForm.title || "Provider Profile"}</h1>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">{profile.status}</div>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl mb-8 w-full overflow-x-auto no-scrollbar">
                    <NavTab label="Information" active={activeTab} onClick={setActiveTab} icon={<User size={16} />} />
                    <NavTab label="Service & Area" active={activeTab} onClick={setActiveTab} icon={<Wrench size={16} />} />
                    <NavTab label="Portfolio" active={activeTab} onClick={setActiveTab} icon={<ImageIcon size={16} />} />
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {activeTab === "Information" && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Display Title" name="title" value={editForm.title} onChange={handleInputChange} placeholder="e.g. Master Plumber" />
                                <InputGroup label="Hourly Rate (₹)" name="hourlyRate" type="number" value={editForm.hourlyRate} onChange={handleInputChange} />
                                <InputGroup label="Experience (Years)" name="experience" type="number" value={editForm.experience} onChange={handleInputChange} />
                                <InputGroup label="Languages" name="languages" value={editForm.languages} onChange={handleInputChange} placeholder="English, Hindi, etc." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                                <SelectGroup
                                    label="Account Visibility"
                                    name="isActive"
                                    value={editForm.isActive}
                                    onChange={handleInputChange}
                                    options={[{ l: "Online / Public", v: true }, { l: "Offline / Private", v: false }]}
                                />
                                <SelectGroup
                                    label="Own Equipment"
                                    name="hasTools"
                                    value={editForm.hasTools}
                                    onChange={handleInputChange}
                                    options={[{ l: "Yes, I carry tools", v: true }, { l: "No, client provides", v: false }]}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Bio</label>
                                <textarea name="bio" rows="5" value={editForm.bio} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-900 outline-none transition-all text-sm font-medium leading-relaxed" />
                            </div>
                        </div>
                    )}

                    {activeTab === "Service & Area" && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputGroup label="City" name="city" value={editForm.city} onChange={handleInputChange} />
                                <InputGroup label="Zip Code" name="zipCode" value={editForm.zipCode} onChange={handleInputChange} />
                                <InputGroup label="Service Radius (KM)" name="serviceRadius" type="number" value={editForm.serviceRadius} onChange={handleInputChange} />
                            </div>
                            <InputGroup label="Street Address" name="address" value={editForm.address} onChange={handleInputChange} icon={<Home size={14} />} />
                            <InputGroup label="Specific Services" disabled name="services" value={editForm.services} onChange={handleInputChange} placeholder="Plumbing, Painting, Tiling..." className="bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed font-medium w-full px-4 py-3  border rounded-2xl" />

                            <div className="space-y-4 pt-6 border-t border-slate-50">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Working Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {daysOfWeek.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${editForm.availability?.includes(day) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Portfolio" && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                {existingImages.map((img) => (
                                    <div key={img.public_id} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                                        <img src={img.url} className="h-full w-full object-cover" alt="work" />
                                        <button onClick={() => removeExistingImage(img.public_id)} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {images.map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-blue-200 bg-blue-50">
                                        <img src={URL.createObjectURL(file)} className="h-full w-full object-cover opacity-60" alt="new" />
                                        <button onClick={() => removeNewImage(idx)} className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-slate-900 shadow-sm"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>

                            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
                                <input type="file" multiple onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} className="hidden" />
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                    <Camera size={20} className="text-slate-600" />
                                </div>
                                <span className="text-sm font-bold text-slate-600">Add Photos</span>
                                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">PNG, JPG up to 5MB</span>
                            </label>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-6">
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="flex flex-col">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                            <div className="flex items-center gap-1.5 text-slate-700">
                                <Calendar size={14} className="text-blue-500" />
                                <p className="text-sm font-bold">
                                    {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className={`p-2.5 rounded-xl ${editForm.isActive ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-300"}`}>
                            <Activity size={20} className={editForm.isActive ? "animate-pulse" : ""} />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${editForm.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    {editForm.isActive ? "Profile is Live" : "Profile Hidden"}
                                </p>
                            </div>

                            <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                                <Clock size={12} className="text-slate-400" />
                                Last Updated: {new Date(profile.updatedAt).toLocaleDateString()} at {new Date(profile.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavTab({ label, active, onClick, icon }) {
    const isActive = active === label;
    return (
        <button
            onClick={() => onClick(label)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            {icon} {label}
        </button>
    );
}

function InputGroup({ label, icon, ...props }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400">
                {icon} <label className="text-[10px] font-bold uppercase tracking-widest">{label}</label>
            </div>
            <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm font-semibold" {...props} />
        </div>
    );
}

function SelectGroup({ label, name, value, onChange, options }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:border-slate-900 transition-all appearance-none"
            >
                {options.map(opt => <option key={opt.l} value={opt.v}>{opt.l}</option>)}
            </select>
        </div>
    );
}

