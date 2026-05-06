import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2, Calendar, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URI}/api/reviews/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Delete failed");
    }
  };

  if (loading) return <Loader/>

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto py-5 md:py-10">

        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Moderate Feedback</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review Dashboard</h1>
            <p className="text-slate-500 font-medium">Analyze and manage customer experiences across the platform.</p>
          </div>

          <div className="hidden bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm md:flex items-center gap-4">
            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
              <Star size={20} fill="currentColor" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Total Feedback</span>
              <span className="text-xl font-black text-slate-900 leading-none">{reviews.length} Entries</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 hidden lg:table-row">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Customer Details</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Review Content</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">Applied to Service</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="group flex flex-col lg:table-row hover:bg-blue-50/20 transition-all duration-300">

                    <td className="px-8 py-6 lg:table-cell">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img
                            src={rev.user?.profilePic || `https://ui-avatars.com/api/?name=${rev.user?.firstName || 'User'}&background=random`}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md"
                            alt="Profile"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-tight mb-1">
                            {rev.user?.firstName} {rev.user?.lastName}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail size={10} className="text-slate-300" />
                            <p className="text-[11px] font-bold">{rev.user?.email || "No Email Provided"}</p>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 lg:py-6 lg:table-cell">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < rev.rating ? "#F59E0B" : "none"}
                              className={i < rev.rating ? "text-amber-500" : "text-slate-200"}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-black bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                          Score: {rev.rating}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-3 mb-3">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={11} />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                          {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 lg:py-6 lg:table-cell align-middle">
                      <div
                        onClick={() => navigate(`/servicedetails/${rev.booking?.provider?._id}`)}
                        className="flex items-center gap-3 p-3 bg-slate-50 md:bg-transparent rounded-2xl border border-slate-100 md:border-none cursor-pointer group/card"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={rev.booking?.provider?.user?.profilePic || "https://via.placeholder.com/150?text=Service"}
                            className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm ring-2 ring-white transition-transform group-hover/card:scale-105"
                            alt="Service"
                          />
                          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase">
                            Details
                          </div>
                        </div>

                        <div>
                          <p className="font-black text-slate-900 text-xs uppercase tracking-tight mb-1 group-hover/card:text-indigo-600 transition-colors">
                            {rev.booking?.provider?.title || "Project Asset"}
                          </p>
                          <div className="flex gap-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                              Loc: {rev.booking?.provider?.city || "Remote"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 lg:table-cell text-right">
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-rose-500 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-sm"
                      >
                        <Trash2 size={16} />
                        <span className="lg:hidden">Remove Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reviews.length === 0 && (
              <div className="p-32 text-center bg-slate-50/30">
                <div className="inline-flex p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-6">
                  <Star size={48} className="text-slate-100" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Feedback Yet</h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                  Customer moderation will appear here once the first transaction is rated.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}