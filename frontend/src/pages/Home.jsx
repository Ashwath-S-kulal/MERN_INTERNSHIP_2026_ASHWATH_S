import React, { useCallback, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import axios from 'axios';
import { setUser } from '@/redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Homepage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user || {}); 

  const fetchuserbyid = useCallback(async () => {
    const activeUserId = user?._id || localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');
    if (!activeUserId) {
      console.log("Still looking for User ID...");
      return;
    }
    try {
      const res = await axios.get(`/api/user/getuserbyid/${activeUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        const freshUser = res.data.user;
        if (user && user.role !== freshUser.role) {
          dispatch(setUser(freshUser));
        }
      }
    } catch (error) {
      console.error("Error syncing user role:", error);
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchuserbyid();
    const interval = setInterval(fetchuserbyid, 10000);
    return () => clearInterval(interval);
  }, [fetchuserbyid]);



  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="relative bg-blue-50 pt-44 pb-20 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Expert Help, <br />
              <span className="text-blue-600">Just a Tap Away.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Book trusted local professionals for cleaning, plumbing, repairs, and more.
              Transparent pricing. Verified pros.
            </p>

            <div className="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-2 border border-gray-100">
              <div className="flex items-center w-full px-4 border-r border-gray-200">
                <MapPin className="text-blue-500 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Bengaluru, KA"
                  className="w-full py-3 outline-none text-gray-700"
                />
              </div>
              <div className="flex items-center w-full px-4">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full py-3 outline-none text-gray-700"
                />
              </div>
              <button className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <img
                src="https://thumbs.dreamstime.com/b/giving-helping-hand-hands-man-woman-reaching-to-each-other-support-rescue-gesture-lending-solidarity-compassion-296184706.jpg"
                alt="Professional Service"
                className="rounded-2xl shadow-2xl w-full max-w-md object-cover h-[400px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Star className="text-green-600 fill-current" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">4.9/5 Rating</p>
                  <p className="text-xs text-gray-500">From 10k+ customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 border-y border-indigo-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black tracking-widest text-indigo-500 uppercase mb-2">Simple Process</p>
            <h2 className="text-4xl font-black text-gray-900">How It Works</h2>
            <p className="text-gray-500 text-sm mt-2">From search to service in 4 easy steps</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🔍", step: "1", title: "Choose Service", desc: "Browse 50+ home services and pick what you need" },
              { icon: "📅", step: "2", title: "Pick a Slot", desc: "Select your preferred date & time" },
              { icon: "👷", step: "3", title: "Pro Arrives", desc: "Verified expert comes to your doorstep" },
              { icon: "✅", step: "4", title: "Pay & Rate", desc: "Pay after completion, rate your pro" },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[65%] w-[70%] h-0.5 bg-gradient-to-r from-indigo-200 to-violet-200 z-0" />}
                <div className="relative z-10 w-16 h-16 bg-white border-2 border-indigo-200 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-md group-hover:scale-110 group-hover:border-indigo-500 group-hover:shadow-lg transition-all">
                  {item.icon}
                </div>
                <div className="text-xs font-black text-indigo-400 mb-1 tracking-widest">STEP {item.step}</div>
                <h3 className="font-black text-gray-900 mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;