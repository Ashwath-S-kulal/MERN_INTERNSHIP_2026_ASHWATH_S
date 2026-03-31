import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ChevronLeft, CheckCircle2, Loader2, UserPlus, MapPin,
    Calendar, Clock, Timer, TrendingUp, XCircle, Wrench,
    Mail, Phone, ShieldCheck, CreditCard, Check, Circle, ArrowRight
} from "lucide-react";

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelType, setCancelType] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [hoursWorked, setHoursWorked] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);

    const token = localStorage.getItem("accessToken");

    const stages = [
        { key: 'pending', label: 'Order Requested' },
        { key: 'accepted', label: 'Order Accepted' },
        { key: 'in_progress', label: 'In Service' },
        { key: 'completed', label: 'Completed' }
    ];

    const loadOrderData = async () => {
        try {
            const [bookRes, memRes] = await Promise.all([
                axios.get(`http://localhost:8000/api/booking/single/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:8000/api/member/all", { headers: { Authorization: `Bearer ${token}` } })
            ]);
            const data = bookRes.data.booking || bookRes.data;
            setBooking(data);
            if (memRes.data.success) setMembers(memRes.data.members);
            if (data.assignedWorker) {
                setSelectedWorker(typeof data.assignedWorker === 'object' ? data.assignedWorker._id : data.assignedWorker);
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    const workerDetails = members.find(m => m._id === booking.assignedWorker);



    useEffect(() => {
        loadOrderData();
    }, [id]);



    const updateStatus = async (status, extraData = {}) => {
        try {
            await axios.put(`http://localhost:8000/api/booking/status/${id}`,
                { status, ...extraData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadOrderData();
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    const cancelOrder = async (status, extraData = {}) => {
        try {
            // extraData now contains { cancellationReason: "..." }
            await axios.put(`http://localhost:8000/api/booking/cancel/${id}`,
                { status, ...extraData }, // This results in { status: "rejected", cancellationReason: "..." }
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShowCancelModal(false);
            setCancelType("");
            setCustomReason("");
            loadOrderData(); // Ensure this refreshes the UI
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };



    const handleAssign = async () => {
        if (!selectedWorker) return;
        setIsAssigning(true);
        try {
            await axios.put("http://localhost:8000/api/booking/memberassign",
                { bookingId: id, workerId: selectedWorker },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadOrderData();
        } catch (err) {
            console.error(err);
            alert("Assignment failed");
        }
        finally { setIsAssigning(false); }
    };



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-blue-600" />
            </div>
        )
    }


    const currentStageIndex = stages.findIndex(s => s.key === booking.status);



    const handleFinalizePayment = async () => {
        if (!hoursWorked || hoursWorked <= 0) return alert("Please enter valid hours.");

        setIsCalculating(true);
        try {
            await axios.put(`http://localhost:8000/api/booking/settle/${id}`,
                { hoursWorked: parseFloat(hoursWorked) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHoursWorked("");
            loadOrderData();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Settlement failed");
        } finally {
            setIsCalculating(false);
        }
    };

    const handleConfirmCash = async () => {
        try {
            await axios.put(`http://localhost:8000/api/booking/confirm-payment/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadOrderData();
        } catch (err) {
            console.error(err);
            alert("Payment confirmation failed");
        }
    };


    return (
        <div className="min-h-screen bg-[#F9FBFF] font-sans text-slate-900 pb-10">

            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-screen mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors">
                        <ChevronLeft size={20} /> Back
                    </button>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Booking </p>
                        <p className="font-black text-slate-800">{booking.serviceType.toUpperCase()}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-screen mx-auto pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-md p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                            <div>
                                <h2 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] mb-2">Customer</h2>
                                <div className="flex items-center gap-4">
                                    <img src={booking.user?.profilePic || `https://ui-avatars.com/api/?name=${booking.user?.firstName}`} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                                    <div>
                                        <h1 className="text-xl font-black">{booking.user?.firstName} {booking.user?.lastName}</h1>
                                        <div className="flex gap-4 mt-1">
                                            <a href={`tel:${booking.user?.phone}`} className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1"><Phone size={12} /> {booking.user?.phone}</a>
                                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1"><Mail size={12} /> {booking.user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                                <InfoRow icon={<Wrench size={16} className="text-blue-500" />} label="Service" value={booking.serviceType} />
                                <InfoRow icon={<CreditCard size={16} className="text-emerald-500" />} label="Amount" value={`₹${booking.price}`} />
                                <InfoRow icon={<Calendar size={16} className="text-indigo-500" />} label="Date" value={new Date(booking.date).toLocaleDateString('en-GB')} />
                                <InfoRow icon={<Clock size={16} className="text-amber-500" />} label="Time" value={booking.time} />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50 rounded-2xl flex gap-4 items-start border border-slate-100 h-full">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Service Location</p>
                                        <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                                            "{booking.address}"
                                        </p>
                                    </div>
                                </div>


                                <div className="p-5 bg-blue-50/50 rounded-2xl flex gap-4 items-start border border-blue-100 h-full">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                        <UserPlus size={18} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-2">
                                            Assigned Professional
                                        </p>

                                        {workerDetails ? (
                                            <div className="flex items-center gap-3 mt-1 animate-in fade-in duration-300">
                                                <img
                                                    src={workerDetails.profilePic || `https://ui-avatars.com/api/?name=${workerDetails.fullname}&background=0284c7&color=fff`}
                                                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-white"
                                                    alt=""
                                                />
                                                <div className="overflow-hidden text-left">
                                                    <p className="text-sm font-black text-slate-800 truncate">
                                                        {workerDetails.fullname}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter italic">
                                                        {workerDetails.role || "Expert Technician"}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs font-bold text-slate-400 mt-1 italic">
                                                {booking.assignedWorker ? "Fetching details..." : "Awaiting Assignment..."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-md p-8 shadow-lg border border-blue-100 ring-4 ring-blue-50/50">
                        <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Manage Order Workflow</h2>

                        <div className="space-y-6">
                            {booking.status === "pending" && (
                                <MainAction
                                    label="Accept Order Request"
                                    color="bg-slate-900"
                                    onClick={() => updateStatus("accepted")}
                                />
                            )}

                            {booking.status === "accepted" && (
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <p className="text-xs font-black uppercase text-slate-400 mb-4 tracking-wider">Step 1: Assign a Professional</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                            {members.map((m) => {
                                                const isSelected = selectedWorker === m._id;
                                                return (
                                                    <button
                                                        key={m._id}
                                                        onClick={() => setSelectedWorker(m._id)}
                                                        className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 
                                                                ${isSelected
                                                                ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100'
                                                                : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
                                                            }`}
                                                    >
                                                        <div className="relative shrink-0">
                                                            <img
                                                                src={m.profilePic || `https://ui-avatars.com/api/?name=${m.fullname}&background=random`}
                                                                className="w-12 h-12 rounded-xl object-cover"
                                                                alt={m.fullname}
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 shadow-lg">
                                                                    <Check size={10} strokeWidth={4} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="text-left overflow-hidden">
                                                            <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                                                                {m.fullname}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md
                                                                 ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                    {m.role || "Technician"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <MainAction
                                            label="Confirm Assignment"
                                            color="bg-blue-600"
                                            disabled={!selectedWorker || isAssigning}
                                            onClick={handleAssign}
                                        />
                                    </div>

                                    {booking.assignedWorker && (
                                        <MainAction
                                            label="Mark as Dispatched"
                                            color="bg-indigo-600"
                                            onClick={() => updateStatus("in_progress")}
                                        />
                                    )}
                                </div>
                            )}

                            {booking.status === "in_progress" && (
                                <MainAction
                                    label="Mark Job Completed"
                                    color="bg-emerald-600"
                                    onClick={() => updateStatus("completed")}
                                />
                            )}

                            {booking.status === "completed" && (
                                <div className="text-center py-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md"><Check strokeWidth={3} /></div>
                                    <p className="font-black text-emerald-800 text-sm uppercase">Order Successfully Completed</p>
                                </div>
                            )}

                            {["pending", "accepted", "in_progress"].includes(booking.status) && (
                                <button onClick={() => setShowCancelModal(true)} className="w-full py-4 text-red-400 cursor-pointer font-black text-[10px] uppercase tracking-widest hover:text-red-600 transition-all">
                                    Reject or Cancel Order
                                </button>
                            )}

                            {booking.status === "rejected" && (
                                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-in zoom-in-95 duration-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
                                            <XCircle size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-red-400 tracking-widest leading-none mb-1">Status Update</p>
                                            <h3 className="font-black text-red-800 uppercase text-sm">Order Rejected</h3>
                                        </div>
                                    </div>

                                    {booking.cancellationReason && (
                                        <div className="bg-white/60 p-4 rounded-2xl border border-red-50">
                                            <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-wider">Reason for rejection</p>
                                            <p className="text-sm font-bold text-slate-700 italic">
                                                "{booking.cancellationReason}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-red-100 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-red-400 uppercase">Closed on</span>
                                        <span className="text-[10px] font-black text-red-800">{new Date(booking.updatedAt).toLocaleDateString('en-GB')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-md p-8 shadow-sm border border-slate-200 sticky top-24">
                        <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10">Live Status</h2>
                        <div className="relative space-y-0">
                            {stages.map((stage, idx) => {
                                const isCompleted = idx < currentStageIndex;
                                const isCurrent = idx === currentStageIndex;
                                const isLast = idx === stages.length - 1;

                                return (
                                    <div key={stage.key} className="relative flex gap-6 pb-12">

                                        {!isLast && (
                                            <div className={`absolute left-4 top-8 w-[2px] h-full -translate-x-1/2 ${idx < currentStageIndex ? 'bg-blue-600' : 'bg-slate-100'
                                                }`} />
                                        )}


                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-700 ${isCurrent ? 'bg-blue-600 border-blue-100 text-white scale-110 shadow-lg shadow-blue-200' :
                                            isCompleted ? 'bg-blue-600 border-white text-white' : 'bg-white border-slate-100 text-slate-200'
                                            }`}>
                                            {isCompleted ? <Check size={14} strokeWidth={4} /> : <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-current'}`} />}
                                        </div>


                                        <div className="flex-1 pt-1">
                                            <p className={`text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-300'}`}>
                                                {stage.label}
                                            </p>
                                            {isCurrent && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-500 text-[8px] font-black uppercase rounded">Current Stage</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>


            {showCancelModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-md p-8 shadow-2xl animate-in zoom-in duration-150">
                        <h3 className="text-xl font-bold mb-1">Cancel Order</h3>
                        <p className="text-sm text-slate-500 mb-6">Please select a reason for cancellation.</p>

                        <div className="space-y-2 mb-6">
                            <ReasonOption id="no_provider" label="No technicians available" active={cancelType} set={setCancelType} />
                            <ReasonOption id="wrong_loc" label="Service location not reachable" active={cancelType} set={setCancelType} />
                            <ReasonOption id="other" label="Other reason" active={cancelType} set={setCancelType} />
                        </div>

                        {cancelType === "other" && (
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm mb-6 outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Type the reason here..."
                                rows="3"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                            />
                        )}

                        <div className="flex gap-3">
                            <button onClick={() => setShowCancelModal(false)} className="flex-1 py-4 font-bold text-slate-400">Back</button>
                            <button
                                disabled={!cancelType || (cancelType === 'other' && !customReason)}
                                onClick={() => {
                                    const finalReason = cancelType === "other" ? customReason : cancelType;
                                    cancelOrder("rejected", { cancellationReason: finalReason });
                                }}
                                className="flex-[2] cursor-pointer bg-red-600 text-white py-4 rounded-md font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {booking.status === "completed" && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    {!booking.isSettled ? (
                        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-blue-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Timer size={18} className="text-blue-500" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Final Settlement</p>
                            </div>

                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-black text-slate-700 uppercase ml-1">Actual Hours Worked</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={hoursWorked}
                                        onChange={(e) => setHoursWorked(e.target.value)}
                                        placeholder="e.g. 2.5"
                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-black text-lg transition-all"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">HRS</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-blue-50/50 p-5 rounded-2xl mb-6 border border-blue-50">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Calculated Total:</span>
                                <span className="text-2xl font-black text-slate-900">
                                    ₹{hoursWorked ? (parseFloat(hoursWorked) * booking.price).toLocaleString() : "0"}
                                </span>
                            </div>

                            <button
                                onClick={handleFinalizePayment}
                                disabled={isCalculating || !hoursWorked}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-blue-100"
                            >
                                {isCalculating ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                                {isCalculating ? "Generating..." : "Generate Final Invoice"}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 p-8 rounded-md border border-emerald-100 shadow-sm animate-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <ShieldCheck size={16} className="text-emerald-600" />
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Invoice</p>
                                    </div>
                                    <p className="text-sm text-emerald-800 font-bold italic">
                                        {booking.hoursWorked} hours at ₹{booking.price}/hr
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-emerald-950 leading-none">₹{booking.totalAmount?.toLocaleString()}</p>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full mt-3 inline-block shadow-sm ${booking.paymentStatus === 'paid' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white animate-pulse'}`}>
                                        {booking.paymentStatus === 'paid' ? 'Transaction Paid' : 'Awaiting Payment'}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8 p-6 bg-white/60 rounded-2xl border border-emerald-200/50 space-y-4">
                                <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest border-b border-emerald-100 pb-2">Final Job Summary</h4>
                                <div className="grid grid-cols-2 gap-y-3">
                                    <SummaryItem label="Service Rendered" value={booking.serviceType} />
                                    <SummaryItem label="Professional" value={workerDetails?.fullname || "Assigned Tech"} />
                                    <SummaryItem label="Work Duration" value={`${booking.hoursWorked} Hours`} />
                                    <SummaryItem label="Base Rate" value={`₹${booking.price}/hr`} />
                                    <SummaryItem label="Location" value={booking.address} className="col-span-2" />
                                    <div className="col-span-2 pt-2 border-t border-emerald-100 mt-1 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Grand Total</span>
                                        <span className="text-lg font-black text-emerald-900">₹{booking.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {booking.paymentStatus !== 'paid' ? (
                                <button
                                    onClick={handleConfirmCash}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-200"
                                >
                                    <CheckCircle2 size={18} /> Confirm Cash Received
                                </button>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 py-4 bg-white/50 rounded-2xl border border-emerald-100/50">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                        <Check size={20} strokeWidth={3} />
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">Closed & Settled</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}


        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}

function MainAction({ label, color, onClick, disabled }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`w-full ${color} text-white py-4 cursor-pointer px-6 rounded-md flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`}
        >
            <span>{label}</span>
            <ArrowRight size={16} className="shrink-0" />
        </button>
    );
}

const ReasonOption = ({ id, label, active, set }) => (
    <button
        onClick={() => set(id)}
        className={`w-full p-4 py-3 rounded-xl text-left text-xs font-bold border-2 transition-all ${active === id ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
    >
        {label}
    </button>
);

function SummaryItem({ label, value, className = "" }) {
    return (
        <div className={className}>
            <p className="text-[9px] font-black text-emerald-700/50 uppercase leading-none mb-1">{label}</p>
            <p className="text-xs font-bold text-slate-800 truncate">{value}</p>
        </div>
    );
}