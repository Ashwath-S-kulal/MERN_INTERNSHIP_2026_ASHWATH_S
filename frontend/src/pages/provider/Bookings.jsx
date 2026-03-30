import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronRight, Users, CheckCircle2, Loader2, UserPlus, MapPin,
  Calendar, Clock, Banknote, Info, Timer, LayoutDashboard,
  CheckCircle, Inbox, TrendingUp, XCircle, AlertCircle, Wrench, X, Check
} from "lucide-react";

export default function OperatorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedWorkers, setSelectedWorkers] = useState({});
  const [isAssigning, setIsAssigning] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const quickReasons = [
    "Staff Unavailable",
    "Outside Service Area",
    "Invalid Address",
    "Equipment Issue",
    "Other"
  ];

  const loadData = async () => {
    try {
      const [bookRes, memRes] = await Promise.all([
        axios.get("http://localhost:8000/api/booking/provider", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8000/api/member/all", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBookings(bookRes.data);
      if (memRes.data.success) setMembers(memRes.data.members);
    } catch (err) {
      console.error("Data Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id, status, extraData = {}) => {
    try {
      await axios.put(`http://localhost:8000/api/booking/status/${id}`,
        { status, ...extraData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadData();
      return true;
    } catch (err) {
      console.error("Status Update Error:", err);
      alert("Status update failed");
      return false;
    }
  };

  const handleCancelSubmit = async () => {
    if (!selectedReason) return alert("Please select a reason");

    const finalReason = selectedReason === "Other"
      ? customReason
      : `${selectedReason}${customReason ? `: ${customReason}` : ""}`;

    setCancelLoading(true);
    const success = await updateStatus(cancellingId, "rejected", {
      cancellationReason: finalReason,
      cancelledBy: "provider"
    });

    if (success) {
      setShowCancelModal(false);
      setCancellingId(null);
      setSelectedReason("");
      setCustomReason("");
    }
    setCancelLoading(false);
  };

  const handleAssignWorker = async (bookingId) => {
    const workerId = selectedWorkers[bookingId];
    if (!workerId) return;
    setIsAssigning(true);
    try {
      await axios.put("http://localhost:8000/api/booking/memberassign", { bookingId, workerId }, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedWorkers(prev => { const n = { ...prev }; delete n[bookingId]; return n; });
      loadData();
    } catch (err) {
      console.error("Worker Assignment Error:", err);
      alert("Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const filtered = bookings.filter(b => {
    if (activeTab === "pending") return b.status === "pending" || b.status === "accepted";
    if (activeTab === "active") return b.status === "in_progress";
    if (activeTab === "completed") return b.status === "completed";
    return true;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 pb-20 relative">
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800">Cancel/Reject Booking</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-black transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Reason for cancellation</label>
                <div className="flex flex-wrap gap-2">
                  {quickReasons.map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedReason(r)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${selectedReason === r ? "bg-red-600 text-white border-red-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Additional Details</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Type details here..."
                  rows="3"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              </div>

              <button
                onClick={handleCancelSubmit}
                disabled={cancelLoading || !selectedReason}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 transition-all"
              >
                {cancelLoading ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">Operator Console</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Service Control Room</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <StatCard label="Pending" count={bookings.filter(b => b.status === 'pending').length} color="text-amber-500" />
            <StatCard label="Live Jobs" count={bookings.filter(b => b.status === 'in_progress').length} color="text-blue-500" />
            <StatCard label="Finished" count={bookings.filter(b => b.status === 'completed').length} color="text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex bg-slate-200/50 p-1.5 rounded-md mb-8 w-max">
          <TabBtn active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} label="Requests" count={bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length} icon={<Inbox size={16} />} />
          <TabBtn active={activeTab === 'active'} onClick={() => setActiveTab('active')} label="In Progress" icon={<Timer size={16} />} />
          <TabBtn active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} label="History" icon={<CheckCircle size={16} />} />
        </div>

        <div className="grid gap-6">
          {filtered.length > 0 ? filtered.map((b) => (
            <div key={b._id} className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row group hover:shadow-xl transition-all duration-300">
              <div className="p-6 lg:w-1/3 bg-slate-50/50 border-r border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={b.user?.profilePic || `https://ui-avatars.com/api/?name=${b.user?.firstName}`} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md" alt="User" />
                    <div>
                      <h3 className="font-black text-slate-800 leading-tight">{b.user?.firstName} {b.user?.lastName}</h3>
                      <p className="text-xs text-slate-400 font-medium">{b.user?.email}</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench size={14} className="text-blue-500" />
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Service</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700">{b.serviceType || "General Service"}</p>
                    <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400">Total</span>
                      <span className="text-lg font-black text-emerald-600">₹{b.price}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <InfoItem icon={<Calendar size={14} />} text={b.date} />
                  <InfoItem icon={<Clock size={14} />} text={b.time} />
                  <InfoItem icon={<MapPin size={14} />} text={b.address} isAddress />
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-center border-r border-slate-100">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status:</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${b.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        b.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                          b.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {b.status}
                    </span>
                  </div>
                </div>

                {b.status === "accepted" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {members.map(m => (
                        <button
                          key={m._id}
                          onClick={() => setSelectedWorkers({ ...selectedWorkers, [b._id]: m._id })}
                          className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center text-center ${selectedWorkers[b._id] === m._id ? 'border-blue-600 bg-blue-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                        >
                          <img src={m.profilePic || `https://ui-avatars.com/api/?name=${m.fullname}`} className="w-8 h-8 rounded-full mb-1 object-cover" />
                          <p className="text-[10px] font-bold truncate w-full">{m.fullname.split(' ')[0]}</p>
                          <p className="text-[8px] text-slate-400 uppercase">{m.role || 'Staff'}</p>
                        </button>
                      ))}
                    </div>
                    {selectedWorkers[b._id] && (
                      <button onClick={() => handleAssignWorker(b._id)} disabled={isAssigning} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                        {isAssigning ? <Loader2 className="animate-spin" size={14} /> : <UserPlus size={14} />} Confirm Assignment
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    {b.assignedWorker ? (
                      <>
                        <img src={getWorker(members, b.assignedWorker)?.profilePic || `https://ui-avatars.com/api/?name=W`} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="Worker" />
                        <div>
                          <p className="text-xs font-bold">{getWorker(members, b.assignedWorker)?.fullname}</p>
                          <p className="text-[9px] text-blue-500 font-black uppercase tracking-tighter">Assigned Professional</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No professional assigned yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 lg:w-56 bg-white flex flex-col justify-center gap-3">
                {b.status === "pending" && (
                  <StatusAction label="Accept Job" color="bg-slate-900" onClick={() => updateStatus(b._id, "accepted")} icon={<CheckCircle2 size={16} />} />
                )}
                {b.status === "accepted" && b.assignedWorker && (
                  <StatusAction label="Dispatch Team" color="bg-blue-600" onClick={() => updateStatus(b._id, "in_progress")} icon={<TrendingUp size={16} />} />
                )}
                {b.status === "in_progress" && (
                  <StatusAction label="Complete Job" color="bg-emerald-600" onClick={() => updateStatus(b._id, "completed")} icon={<CheckCircle2 size={16} />} />
                )}

                {(b.status === "pending" || b.status === "accepted" || b.status === "in_progress") && (
                  <button
                    onClick={() => { setCancellingId(b._id); setShowCancelModal(true); }}
                    className="w-full bg-white text-red-500 border border-red-100 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                  >
                    <XCircle size={14} /> {b.status === "pending" ? "Reject Request" : "Cancel Order"}
                  </button>
                )}

                {b.status === "completed" && (
                  <div className="flex flex-col items-center text-emerald-600 gap-1">
                    <CheckCircle2 size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Finished</span>
                  </div>
                )}
                {b.status === "rejected" && (
                  <div className="flex flex-col items-center text-red-400 gap-1">
                    <AlertCircle size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cancelled</span>
                    {b.cancellationReason && (
                      <p className="text-[9px] text-center bg-red-50 p-2 rounded-lg italic mt-1 leading-tight">"{b.cancellationReason}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-md p-20 text-center border-2 border-dashed border-slate-200">
              <LayoutDashboard size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">No jobs in this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, count, color }) {
  return (
    <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-sm min-w-[100px] shrink-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-xl font-black ${color}`}>{count}</p>
    </div>
  );
}

function TabBtn({ active, onClick, label, icon, count }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-bold text-sm transition-all ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
      {icon} {label} {count !== undefined && <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-blue-100' : 'bg-slate-200'}`}>{count}</span>}
    </button>
  );
}

function InfoItem({ icon, text, isAddress }) {
  return (
    <div className="flex items-start gap-2 text-slate-600">
      <div className="mt-0.5 text-blue-500">{icon}</div>
      <p className={`text-xs font-semibold leading-tight ${isAddress ? 'line-clamp-2' : ''}`}>{text}</p>
    </div>
  );
}

function StatusAction({ label, color, onClick, icon }) {
  return (
    <button onClick={onClick} className={`w-full ${color} text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg`}>
      {icon} {label}
    </button>
  );
}

function getWorker(members, id) {
  const workerId = typeof id === 'object' ? id?._id : id;
  return members.find(m => m._id === workerId);
}