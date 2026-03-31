import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2, Calendar, Mail, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.get("http://localhost:8000/api/reviews/admin/all", {
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
      await axios.delete(`http://localhost:8000/api/reviews/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className=" bg-gray-50 min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Review Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage and moderate customer feedback</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Reviews: </span>
          <span className="text-sm font-black text-blue-600">{reviews.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-200 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100">
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Customer Details</th>
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">Review Content</th>
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest">To Service</th>
              <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews.map((rev) => (
              <tr key={rev._id} className="hover:bg-blue-50/30 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={rev.user?.profilePic || `https://ui-avatars.com/api/?name=${rev.user?.firstName || 'User'}&background=random`}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
                        alt="Profile"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-base leading-none mb-1">
                        {rev.user?.firstName} {rev.user?.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Mail size={12} />
                        <p className="text-xs font-bold">{rev.user?.email || "No Email Provided"}</p>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-6">
                  <div className="flex items-center gap-2 mb-2">
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
                    <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg uppercase">
                      {rev.rating}/5
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-md">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center gap-1.5 mt-3 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Reviewed on: {new Date(rev.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </td>

                <td className="p-6 align-top cursor-pointer" onClick={() => navigate(`/servicedetails/${rev.booking?.provider?._id}`)}>
                  <div className="flex items-start gap-3">
                    <div className="relative group/img">
                      <img
                        src={rev.booking?.provider?.user?.profilePic || "https://via.placeholder.com/150?text=Service"}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm transition-transform group-hover/img:scale-105"
                        alt="Service"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                        PRO
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="font-black text-slate-900 text-sm uppercase tracking-tight leading-none mb-1">
                        {rev.booking?.provider?.title || "Unknown Service"}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                          ₹{rev.booking?.provider?.hourlyRate}/hr
                        </span>
                        <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase">
                          {rev.booking?.provider?.experience}+ Yrs Exp
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {rev.booking?.provider?.city || "Remote"}
                        </span>
                        <span className="text-gray-300">•</span>

                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-6 text-center">
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group-hover:scale-110"
                    title="Delete Review"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reviews.length === 0 && (
          <div className="p-32 text-center">
            <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
              <Star size={40} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-800">No Reviews Yet</h3>
            <p className="text-slate-400 text-sm">Customer feedback will appear here once submitted.</p>
          </div>
        )}
      </div>
    </div>
  );
}