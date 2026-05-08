import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Bot, BotIcon, BotMessageSquare, Layout, MessageSquare, Plus, Send, Trash2, User, Wrench } from "lucide-react";
import { useSelector } from "react-redux";

function AIChat() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const axiosConfig = { withCredentials: true };
    const API_BASE = `${import.meta.env.VITE_BASE_URI}/api/ai`;
    const accessToken = localStorage.getItem("accessToken");
    const { user } = useSelector((store) => store.user);


    const fetchSessions = async () => {
        try {
            const res = await axios.get(`${API_BASE}/sessions/user`, {
                ...axiosConfig,
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.data.success) {
                setSessions(res.data.sessions);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const loadSession = async (id) => {
        setLoading(true);
        setCurrentSessionId(id);
        try {
            const res = await axios.get(`${API_BASE}/session/${id}`, {
                ...axiosConfig,
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (res.data.success) {
                setChat(res.data.messages);
            }
        } catch (err) {
            console.error("Error loading chat:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat, loading]);


    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!message.trim() || loading) return;

        const userInput = message;
        setChat((prev) => [...prev, { role: "user", text: userInput }]);
        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE}/chat`,
                { message: userInput, sessionId: currentSessionId },
                {
                    ...axiosConfig,
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );

            if (res.data.success) {
                setChat((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
                if (!currentSessionId) {
                    setCurrentSessionId(res.data.sessionId);
                    fetchSessions();
                }
            }
        } catch (error) {
            console.error("Chat Error:", error.response?.data || error.message);
            setChat((prev) => [...prev, { role: "assistant", text: "⚠️ Auth Error: Please log in again." }]);
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setChat([]);
    };


    const deleteSessionHandler = async (sessionId) => {
        try {
            if (!window.confirm("Are you sure you want to delete this chat?")) return;

            const res = await axios.delete(
                `${import.meta.env.VITE_BASE_URI}/api/ai/delete/${sessionId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                setSessions((prevSessions) => prevSessions.filter(s => s._id !== sessionId));

                if (currentSessionId === sessionId) {
                    startNewChat();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-[calc(110vh-80px)] pt-16 w-full bg-slate-50/50 backdrop-blur-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-t border-slate-200/50">
            <aside className={` pt-18 md:pt-0 fixed inset-y-0 left-0 z-50 w-72 bg-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto md:bg-slate-50 md:backdrop-blur-md md:border-r md:border-slate-200/60
                     ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    `}>

                <div className="p-5 pt-10 flex-shrink-0 flex items-center justify-between">
                    <button
                        onClick={() => { startNewChat(); setIsSidebarOpen(false); }}
                        className="flex-1 group flex items-center justify-center gap-2 py-2.5 bg-indigo-500 text-white rounded-md text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98]"
                    >
                        <Plus size={16} />
                        New Chat
                    </button>
                    <button onClick={() => setIsSidebarOpen(false)} className="ml-2 p-2 text-slate-400 md:hidden">
                        <Layout size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-0.5 custom-scrollbar">
                    <div className="flex items-center gap-2 px-3 mb-3 sticky top-0 bg-white md:bg-transparent py-2 z-10">
                        <Layout size={12} className="text-slate-400" />
                        <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black">History</span>
                    </div>

                    {sessions.map((s) => (
                        <div key={s._id} className="group relative flex items-center">
                            <button
                                onClick={() => loadSession(s._id)}
                                className={`w-full p-2.5 text-xs rounded-lg flex items-center gap-2.5 transition-all ${currentSessionId === s._id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <MessageSquare size={14} />
                                <span className="truncate flex-1 text-left">{s.title || "Untitled Chat"}</span>
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSessionHandler(s._id);
                                }}
                                className="absolute right-2  group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative bg-white/30 h-full overflow-hidden">
                <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <MessageSquare size={20} />
                    </button>
                    <span className="text-xs font-black text-slate-800 tracking-tighter uppercase">Service Mate AI</span>
                    <button onClick={startNewChat} className="p-2 text-indigo-600">
                        <Plus size={20} />
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6 lg:px-12 lg:py-10 space-y-6 md:space-y-4 lg:space-y-8 scroll-smooth custom-scrollbar"
                >
                    {chat.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner group">
                                <BotMessageSquare size={40} className="text-indigo-500 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">How can I help you?</h3>
                                <p className="text-slate-500 max-w-xs text-[11px] md:text-xs leading-relaxed mx-auto">
                                    Specialized AI for home maintenance and repairs.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full pt-2">
                                {['Fix a leaky sink', 'AC filter cleaning', 'Check wiring', 'Paint estimates'].map(hint => (
                                    <button
                                        key={hint}
                                        onClick={() => setMessage(hint)}
                                        className="p-3 text-[10px] md:text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-all text-left flex items-center gap-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
                                        "{hint}"
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {chat.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-3 md:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${msg.role === "user" ? "bg-slate-100" : "bg-indigo-600 text-white"
                                }`}>
                                {msg.role === "user" ? (
                                    <img
                                        src={user?.profilePic || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Bot size={14} />
                                )}
                            </div>

                            <div className={`max-w-[85%] md:max-w-[75%] p-3.5 md:p-4 rounded-2xl shadow-sm ${msg.role === "user"
                                ? "bg-slate-800 text-white rounded-tr-none"
                                : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                                }`}>
                                <div className="prose prose-xs md:prose-sm max-w-none text-inherit leading-normal md:leading-relaxed overflow-x-auto text-xs md:text-sm">
                                    <ReactMarkdown>{msg.content || msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                <Bot size={14} className="animate-pulse" />
                            </div>
                            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3 md:p-4 lg:p-6 bg-gradient-to-t from-white via-white/90 to-transparent flex-shrink-0">
                    <form
                        onSubmit={sendMessage}
                        className="flex items-center gap-2 max-w-3xl lg:max-w-4xl mx-auto bg-white p-1.5 pl-4 pr-1.5 border border-slate-200 rounded-2xl focus-within:ring-4 ring-indigo-500/10 transition-all duration-500 shadow-xl"
                    >
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 bg-transparent py-2.5 md:py-3 outline-none text-slate-700 placeholder:text-slate-400 font-medium text-xs md:text-sm"
                            placeholder="Ask anything..."
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || loading}
                            className={`p-2.5 md:p-3 rounded-xl transition-all duration-300 active:scale-90 ${message.trim() && !loading
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                }`}
                        >
                            <Send size={16} />
                        </button>
                    </form>

                    <div className="flex justify-center items-center gap-3 mt-3 select-none opacity-40">
                        <div className="h-px w-6 bg-slate-200"></div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Service Mate AI Core</p>
                        <div className="h-px w-6 bg-slate-200"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AIChat;