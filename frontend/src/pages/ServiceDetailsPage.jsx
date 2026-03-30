import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, MapPin, Globe, Calendar,
    Clock, ShieldCheck, Star, Zap, Navigation, Mail,
    ToolCase
} from 'lucide-react';

export default function ServiceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [activeImg, setActiveImg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const res = await axios.get(`http://localhost:8000/api/user/getservicebyid/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setService(res.data);
                if (res.data.images?.length > 0) setActiveImg(res.data.images[0].url);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 font-bold">Loading Profile...</div>;
    if (!service) return <div className="p-20 text-center">Profile not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-all">
                        <ArrowLeft size={18} /> Back to Directory
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Verified</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-4 rounded-md shadow-sm border border-slate-200">
                            <img
                                src={activeImg || "https://via.placeholder.com/800x400?text=No+Image+Available"}
                                className="w-full h-[450px] object-cover rounded-md transition-all duration-500"
                                alt="Work preview"
                            />
                            <div className="flex gap-3 pl-3 mt-4 overflow-x-auto no-scrollbar py-2">
                                {service.images?.map((img, i) => (
                                    <img
                                        key={i} src={img.url}
                                        onClick={() => setActiveImg(img.url)}
                                        className={`w-20 h-20 rounded-xl cursor-pointer object-cover border-2 transition-all ${activeImg === img.url ? 'border-indigo-600 scale-105' : 'border-transparent opacity-60'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-md shadow-sm border border-slate-200">
                            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-indigo-600" /> About the Professional
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                                {service.bio}
                            </p>
                            <hr className="border-slate-100 mb-6" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Languages</p>
                                        <p className="text-sm font-bold">{service.languages?.join(", ") || "English"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <ToolCase size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Tools & Equipment</p>
                                        <p className="text-sm font-bold">{service.hasTools ? "Fully Equipped" : "Standard Setup"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 text-white p-8 rounded-md shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                        Approved
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400">
                                        <Star size={16} fill="currentColor" />
                                        <span className="text-sm font-black text-white">
                                            {service.rating} ({service.totalReviews || 0})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        {service.user?.profilePic ? (
                                            <img
                                                src={service.user.profilePic}
                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-indigo-400 transition-colors duration-300"
                                                alt="Provider"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-black border-2 border-white/10">
                                                {service.user?.firstName?.charAt(0)}
                                                {service.user?.lastName?.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-900"></div>
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-black leading-tight tracking-tight">
                                            {service.title}
                                        </h1>
                                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">
                                            By {service.user?.firstName} {service.user?.lastName}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-slate-400 font-medium mb-8 text-xs leading-relaxed line-clamp-2 italic">
                                    {service.services?.[0] || "General Professional"} • {service.experience} Years Experience
                                </p>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Service Email</span>
                                        <span className="text-xs font-bold text-white truncate max-w-[150px]">
                                            {service.user?.email}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1">Rate</span>
                                            <span className="text-3xl font-black text-indigo-400">₹{service.hourlyRate}</span>
                                            <span className="text-slate-500 text-[10px] font-black ml-1 uppercase">/ Hr</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-md shadow-sm border border-slate-200">
                            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Service Area</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{service.city}, {service.zipCode}</p>
                                        <p className="text-xs text-slate-400 font-medium">{service.address}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <Navigation size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{service.serviceRadius} KM Radius</p>
                                        <p className="text-xs text-slate-400 font-medium">Available for on-site visits</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-md shadow-sm border border-slate-200">
                            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4">Availability</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {service.availability?.map((day) => (
                                    <div key={day} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        <span className="text-[10px] font-black text-emerald-700 uppercase">{day.split(' ')[0]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}