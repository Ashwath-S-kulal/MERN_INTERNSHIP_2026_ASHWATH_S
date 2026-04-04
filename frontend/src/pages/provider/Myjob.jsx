import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import {
  Wrench, ChevronRight, MapPin, Plus, Clock,
  Briefcase, ToolCase, Star, LayoutGrid, List
} from "lucide-react";

export default function ProviderDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/serviceprovider/provider/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setProfiles(res.data.providers || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfiles();
  }, [id, token]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-slate-400 animate-pulse">Syncing your services...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-slate-200  px-6 py-4">
        <div className="max-w-screen mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Provider  <span className="text-blue-600">Services</span></h1>
          </div>
          <NavLink to={"/provider/applyforservice"}>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95">
              <Plus size={18} /> Add New Service
            </button>
          </NavLink>

        </div>
      </div>

      <main className="max-w-screen mx-auto mt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatBox label="Total Services" value={profiles.length} sub="Active services" color="blue" />
          <StatBox label="Avg. Rate" value={`₹${profiles.length ? Math.round(profiles.reduce((acc, curr) => acc + curr.pricing.rate, 0) / profiles.length) : 0}`} sub="Market average" color="emerald" />
          <StatBox label="Experience Range" value={`${Math.min(...profiles.map(p => p.experience || 0))} - ${Math.max(...profiles.map(p => p.experience || 0))} yrs`} sub="Professional depth" color="purple" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase">Your Active Portfolio</h3>
          <div className="h-px flex-1 bg-slate-200 mx-6 opacity-50" />
        </div>

        <div className="flex flex-col">
          {profiles.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/provider/details/${job._id}`)}
              className="group bg-white rounded-md border border-slate-200 p-4 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden mb-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                      {job.images && job.images.length > 0 ? (
                        <img
                          src={job?.images[0].url}
                          alt={job.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Wrench size={20} />
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm
            ${job.status === 'approved' ? 'bg-emerald-500' :
                        job.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-slate-800 tracking-tight">{job.title}</h2>
                      {job.status === "approved" && (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Approved
                        </span>
                      )}

                      {job.status === "pending" && (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight bg-amber-50 text-amber-600 border border-amber-100">
                          <Clock size={10} strokeWidth={3} />
                          Under Review
                        </span>
                      )}

                      {job.status === "rejected" && (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight bg-rose-50 text-rose-600 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <MapPin size={12} className="text-blue-500" /> {job.city}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Briefcase size={12} className="text-blue-500" /> {job.experience}yr Exp.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-xl font-black text-slate-900 leading-none">
                      ₹{job.pricing.rate}<span className="text-[10px] text-slate-400 font-bold tracking-normal"> /{job.pricing.unit}</span>
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">
                      {job.status === 'approved' ? 'Earnings Rate' : 'Estimated Rate'}
                    </p>
                  </div>

                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>

              </div>
            </div>
          ))}
          <NavLink to={"/provider/applyforservice"}>
            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all mb-4">
                <Plus size={32} />
              </div>
              <p className="font-black text-slate-400 group-hover:text-blue-600">Add another expertise</p>
            </div>
          </NavLink>

        </div>
      </main>
    </div>
  );
}

function StatBox({ label, value, color }) {
  const colors = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500"
  };
  return (
    <div className="bg-white p-6 rounded-md border border-slate-200 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${colors[color]} opacity-5 rounded-bl-full transition-all group-hover:scale-110`} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}