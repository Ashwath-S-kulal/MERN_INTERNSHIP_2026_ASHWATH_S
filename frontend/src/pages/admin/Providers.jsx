import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search, Filter, MoreVertical, CheckCircle,
  XCircle, Clock, ExternalLink, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProviderDirectory() {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/allprovider", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProviders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);


  const handleApprove = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/approve/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProviders((prev) =>
        prev.map((p) => p._id === id ? { ...p, status: newStatus } : p)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    }
  };


  const handleReject = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/admin/reject/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProviders((prev) =>
        prev.map((p) => p._id === id ? { ...p, status: newStatus } : p)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    }
  };


  const filtered = providers.filter(p =>
    p.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      rejected: "bg-rose-100 text-rose-700 border-rose-200"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="p-10 text-center font-medium">Loading Directory...</div>;

  return (
    <div className="px-4 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Provider Directory</h1>
          <p className="text-slate-500">Manage {providers.length} total registered professionals</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search name or profession..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Provider</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Service</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Experience</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Rate</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold overflow-hidden shrink-0">
                        {p.user?.profilePic ? (
                          <img
                            onClick={() => navigate(`/servicedetails/${p._id}`)}
                            src={p.user.profilePic}
                            alt={`${p.user.firstName}'s profile`}
                            className="h-full w-full object-cover cursor-pointer"
                          />
                        ) : (
                          <span>{p.user?.firstName?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-none mb-1">
                          {p.user?.firstName} {p.user?.lastName}
                        </div>
                        <div className="text-xs text-slate-500 font-medium tracking-tight">
                          {p.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{p.services[0]}</td>
                  <td className="p-4">{getStatusBadge(p.status)}</td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{p.experience} Years</td>
                  <td className="p-4 text-sm font-bold text-slate-900">₹{p.hourlyRate}/hr</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      {p.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(p._id, "approved")}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                        >
                          <CheckCircle size={14} strokeWidth={3} /> Approve
                        </button>
                      )}

                      {p.status !== "rejected" && (
                        <button
                          onClick={() => handleReject(p._id, "rejected")}
                          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                        >
                          <XCircle size={14} strokeWidth={3} /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-20 text-center">
            <User className="mx-auto text-slate-300 mb-2" size={40} />
            <p className="text-slate-500 font-medium">No providers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}