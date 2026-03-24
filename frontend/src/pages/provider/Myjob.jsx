import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  MapPin, ShieldCheck, Clock, ChevronLeft, 
  Award, User, Wrench, Briefcase, Info, 
  CheckCircle2, Phone, MessageSquare,
  ChevronDown, Star, Globe, Languages, Hash, Calendar, 
  ToolCase
} from "lucide-react";

export default function ProviderProfile() {
  const { id } = useParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`/api/serviceprovider/provider/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setProfiles(res.data.providers || []);
      } catch (err) {
        console.error("Error loading profiles", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfiles();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFDFD]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const user = profiles[0]?.user;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-indigo-100 selection:text-indigo-900">
     
      <main className="max-w-full mx-auto px-6 pt-5">
        {/* --- PROFESSIONAL HERO SECTION --- */}
        <section className="relative bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="h-32 w-32 bg-gradient-to-tr from-slate-100 to-white rounded-3xl flex-shrink-0 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} className="h-full w-full object-cover" alt="User" />
                ) : (
                  <span className="text-4xl font-light text-slate-400 uppercase">{user?.firstName?.[0]}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100 text-emerald-500">
                <ShieldCheck size={20} fill="currentColor" className="text-white" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1 pt-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                  {user?.firstName} {user?.lastName}
                </h1>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-indigo-100">
                  Pro Partner
                </span>
              </div>
              
              <p className="text-slate-500 mt-2 font-medium flex items-center justify-center md:justify-start gap-4">
                <span className="flex items-center gap-1"><Star size={16} className="text-amber-400 fill-amber-400" /> 4.98</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>{profiles.length} Active Services</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="flex items-center gap-1"><MapPin size={16} /> {profiles[0]?.city}</span>
              </p>

            </div>
          </div>
        </section>

        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">
          Service Portfolios
        </h2>

        {/* --- MODERN SERVICE LIST --- */}
        <div className="grid grid-cols-1 gap-6">
          {profiles.map((job) => {
            const isExpanded = expandedJobId === job._id;
            return (
              <div 
                key={job._id} 
                className={`group bg-white rounded-3xl border transition-all duration-500 ${
                  isExpanded ? 'border-indigo-200 shadow-xl shadow-indigo-100/40 translate-y-[-4px]' : 'border-slate-200 hover:border-indigo-200 shadow-sm'
                }`}
              >
                {/* Compact Header */}
                <div onClick={() => setExpandedJobId(isExpanded ? null : job._id)} className="p-6 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isExpanded ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                      }`}>
                        <Wrench size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><Clock size={14}/> {job.experience}y Exp.</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="flex items-center gap-1 uppercase text-[10px] tracking-widest text-emerald-600">{job.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-10">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-slate-900">₹{job.hourlyRate}</span>
                          <span className="text-sm text-slate-500 font-medium">/hr</span>
                        </div>
                      </div>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border border-slate-100 transition-all ${isExpanded ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'text-slate-300'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modern Expanded View */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8">
                    <div className="border-t border-slate-100 pt-8">
                      
                      {/* Detailed Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Column 1: Core Logistics */}
                        <div className="space-y-6">
                          <DetailGroup icon={<MapPin size={16}/>} title="Service Coverage">
                            <p className="text-slate-700 font-medium text-sm">{job.address}</p>
                            <p className="text-slate-500 text-xs mt-1">{job.city}, {job.zipCode} • {job.serviceRadius}km Radius</p>
                          </DetailGroup>
                          
                          <DetailGroup icon={<Languages size={16}/>} title="Communication">
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {job.languages?.map(l => (
                                <span key={l} className="bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[11px] font-bold border border-slate-100">{l}</span>
                              ))}
                            </div>
                          </DetailGroup>
                        </div>

                        {/* Column 2: Availability & Tools */}
                        <div className="space-y-6">
                           <DetailGroup icon={<Calendar size={16}/>} title="Availability">
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.availability?.map(day => (
                                <span key={day} className="bg-indigo-50/50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold border border-indigo-100/50 uppercase">{day.slice(0,3)}</span>
                              ))}
                            </div>
                          </DetailGroup>

                          <DetailGroup icon={<ToolCase size={16}/>} title="Equipment">
                            <p className="text-sm font-medium text-slate-700">
                              {job.hasTools ? "Professional Grade Tools Provided" : "Standard Labor Only"}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">Status: {job.isActive ? 'Taking active bookings' : 'Currently busy'}</p>
                          </DetailGroup>
                        </div>

                        {/* Column 3: Summary & Skills */}
                        <div className="space-y-6">
                          <DetailGroup icon={<Info size={16}/>} title="Provider Bio">
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                              {job.bio}
                            </p>
                          </DetailGroup>
                          
                          <DetailGroup icon={<CheckCircle2 size={16}/>} title="Skills Set">
                             <div className="flex flex-wrap gap-2 mt-2">
                              {job.services?.map(s => (
                                <span key={s} className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-medium tracking-wide">
                                  {s.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </DetailGroup>
                        </div>
                      </div>

                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

/* Helper Components for Clarity */
function DetailGroup({ icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-indigo-600 mb-2">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{title}</span>
      </div>
      {children}
    </div>
  );
}