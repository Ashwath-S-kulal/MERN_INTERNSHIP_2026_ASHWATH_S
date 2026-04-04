import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, MapPin, Globe, Calendar,
    Clock, ShieldCheck, Star, Zap, Navigation, Mail,
    ToolCase,
    MessageSquare
} from 'lucide-react';

export default function ServiceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [activeImg, setActiveImg] = useState("");
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

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

    useEffect(() => {
        const fetchServiceAndReviews = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                // Fetch Service Details
                const res = await axios.get(`http://localhost:8000/api/user/getservicebyid/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setService(res.data);
                if (res.data.images?.length > 0) setActiveImg(res.data.images[0].url);

                // Fetch Reviews for this Provider
                const reviewRes = await axios.get(`http://localhost:8000/api/reviews/provider/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(reviewRes.data.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServiceAndReviews();
    }, [id]);


    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
        : (service?.rating || 0);


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
                                    <div className="bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20 text-white">
                                        Approved
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star size={16} fill="currentColor" />
                                            <span className="text-sm font-black text-white">
                                                {averageRating}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            ({reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'})
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
                                <span className="text-xs font-bold text-white truncate max-w-[150px]">
                                            {service.user?.email}
                                        </span>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                  
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block mb-1">Rate</span>
                                            <span className="text-3xl font-black text-indigo-400">₹{service.pricing.rate}</span>
                                            <span className="text-slate-500 text-[10px] font-black ml-1 uppercase">/ {service.pricing.unit}</span>
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

                <div className="bg-white p-8 mt-6 rounded-md shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                Client Reviews
                            </h2>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">
                                Verified feedback from {reviews.length} customers
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

                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="group border-b border-slate-50 last:border-0 pb-6 last:pb-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={review.user?.profilePic || `https://ui-avatars.com/api/?name=${review.user?.firstName}`}
                                                className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                                                alt="User"
                                            />
                                            <div>
                                                <p className="text-sm font-black text-slate-800">
                                                    {review.user?.firstName} {review.user?.lastName}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 bg-slate-50 px-2 py-1 rounded-lg">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "#f59e0b" : "#cbd5e1"} stroke="none" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed font-medium pl-[52px]">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare size={20} className="text-slate-300" />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No reviews yet</p>
                                <p className="text-[10px] text-slate-300 font-medium">Be the first to hire this professional!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}