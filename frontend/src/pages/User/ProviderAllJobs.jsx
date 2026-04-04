import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import {
    ChevronLeft, MapPin, Star, ShieldCheck,
    Search, Grid, LayoutList, FilterX,
    Phone, Mail, Calendar, Clock, Award,
    ArrowLeft,
    ChevronRight
} from "lucide-react";

export default function ProviderAllJobs() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/serviceprovider/provider/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setProfiles(res.data.providers || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, [id, token]);

    const provider = profiles[0]?.user; 
    const filteredJobs = profiles.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Catalog...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-20">

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
                            <span className="text-blue-600 font-black">{provider?.firstName} {provider?.lastName} profile</span>
                        </div>
                    </div>
                    <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Business Profile</h1>

                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${provider?.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${provider?.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {provider?.isActive ? "Online" : "Offline"}
                        </span>
                    </div>
                </div>
            </nav>

            <section className="bg-white border-b border-slate-100 shadow-sm overflow-hidden pt-10 pb-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative flex flex-col md:flex-row items-start md:items-end gap-8 mb-10">
                        <div className="relative group">
                            <img
                                src={provider?.profilePic || `https://ui-avatars.com/api/?name=${provider?.firstName}&background=6366f1&color=fff`}
                                className="w-36 h-36 rounded-[44px] border-8 border-white shadow-2xl object-cover bg-slate-100 ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-105"
                                alt="Provider"
                            />
                            {profiles[0]?.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg animate-in zoom-in duration-300">
                                    <ShieldCheck size={22} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                                    {provider?.firstName} {provider?.lastName}
                                </h2>
                                {profiles[0]?.experience && (
                                    <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                                        {profiles[0].experience} Years Experience
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-5 text-slate-500">
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <MapPin size={15} className="text-blue-500" />
                                    <span className="text-xs font-bold uppercase tracking-tight">{profiles[0]?.user?.city || "Local Area"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold">
                                    <Calendar size={15} className="text-slate-400" />
                                    <span className="uppercase tracking-tight text-slate-400">
                                        Partner Since {provider?.createdAt ? new Date(provider.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2024'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-4 mb-2">
                            <a href={`tel:${provider?.phoneNo}`} className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-[24px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 group">
                                <Phone size={18} className="group-hover:animate-bounce" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Call Professional</span>
                            </a>
                            <a href={`mailto:${provider?.email}`} className="p-4 bg-white border border-slate-200 text-slate-600 rounded-[24px] hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pb-8">
                        <StatCard
                            label="Registered Email"
                            value={profiles[0]?.user?.email}
                            icon={<Mail size={12} />}
                            isTruncated
                        />
                        <StatCard
                            label="Active Services"
                            value={`${profiles.length} Listed Jobs`}
                            icon={<Grid size={12} />}
                        />
                        <StatCard
                            label="Coverage Area"
                            value={`${profiles[0]?.user?.city}, ${profiles[0]?.user?.address}`}
                            icon={<MapPin size={12} />}
                            isTruncated
                        />
                        <div className={`p-5 rounded-md border transition-all ${profiles[0]?.status === "approved" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}>
                            <p className={`text-[9px] font-black uppercase mb-1.5 tracking-[0.1em] ${profiles[0]?.status === "approved" ? "text-emerald-600" : "text-blue-600"}`}>Account Status</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${profiles[0]?.status === "approved" ? "bg-emerald-500" : "bg-blue-500"}`} />
                                <p className={`text-sm font-black uppercase ${profiles[0]?.status === "approved" ? "text-emerald-900" : "text-blue-900"}`}>
                                    {profiles[0]?.status === "approved" ? "Verified Pro" : "Awaiting Approval"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Service Catalog</h3>
                    <p className="text-xs font-bold text-slate-400">Browse all specialized services from this provider</p>
                </div>

                <div className="w-full md:w-96 relative">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search services (e.g. Electrician, Repair)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white rounded-3xl text-sm font-bold outline-none border border-slate-100 focus:border-blue-500 shadow-sm transition-all"
                    />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-8">
                {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredJobs.map((job) => (
                            <SmallServiceCard key={job._id} service={job} navigate={navigate} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <FilterX size={48} className="text-slate-200 mb-4" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching jobs found</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function SmallServiceCard({ service, navigate }) {
    return (
        <div
            onClick={() => navigate(`/service/${service._id}`)}
            className="group cursor-pointer bg-white p-4 rounded-md border border-slate-100 shadow-md hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
        >
            <div className="relative aspect-square rounded-md overflow-hidden mb-4 bg-slate-50">
                <img
                    src={service.images?.[0]?.url || "placeholder.jpg"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={service.title}
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black shadow-sm">
                    ₹{service.pricing?.rate}<span className="text-slate-400 font-bold">/{service.pricing?.unit || 'hr'}</span>
                </div>
            </div>

            <div className="px-1">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">{service.category}</p>
                <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors mb-2">
                    {service.title}
                </h4>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin size={12} className="text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{service.city}</span>
                    </div>
                   
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, isTruncated = false }) {
    return (
        <div className="p-5 bg-white rounded-md border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="text-slate-300 group-hover:text-blue-500 transition-colors">{icon}</span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{label}</p>
            </div>
            <p className={`text-sm font-black text-slate-900 ${isTruncated ? "truncate" : ""}`}>
                {value || "Not Provided"}
            </p>
        </div>
    );
}