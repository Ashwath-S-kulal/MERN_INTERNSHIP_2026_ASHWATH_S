import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MapPin, Wrench, Phone, Languages, CalendarDays, ToolCase,
  Mail, Edit, Save, Image as ImageIcon, Briefcase, Hash,
  ChevronLeft, Check, Globe, Navigation
} from "lucide-react";

export default function ProviderProfile() {
  const { id } = useParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [images, setImages] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const token = localStorage.getItem("accessToken");

  useEffect(() => { fetchProfiles(); }, [id]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/serviceprovider/provider/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setProfiles(res.data.providers || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const startEdit = (job) => {
    setIsEditing(job._id);
    setEditForm({
      ...job,
      // Ensure arrays are handled correctly for the form
      languages: Array.isArray(job.languages) ? job.languages.join(", ") : job.languages,
      services: Array.isArray(job.services) ? job.services.join(", ") : job.services
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === "checkbox" ? checked : value });
  };

  const toggleDay = (day) => {
    const currentDays = editForm.availability || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setEditForm({ ...editForm, availability: newDays });
  };



  const handleEditSubmit = async (jobId) => {
    try {
      const formData = new FormData();
      const originalProfile = profiles.find(p => p._id === jobId);
      const existingImagesIds = originalProfile.images
        .filter(img => img.public_id) 
        .map(img => img.public_id);

      formData.append("existingImages", JSON.stringify(existingImagesIds));

      images.filter(img => img instanceof File).forEach((file) => {
        formData.append("files", file); 
      });

      // 3. Prepare other fields (merging edits with original)
      const servicesArray = typeof editForm.services === 'string'
        ? editForm.services.split(",").map(s => s.trim()).filter(s => s !== "")
        : editForm.services;

      const submissionData = {
        ...editForm,
        services: servicesArray,
        languages: typeof editForm.languages === 'string'
          ? editForm.languages.split(",").map(l => l.trim())
          : editForm.languages,
      };

      // 4. Append Text Fields to FormData
      Object.keys(submissionData).forEach(key => {
        if (['user', 'images', '_id', 'createdAt', 'updatedAt', '__v'].includes(key)) return;

        if (Array.isArray(submissionData[key])) {
          formData.append(key, JSON.stringify(submissionData[key]));
        } else {
          formData.append(key, submissionData[key]);
        }
      });

      const res = await axios.put(`http://localhost:8000/api/serviceprovider/update/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.success) {
        alert("✅ Updated!");
        setIsEditing(null);
        setImages([]); 
        fetchProfiles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="h-48 bg-slate-900 w-full" />

      <main className="max-w-5xl mx-auto px-6 -mt-24">
        {profiles.map((job) => (
          <div key={job._id} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">

            {/* Header Section */}
            <div className="p-8 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white"><Wrench /></div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{isEditing ? "Editing Profile" : job.title}</h2>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">Provider ID: {job._id}</p>
                </div>
              </div>
              {!isEditing && (
                <button onClick={() => startEdit(job)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all">
                  <Edit size={18} /> Edit Profile
                </button>
              )}
            </div>

            <div className="p-8">
              {isEditing === job._id ? (
                /* --- FULL EDIT FORM --- */
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  {/* Section 1: Core Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase">Professional Title</label>
                      <input name="title" value={editForm.title} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase">Hourly Rate (₹)</label>
                      <input name="hourlyRate" type="number" value={editForm.hourlyRate} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase">Experience (Years)</label>
                      <input name="experience" type="number" value={editForm.experience} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none" />
                    </div>
                  </div>

                  {/* Section 2: Services & Languages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Services (Comma Separated)</label>
                      <input name="services" value={editForm.services} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" placeholder="Plumbing, Electrical..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Languages (Comma Separated)</label>
                      <input name="languages" value={editForm.languages} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" placeholder="English, Hindi..." />
                    </div>
                  </div>

                  {/* Section 3: Bio */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Professional Bio</label>
                    <textarea name="bio" rows="4" value={editForm.bio} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium outline-none" />
                  </div>

                  {/* Section 4: Availability Toggle */}
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CalendarDays size={14} /> Weekly Availability</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => (
                        <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${editForm.availability?.includes(day) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: Logistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-3xl">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase">Service Radius (KM)</label>
                      <input name="serviceRadius" type="number" value={editForm.serviceRadius} onChange={handleInputChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input type="checkbox" name="hasTools" checked={editForm.hasTools} onChange={handleInputChange} className="w-5 h-5 accent-blue-600" id="toolCheck" />
                      <label htmlFor="toolCheck" className="text-sm font-bold text-slate-700">I Own Equipment/Tools</label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase">Zip Code</label>
                      <input name="zipCode" value={editForm.zipCode} onChange={handleInputChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </div>
                  </div>

                  {/* Section 6: Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase">Street Address</label>
                      <input name="address" value={editForm.address} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase">City</label>
                      <input name="city" value={editForm.city} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" />
                    </div>
                  </div>

                  {/* Section 7: Images */}
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Add New Portfolio Images</label>
                    <input type="file" multiple onChange={(e) => setImages([...e.target.files])} className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold" />
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button onClick={() => handleEditSubmit(job._id)} className="flex-1 bg-green-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                      <Save size={20} /> Save All Changes
                    </button>
                    <button onClick={() => setIsEditing(null)} className="px-8 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all">
                      Cancel
                    </button>
                  </div>

                </div>
              ) : (
                /* --- FULL VIEW MODE (All Data Displayed) --- */
                <div className="space-y-12">

                  {/* Bio Section */}
                  <div className="max-w-3xl">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Professional Statement</h4>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium italic">"{job.bio}"</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <Briefcase className="text-blue-600 mb-2" size={20} />
                      <p className="text-xs font-bold text-slate-400 uppercase">Experience</p>
                      <p className="text-lg font-black text-slate-800">{job.experience} Years</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <Navigation className="text-blue-600 mb-2" size={20} />
                      <p className="text-xs font-bold text-slate-400 uppercase">Radius</p>
                      <p className="text-lg font-black text-slate-800">{job.serviceRadius} KM</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <ToolCase className="text-blue-600 mb-2" size={20} />
                      <p className="text-xs font-bold text-slate-400 uppercase">Tools</p>
                      <p className="text-lg font-black text-slate-800">{job.hasTools ? "Equipped" : "Basic"}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <Globe className="text-blue-600 mb-2" size={20} />
                      <p className="text-xs font-bold text-slate-400 uppercase">Languages</p>
                      <p className="text-lg font-black text-slate-800">{job.languages?.join(", ")}</p>
                    </div>
                  </div>

                  {/* Portfolio Gallery */}
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ImageIcon size={16} /> Project Gallery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {job.images?.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md">
                          <img src={img.url} className="h-full w-full object-cover" alt="work" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Logistics */}
                  <div className="grid md:grid-cols-2 gap-12 pt-10 border-t border-slate-100">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CalendarDays size={16} /> Availability</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.availability?.map(day => (
                          <span key={day} className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-100">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={16} /> Service Area</h4>
                      <p className="text-lg font-bold text-slate-700">{job.address}</p>
                      <p className="text-slate-500 font-medium">{job.city}, {job.zipCode}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-8 p-4 rounded-2xl bg-slate-900 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <Check className="text-green-400" />
                      <span className="text-sm font-bold">Profile Status: <span className="uppercase text-blue-400">{job.status}</span></span>
                    </div>
                    <span className="text-[10px] opacity-50 font-bold uppercase">Created {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>

                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}