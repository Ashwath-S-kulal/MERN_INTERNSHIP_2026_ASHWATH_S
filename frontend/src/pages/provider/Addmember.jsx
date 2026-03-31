import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Users, Plus, Trash2, Phone, Briefcase,
    Mail, Check, ShieldCheck, Camera, Loader2, User, ChevronRight,
    Zap
} from "lucide-react";

export default function ProviderTeam() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullname: "",
        role: "",
        phonenumber: "",
        email: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const token = localStorage.getItem("accessToken");

    const fetchMembers = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/member/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setMembers(res.data.members);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append("fullname", formData.fullname);
        data.append("role", formData.role);
        data.append("phonenumber", formData.phonenumber);
        data.append("email", formData.email);
        if (selectedFile) data.append("file", selectedFile);

        try {
            const res = await axios.post("http://localhost:8000/api/member/add", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.data.success) {
                setMembers([...members, res.data.member]);
                setFormData({ fullname: "", role: "", phonenumber: "", email: "" });
                setSelectedFile(null);
                setPreviewUrl("");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add member");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteMember = async (id) => {
        if (!window.confirm("Remove this member?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/member/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(members.filter(m => m._id !== id));
        } catch (err) {
            console.error(err)
            alert("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <main className="max-w-screen mx-auto py-8 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-12">

                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm fixed">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="font-bold text-xl">Add New Member</h2>
                                <p className="text-slate-500 text-sm">Expand your team directory</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="flex justify-center">
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="group relative w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all overflow-hidden"
                                    >
                                        {previewUrl ? (
                                            <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                                        ) : (
                                            <Camera size={24} className="text-slate-400 group-hover:text-indigo-500" />
                                        )}
                                        <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <FormInput label="Full Name" placeholder="e.g. Alex Johnson" value={formData.fullname} onChange={(v) => setFormData({ ...formData, fullname: v })} />
                                    <FormInput label="Role" placeholder="e.g. Senior Electrician" value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} />
                                    <FormInput label="Phone Number" placeholder="+91 00000 00000" value={formData.phonenumber} onChange={(v) => setFormData({ ...formData, phonenumber: v })} />
                                    <FormInput label="Email Address" placeholder="alex@company.com" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18} /> Add Member</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <div className="w-full bg-white rounded-md border border-slate-200 shadow-sm p-8 py-6 overflow-hidden relative group">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                <div className="w-full md:w-1/4 flex flex-col items-center md:items-start px-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Team Personnel</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900 tracking-tight">{members.length}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase">Active</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/4 flex flex-col items-center md:items-start px-8">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Team Capacity</span>
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <Zap size={18} fill="currentColor" className="opacity-20" />
                                        <span className="text-xl font-black uppercase tracking-tighter">Unlimited</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold">Team Directory</h3>
                                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md">Live Data</span>
                            </div>

                            {loading ? (
                                <div className="p-20 flex flex-col items-center justify-center opacity-40">
                                    <Loader2 className="animate-spin mb-2" />
                                    <p className="text-sm font-medium">Loading Directory...</p>
                                </div>
                            ) : members.length === 0 ? (
                                <div className="p-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <User size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">No members found. Use the form to add your team.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {members.map((member) => (
                                        <div key={member._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                                    {member.profilePic ? (
                                                        <img src={member.profilePic} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase">
                                                            {member.fullname.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm leading-none">{member.fullname}</h4>
                                                    <span className="text-indigo-600 text-[11px] font-bold uppercase tracking-wider">{member.role}</span>
                                                    <div className="flex items-center gap-4 mt-1 text-slate-400">
                                                        <span className="flex items-center gap-1 text-[11px] font-medium"><Phone size={10} /> {member.phonenumber}</span>
                                                        <span className="flex items-center gap-1 text-[11px] font-medium"><Mail size={10} /> {member.email || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => deleteMember(member._id)}
                                                className="opacity-100 p-2 text-red-500 cursor-pointer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FormInput({ label, value, onChange, placeholder }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 ml-1">{label}</label>
            <input
                required
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}