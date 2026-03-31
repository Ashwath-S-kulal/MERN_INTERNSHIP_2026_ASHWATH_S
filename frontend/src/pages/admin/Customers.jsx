import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Mail, Search, Trash2, X, Shield, User, ShieldCheck, MoreVertical, Calendar, MapPin } from "lucide-react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState({});
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const accessToken = localStorage.getItem("accessToken");

  const filtered = users.filter((u) =>
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`/api/admin/alluser`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [accessToken]);

  const handleDeleteAccount = async (user) => {
    if (!window.confirm(`Permanently delete ${user.firstName}'s account? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/deleteuser/${user._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Delete failed");

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success("Account removed successfully");
      
      if (currentUser?._id === user._id) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditClick = (user) => {
    setUpdateUser({ _id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role });
    setUserId(user._id);
    setIsModalOpen(true);
  };

  const handleRoleChange = (newRole) => {
    setUpdateUser((prev) => ({ ...prev, role: newRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`/api/admin/updateuser/${userId}`, 
        { role: updateUser.role }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.success) {
        toast.success(`Role updated to ${updateUser.role}`);
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: updateUser.role } : u)));
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) return (
    <div className="flex items-center justify-center min-h-screen text-slate-400 font-medium animate-pulse">
      Loading directory...
    </div>
  );

  return (
    <div className="min-h-screen text-slate-900 font-sans ">
      <div className="max-w-screen mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">User Directory</h1>
            <p className="text-sm text-slate-500">Manage user permissions and account status.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Access</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}&background=f1f5f9&color=64748b`}
                        alt=""
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      user.role === 'admin' ? 'bg-purple-50 border-purple-100 text-purple-700' : 
                      user.role === 'provider' ? 'bg-blue-50 border-blue-100 text-blue-700' : 
                      'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center text-xs text-slate-500 gap-1">
                      <MapPin size={12} />
                      {user.city || "Not set"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditClick(user)}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">User Permissions</h3>
                <p className="text-xs text-slate-500">{updateUser.firstName} {updateUser.lastName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-2 mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Access Level</p>
                <div className="grid grid-cols-1 gap-2">
                  {['user', 'provider', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        updateUser.role === r 
                        ? "border-slate-900 bg-slate-900 text-white shadow-md" 
                        : "border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="text-sm font-bold uppercase tracking-wider">{r}</span>
                      {updateUser.role === r && <ShieldCheck size={18} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAccount(updateUser)}
                  className="w-full py-3 text-red-500 text-xs font-bold hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Remove Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;