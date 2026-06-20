import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Search, MapPin, Star, Sparkles, Home, X, Sparkle, Layers, ChevronDown, Wrench, Briefcase, Languages, Calendar, Navigation, MessageSquare, Send, SlidersHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loading";

export default function ServiceExplorer() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle state for filters drawer visibility
  const [showFilters, setShowFilters] = useState(false);

  // Basic Input States
  const [searchTerm, setSearchTerm] = useState("");
  const [aiSearchTerm, setAiSearchTerm] = useState("");

  // Base Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);

  // New Detailed Schema Structural Filter States
  const [selectedSubService, setSelectedSubService] = useState("All");
  const [maxRadius, setMaxRadius] = useState(50);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [toolRequirement, setToolRequirement] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");

  // AI Operation States
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiNotice, setAiNotice] = useState("");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hey! I'm your ServiceMate AI Finder. Describe what you're looking for (e.g., 'plumber in Bangalore under 1000 with tools') and I'll configure your marketplace filters instantly!" }
  ]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/user/getallservices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchServices();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, aiAnalyzing]);

  const categories = ["All", ...new Set(services.map(s => s.category).filter(Boolean))];
  const cities = ["All", ...new Set(services.map(s => s.city).filter(Boolean))];
  const languagesList = ["All", ...new Set(services.flatMap(s => s.languages || []).filter(Boolean))];
  const daysList = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const subServicesList = [
    "All",
    ...new Set(services.flatMap(s => s.services || []).map(svc => svc?.type || svc).filter(Boolean))
  ];

  const handleDedicatedAISearch = async (e) => {
    e.preventDefault();
    if (!aiSearchTerm.trim()) return;

    const userPrompt = aiSearchTerm.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userPrompt }]);
    setAiSearchTerm("");
    setAiAnalyzing(true);
    setAiNotice("");

    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/ai/search-intent`,
        { query: userPrompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const {
        category,
        services: aiServices,
        city,
        maxPrice: price,
        maxRadius: radius,
        minExperience: exp,
        hasTools,
        language,
        dayAvailable
      } = res.data;

      let logs = [];

      if (category || city || price || radius || exp || hasTools !== undefined || language || dayAvailable) {
        setShowFilters(true);
      }

      if (Array.isArray(aiServices) && aiServices.length > 0) {
        const structuralKeywords = aiServices.join(", ");
        setSearchTerm(structuralKeywords);
        logs.push(`Tags: ${structuralKeywords}`);
      }

      if (category && category !== "All") { setSelectedCategory(category); logs.push(category); }
      if (city && city !== "All") { setSelectedCity(city); logs.push(city); }
      if (price) { setMaxPrice(price); logs.push(`Under ₹${price}`); }
      if (radius) { setMaxRadius(radius); logs.push(`Within ${radius}km`); }
      if (exp) { setMinExperience(exp); logs.push(`${exp}+ Yrs Exp`); }
      if (hasTools !== null && hasTools !== undefined) { setToolRequirement(hasTools ? "Yes" : "No"); logs.push(hasTools ? "Has Tools" : "No Tools"); }
      if (language && language !== "All") { setSelectedLanguage(language); logs.push(language); }
      if (dayAvailable && dayAvailable !== "All") { setSelectedDay(dayAvailable); logs.push(`On ${dayAvailable}`); }

      const summaryText = logs.length > 0 ? `Applied filters: ${logs.join(" | ")}` : "I've optimized your marketplace lookups.";
      setAiNotice(logs.length > 0 ? `AI Applied: ${logs.join(" | ")}` : "AI parsed general queries.");

      setChatMessages((prev) => [...prev, { role: "assistant", text: `✨ Done! ${summaryText}` }]);
    } catch (err) {
      console.error("AI Context processing failure:", err);
      setChatMessages((prev) => [...prev, { role: "assistant", text: "❌ Sorry, I hit an error optimizing your criteria parameters." }]);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const filteredServices = services.filter(s => {
    const rate = s.pricing?.rate || 0;

    let matchesSearch = true;
    if (searchTerm.trim() !== "") {
      const searchKeywords = searchTerm.toLowerCase().split(",").map(kw => kw.trim()).filter(Boolean);
      matchesSearch = searchKeywords.some(keyword => {
        return s.title?.toLowerCase().includes(keyword) ||
          s.category?.toLowerCase().includes(keyword) ||
          s.services?.some(svc => (svc?.type || svc).toLowerCase().includes(keyword));
      });
    }

    const targetLanguage = selectedLanguage.trim().toLowerCase();

    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesCity = selectedCity === "All" || s.city === selectedCity;
    const matchesPrice = rate <= maxPrice;
    const matchesSubService = selectedSubService === "All" || s.services?.some(svc => (svc?.type || svc) === selectedSubService);
    const matchesRadius = (s.serviceRadius || 10) <= maxRadius;
    const matchesExperience = (s.experience || 0) >= minExperience;

    const matchesLang = selectedLanguage === "All" || (
      Array.isArray(s.languages) && s.languages.some(lang =>
        lang && lang.trim().toLowerCase() === targetLanguage
      )
    );

    const matchesTools = toolRequirement === "All" || (toolRequirement === "Yes" ? s.hasTools === true : s.hasTools === false);
    const matchesDay = selectedDay === "All" || s.availability?.includes(selectedDay);

    return matchesSearch && matchesCategory && matchesCity && matchesPrice && matchesSubService && matchesRadius && matchesExperience && matchesLang && matchesTools && matchesDay;
  });

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedCity("All");
    setMaxPrice(10000);
    setSelectedSubService("All");
    setMaxRadius(50);
    setMinExperience(0);
    setSelectedLanguage("All");
    setToolRequirement("All");
    setSelectedDay("All");
    setSearchTerm("");
    setAiSearchTerm("");
    setAiNotice("");
    setChatMessages([
      { role: "assistant", text: "Filters cleared completely! What kind of service workspace lookup can I help setup next?" }
    ]);
  };

  const getSectionData = (categoryName) => {
    return filteredServices.filter(s => s.category === categoryName).slice(0, 4);
  };

  // Helper to count active criteria tags
  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedCity !== "All",
    selectedSubService !== "All",
    minExperience > 0,
    selectedLanguage !== "All",
    toolRequirement !== "All",
    selectedDay !== "All",
    maxRadius !== 50,
    maxPrice !== 10000
  ].filter(Boolean).length;

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-white pb-20 mt-16 relative">

      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-2xl border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4">

          <div className="flex items-center gap-3">
            <div className="relative flex-1 group flex items-center bg-slate-100/70 rounded-2xl px-4 py-1 border border-slate-200/20 focus-within:bg-white focus-within:border-slate-200 transition-all shadow-inner">
              <Search className="text-slate-400 group-focus-within:text-blue-600 transition-colors shrink-0" size={15} />
              <input
                type="text"
                value={searchTerm}
                placeholder="Search across title, keywords, or tags (e.g. plumber, repair)..."
                className="w-full pl-2.5 pr-4 py-2.5 bg-transparent border-none text-xs font-bold outline-none text-slate-800 placeholder:text-slate-400"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-all shrink-0 ${
                showFilters 
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={14} className={showFilters ? "rotate-180 transition-transform" : ""} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className={`inline-flex items-center justify-center text-[9px] font-black w-4 h-4 rounded-full ${showFilters ? "bg-white text-slate-900" : "bg-blue-600 text-white"}`}>
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown size={12} className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4 pt-2 border-t border-slate-100/80 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                
                <div className="relative flex-1 md:max-w-[220px]">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 z-10" size={12} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubService("All");
                    }}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 appearance-none cursor-pointer outline-none shadow-sm focus:border-blue-500"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                </div>

                <div className="relative flex-1 md:max-w-[180px]">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={12} />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 appearance-none cursor-pointer outline-none shadow-sm focus:border-blue-500"
                  >
                    {cities.map(city => <option key={city} value={city}>{city === "All" ? "Everywhere" : city}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                </div>

                <div className="flex-1 flex items-center justify-between md:justify-end gap-4 bg-white border border-slate-200/60 px-4 py-2 rounded-xl shadow-sm min-h-[40px]">
                  <div className="flex flex-col min-w-[75px]">
                    <span className="text-[7px] font-black text-slate-400 uppercase leading-none mb-1">Max Price</span>
                    <span className="text-[10px] font-black text-slate-900 leading-none">₹{maxPrice}</span>
                  </div>
                  <input
                    type="range" min="100" max="10000" step="100" value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full md:w-32 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/40 text-slate-600">
                  <Wrench size={11} className="text-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Task Skill:</span>
                  <select
                    value={selectedSubService}
                    onChange={(e) => setSelectedSubService(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-700 outline-none cursor-pointer max-w-[130px]"
                  >
                    {subServicesList.map(svc => <option key={svc} value={svc}>{svc === "All" ? "Any Task / Skill" : svc}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/40 text-slate-600">
                  <Navigation size={11} className="text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Radius:</span>
                  <select
                    value={maxRadius}
                    onChange={(e) => setMaxRadius(Number(e.target.value))}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    {[5, 10, 15, 25, 50].map(r => <option key={r} value={r}>{r} km</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/40 text-slate-600">
                  <Briefcase size={11} className="text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Experience:</span>
                  <select
                    value={minExperience}
                    onChange={(e) => setMinExperience(Number(e.target.value))}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    {[0, 1, 3, 5, 8].map(y => <option key={y} value={y}>{y === 0 ? "Any Experience" : `${y}+ Years`}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/40 text-slate-600">
                  <Languages size={11} className="text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Language:</span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    {languagesList.map(lang => <option key={lang} value={lang}>{lang === "All" ? "Any Language" : lang}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/40 text-slate-600">
                  <Wrench size={11} className="text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Tools:</span>
                  <select
                    value={toolRequirement}
                    onChange={(e) => setToolRequirement(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All">Any Setup</option>
                    <option value="Yes">Brings Own Tools</option>
                    <option value="No">No Tools Required</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/40 text-slate-600">
                  <Calendar size={11} className="text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Availability:</span>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    {daysList.map(day => <option key={day} value={day}>{day === "All" ? "Any Day" : day}</option>)}
                  </select>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="ml-auto p-1.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-3"
                  >
                    <X size={12} /> Clear ALL
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-20">
        {aiNotice && (
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3 flex items-center gap-2 text-indigo-800 text-xs font-bold max-w-fit shadow-sm">
            <Sparkles size={14} className="text-indigo-500 shrink-0" />
            <span>{aiNotice}</span>
            <button onClick={() => setAiNotice("")} className="hover:bg-indigo-100 p-0.5 rounded ml-2">
              <X size={12} />
            </button>
          </div>
        )}

        {filteredServices.length > 0 ? (
          <>
            {selectedCategory === "All" && selectedSubService === "All" && searchTerm === "" ? (
              <>
                <ServiceSection
                  title="New Arrivals"
                  subtitle="Recently Joined Experts"
                  icon={<Sparkles size={18} className="text-amber-500" />}
                  data={[...filteredServices].reverse().slice(0, 4)}
                  navigate={navigate}
                />
                <ServiceSection
                  title="Home Services"
                  subtitle="Top Rated in Cleaning & Fixes"
                  icon={<Home size={18} className="text-blue-500" />}
                  data={getSectionData("Home Services")}
                  navigate={navigate}
                />
              </>
            ) : null}

            <section>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {selectedCategory === "All" ? "Explore Marketplace" : `${selectedCategory} Experts`}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Handpicked Professionals</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredServices.map(s => (
                  <SmallServiceCard key={s._id} service={s} navigate={navigate} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="py-40 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <Search className="mx-auto text-slate-300 mb-4" size={42} />
            <h3 className="text-base font-black text-slate-900 uppercase">No Matches Found</h3>
            <button onClick={resetFilters} className="mt-4 text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-600 pb-1">
              Clear All Constraints
            </button>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isAiChatOpen && (
          <div className="w-[340px] h-[440px] bg-white border border-slate-200 shadow-2xl rounded-xl mb-4 flex flex-col overflow-hidden border-indigo-100/80 animate-in fade-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-1.5 rounded-xl">
                  <Sparkles size={16} className="text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wide uppercase">ServiceMate Engine</h3>
                  <p className="text-[9px] font-semibold text-indigo-200 uppercase tracking-wider">AI Semantic Filter Agent</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiChatOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-bold leading-relaxed shadow-sm ${msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {aiAnalyzing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-xs text-indigo-600 font-bold flex items-center gap-2">
                    <Sparkle size={12} className="animate-spin text-indigo-500" />
                    <span>Analyzing constraints...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleDedicatedAISearch} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={aiSearchTerm}
                onChange={(e) => setAiSearchTerm(e.target.value)}
                placeholder="Type structural lookup parameters..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder:text-slate-400"
                disabled={aiAnalyzing}
              />
              <button
                type="submit"
                disabled={aiAnalyzing || !aiSearchTerm.trim()}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className={`flex items-center gap-2 p-4 rounded-full shadow-xl transition-all duration-300 ${isAiChatOpen
            ? "bg-slate-900 text-white hover:bg-slate-800 scale-95"
            : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-indigo-500/20 hover:scale-105"
            }`}
        >
          {isAiChatOpen ? (
            <X size={20} />
          ) : (
            <>
              <MessageSquare size={18} />
              <span className="text-[10px] font-black uppercase tracking-wider pr-1">Ask AI Agent</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ServiceSection({ title, subtitle, icon, data, navigate }) {
  if (data.length === 0) return null;
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map(s => (
          <ServiceCard key={s._id} service={s} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function SmallServiceCard({ service, navigate }) {
  return (
    <div onClick={() => navigate(`/service/${service._id}`)} className="group cursor-pointer">
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-100">
        <img src={service.images?.[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[9px] font-black shadow-sm">
          ₹{service.pricing?.rate}<span className="text-slate-400"> /{service.pricing?.unit || 'hr'}</span>
        </div>
      </div>
      <h4 className="text-xs font-black text-slate-900 truncate">{service.title}</h4>
      <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase mt-1">
        <span>{service.city}</span>
        <span className="text-indigo-600">↔ {service.serviceRadius || 10}km</span>
      </div>
    </div>
  );
}

function ServiceCard({ service, navigate }) {
  return (
    <div
      onClick={() => navigate(`/service/${service._id}`)}
      className="group bg-white border border-slate-100 rounded-[24px] p-3 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer"
    >
      <div className="relative h-44 rounded-[18px] overflow-hidden mb-4">
        <img
          src={service.images?.[0]?.url || "https://images.unsplash.com/photo-1581578731522-745d05db9ad0?q=80&w=800"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={service.title}
        />
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-black">
          ₹{service.pricing?.rate} <span className="text-slate-400">/{service.pricing?.unit || 'hr'}</span>
        </div>
      </div>
      <div className="px-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{service.category}</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px]">
            <Star size={10} fill="currentColor" /> {service.rating || "4.9"}
          </div>
        </div>
        <h3 className="text-sm font-black text-slate-900 mb-1 truncate">{service.title}</h3>
        <div className="flex items-center justify-between text-slate-400 mt-2 text-[9px] font-bold">
          <div className="flex items-center gap-1">
            <MapPin size={10} />
            <span className="uppercase tracking-tighter">{service.city}</span>
          </div>
          <span>{service.experience} Yrs Exp</span>
        </div>
      </div>
    </div>
  );
}