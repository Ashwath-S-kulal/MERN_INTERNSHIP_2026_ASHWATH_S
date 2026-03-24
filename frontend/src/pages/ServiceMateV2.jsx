import { useState, useEffect, useRef } from "react";
import {
  RiHomeLine, RiCalendarLine, RiMapPinLine, RiMessage2Line, RiStarLine,
  RiUserLine, RiLogoutBoxLine, RiSearchLine, RiArrowRightLine, RiCheckLine,
  RiTimeLine, RiMoneyDollarCircleLine, RiShieldCheckLine, RiToolsLine,
  RiLightbulbLine, RiSnowflakeLine, RiBrushLine, RiHammerLine, RiLeafLine,
  RiLock2Line, RiCameraLine, RiCarLine, RiDropLine, RiHome2Line,
  RiBarChartLine, RiGroupLine, RiSettings3Line, RiNotificationLine,
  RiArrowUpLine, RiArrowDownLine, RiEyeLine, RiDeleteBinLine, RiEditLine,
  RiSendPlaneLine, RiRefreshLine, RiPhoneLine, RiMailLine, RiMapPin2Line,
  RiVerifiedBadgeLine, RiTrophyLine, RiFireLine, RiBriefcaseLine,
  RiDashboardLine, RiListCheck2, RiPieChartLine, RiAlertLine,
  RiCloseLine, RiMenuLine, RiSunLine, RiMoonLine, RiFlashlightLine,
  RiBuildingLine, RiStarFill, RiAddLine, RiDownloadLine, RiFilterLine,
} from "react-icons/ri";

/* ════════════════════════════════════════════════
   DUMMY DATA
════════════════════════════════════════════════ */
const SERVICES = [
  { id:1,  Icon:RiDropLine,      title:"Plumbing",        desc:"Leaks · Pipes · Faucets",       price:299,  time:"60 min", cat:"Repair",       grad:"135deg,#3B82F6,#06B6D4" },
  { id:2,  Icon:RiFlashlightLine,title:"Electrician",     desc:"Wiring · Switches · Fuse",      price:349,  time:"90 min", cat:"Repair",       grad:"135deg,#F59E0B,#EF4444" },
  { id:3,  Icon:RiSnowflakeLine, title:"AC Service",      desc:"Clean · Refill · Repair",       price:499,  time:"75 min", cat:"Cleaning",     grad:"135deg,#06B6D4,#6366F1" },
  { id:4,  Icon:RiHome2Line,     title:"Home Cleaning",   desc:"Deep · Sofa · Bathroom",        price:799,  time:"4 hrs",  cat:"Cleaning",     grad:"135deg,#10B981,#059669" },
  { id:5,  Icon:RiBrushLine,     title:"Painting",        desc:"Interior · Texture · Wall",     price:15,   time:"2 days", cat:"Makeover",     grad:"135deg,#EC4899,#8B5CF6", unit:"/sqft" },
  { id:6,  Icon:RiHammerLine,    title:"Carpentry",       desc:"Doors · Cabinets · Furniture",  price:399,  time:"2 hrs",  cat:"Repair",       grad:"135deg,#F97316,#F59E0B" },
  { id:7,  Icon:RiDropLine,      title:"Bathroom Reno",   desc:"Tiles · Waterproof · Faucet",   price:2499, time:"2 days", cat:"Makeover",     grad:"135deg,#8B5CF6,#EC4899" },
  { id:8,  Icon:RiLock2Line,     title:"Locksmith",       desc:"Unlock · Replace · Duplicate",  price:249,  time:"30 min", cat:"Emergency",    grad:"135deg,#64748B,#334155" },
  { id:9,  Icon:RiLeafLine,      title:"Pest Control",    desc:"Roach · Termite · Rodent",      price:999,  time:"3 hrs",  cat:"Cleaning",     grad:"135deg,#16A34A,#15803D" },
  { id:10, Icon:RiCameraLine,    title:"CCTV Install",    desc:"Cameras · DVR · Cabling",       price:1999, time:"3 hrs",  cat:"Installation", grad:"135deg,#6366F1,#8B5CF6" },
  { id:11, Icon:RiBuildingLine,  title:"Waterproofing",   desc:"Terrace · Walls · Basement",    price:1499, time:"1 day",  cat:"Makeover",     grad:"135deg,#0EA5E9,#3B82F6" },
  { id:12, Icon:RiCarLine,       title:"Vehicle Wash",    desc:"Exterior · Interior · Polish",  price:199,  time:"45 min", cat:"Cleaning",     grad:"135deg,#14B8A6,#10B981" },
];

const PROVIDERS = [
  { id:1, name:"Ravi Kumar",   role:"Master Plumber",    rating:4.98, jobs:1240, exp:"8 yrs",  status:"active",  earnings:42000, av:"RK", grad:"135deg,#3B82F6,#06B6D4", phone:"+91 98765 43210" },
  { id:2, name:"Anita Sharma", role:"Electrician",       rating:4.95, jobs:980,  exp:"6 yrs",  status:"active",  earnings:38000, av:"AS", grad:"135deg,#F59E0B,#EF4444", phone:"+91 87654 32109" },
  { id:3, name:"Suresh Babu",  role:"AC Technician",     rating:4.97, jobs:1560, exp:"10 yrs", status:"busy",    earnings:55000, av:"SB", grad:"135deg,#06B6D4,#6366F1", phone:"+91 76543 21098" },
  { id:4, name:"Priya Nair",   role:"Cleaning Expert",   rating:4.92, jobs:2300, exp:"5 yrs",  status:"active",  earnings:31000, av:"PN", grad:"135deg,#10B981,#059669", phone:"+91 65432 10987" },
  { id:5, name:"Kiran Reddy",  role:"Painter",           rating:4.85, jobs:430,  exp:"7 yrs",  status:"offline", earnings:28000, av:"KR", grad:"135deg,#EC4899,#8B5CF6", phone:"+91 54321 09876" },
  { id:6, name:"Mohan Das",    role:"Carpenter",         rating:4.78, jobs:320,  exp:"12 yrs", status:"offline", earnings:22000, av:"MD", grad:"135deg,#F97316,#F59E0B", phone:"+91 43210 98765" },
];

const CUSTOMERS = [
  { id:1, name:"Meera Iyer",    email:"meera@email.com",   phone:"+91 99887 76655", area:"Indiranagar", bookings:12, status:"active"   },
  { id:2, name:"Karthik Reddy", email:"karthik@email.com", phone:"+91 88776 65544", area:"HSR Layout",  bookings:8,  status:"active"   },
  { id:3, name:"Divya Menon",   email:"divya@email.com",   phone:"+91 77665 54433", area:"Koramangala", bookings:15, status:"active"   },
  { id:4, name:"Arjun Singh",   email:"arjun@email.com",   phone:"+91 66554 43322", area:"Whitefield",  bookings:4,  status:"inactive" },
  { id:5, name:"Sneha Rao",     email:"sneha@email.com",   phone:"+91 55443 32211", area:"JP Nagar",    bookings:19, status:"active"   },
];

const BOOKINGS = [
  { id:"BK001", customer:"Meera Iyer",    provider:"Ravi Kumar",   service:"Plumbing",      date:"Mar 20",  time:"10:00 AM", status:"completed", amount:450  },
  { id:"BK002", customer:"Karthik Reddy", provider:"Anita Sharma", service:"Electrician",   date:"Mar 20",  time:"2:00 PM",  status:"ongoing",   amount:520  },
  { id:"BK003", customer:"Divya Menon",   provider:"Suresh Babu",  service:"AC Service",    date:"Mar 21",  time:"11:00 AM", status:"scheduled", amount:499  },
  { id:"BK004", customer:"Arjun Singh",   provider:"Priya Nair",   service:"Home Cleaning", date:"Mar 19",  time:"9:00 AM",  status:"completed", amount:800  },
  { id:"BK005", customer:"Sneha Rao",     provider:"Kiran Reddy",  service:"Painting",      date:"Mar 22",  time:"9:00 AM",  status:"scheduled", amount:3200 },
  { id:"BK006", customer:"Meera Iyer",    provider:"Suresh Babu",  service:"AC Service",    date:"Mar 15",  time:"3:00 PM",  status:"completed", amount:499  },
  { id:"BK007", customer:"Karthik Reddy", provider:"Ravi Kumar",   service:"Plumbing",      date:"Mar 18",  time:"10:00 AM", status:"cancelled", amount:299  },
];

const MESSAGES_INIT = [
  { id:1, from:"Ravi Kumar",  av:"RK", grad:"135deg,#3B82F6,#06B6D4", text:"I'll arrive by 10:15 AM. Please keep the tap area accessible.", time:"9:45 AM", mine:false },
  { id:2, from:"Me",          av:"MI", grad:"135deg,#6366F1,#8B5CF6", text:"Sure! Main issue is the kitchen tap.",                          time:"9:47 AM", mine:true  },
  { id:3, from:"Ravi Kumar",  av:"RK", grad:"135deg,#3B82F6,#06B6D4", text:"Got it. Bringing all tools and spare fittings.",                time:"9:48 AM", mine:false },
  { id:4, from:"Me",          av:"MI", grad:"135deg,#6366F1,#8B5CF6", text:"Great, door code is 4521 🙂",                                   time:"9:50 AM", mine:true  },
  { id:5, from:"Ravi Kumar",  av:"RK", grad:"135deg,#3B82F6,#06B6D4", text:"Perfect, on my way now 🚗",                                     time:"9:52 AM", mine:false },
];

const EARNING_DATA = [
  { month:"Oct", v:28000 },{ month:"Nov", v:32000 },{ month:"Dec", v:38000 },
  { month:"Jan", v:35000 },{ month:"Feb", v:41000 },{ month:"Mar", v:42000 },
];

const REVIEWS = [
  { id:1, customer:"Meera Iyer",    service:"Plumbing",    provider:"Ravi Kumar",   stars:5, text:"Excellent! Fixed the leak in no time. Super professional.",     date:"Mar 20" },
  { id:2, customer:"Karthik Reddy", service:"AC Service",  provider:"Suresh Babu",  stars:5, text:"AC is running like new. Very knowledgeable technician.",         date:"Mar 18" },
  { id:3, customer:"Divya Menon",   service:"Cleaning",    provider:"Priya Nair",   stars:4, text:"Great job overall. Bathroom was spotless. Slightly delayed.",      date:"Mar 15" },
  { id:4, customer:"Arjun Singh",   service:"Painting",    provider:"Kiran Reddy",  stars:5, text:"Beautiful finish! Color consultation was very helpful.",           date:"Mar 12" },
  { id:5, customer:"Sneha Rao",     service:"Electrician", provider:"Anita Sharma", stars:4, text:"All switches working perfectly. Quick and efficient.",             date:"Mar 10" },
];

const SLOTS = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
const CATS  = ["All","Repair","Cleaning","Makeover","Emergency","Installation"];

/* ════════════════════════════════════════════════
   GLOBAL STYLES
════════════════════════════════════════════════ */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  body { font-family:'Plus Jakarta Sans','Segoe UI',sans-serif; background:#070B14; color:#E2E8F0; }
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:rgba(255,255,255,.03); }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.15); border-radius:99px; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn    { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
  .fadeUp  { animation: fadeUp  .5s ease both; }
  .popIn   { animation: popIn   .3s cubic-bezier(.34,1.56,.64,1) both; }
  .slideIn { animation: slideIn .4s ease both; }
  .card-hover { transition: all .25s ease; }
  .card-hover:hover { transform:translateY(-4px); }
`;

/* ════════════════════════════════════════════════
   SHARED ATOMS
════════════════════════════════════════════════ */

// Glass card
const Glass = ({ children, className="", style={}, onClick }) => (
  <div onClick={onClick} className={className} style={{
    background:"rgba(255,255,255,.04)",
    border:"1px solid rgba(255,255,255,.08)",
    borderRadius:20,
    backdropFilter:"blur(12px)",
    ...style,
  }}>{children}</div>
);

// Gradient avatar
const Av = ({ initials, grad, size=36 }) => (
  <div style={{
    width:size, height:size, borderRadius:"50%",
    background:`linear-gradient(${grad})`,
    display:"flex", alignItems:"center", justifyContent:"center",
    color:"white", fontWeight:900, fontSize:size*.34, flexShrink:0,
    boxShadow:`0 4px 12px rgba(0,0,0,.4)`,
  }}>{initials}</div>
);

// Status pill
const Pill = ({ status }) => {
  const map = {
    completed:{ bg:"rgba(16,185,129,.15)", c:"#34D399", label:"Completed" },
    ongoing:  { bg:"rgba(99,102,241,.15)", c:"#818CF8", label:"Ongoing"   },
    scheduled:{ bg:"rgba(245,158,11,.15)", c:"#FCD34D", label:"Scheduled" },
    cancelled:{ bg:"rgba(239,68,68,.15)",  c:"#F87171", label:"Cancelled" },
    active:   { bg:"rgba(16,185,129,.15)", c:"#34D399", label:"Active"    },
    inactive: { bg:"rgba(100,116,139,.15)",c:"#94A3B8", label:"Inactive"  },
    busy:     { bg:"rgba(245,158,11,.15)", c:"#FCD34D", label:"Busy"      },
    offline:  { bg:"rgba(100,116,139,.15)",c:"#94A3B8", label:"Offline"   },
    paid:     { bg:"rgba(16,185,129,.15)", c:"#34D399", label:"Paid"      },
  };
  const s = map[status] || map.active;
  return (
    <span style={{ background:s.bg, color:s.c, fontSize:11, fontWeight:800,
      padding:"4px 10px", borderRadius:99, whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
};

// Stars
const Stars = ({ n=5, size=13 }) => (
  <span style={{ display:"flex", gap:1 }}>
    {[1,2,3,4,5].map(i=>(
      <RiStarFill key={i} size={size} color={i<=n?"#FBBF24":"rgba(255,255,255,.1)"}/>
    ))}
  </span>
);

// Stat card
const StatCard = ({ Icon, label, value, sub, grad, delay=0 }) => (
  <Glass className="fadeUp" style={{ padding:20, animationDelay:`${delay}ms` }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
      <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(${grad})`,
        display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 16px rgba(0,0,0,.4)` }}>
        <Icon size={20} color="white"/>
      </div>
      {sub && <span style={{ fontSize:11, fontWeight:800, color:"#34D399", background:"rgba(16,185,129,.12)",
        padding:"3px 8px", borderRadius:99 }}>{sub}</span>}
    </div>
    <div style={{ fontSize:26, fontWeight:900, color:"white", lineHeight:1.1 }}>{value}</div>
    <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", fontWeight:600, marginTop:4 }}>{label}</div>
  </Glass>
);

// Bar chart
const BarChart = ({ data, color="#6366F1" }) => {
  const max = Math.max(...data.map(d=>d.v));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:100 }}>
      {data.map((d,i)=>(
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ width:"100%", borderRadius:"6px 6px 0 0", transition:"all .7s ease",
            height:`${(d.v/max)*100}%`, minHeight:4,
            background: i===data.length-1 ? `linear-gradient(180deg,${color},${color}88)` : "rgba(255,255,255,.08)" }}/>
          <span style={{ fontSize:10, color:"rgba(255,255,255,.3)", fontWeight:700 }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// Sidebar nav item (dark)
const SNavItem = ({ Icon, label, active, onClick, badge, accent="#6366F1" }) => (
  <button onClick={onClick} style={{
    width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
    borderRadius:12, border:"none", cursor:"pointer", textAlign:"left", transition:"all .2s",
    background: active ? `linear-gradient(135deg,${accent}33,${accent}18)` : "transparent",
    color: active ? "white" : "rgba(255,255,255,.4)",
    borderLeft: active ? `3px solid ${accent}` : "3px solid transparent",
  }}>
    <Icon size={18}/>
    <span style={{ flex:1, fontSize:13, fontWeight: active?800:600 }}>{label}</span>
    {badge && <span style={{ fontSize:10, fontWeight:900, padding:"2px 7px", borderRadius:99,
      background:"#EF4444", color:"white" }}>{badge}</span>}
  </button>
);

/* ════════════════════════════════════════════════
   BOOKING MODAL
════════════════════════════════════════════════ */
function BookModal({ svc, onClose }) {
  const [step, setStep]   = useState(1);
  const [date, setDate]   = useState("");
  const [time, setTime]   = useState("");
  const [addr, setAddr]   = useState("");
  const [phone,setPhone]  = useState("");
  const [done, setDone]   = useState(false);

  const today = new Date();
  const dates = Array.from({length:7},(_,i)=>{ const d=new Date(today); d.setDate(today.getDate()+i); return d; });

  const confirm = () => { setDone(true); setTimeout(onClose, 2800); };

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)",
    borderRadius:12, padding:"12px 16px", color:"white", fontSize:13, fontWeight:600, outline:"none",
    fontFamily:"inherit",
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{
      position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center",
      padding:16, background:"rgba(0,0,0,.75)", backdropFilter:"blur(16px)",
    }}>
      <div className="popIn" style={{
        width:"100%", maxWidth:400, borderRadius:24, overflow:"hidden",
        background:"#0D1320", border:"1px solid rgba(255,255,255,.1)",
        boxShadow:"0 32px 80px rgba(0,0,0,.6)",
      }}>
        {done ? (
          <div style={{ padding:48, textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(16,185,129,.15)",
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <RiCheckLine size={32} color="#34D399"/>
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:8 }}>Booking Confirmed!</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.4)", lineHeight:1.6 }}>
              <strong style={{color:"white"}}>{svc.title}</strong> booked for <strong style={{color:"white"}}>{date}</strong> at <strong style={{color:"white"}}>{time}</strong>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding:"20px 24px 18px", background:`linear-gradient(${svc.grad})`, position:"relative" }}>
              <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:30, height:30,
                borderRadius:"50%", background:"rgba(0,0,0,.25)", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
                <RiCloseLine size={16}/>
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <svc.Icon size={28} color="white"/>
                <div>
                  <div style={{ fontSize:18, fontWeight:900, color:"white" }}>{svc.title}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.7)" }}>From ₹{svc.price}{svc.unit||""} · ~{svc.time}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {["Date & Time","Details","Confirm"].map((s,i)=>(
                  <div key={s} style={{ flex:1 }}>
                    <div style={{ height:3, borderRadius:99, background: step>i?"white":"rgba(255,255,255,.25)", transition:"all .3s" }}/>
                    <div style={{ fontSize:9, fontWeight:800, color: step>i?"white":"rgba(255,255,255,.4)", marginTop:4, textTransform:"uppercase", letterSpacing:1 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:"20px 24px 24px" }}>
              {step===1 && <>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>Select Date</div>
                <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:16 }}>
                  {dates.map(d=>{
                    const v = d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
                    const sel = date===v;
                    return (
                      <button key={v} onClick={()=>setDate(v)} style={{
                        flexShrink:0, width:56, padding:"8px 0", borderRadius:14, textAlign:"center",
                        border:"1.5px solid", cursor:"pointer", transition:"all .2s", fontFamily:"inherit",
                        borderColor: sel?"transparent":"rgba(255,255,255,.1)",
                        background: sel?`linear-gradient(${svc.grad})`:"rgba(255,255,255,.04)",
                        color:"white",
                      }}>
                        <div style={{fontSize:9,fontWeight:700,opacity:.6}}>{d.toLocaleDateString("en-IN",{weekday:"short"})}</div>
                        <div style={{fontSize:18,fontWeight:900}}>{d.getDate()}</div>
                        <div style={{fontSize:9,fontWeight:700,opacity:.6}}>{d.toLocaleDateString("en-IN",{month:"short"})}</div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>Select Time</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
                  {SLOTS.map(t=>{
                    const sel = time===t;
                    return (
                      <button key={t} onClick={()=>setTime(t)} style={{
                        padding:"8px 0", borderRadius:10, fontSize:11, fontWeight:800,
                        border:"1.5px solid", cursor:"pointer", transition:"all .2s", fontFamily:"inherit",
                        borderColor: sel?"transparent":"rgba(255,255,255,.1)",
                        background: sel?`linear-gradient(${svc.grad})`:"rgba(255,255,255,.04)",
                        color:"white",
                      }}>{t}</button>
                    );
                  })}
                </div>
                <button disabled={!date||!time} onClick={()=>setStep(2)} style={{
                  width:"100%", padding:"13px 0", borderRadius:14, border:"none", cursor:date&&time?"pointer":"not-allowed",
                  background: date&&time?`linear-gradient(${svc.grad})`:"rgba(255,255,255,.08)",
                  color:"white", fontWeight:900, fontSize:14, fontFamily:"inherit", transition:"all .2s",
                }}>Continue →</button>
              </>}

              {step===2 && <>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>Your Details</div>
                <textarea value={addr} onChange={e=>setAddr(e.target.value)} rows={3}
                  placeholder="Full address..."
                  style={{ ...inputStyle, resize:"none", marginBottom:10 }}/>
                <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel"
                  placeholder="+91 98765 43210" style={{ ...inputStyle, marginBottom:16 }}/>
                <Glass style={{ padding:14, marginBottom:16 }}>
                  {[["Service",svc.title],["Date",date],["Time",time]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                      <span style={{color:"rgba(255,255,255,.4)",fontWeight:600}}>{k}</span>
                      <span style={{color:"white",fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:8, display:"flex", justifyContent:"space-between", fontSize:14 }}>
                    <span style={{color:"rgba(255,255,255,.4)",fontWeight:600}}>Amount</span>
                    <span style={{fontWeight:900,color:"white"}}>₹{svc.price}{svc.unit||""}</span>
                  </div>
                </Glass>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>setStep(1)} style={{ flex:1, padding:"12px 0", borderRadius:14, border:"1.5px solid rgba(255,255,255,.1)", background:"transparent", color:"rgba(255,255,255,.5)", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>← Back</button>
                  <button disabled={!addr||!phone} onClick={()=>setStep(3)} style={{
                    flex:2, padding:"12px 0", borderRadius:14, border:"none", cursor:addr&&phone?"pointer":"not-allowed",
                    background: addr&&phone?`linear-gradient(${svc.grad})`:"rgba(255,255,255,.08)",
                    color:"white", fontWeight:900, fontSize:14, fontFamily:"inherit",
                  }}>Review →</button>
                </div>
              </>}

              {step===3 && <>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>Confirm Booking</div>
                <Glass style={{ padding:14, marginBottom:12 }}>
                  {[["Service",svc.title],["Date",date],["Time",time],["Address",addr],["Phone",phone]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", gap:16, marginBottom:8, fontSize:12 }}>
                      <span style={{color:"rgba(255,255,255,.35)",fontWeight:600,flexShrink:0}}>{k}</span>
                      <span style={{color:"rgba(255,255,255,.85)",fontWeight:600,textAlign:"right",lineHeight:1.4}}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:10, display:"flex", justifyContent:"space-between" }}>
                    <span style={{color:"rgba(255,255,255,.4)",fontWeight:600}}>Total</span>
                    <span style={{fontWeight:900,color:"white",fontSize:18}}>₹{svc.price}{svc.unit||""}</span>
                  </div>
                </Glass>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(16,185,129,.1)",
                  border:"1px solid rgba(16,185,129,.2)", borderRadius:10, padding:"10px 12px", marginBottom:16, fontSize:12, color:"#34D399" }}>
                  <RiShieldCheckLine size={16}/><span style={{fontWeight:600}}>Pay only after job completion. Zero advance.</span>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>setStep(2)} style={{ flex:1, padding:"12px 0", borderRadius:14, border:"1.5px solid rgba(255,255,255,.1)", background:"transparent", color:"rgba(255,255,255,.5)", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>← Back</button>
                  <button onClick={confirm} style={{ flex:2, padding:"13px 0", borderRadius:14, border:"none", cursor:"pointer", background:`linear-gradient(${svc.grad})`, color:"white", fontWeight:900, fontSize:14, fontFamily:"inherit" }}>Confirm 🎉</button>
                </div>
              </>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   AUTH PAGE
════════════════════════════════════════════════ */
function AuthPage({ onLogin }) {
  const [mode, setMode]   = useState("login");
  const [role, setRole]   = useState("customer");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");

  const roles = [
    { id:"customer", Icon:RiUserLine,      label:"Customer",  desc:"Book services",   grad:"135deg,#6366F1,#8B5CF6" },
    { id:"provider", Icon:RiToolsLine,     label:"Provider",  desc:"Offer skills",    grad:"135deg,#10B981,#059669" },
    { id:"admin",    Icon:RiShieldCheckLine,label:"Admin",    desc:"Manage platform", grad:"135deg,#F59E0B,#EF4444" },
  ];

  const inp = {
    width:"100%", background:"rgba(255,255,255,.05)", border:"1.5px solid rgba(255,255,255,.1)",
    borderRadius:14, padding:"14px 18px", color:"white", fontSize:14, fontWeight:600,
    outline:"none", fontFamily:"inherit",
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{G}</style>
      {/* Left */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40,
        background:"linear-gradient(135deg,#0D1320 0%,#0F172A 100%)", position:"relative", overflow:"hidden" }}>
        {/* Orbs */}
        <div style={{ position:"absolute", top:"15%", left:"20%", width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(99,102,241,.2) 0%,transparent 70%)", filter:"blur(40px)" }}/>
        <div style={{ position:"absolute", bottom:"20%", right:"15%", width:240, height:240, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(139,92,246,.15) 0%,transparent 70%)", filter:"blur(40px)" }}/>

        <div style={{ position:"relative", width:"100%", maxWidth:400 }} className="fadeUp">
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
              display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(99,102,241,.4)" }}>
              <RiHomeLine size={24} color="white"/>
            </div>
            <span style={{ fontSize:22, fontWeight:900, color:"white" }}>
              Service<span style={{ color:"#818CF8" }}>Mate</span>
            </span>
          </div>

          <div style={{ fontSize:28, fontWeight:900, color:"white", lineHeight:1.2, marginBottom:8 }}>
            {mode==="login" ? "Welcome back 👋" : "Join ServiceMate"}
          </div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,.4)", marginBottom:28, fontWeight:500 }}>
            {mode==="login" ? "Sign in to your account" : "Create your account today"}
          </div>

          {/* Role pills */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:24 }}>
            {roles.map(r=>(
              <button key={r.id} onClick={()=>setRole(r.id)} style={{
                padding:"12px 8px", borderRadius:14, border:"1.5px solid", cursor:"pointer", textAlign:"center",
                transition:"all .2s", fontFamily:"inherit",
                borderColor: role===r.id?"transparent":"rgba(255,255,255,.1)",
                background: role===r.id?`linear-gradient(${r.grad})`:"rgba(255,255,255,.04)",
              }}>
                <r.Icon size={18} color="white" style={{ margin:"0 auto 4px" }}/>
                <div style={{ fontSize:12, fontWeight:900, color:"white" }}>{r.label}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", fontWeight:500 }}>{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            {mode==="register" && <input placeholder="Full Name" style={inp}/>}
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={inp}/>
            <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" style={inp}/>
          </div>

          <button onClick={()=>onLogin(role)} style={{
            width:"100%", padding:"15px 0", borderRadius:16, border:"none", cursor:"pointer",
            background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:900,
            fontSize:15, fontFamily:"inherit", marginBottom:16,
            boxShadow:"0 8px 24px rgba(99,102,241,.35)", transition:"all .2s",
          }}>
            {mode==="login" ? `Sign in as ${roles.find(r=>r.id===role)?.label}` : "Create Account"}
          </button>

          {/* Demo */}
          <Glass style={{ padding:14, marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>Quick Demo</div>
            <div style={{ display:"flex", gap:8 }}>
              {roles.map(r=>(
                <button key={r.id} onClick={()=>onLogin(r.id)} style={{
                  flex:1, padding:"9px 0", borderRadius:10, border:"none", cursor:"pointer",
                  background:`linear-gradient(${r.grad})`, color:"white", fontWeight:800, fontSize:12,
                  fontFamily:"inherit", transition:"all .2s",
                }}>
                  <r.Icon size={14} style={{marginBottom:2}}/><br/>{r.label}
                </button>
              ))}
            </div>
          </Glass>

          <div style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,.35)", fontWeight:500 }}>
            {mode==="login" ? "No account? " : "Have an account? "}
            <button onClick={()=>setMode(m=>m==="login"?"register":"login")} style={{
              background:"none", border:"none", color:"#818CF8", fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>
              {mode==="login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>

      {/* Right — decorative */}
      <div className="hidden lg:flex" style={{ width:"45%", background:"linear-gradient(135deg,#6366F1 0%,#8B5CF6 60%,#EC4899 100%)",
        display:"flex", flexDirection:"column", justifyContent:"center", padding:60, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:.15,
          backgroundImage:"radial-gradient(circle at 30% 70%,white 0%,transparent 50%), radial-gradient(circle at 80% 20%,white 0%,transparent 40%)" }}/>
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:38, fontWeight:900, color:"white", lineHeight:1.15, marginBottom:20 }}>
            Your Home.<br/>Our Experts.<br/>Every Time.
          </div>
          <div style={{ fontSize:16, color:"rgba(255,255,255,.7)", lineHeight:1.7, marginBottom:40 }}>
            Bengaluru's most trusted home service platform. Verified pros, same-day service, pay after completion.
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[["50K+","Happy Homes"],["1,200+","Verified Pros"],["4.9 ★","Avg Rating"],["30 min","Avg Response"]].map(([v,l])=>(
              <div key={l} style={{ background:"rgba(255,255,255,.12)", borderRadius:16, padding:16, backdropFilter:"blur(10px)" }}>
                <div style={{ fontSize:22, fontWeight:900, color:"white" }}>{v}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.6)", fontWeight:600, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   LANDING PAGE
════════════════════════════════════════════════ */
function LandingPage({ onLogin, onBook }) {
  const [cat, setCat]     = useState("All");
  const [q, setQ]         = useState("");
  const [revIdx, setRevIdx] = useState(0);

  useEffect(()=>{
    const t = setInterval(()=>setRevIdx(i=>(i+1)%REVIEWS.length), 4200);
    return ()=>clearInterval(t);
  },[]);

  const filtered = SERVICES.filter(s=>(cat==="All"||s.cat===cat)&&s.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#070B14" }}>
      <style>{G}</style>

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:40, background:"rgba(7,11,20,.85)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,.06)", padding:"0 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
              display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(99,102,241,.4)" }}>
              <RiHomeLine size={20} color="white"/>
            </div>
            <span style={{ fontSize:20, fontWeight:900, color:"white" }}>
              Service<span style={{ color:"#818CF8" }}>Mate</span>
            </span>
          </div>

          <div style={{ display:"flex", gap:32 }}>
            {["Services","How it Works","Reviews","Careers"].map(l=>(
              <a key={l} href="#" style={{ color:"rgba(255,255,255,.4)", fontSize:13, fontWeight:700,
                textDecoration:"none", transition:"color .2s" }}>{l}</a>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onLogin} style={{ padding:"9px 20px", borderRadius:10, border:"1.5px solid rgba(255,255,255,.1)",
              background:"transparent", color:"rgba(255,255,255,.6)", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              Login
            </button>
            <button onClick={onLogin} style={{ padding:"9px 20px", borderRadius:10, border:"none",
              background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:900, fontSize:13,
              cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(99,102,241,.3)" }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 60px", display:"grid",
        gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
        <div className="fadeUp">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,.12)",
            border:"1px solid rgba(99,102,241,.25)", borderRadius:99, padding:"8px 16px", marginBottom:24 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#34D399", animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:12, fontWeight:800, color:"#818CF8", textTransform:"uppercase", letterSpacing:1.5 }}>
              Trusted by 50,000+ Bengaluru Homes
            </span>
          </div>

          <h1 style={{ fontSize:"clamp(2.4rem,4.5vw,3.8rem)", fontWeight:900, color:"white",
            lineHeight:1.08, letterSpacing:"-0.02em", marginBottom:20 }}>
            Every Home<br/>Deserves<br/>
            <span style={{ background:"linear-gradient(135deg,#818CF8,#C084FC,#FB7185)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Expert Care.
            </span>
          </h1>

          <p style={{ color:"rgba(255,255,255,.45)", fontSize:17, lineHeight:1.7, marginBottom:32, maxWidth:440, fontWeight:500 }}>
            Book verified professionals for plumbing, electrical, cleaning & more — in under 60 seconds, same-day service.
          </p>

          {/* Search */}
          <div style={{ display:"flex", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)",
            borderRadius:16, overflow:"hidden", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", paddingLeft:16, color:"rgba(255,255,255,.3)" }}>
              <RiSearchLine size={20}/>
            </div>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search a service..."
              style={{ flex:1, padding:"14px 14px", background:"transparent", border:"none", color:"white",
                fontSize:14, fontWeight:600, outline:"none", fontFamily:"inherit" }}/>
            <button style={{ margin:6, padding:"0 20px", borderRadius:10, border:"none",
              background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:900, fontSize:13,
              cursor:"pointer", fontFamily:"inherit" }}>
              Search
            </button>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {["Plumbing","AC Service","Home Cleaning","Electrician"].map(x=>(
              <button key={x} onClick={()=>setQ(x)} style={{
                padding:"7px 14px", borderRadius:99, border:"1.5px solid rgba(255,255,255,.1)",
                background:"rgba(255,255,255,.04)", color:"rgba(255,255,255,.5)", fontSize:12, fontWeight:700,
                cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
              }}>{x}</button>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="fadeUp" style={{ animationDelay:"150ms", position:"relative" }}>
          <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08))",
            borderRadius:28, padding:28, border:"1px solid rgba(255,255,255,.08)" }}>
            <Glass style={{ padding:20, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#3B82F6,#06B6D4)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <RiDropLine size={22} color="white"/>
                </div>
                <div>
                  <div style={{ fontWeight:800, color:"white", fontSize:15 }}>Plumbing Service</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.4)" }}>Today · 11:00 AM</div>
                </div>
                <Pill status="ongoing"/>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.05)",
                borderRadius:12, padding:"10px 14px" }}>
                <Av initials="RK" grad="135deg,#3B82F6,#06B6D4" size={36}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:13, color:"white" }}>Ravi Kumar</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>⭐ 4.98 · 1,240 jobs</div>
                </div>
                <span style={{ fontSize:11, fontWeight:800, color:"#34D399", background:"rgba(16,185,129,.12)",
                  padding:"5px 10px", borderRadius:99 }}>On the way 🚗</span>
              </div>
            </Glass>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Glass style={{ padding:16, textAlign:"center" }}>
                <RiStarFill size={20} color="#FBBF24" style={{margin:"0 auto 6px"}}/>
                <div style={{ fontWeight:900, color:"white", fontSize:18 }}>4.9</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600 }}>Avg Rating</div>
              </Glass>
              <div style={{ background:"linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius:16, padding:16, textAlign:"center" }}>
                <RiVerifiedBadgeLine size={20} color="white" style={{margin:"0 auto 6px"}}/>
                <div style={{ fontWeight:900, color:"white", fontSize:18 }}>100%</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:600 }}>Verified Pros</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background:"rgba(255,255,255,.03)", borderTop:"1px solid rgba(255,255,255,.05)", borderBottom:"1px solid rgba(255,255,255,.05)", padding:"24px 24px" }}>
        <div style={{ maxWidth:800, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }}>
          {[["50K+","Happy Homes",RiHome2Line,"135deg,#6366F1,#8B5CF6"],["1,200+","Verified Pros",RiVerifiedBadgeLine,"135deg,#10B981,#059669"],["4.9★","Avg Rating",RiStarLine,"135deg,#F59E0B,#EF4444"],["30 min","Response Time",RiTimeLine,"135deg,#06B6D4,#6366F1"]].map(([v,l,Icon,grad],i)=>(
            <div key={l} style={{ textAlign:"center", padding:"0 20px", borderRight: i<3?"1px solid rgba(255,255,255,.07)":"none" }}>
              <Icon size={20} color="#818CF8" style={{margin:"0 auto 6px"}}/>
              <div style={{ fontSize:22, fontWeight:900, color:"white" }}>{v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"64px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32, flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:900, color:"#818CF8", textTransform:"uppercase", letterSpacing:2, marginBottom:6 }}>Services</div>
            <h2 style={{ fontSize:32, fontWeight:900, color:"white" }}>Everything Your Home Needs</h2>
            <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, fontWeight:500, marginTop:4 }}>{filtered.length} services available</p>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{
                padding:"8px 16px", borderRadius:99, border:"1.5px solid", fontSize:13, fontWeight:800,
                cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
                borderColor: cat===c?"transparent":"rgba(255,255,255,.1)",
                background: cat===c?"linear-gradient(135deg,#6366F1,#8B5CF6)":"rgba(255,255,255,.04)",
                color: cat===c?"white":"rgba(255,255,255,.4)",
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {filtered.map((s,i)=>(
            <Glass key={s.id} className="card-hover" style={{ padding:20, cursor:"pointer", animationDelay:`${i*40}ms` }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(${s.grad})`,
                display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14,
                boxShadow:`0 6px 20px rgba(0,0,0,.4)` }}>
                <s.Icon size={22} color="white"/>
              </div>
              <div style={{ fontWeight:900, color:"white", fontSize:15, marginBottom:4 }}>{s.title}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginBottom:10, fontWeight:500 }}>{s.desc}</div>
              <div style={{ display:"flex", gap:1, marginBottom:12 }}>
                {[1,2,3,4,5].map(j=><RiStarFill key={j} size={11} color={j<=5?"#FBBF24":"rgba(255,255,255,.1)"}/>)}
                <span style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginLeft:4, fontWeight:700 }}>4.9</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12,
                borderTop:"1px solid rgba(255,255,255,.07)" }}>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", fontWeight:600 }}>FROM</div>
                  <div style={{ fontWeight:900, fontSize:15, color:"white" }}>₹{s.price}{s.unit||""}</div>
                </div>
                <button onClick={()=>onBook(s)} style={{
                  padding:"8px 16px", borderRadius:10, border:"none",
                  background:`linear-gradient(${s.grad})`, color:"white", fontWeight:900, fontSize:12,
                  cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4,
                }}>Book <RiArrowRightLine size={13}/></button>
              </div>
            </Glass>
          ))}
        </div>
        {filtered.length===0&&(
          <div style={{ textAlign:"center", padding:"80px 0", color:"rgba(255,255,255,.3)" }}>
            <RiSearchLine size={40} style={{margin:"0 auto 12px"}}/>
            <div style={{ fontWeight:800, fontSize:18, color:"white" }}>No services found</div>
            <button onClick={()=>{setQ("");setCat("All");}} style={{ marginTop:12, background:"none", border:"none",
              color:"#818CF8", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Clear filters</button>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background:"rgba(255,255,255,.02)", borderTop:"1px solid rgba(255,255,255,.05)", padding:"64px 24px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:900, color:"#818CF8", textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Simple Process</div>
          <h2 style={{ fontSize:32, fontWeight:900, color:"white", marginBottom:48 }}>How It Works</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {[
              [RiSearchLine,"01","Browse","Find from 50+ services"],
              [RiCalendarLine,"02","Schedule","Pick date & time"],
              [RiBriefcaseLine,"03","Pro Arrives","Expert at your door"],
              [RiCheckLine,"04","Pay Later","After job is done"],
            ].map(([Icon,n,t,d],i)=>(
              <div key={n} style={{ textAlign:"center", position:"relative" }}>
                {i<3&&<div style={{ position:"absolute", top:24, left:"60%", width:"80%", height:1,
                  background:"linear-gradient(90deg,rgba(99,102,241,.4),rgba(139,92,246,.2))" }}/>}
                <div style={{ width:56, height:56, borderRadius:16, background:"rgba(99,102,241,.12)",
                  border:"1.5px solid rgba(99,102,241,.25)", display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 12px", position:"relative", zIndex:1 }}>
                  <Icon size={24} color="#818CF8"/>
                </div>
                <div style={{ fontSize:10, fontWeight:900, color:"#818CF8", marginBottom:4, textTransform:"uppercase", letterSpacing:1.5 }}>STEP {n}</div>
                <div style={{ fontWeight:800, color:"white", fontSize:14, marginBottom:4 }}>{t}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", fontWeight:500 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"64px 24px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:11, fontWeight:900, color:"#818CF8", textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Reviews</div>
          <h2 style={{ fontSize:32, fontWeight:900, color:"white" }}>What Our Customers Say</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {REVIEWS.slice(0,3).map((r,i)=>(
            <Glass key={r.id} className="card-hover" style={{ padding:24, animationDelay:`${i*80}ms` }}>
              <Stars n={r.stars} size={14}/>
              <p style={{ color:"rgba(255,255,255,.6)", fontSize:14, lineHeight:1.7, margin:"14px 0 16px", fontWeight:500 }}>"{r.text}"</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontWeight:800, color:"white", fontSize:14 }}>{r.customer}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", fontWeight:600 }}>{r.service}</div>
                </div>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.3)", fontWeight:600 }}>{r.date}</span>
              </div>
            </Glass>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"0 24px 80px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", borderRadius:28, padding:"56px 48px", textAlign:"center",
          background:"linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#EC4899 100%)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, opacity:.15,
            backgroundImage:"radial-gradient(circle at 25% 50%,white 0%,transparent 55%)" }}/>
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,.7)", textTransform:"uppercase", letterSpacing:2, marginBottom:12 }}>Limited Offer</div>
            <h2 style={{ fontSize:36, fontWeight:900, color:"white", marginBottom:8 }}>First Booking? 15% OFF.</h2>
            <p style={{ color:"rgba(255,255,255,.7)", fontSize:16, marginBottom:32 }}>Auto-applied. No code needed.</p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button onClick={onLogin} style={{ padding:"14px 32px", borderRadius:16, border:"none",
                background:"white", color:"#6366F1", fontWeight:900, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
                Book a Service ✨
              </button>
              <button style={{ padding:"14px 32px", borderRadius:16, border:"2px solid rgba(255,255,255,.3)",
                background:"transparent", color:"white", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
                View All Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#040710", borderTop:"1px solid rgba(255,255,255,.06)", padding:"48px 24px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:40, marginBottom:40 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}><RiHomeLine size={18} color="white"/></div>
                <span style={{ fontWeight:900, color:"white", fontSize:18 }}>Service<span style={{color:"#818CF8"}}>Mate</span></span>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.3)", lineHeight:1.7, fontWeight:500 }}>
                Bengaluru's most trusted home service platform. Verified pros, quality guaranteed.
              </p>
            </div>
            {[{h:"Services",ls:["Plumbing","Electrician","AC Service","Cleaning","Pest Control"]},
              {h:"Company", ls:["About","Careers","Blog","Press"]},
              {h:"Support",  ls:["Help Center","Contact","Privacy","Terms"]}].map(c=>(
              <div key={c.h}>
                <div style={{ fontWeight:900, color:"white", fontSize:14, marginBottom:16 }}>{c.h}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {c.ls.map(l=><a key={l} href="#" style={{ fontSize:13, color:"rgba(255,255,255,.3)", fontWeight:600, textDecoration:"none" }}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:20, display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,.2)", fontWeight:600 }}>
            <span>© 2026 ServiceMate. All rights reserved.</span>
            <span>Made with ❤️ for Bengaluru</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════
   CUSTOMER DASHBOARD
════════════════════════════════════════════════ */
function CustomerDashboard({ onLogout, onBook }) {
  const [page, setPage]         = useState("home");
  const [chatMsg, setChatMsg]   = useState("");
  const [msgs, setMsgs]         = useState(MESSAGES_INIT);
  const [ratingVal, setRating]  = useState(5);
  const [reviewTxt, setRevTxt]  = useState("");
  const [reviewDone, setRevDone]= useState(false);
  const chatRef = useRef(null);

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[msgs,page]);

  const sendMsg = () => {
    if(!chatMsg.trim()) return;
    setMsgs(m=>[...m,{id:Date.now(),from:"Me",av:"MI",grad:"135deg,#6366F1,#8B5CF6",text:chatMsg,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),mine:true}]);
    setChatMsg("");
    setTimeout(()=>setMsgs(m=>[...m,{id:Date.now()+1,from:"Ravi Kumar",av:"RK",grad:"135deg,#3B82F6,#06B6D4",text:"Got it! On my way.",time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),mine:false}]),1200);
  };

  const myBookings = BOOKINGS.filter(b=>b.customer==="Meera Iyer");

  const navItems = [
    {id:"home",    Icon:RiDashboardLine, label:"Dashboard"},
    {id:"bookings",Icon:RiListCheck2,    label:"Bookings", badge:myBookings.filter(b=>b.status==="scheduled").length||undefined},
    {id:"tracking",Icon:RiMapPinLine,    label:"Track Job"},
    {id:"chat",    Icon:RiMessage2Line,  label:"Messages"},
    {id:"reviews", Icon:RiStarLine,      label:"Reviews"},
    {id:"profile", Icon:RiUserLine,      label:"Profile"},
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#070B14" }}>
      <style>{G}</style>

      {/* Sidebar */}
      <aside style={{ width:240, background:"#0A0F1E", borderRight:"1px solid rgba(255,255,255,.06)",
        display:"flex", flexDirection:"column", padding:16, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 8px", marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
            display:"flex", alignItems:"center", justifyContent:"center" }}><RiHomeLine size={18} color="white"/></div>
          <span style={{ fontWeight:900, color:"white", fontSize:17 }}>Service<span style={{color:"#818CF8"}}>Mate</span></span>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
          {navItems.map(n=><SNavItem key={n.id} Icon={n.Icon} label={n.label} active={page===n.id} onClick={()=>setPage(n.id)} badge={n.badge} accent="#6366F1"/>)}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:8 }}>
            <Av initials="MI" grad="135deg,#6366F1,#8B5CF6" size={36}/>
            <div>
              <div style={{ fontWeight:800, fontSize:13, color:"white" }}>Meera Iyer</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>Customer</div>
            </div>
          </div>
          <SNavItem Icon={RiLogoutBoxLine} label="Logout" active={false} onClick={onLogout} accent="#EF4444"/>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflowY:"auto", background:"#070B14" }}>
        {/* Topbar */}
        <div style={{ background:"#0A0F1E", borderBottom:"1px solid rgba(255,255,255,.06)",
          padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10 }}>
          <h1 style={{ fontSize:20, fontWeight:900, color:"white" }}>
            {navItems.find(n=>n.id===page)?.label}
          </h1>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.05)",
              border:"1px solid rgba(255,255,255,.08)", display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", color:"rgba(255,255,255,.5)" }}><RiNotificationLine size={18}/></button>
            {page==="home"&&<button onClick={()=>onBook(SERVICES[0])} style={{
              padding:"9px 18px", borderRadius:10, border:"none",
              background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:900, fontSize:13,
              cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6,
            }}><RiAddLine size={16}/>New Booking</button>}
          </div>
        </div>

        <div style={{ padding:28 }}>
          {/* HOME */}
          {page==="home" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                <StatCard Icon={RiCalendarLine}        label="Total Bookings" value={myBookings.length}                                     grad="135deg,#6366F1,#8B5CF6" delay={0}/>
                <StatCard Icon={RiCheckLine}           label="Completed"      value={myBookings.filter(b=>b.status==="completed").length}    grad="135deg,#10B981,#059669" delay={60} sub="+2 this month"/>
                <StatCard Icon={RiRefreshLine}         label="Upcoming"       value={myBookings.filter(b=>b.status==="scheduled").length}    grad="135deg,#F59E0B,#EF4444" delay={120}/>
                <StatCard Icon={RiStarLine}            label="Reviews Given"  value={myBookings.filter(b=>b.status==="completed").length-1}  grad="135deg,#EC4899,#F43F5E" delay={180}/>
              </div>

              {/* Active job banner */}
              {myBookings.filter(b=>b.status==="ongoing").map(b=>(
                <div key={b.id} style={{ borderRadius:20, padding:24, position:"relative", overflow:"hidden",
                  background:"linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                  <div style={{ position:"absolute", right:-40, top:-40, width:180, height:180, borderRadius:"50%",
                    background:"rgba(255,255,255,.07)" }}/>
                  <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,.7)", textTransform:"uppercase",
                    letterSpacing:2, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"#34D399", animation:"pulse 1.5s infinite" }}/>
                    Active Booking
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
                    <div>
                      <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:4 }}>{b.service}</div>
                      <div style={{ color:"rgba(255,255,255,.6)", fontSize:13 }}>{b.date} · {b.time}</div>
                      <div style={{ color:"rgba(255,255,255,.6)", fontSize:13 }}>{b.address||"15, 7th Main, HSR Layout"}</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>setPage("tracking")} style={{ padding:"10px 18px", borderRadius:12, border:"none",
                        background:"white", color:"#6366F1", fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"inherit",
                        display:"flex", alignItems:"center", gap:6 }}>
                        <RiMapPinLine size={15}/>Track
                      </button>
                      <button onClick={()=>setPage("chat")} style={{ padding:"10px 18px", borderRadius:12,
                        border:"2px solid rgba(255,255,255,.3)", background:"transparent", color:"white",
                        fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"inherit",
                        display:"flex", alignItems:"center", gap:6 }}>
                        <RiMessage2Line size={15}/>Chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                {/* Quick book */}
                <Glass style={{ padding:20 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:16 }}>Quick Book</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                    {SERVICES.slice(0,6).map(s=>(
                      <button key={s.id} onClick={()=>onBook(s)} style={{
                        background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:14,
                        padding:"12px 8px", textAlign:"center", cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
                      }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(${s.grad})`,
                          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px" }}>
                          <s.Icon size={18} color="white"/>
                        </div>
                        <div style={{ fontSize:11, fontWeight:800, color:"white" }}>{s.title}</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", fontWeight:700, marginTop:2 }}>₹{s.price}</div>
                      </button>
                    ))}
                  </div>
                </Glass>

                {/* Recent bookings */}
                <Glass style={{ padding:20 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:16 }}>Recent Bookings</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {myBookings.slice(0,4).map(b=>(
                      <div key={b.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
                        background:"rgba(255,255,255,.04)", borderRadius:12 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(${SERVICES.find(s=>s.title===b.service)?.grad||"135deg,#6366F1,#8B5CF6"})`,
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {(() => { const Ic = SERVICES.find(s=>s.title===b.service)?.Icon||RiToolsLine; return <Ic size={16} color="white"/>; })()}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:800, fontSize:13, color:"white" }}>{b.service}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:500 }}>{b.date} · {b.provider}</div>
                        </div>
                        <Pill status={b.status}/>
                      </div>
                    ))}
                  </div>
                </Glass>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {page==="bookings" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {BOOKINGS.filter(b=>b.customer==="Meera Iyer").map(b=>(
                <Glass key={b.id} style={{ padding:20 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(${SERVICES.find(s=>s.title===b.service)?.grad||"135deg,#6366F1,#8B5CF6"})`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {(() => { const Ic = SERVICES.find(s=>s.title===b.service)?.Icon||RiToolsLine; return <Ic size={22} color="white"/>; })()}
                      </div>
                      <div>
                        <div style={{ fontWeight:900, color:"white", fontSize:16 }}>{b.service}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginTop:2 }}>{b.date} · {b.time} · {b.id}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <Pill status={b.status}/>
                      <div style={{ fontWeight:900, color:"white", fontSize:18, marginTop:8 }}>₹{b.amount}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.04)",
                    borderRadius:12, padding:"10px 14px", marginBottom: b.status==="ongoing"?12:0 }}>
                    <Av initials={PROVIDERS.find(p=>p.name===b.provider)?.av||"??"} grad={PROVIDERS.find(p=>p.name===b.provider)?.grad||"135deg,#6366F1,#8B5CF6"} size={32}/>
                    <div style={{ fontWeight:700, fontSize:13, color:"rgba(255,255,255,.7)" }}>{b.provider}</div>
                    {b.status==="ongoing"&&<button onClick={()=>setPage("chat")} style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:8, border:"none",
                      background:"rgba(99,102,241,.2)", color:"#818CF8", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit",
                      display:"flex", alignItems:"center", gap:4 }}><RiMessage2Line size={13}/>Chat</button>}
                  </div>
                  {b.status==="completed"&&<button onClick={()=>setPage("reviews")} style={{ marginTop:10, background:"none", border:"none",
                    color:"#818CF8", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                    display:"flex", alignItems:"center", gap:4 }}><RiStarLine size={14}/>Write a Review</button>}
                </Glass>
              ))}
            </div>
          )}

          {/* TRACKING */}
          {page==="tracking" && (
            <div style={{ maxWidth:520, display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ borderRadius:20, padding:24, textAlign:"center",
                background:"linear-gradient(135deg,#6366F1,#8B5CF6)" }}>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.6)", marginBottom:4, fontWeight:700 }}>BK002</div>
                <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:4 }}>Electrician Service</div>
                <div style={{ color:"rgba(255,255,255,.6)", fontSize:14 }}>Anita Sharma · Today, 2:00 PM</div>
              </div>

              <Glass style={{ padding:24 }}>
                <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:20 }}>Live Status</div>
                {[
                  {label:"Booking Confirmed",sub:"Your booking has been confirmed",      done:true, active:false},
                  {label:"Pro Assigned",     sub:"Anita Sharma assigned to your job",    done:true, active:false},
                  {label:"Pro On the Way",   sub:"ETA: 15 minutes · 3.2 km away",        done:false,active:true},
                  {label:"Job in Progress",  sub:"Service started",                       done:false,active:false},
                  {label:"Job Completed",    sub:"Rate your experience",                  done:false,active:false},
                ].map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:16, paddingBottom: i<4?20:0 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0,
                        background: s.done?"linear-gradient(135deg,#6366F1,#8B5CF6)": s.active?"rgba(245,158,11,.2)":"rgba(255,255,255,.06)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        border: s.active?"1.5px solid #F59E0B":"1.5px solid transparent",
                      }}>
                        {s.done ? <RiCheckLine size={16} color="white"/> :
                         s.active ? <div style={{ width:8, height:8, borderRadius:"50%", background:"#F59E0B", animation:"pulse 1.5s infinite" }}/> :
                         <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.25)" }}>{i+1}</span>}
                      </div>
                      {i<4&&<div style={{ width:2, flex:1, marginTop:4, borderRadius:99,
                        background: s.done?"linear-gradient(#6366F1,#8B5CF6)":"rgba(255,255,255,.07)" }}/>}
                    </div>
                    <div style={{ paddingBottom:4 }}>
                      <div style={{ fontWeight:800, fontSize:14, color: s.done||s.active?"white":"rgba(255,255,255,.25)" }}>{s.label}</div>
                      <div style={{ fontSize:12, marginTop:2, color: s.active?"#FBBF24":"rgba(255,255,255,.25)", fontWeight:500 }}>{s.sub}</div>
                      {s.active&&<span style={{ display:"inline-block", marginTop:4, fontSize:10, fontWeight:900,
                        padding:"3px 8px", borderRadius:99, background:"rgba(245,158,11,.15)", color:"#FCD34D",
                        animation:"pulse 1.5s infinite", textTransform:"uppercase", letterSpacing:1 }}>LIVE</span>}
                    </div>
                  </div>
                ))}
              </Glass>

              <Glass style={{ padding:18, display:"flex", alignItems:"center", gap:14 }}>
                <Av initials="AS" grad="135deg,#F59E0B,#EF4444" size={48}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:15 }}>Anita Sharma</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:2 }}>⭐ 4.95 · Electrician</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.4)" }}>+91 87654 32109</div>
                </div>
                <button onClick={()=>setPage("chat")} style={{ padding:"10px 18px", borderRadius:12, border:"none",
                  background:"rgba(99,102,241,.2)", color:"#818CF8", fontWeight:900, fontSize:13, cursor:"pointer",
                  fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                  <RiMessage2Line size={15}/>Chat
                </button>
              </Glass>
            </div>
          )}

          {/* CHAT */}
          {page==="chat" && (
            <div style={{ maxWidth:560, height:"calc(100vh - 130px)", display:"flex", flexDirection:"column",
              background:"#0A0F1E", borderRadius:20, border:"1px solid rgba(255,255,255,.08)", overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px",
                borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                <Av initials="RK" grad="135deg,#3B82F6,#06B6D4" size={40}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:14 }}>Ravi Kumar</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#34D399" }}/>
                    <span style={{ fontSize:11, color:"#34D399", fontWeight:700 }}>Online</span>
                  </div>
                </div>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.3)", background:"rgba(255,255,255,.06)",
                  padding:"5px 10px", borderRadius:99, fontWeight:700 }}>BK001 · Plumbing</span>
              </div>

              <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
                {msgs.map(m=>(
                  <div key={m.id} style={{ display:"flex", gap:10, flexDirection: m.mine?"row-reverse":"row" }}>
                    {!m.mine&&<Av initials={m.av} grad={m.grad} size={32}/>}
                    <div style={{ maxWidth:"70%" }}>
                      <div style={{ padding:"10px 14px", borderRadius:16, fontSize:13, fontWeight:600, lineHeight:1.5,
                        background: m.mine?"linear-gradient(135deg,#6366F1,#8B5CF6)":"rgba(255,255,255,.07)",
                        color:"rgba(255,255,255,.9)",
                        borderBottomRightRadius: m.mine?4:16, borderBottomLeftRadius: m.mine?16:4,
                      }}>{m.text}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", marginTop:4, fontWeight:600,
                        textAlign: m.mine?"right":"left", padding:"0 4px" }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", gap:10 }}>
                <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Type a message..."
                  style={{ flex:1, background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)",
                    borderRadius:12, padding:"11px 16px", color:"white", fontSize:13, fontWeight:600,
                    outline:"none", fontFamily:"inherit" }}/>
                <button onClick={sendMsg} style={{ width:40, height:40, borderRadius:12, border:"none",
                  background:"linear-gradient(135deg,#6366F1,#8B5CF6)", display:"flex", alignItems:"center",
                  justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                  <RiSendPlaneLine size={18} color="white"/>
                </button>
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {page==="reviews" && (
            <div style={{ maxWidth:600, display:"flex", flexDirection:"column", gap:16 }}>
              {!reviewDone ? (
                <Glass style={{ padding:24 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:18, marginBottom:16 }}>Write a Review</div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,.05)",
                    borderRadius:14, padding:"12px 16px", marginBottom:20 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#3B82F6,#06B6D4)",
                      display:"flex", alignItems:"center", justifyContent:"center" }}><RiDropLine size={20} color="white"/></div>
                    <div>
                      <div style={{ fontWeight:800, color:"white", fontSize:14 }}>Plumbing · Ravi Kumar</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,.35)" }}>BK001 · Mar 20</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:800, color:"rgba(255,255,255,.5)", marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Your Rating</div>
                  <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                    {[1,2,3,4,5].map(i=>(
                      <button key={i} onClick={()=>setRating(i)} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
                        <RiStarFill size={32} color={i<=ratingVal?"#FBBF24":"rgba(255,255,255,.1)"}/>
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewTxt} onChange={e=>setRevTxt(e.target.value)} rows={4}
                    placeholder="Share your experience..."
                    style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)",
                      borderRadius:14, padding:"14px 16px", color:"white", fontSize:13, fontWeight:600,
                      outline:"none", resize:"none", fontFamily:"inherit", marginBottom:16 }}/>
                  <button onClick={()=>setRevDone(true)} disabled={!reviewTxt} style={{
                    padding:"12px 24px", borderRadius:12, border:"none", cursor:reviewTxt?"pointer":"not-allowed",
                    background:reviewTxt?"linear-gradient(135deg,#6366F1,#8B5CF6)":"rgba(255,255,255,.08)",
                    color:"white", fontWeight:900, fontSize:14, fontFamily:"inherit",
                  }}>Submit Review</button>
                </Glass>
              ) : (
                <Glass style={{ padding:32, textAlign:"center" }}>
                  <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(16,185,129,.15)",
                    display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                    <RiCheckLine size={28} color="#34D399"/>
                  </div>
                  <div style={{ fontWeight:900, color:"white", fontSize:18 }}>Review Submitted!</div>
                  <div style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginTop:4 }}>Thank you for your feedback.</div>
                </Glass>
              )}
              {REVIEWS.filter(r=>r.customer==="Meera Iyer").map(r=>(
                <Glass key={r.id} style={{ padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:900, color:"white", fontSize:14 }}>{r.service} · {r.provider}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:2 }}>{r.date}</div>
                    </div>
                    <Stars n={r.stars}/>
                  </div>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,.55)", lineHeight:1.6 }}>"{r.text}"</p>
                </Glass>
              ))}
            </div>
          )}

          {/* PROFILE */}
          {page==="profile" && (
            <div style={{ maxWidth:500, display:"flex", flexDirection:"column", gap:16 }}>
              <Glass style={{ padding:28, textAlign:"center" }}>
                <Av initials="MI" grad="135deg,#6366F1,#8B5CF6" size={80}/>
                <div style={{ fontWeight:900, color:"white", fontSize:22, marginTop:14 }}>Meera Iyer</div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginTop:4 }}>meera@email.com</div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:13 }}>+91 99887 76655 · Indiranagar</div>
                <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:16 }}>
                  {[["12","Bookings"],["4","Reviews"],["4.8","Avg Rating"]].map(([v,l])=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:900, color:"white", fontSize:20 }}>{v}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Glass>
              <Glass style={{ padding:24 }}>
                <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:16 }}>Edit Profile</div>
                {[["Full Name","Meera Iyer"],["Email","meera@email.com"],["Phone","+91 99887 76655"],["Area","Indiranagar, Bengaluru"]].map(([l,v])=>(
                  <div key={l} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>{l}</div>
                    <input defaultValue={v} style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)",
                      borderRadius:12, padding:"11px 16px", color:"white", fontSize:13, fontWeight:600, outline:"none", fontFamily:"inherit" }}/>
                  </div>
                ))}
                <button style={{ padding:"12px 24px", borderRadius:12, border:"none", cursor:"pointer",
                  background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:900, fontSize:14, fontFamily:"inherit" }}>
                  Save Changes
                </button>
              </Glass>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PROVIDER DASHBOARD
════════════════════════════════════════════════ */
function ProviderDashboard({ onLogout }) {
  const [page, setPage]       = useState("home");
  const [chatMsg, setChatMsg] = useState("");
  const [msgs, setMsgs]       = useState(MESSAGES_INIT.map(m=>({...m,mine:!m.mine})));
  const [avail, setAvail]     = useState(true);
  const chatRef = useRef(null);
  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[msgs,page]);

  const sendMsg = () => {
    if(!chatMsg.trim()) return;
    setMsgs(m=>[...m,{id:Date.now(),from:"Me",av:"RK",grad:"135deg,#3B82F6,#06B6D4",text:chatMsg,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),mine:true}]);
    setChatMsg("");
    setTimeout(()=>setMsgs(m=>[...m,{id:Date.now()+1,from:"Meera Iyer",av:"MI",grad:"135deg,#6366F1,#8B5CF6",text:"Thank you! See you soon.",time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),mine:false}]),1200);
  };

  const myJobs = BOOKINGS.filter(b=>b.provider==="Ravi Kumar");

  const navItems = [
    {id:"home",     Icon:RiDashboardLine, label:"Dashboard"},
    {id:"jobs",     Icon:RiBriefcaseLine, label:"My Jobs", badge:myJobs.filter(b=>b.status==="scheduled").length||undefined},
    {id:"earnings", Icon:RiMoneyDollarCircleLine, label:"Earnings"},
    {id:"chat",     Icon:RiMessage2Line,  label:"Messages"},
    {id:"reviews",  Icon:RiStarLine,      label:"Reviews"},
    {id:"profile",  Icon:RiUserLine,      label:"Profile"},
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#070B14" }}>
      <style>{G}</style>

      <aside style={{ width:240, background:"#0A0F1E", borderRight:"1px solid rgba(255,255,255,.06)",
        display:"flex", flexDirection:"column", padding:16, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 8px", marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#10B981,#059669)",
            display:"flex", alignItems:"center", justifyContent:"center" }}><RiToolsLine size={18} color="white"/></div>
          <span style={{ fontWeight:900, color:"white", fontSize:17 }}>Service<span style={{color:"#34D399"}}>Mate</span></span>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
          {navItems.map(n=><SNavItem key={n.id} Icon={n.Icon} label={n.label} active={page===n.id} onClick={()=>setPage(n.id)} badge={n.badge} accent="#10B981"/>)}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px 14px" }}>
            <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,.4)" }}>Available</div>
            <button onClick={()=>setAvail(a=>!a)} style={{ width:44, height:24, borderRadius:99, border:"none",
              background: avail?"#10B981":"rgba(255,255,255,.1)", cursor:"pointer", position:"relative", transition:"all .3s" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:"white", position:"absolute",
                top:3, transition:"all .3s", left: avail?"23px":"3px" }}/>
            </button>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:8 }}>
            <Av initials="RK" grad="135deg,#3B82F6,#06B6D4" size={36}/>
            <div>
              <div style={{ fontWeight:800, fontSize:13, color:"white" }}>Ravi Kumar</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>Master Plumber</div>
            </div>
          </div>
          <SNavItem Icon={RiLogoutBoxLine} label="Logout" active={false} onClick={onLogout} accent="#EF4444"/>
        </div>
      </aside>

      <main style={{ flex:1, overflowY:"auto", background:"#070B14" }}>
        <div style={{ background:"#0A0F1E", borderBottom:"1px solid rgba(255,255,255,.06)",
          padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10 }}>
          <h1 style={{ fontSize:20, fontWeight:900, color:"white" }}>{navItems.find(n=>n.id===page)?.label}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background: avail?"#34D399":"rgba(255,255,255,.2)" }}/>
            <span style={{ fontSize:13, fontWeight:800, color: avail?"#34D399":"rgba(255,255,255,.3)" }}>{avail?"Online · Available":"Offline"}</span>
          </div>
        </div>

        <div style={{ padding:28 }}>
          {page==="home" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                <StatCard Icon={RiMoneyDollarCircleLine} label="This Month"    value="₹42,000" grad="135deg,#10B981,#059669" delay={0}  sub="+12%"/>
                <StatCard Icon={RiCheckLine}             label="Jobs Done"     value={myJobs.filter(b=>b.status==="completed").length} grad="135deg,#6366F1,#8B5CF6" delay={60}/>
                <StatCard Icon={RiStarFill}              label="Avg Rating"    value="4.98"    grad="135deg,#F59E0B,#EF4444" delay={120}/>
                <StatCard Icon={RiTimeLine}              label="Upcoming Jobs" value={myJobs.filter(b=>b.status==="scheduled").length} grad="135deg,#EC4899,#F43F5E" delay={180}/>
              </div>

              {myJobs.filter(b=>b.status==="scheduled"||b.status==="ongoing").map(b=>(
                <Glass key={b.id} style={{ padding:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
                    <Pill status={b.status}/>
                    <span style={{ fontWeight:900, color:"white", fontSize:16, marginLeft:4 }}>{b.service}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
                    {[[RiUserLine,b.customer],[RiMapPinLine,b.address||"HSR Layout"],[RiTimeLine,`${b.date} · ${b.time}`]].map(([Icon,val],i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.05)",
                        borderRadius:10, padding:"10px 12px" }}>
                        <Icon size={15} color="rgba(255,255,255,.4)"/>
                        <span style={{ fontSize:12, color:"rgba(255,255,255,.6)", fontWeight:600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setPage("chat")} style={{ flex:1, padding:"10px 0", borderRadius:10,
                      border:"1.5px solid rgba(99,102,241,.3)", background:"rgba(99,102,241,.1)", color:"#818CF8",
                      fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"inherit",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <RiMessage2Line size={15}/>Chat
                    </button>
                    <button style={{ flex:2, padding:"10px 0", borderRadius:10, border:"none",
                      background:"linear-gradient(135deg,#10B981,#059669)", color:"white",
                      fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"inherit",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <RiCheckLine size={15}/>Mark Complete
                    </button>
                  </div>
                </Glass>
              ))}

              <Glass style={{ padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:16 }}>Earnings (Last 6 Months)</div>
                  <span style={{ fontSize:11, fontWeight:900, color:"#34D399", background:"rgba(16,185,129,.12)", padding:"4px 10px", borderRadius:99 }}>+12% growth</span>
                </div>
                <BarChart data={EARNING_DATA} color="#10B981"/>
              </Glass>
            </div>
          )}

          {page==="jobs" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {myJobs.map(b=>(
                <Glass key={b.id} style={{ padding:18 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44, height:44, borderRadius:12, flexShrink:0,
                        background:`linear-gradient(${SERVICES.find(s=>s.title===b.service)?.grad||"135deg,#6366F1,#8B5CF6"})`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {(()=>{const Ic=SERVICES.find(s=>s.title===b.service)?.Icon||RiToolsLine; return <Ic size={20} color="white"/>;})()}
                      </div>
                      <div>
                        <div style={{ fontWeight:900, color:"white", fontSize:15 }}>{b.service}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginTop:2 }}>{b.date} · {b.time}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Pill status={b.status}/>
                      <span style={{ fontWeight:900, color:"white", fontSize:16 }}>₹{b.amount}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, background:"rgba(255,255,255,.04)", borderRadius:10, padding:"10px 14px" }}>
                    <RiUserLine size={14} color="rgba(255,255,255,.4)"/><span style={{ fontSize:12, color:"rgba(255,255,255,.5)", fontWeight:600 }}>{b.customer}</span>
                    <span style={{ color:"rgba(255,255,255,.1)", margin:"0 4px" }}>·</span>
                    <RiMapPinLine size={14} color="rgba(255,255,255,.4)"/><span style={{ fontSize:12, color:"rgba(255,255,255,.5)", fontWeight:600 }}>HSR Layout</span>
                  </div>
                </Glass>
              ))}
            </div>
          )}

          {page==="earnings" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                <StatCard Icon={RiMoneyDollarCircleLine} label="This Month"  value="₹42,000"   grad="135deg,#10B981,#059669" sub="+12%"/>
                <StatCard Icon={RiBarChartLine}          label="This Year"   value="₹3,94,000" grad="135deg,#6366F1,#8B5CF6"/>
                <StatCard Icon={RiTrophyLine}            label="Total Earned" value="₹12,40,000" grad="135deg,#F59E0B,#EF4444"/>
              </div>
              <Glass style={{ padding:24 }}>
                <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:20 }}>Monthly Earnings</div>
                <BarChart data={EARNING_DATA} color="#10B981"/>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:24,
                  paddingTop:20, borderTop:"1px solid rgba(255,255,255,.07)" }}>
                  {[["Total Jobs","1,240"],["Avg/Job","₹339"],["Best Month","Mar 26"]].map(([l,v])=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:900, color:"white", fontSize:20 }}>{v}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", fontWeight:600, marginTop:4 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Glass>
              <Glass style={{ overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                  <span style={{ fontWeight:900, color:"white", fontSize:15 }}>Payout History</span>
                </div>
                {[["Mar 1–15","₹21,500","paid"],["Feb 16–28","₹19,800","paid"],["Feb 1–15","₹21,200","paid"],["Jan 16–31","₹17,500","paid"]].map(([p,a,s],i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"14px 20px", borderTop: i>0?"1px solid rgba(255,255,255,.06)":"none" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.6)" }}>{p}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontWeight:900, color:"white" }}>{a}</span>
                      <Pill status={s}/>
                    </div>
                  </div>
                ))}
              </Glass>
            </div>
          )}

          {page==="chat" && (
            <div style={{ maxWidth:560, height:"calc(100vh - 130px)", display:"flex", flexDirection:"column",
              background:"#0A0F1E", borderRadius:20, border:"1px solid rgba(255,255,255,.08)", overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                <Av initials="MI" grad="135deg,#6366F1,#8B5CF6" size={40}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:14 }}>Meera Iyer</div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#34D399" }}/>
                    <span style={{ fontSize:11, color:"#34D399", fontWeight:700 }}>Online</span>
                  </div>
                </div>
              </div>
              <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
                {msgs.map(m=>(
                  <div key={m.id} style={{ display:"flex", gap:10, flexDirection:m.mine?"row-reverse":"row" }}>
                    {!m.mine&&<Av initials={m.av} grad={m.grad} size={32}/>}
                    <div style={{ maxWidth:"70%" }}>
                      <div style={{ padding:"10px 14px", borderRadius:16, fontSize:13, fontWeight:600, lineHeight:1.5,
                        background:m.mine?"linear-gradient(135deg,#3B82F6,#06B6D4)":"rgba(255,255,255,.07)",
                        color:"rgba(255,255,255,.9)",
                        borderBottomRightRadius:m.mine?4:16, borderBottomLeftRadius:m.mine?16:4 }}>{m.text}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", marginTop:4, textAlign:m.mine?"right":"left", padding:"0 4px", fontWeight:600 }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", gap:10 }}>
                <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
                  placeholder="Type a message..." style={{ flex:1, background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)",
                    borderRadius:12, padding:"11px 16px", color:"white", fontSize:13, fontWeight:600, outline:"none", fontFamily:"inherit" }}/>
                <button onClick={sendMsg} style={{ width:40, height:40, borderRadius:12, border:"none",
                  background:"linear-gradient(135deg,#3B82F6,#06B6D4)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                  <RiSendPlaneLine size={18} color="white"/>
                </button>
              </div>
            </div>
          )}

          {page==="reviews" && (
            <div style={{ maxWidth:580, display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                <StatCard Icon={RiStarFill}  label="Avg Rating"    value="4.98" grad="135deg,#F59E0B,#EF4444"/>
                <StatCard Icon={RiListCheck2} label="Total Reviews" value="284"  grad="135deg,#6366F1,#8B5CF6"/>
                <StatCard Icon={RiTrophyLine} label="5-Star"        value="241"  grad="135deg,#10B981,#059669" sub="84.8%"/>
              </div>
              {REVIEWS.map(r=>(
                <Glass key={r.id} style={{ padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:900, color:"white", fontSize:14 }}>{r.customer}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginTop:2 }}>{r.service} · {r.date}</div>
                    </div>
                    <Stars n={r.stars}/>
                  </div>
                  <p style={{ fontSize:13, color:"rgba(255,255,255,.55)", lineHeight:1.6 }}>"{r.text}"</p>
                </Glass>
              ))}
            </div>
          )}

          {page==="profile" && (
            <div style={{ maxWidth:500, display:"flex", flexDirection:"column", gap:16 }}>
              <Glass style={{ padding:28, textAlign:"center" }}>
                <Av initials="RK" grad="135deg,#3B82F6,#06B6D4" size={80}/>
                <div style={{ fontWeight:900, color:"white", fontSize:22, marginTop:14 }}>Ravi Kumar</div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginTop:4 }}>Master Plumber · HSR Layout</div>
                <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:16 }}>
                  {[["4.98","Rating"],["1,240","Jobs"],["8 yrs","Exp"]].map(([v,l])=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontWeight:900, color:"white", fontSize:20 }}>{v}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Glass>
              <Glass style={{ padding:24 }}>
                <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:16 }}>Profile Details</div>
                {[["Full Name","Ravi Kumar"],["Phone","+91 98765 43210"],["Service Area","HSR Layout, Bengaluru"],["Specialization","Plumbing & Drainage"],["Experience","8 years"]].map(([l,v])=>(
                  <div key={l} style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>{l}</div>
                    <input defaultValue={v} style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1.5px solid rgba(255,255,255,.1)",
                      borderRadius:12, padding:"11px 16px", color:"white", fontSize:13, fontWeight:600, outline:"none", fontFamily:"inherit" }}/>
                  </div>
                ))}
                <button style={{ padding:"12px 24px", borderRadius:12, border:"none", cursor:"pointer",
                  background:"linear-gradient(135deg,#10B981,#059669)", color:"white", fontWeight:900, fontSize:14, fontFamily:"inherit" }}>
                  Save Changes
                </button>
              </Glass>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ADMIN DASHBOARD
════════════════════════════════════════════════ */
function AdminDashboard({ onLogout }) {
  const [page, setPage]   = useState("home");
  const [search, setSearch] = useState("");

  const navItems = [
    {id:"home",      Icon:RiPieChartLine,   label:"Overview"},
    {id:"bookings",  Icon:RiListCheck2,     label:"Bookings",  badge:BOOKINGS.filter(b=>b.status==="ongoing").length||undefined},
    {id:"users",     Icon:RiGroupLine,      label:"Customers"},
    {id:"providers", Icon:RiToolsLine,      label:"Providers"},
    {id:"services",  Icon:RiSettings3Line,  label:"Services"},
    {id:"reviews",   Icon:RiStarLine,       label:"Reviews"},
    {id:"analytics", Icon:RiBarChartLine,   label:"Analytics"},
  ];

  const tblHead = (cols) => (
    <thead>
      <tr style={{ background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
        {cols.map(c=><th key={c} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:900,
          color:"rgba(255,255,255,.3)", textTransform:"uppercase", letterSpacing:1.5, whiteSpace:"nowrap" }}>{c}</th>)}
      </tr>
    </thead>
  );

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#070B14" }}>
      <style>{G}</style>

      <aside style={{ width:240, background:"#0A0F1E", borderRight:"1px solid rgba(255,255,255,.06)",
        display:"flex", flexDirection:"column", padding:16, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 8px", marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#F59E0B,#EF4444)",
            display:"flex", alignItems:"center", justifyContent:"center" }}><RiShieldCheckLine size={18} color="white"/></div>
          <span style={{ fontWeight:900, color:"white", fontSize:17 }}>Service<span style={{color:"#FCD34D"}}>Mate</span></span>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
          {navItems.map(n=><SNavItem key={n.id} Icon={n.Icon} label={n.label} active={page===n.id} onClick={()=>setPage(n.id)} badge={n.badge} accent="#F59E0B"/>)}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:8 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#F59E0B,#EF4444)",
              display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"white", fontSize:13 }}>A</div>
            <div>
              <div style={{ fontWeight:800, fontSize:13, color:"white" }}>Admin</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>Super Admin</div>
            </div>
          </div>
          <SNavItem Icon={RiLogoutBoxLine} label="Logout" active={false} onClick={onLogout} accent="#EF4444"/>
        </div>
      </aside>

      <main style={{ flex:1, overflowY:"auto", background:"#070B14" }}>
        <div style={{ background:"#0A0F1E", borderBottom:"1px solid rgba(255,255,255,.06)",
          padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10 }}>
          <h1 style={{ fontSize:20, fontWeight:900, color:"white" }}>{navItems.find(n=>n.id===page)?.label}</h1>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.05)",
              border:"1.5px solid rgba(255,255,255,.08)", borderRadius:12, padding:"8px 14px" }}>
              <RiSearchLine size={16} color="rgba(255,255,255,.35)"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
                style={{ background:"transparent", border:"none", color:"white", fontSize:13, fontWeight:600,
                  outline:"none", fontFamily:"inherit", width:160 }}/>
            </div>
          </div>
        </div>

        <div style={{ padding:28 }}>
          {/* OVERVIEW */}
          {page==="home" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr) repeat(3,1fr)", gap:14 }}>
                <StatCard Icon={RiGroupLine}            label="Total Users"     value="5,840"  grad="135deg,#6366F1,#8B5CF6" sub="+124 today" delay={0}/>
                <StatCard Icon={RiToolsLine}            label="Providers"       value="1,240"  grad="135deg,#10B981,#059669" sub="+8 today"   delay={60}/>
                <StatCard Icon={RiListCheck2}           label="All Bookings"    value="28,450" grad="135deg,#F59E0B,#EF4444" sub="+342 today" delay={120}/>
                <StatCard Icon={RiMoneyDollarCircleLine}label="Revenue"         value="₹84.2L" grad="135deg,#EC4899,#F43F5E" sub="+12%"       delay={180}/>
                <StatCard Icon={RiRefreshLine}          label="Active Now"      value="342"    grad="135deg,#06B6D4,#6366F1"                  delay={240}/>
                <StatCard Icon={RiAlertLine}            label="Pending Verify"  value="28"     grad="135deg,#F97316,#F59E0B"                  delay={300}/>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                <Glass style={{ padding:24 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:20 }}>Revenue (Last 6 Months)</div>
                  <BarChart data={EARNING_DATA.map(d=>({...d,v:d.v*20}))} color="#F59E0B"/>
                </Glass>
                <Glass style={{ padding:24 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:20 }}>Category Breakdown</div>
                  {[["Cleaning","38%","#10B981"],["Repair","32%","#6366F1"],["Makeover","18%","#F59E0B"],["Emergency","8%","#EF4444"],["Installation","4%","#06B6D4"]].map(([l,pct,c])=>(
                    <div key={l} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:700, color:"rgba(255,255,255,.5)", marginBottom:5 }}>
                        <span>{l}</span><span>{pct}</span>
                      </div>
                      <div style={{ height:6, borderRadius:99, background:"rgba(255,255,255,.06)", overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:99, background:c, width:pct, transition:"all .8s" }}/>
                      </div>
                    </div>
                  ))}
                </Glass>
              </div>

              <Glass style={{ overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.07)",
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:900, color:"white", fontSize:15 }}>Recent Bookings</span>
                  <button onClick={()=>setPage("bookings")} style={{ background:"none", border:"none",
                    color:"#818CF8", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                    display:"flex", alignItems:"center", gap:4 }}>View all <RiArrowRightLine size={13}/></button>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  {tblHead(["ID","Customer","Service","Provider","Status","Amount"])}
                  <tbody>
                    {BOOKINGS.slice(0,5).map((b,i)=>(
                      <tr key={b.id} style={{ borderTop:"1px solid rgba(255,255,255,.05)" }}>
                        <td style={{ padding:"12px 16px", fontSize:11, fontWeight:900, color:"rgba(255,255,255,.3)" }}>{b.id}</td>
                        <td style={{ padding:"12px 16px", fontWeight:700, fontSize:13, color:"rgba(255,255,255,.8)" }}>{b.customer}</td>
                        <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(255,255,255,.5)" }}>{b.service}</td>
                        <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(255,255,255,.5)" }}>{b.provider}</td>
                        <td style={{ padding:"12px 16px" }}><Pill status={b.status}/></td>
                        <td style={{ padding:"12px 16px", fontWeight:900, color:"white" }}>₹{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Glass>
            </div>
          )}

          {/* BOOKINGS TABLE */}
          {page==="bookings" && (
            <Glass style={{ overflow:"hidden" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.07)",
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <span style={{ fontWeight:900, color:"white", fontSize:15 }}>All Bookings ({BOOKINGS.length})</span>
                <div style={{ display:"flex", gap:8 }}>
                  {["All","Ongoing","Scheduled","Completed","Cancelled"].map(f=>(
                    <button key={f} style={{ padding:"6px 12px", borderRadius:8, border:"1.5px solid rgba(255,255,255,.1)",
                      background:"rgba(255,255,255,.04)", color:"rgba(255,255,255,.45)", fontSize:11, fontWeight:800,
                      cursor:"pointer", fontFamily:"inherit" }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  {tblHead(["ID","Customer","Service","Provider","Date","Amount","Status","Actions"])}
                  <tbody>
                    {BOOKINGS.filter(b=>!search||b.customer.toLowerCase().includes(search.toLowerCase())||b.service.toLowerCase().includes(search.toLowerCase())).map((b,i)=>(
                      <tr key={b.id} style={{ borderTop:"1px solid rgba(255,255,255,.05)", transition:"background .15s" }}>
                        <td style={{ padding:"12px 16px", fontSize:11, fontWeight:900, color:"rgba(255,255,255,.3)", whiteSpace:"nowrap" }}>{b.id}</td>
                        <td style={{ padding:"12px 16px", fontWeight:800, fontSize:13, color:"white", whiteSpace:"nowrap" }}>{b.customer}</td>
                        <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(255,255,255,.5)" }}>{b.service}</td>
                        <td style={{ padding:"12px 16px", fontSize:13, color:"rgba(255,255,255,.5)", whiteSpace:"nowrap" }}>{b.provider}</td>
                        <td style={{ padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,.35)", whiteSpace:"nowrap" }}>{b.date}</td>
                        <td style={{ padding:"12px 16px", fontWeight:900, color:"white" }}>₹{b.amount}</td>
                        <td style={{ padding:"12px 16px" }}><Pill status={b.status}/></td>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex", gap:12 }}>
                            <button style={{ background:"none", border:"none", color:"#818CF8", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:3 }}><RiEyeLine size={13}/>View</button>
                            <button style={{ background:"none", border:"none", color:"#F87171", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:3 }}><RiDeleteBinLine size={13}/>Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Glass>
          )}

          {/* CUSTOMERS */}
          {page==="users" && (
            <Glass style={{ overflow:"hidden" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.07)",
                display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontWeight:900, color:"white", fontSize:15 }}>All Customers ({CUSTOMERS.length})</span>
                <button style={{ padding:"9px 18px", borderRadius:10, border:"none",
                  background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:900, fontSize:13,
                  cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                  <RiAddLine size={15}/>Add Customer
                </button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  {tblHead(["Customer","Email","Phone","Area","Bookings","Status","Actions"])}
                  <tbody>
                    {CUSTOMERS.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase())).map((c)=>(
                      <tr key={c.id} style={{ borderTop:"1px solid rgba(255,255,255,.05)" }}>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Av initials={c.name.split(" ").map(n=>n[0]).join("")} grad="135deg,#6366F1,#8B5CF6" size={32}/>
                            <span style={{ fontWeight:800, fontSize:13, color:"white", whiteSpace:"nowrap" }}>{c.name}</span>
                          </div>
                        </td>
                        <td style={{ padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,.4)" }}>{c.email}</td>
                        <td style={{ padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,.4)", whiteSpace:"nowrap" }}>{c.phone}</td>
                        <td style={{ padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,.4)" }}>{c.area}</td>
                        <td style={{ padding:"12px 16px", fontWeight:900, color:"white", textAlign:"center" }}>{c.bookings}</td>
                        <td style={{ padding:"12px 16px" }}><Pill status={c.status}/></td>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex", gap:12 }}>
                            <button style={{ background:"none", border:"none", color:"#818CF8", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:3 }}><RiEyeLine size={13}/>View</button>
                            <button style={{ background:"none", border:"none", color:"#F87171", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:3 }}><RiDeleteBinLine size={13}/>Block</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Glass>
          )}

          {/* PROVIDERS */}
          {page==="providers" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                <StatCard Icon={RiVerifiedBadgeLine} label="Active Providers" value={PROVIDERS.filter(p=>p.status==="active").length} grad="135deg,#10B981,#059669"/>
                <StatCard Icon={RiRefreshLine}       label="Busy"             value={PROVIDERS.filter(p=>p.status==="busy").length}   grad="135deg,#F59E0B,#EF4444"/>
                <StatCard Icon={RiAlertLine}         label="Offline"          value={PROVIDERS.filter(p=>p.status==="offline").length} grad="135deg,#64748B,#475569"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
                {PROVIDERS.filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase())).map(p=>(
                  <Glass key={p.id} style={{ padding:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                      <Av initials={p.av} grad={p.grad} size={48}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:900, color:"white", fontSize:15 }}>{p.name}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:2 }}>{p.role}</div>
                      </div>
                      <Pill status={p.status}/>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                      {[[RiStarFill,p.rating,"Rating"],[RiBriefcaseLine,p.jobs,"Jobs"],[RiTimeLine,p.exp,"Exp"]].map(([Icon,v,l])=>(
                        <div key={l} style={{ background:"rgba(255,255,255,.05)", borderRadius:10, padding:"8px", textAlign:"center" }}>
                          <Icon size={14} color="rgba(255,255,255,.4)" style={{margin:"0 auto 4px"}}/>
                          <div style={{ fontWeight:900, color:"white", fontSize:13 }}>{v}</div>
                          <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", fontWeight:600 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button style={{ flex:1, padding:"9px 0", borderRadius:10, border:"1.5px solid rgba(99,102,241,.3)",
                        background:"rgba(99,102,241,.1)", color:"#818CF8", fontWeight:900, fontSize:12, cursor:"pointer",
                        fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                        <RiEyeLine size={13}/>View
                      </button>
                      <button style={{ flex:1, padding:"9px 0", borderRadius:10, border:"1.5px solid rgba(239,68,68,.3)",
                        background:"rgba(239,68,68,.1)", color:"#F87171", fontWeight:900, fontSize:12, cursor:"pointer",
                        fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                        <RiDeleteBinLine size={13}/>Suspend
                      </button>
                    </div>
                  </Glass>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES */}
          {page==="services" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:"rgba(255,255,255,.35)", fontSize:13 }}>{SERVICES.length} services</span>
                <button style={{ padding:"9px 18px", borderRadius:10, border:"none",
                  background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"white", fontWeight:900, fontSize:13,
                  cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                  <RiAddLine size={15}/>Add Service
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
                {SERVICES.filter(s=>!search||s.title.toLowerCase().includes(search.toLowerCase())).map(s=>(
                  <Glass key={s.id} style={{ padding:16, display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:46, height:46, borderRadius:12, background:`linear-gradient(${s.grad})`,
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <s.Icon size={22} color="white"/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:900, color:"white", fontSize:14 }}>{s.title}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600, marginTop:2 }}>{s.cat} · ₹{s.price}{s.unit||""} · {s.time}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                      <button style={{ background:"none", border:"none", color:"#818CF8", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:3 }}><RiEditLine size={13}/>Edit</button>
                      <button style={{ background:"none", border:"none", color:"#F87171", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:3 }}><RiDeleteBinLine size={13}/>Hide</button>
                    </div>
                  </Glass>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {page==="reviews" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                <StatCard Icon={RiStarFill}   label="Avg Platform Rating" value="4.87"   grad="135deg,#F59E0B,#EF4444"/>
                <StatCard Icon={RiListCheck2}  label="Total Reviews"       value="12,450" grad="135deg,#6366F1,#8B5CF6" sub="+89 today"/>
                <StatCard Icon={RiAlertLine}   label="Flagged Reviews"     value="3"      grad="135deg,#EF4444,#DC2626"/>
              </div>
              <Glass style={{ overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
                  <span style={{ fontWeight:900, color:"white", fontSize:15 }}>All Reviews</span>
                </div>
                {REVIEWS.map((r,i)=>(
                  <div key={r.id} style={{ padding:"16px 20px", borderTop: i>0?"1px solid rgba(255,255,255,.06)":"none",
                    display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                        <span style={{ fontWeight:900, color:"white", fontSize:14 }}>{r.customer}</span>
                        <span style={{ color:"rgba(255,255,255,.2)" }}>→</span>
                        <span style={{ fontSize:13, color:"rgba(255,255,255,.5)", fontWeight:600 }}>{r.provider}</span>
                        <Stars n={r.stars} size={12}/>
                      </div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginBottom:6, fontWeight:600 }}>{r.service} · {r.date}</div>
                      <p style={{ fontSize:13, color:"rgba(255,255,255,.5)", lineHeight:1.6 }}>"{r.text}"</p>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
                      <button style={{ padding:"6px 14px", borderRadius:8, border:"1.5px solid rgba(16,185,129,.3)",
                        background:"rgba(16,185,129,.1)", color:"#34D399", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Approve</button>
                      <button style={{ padding:"6px 14px", borderRadius:8, border:"1.5px solid rgba(239,68,68,.3)",
                        background:"rgba(239,68,68,.1)", color:"#F87171", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Remove</button>
                    </div>
                  </div>
                ))}
              </Glass>
            </div>
          )}

          {/* ANALYTICS */}
          {page==="analytics" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
                <StatCard Icon={RiArrowUpLine} label="Booking Growth"  value="+18.4%" grad="135deg,#10B981,#059669" sub="vs last month"/>
                <StatCard Icon={RiArrowUpLine} label="Revenue Growth"  value="+12.1%" grad="135deg,#6366F1,#8B5CF6" sub="vs last month"/>
                <StatCard Icon={RiGroupLine}   label="New Users"       value="1,248"  grad="135deg,#F59E0B,#EF4444" sub="this month"/>
                <StatCard Icon={RiToolsLine}   label="New Providers"   value="38"     grad="135deg,#EC4899,#F43F5E" sub="this month"/>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                <Glass style={{ padding:24 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:20 }}>Monthly Bookings</div>
                  <BarChart data={[{month:"Oct",v:3800},{month:"Nov",v:4200},{month:"Dec",v:5100},{month:"Jan",v:4700},{month:"Feb",v:5600},{month:"Mar",v:6200}]} color="#6366F1"/>
                </Glass>
                <Glass style={{ padding:24 }}>
                  <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:20 }}>Top Services</div>
                  {[["Home Cleaning","4,520","#10B981",90],["Plumbing","3,890","#3B82F6",78],["AC Service","3,210","#06B6D4",64],["Electrician","2,980","#F59E0B",60],["Pest Control","2,109","#16A34A",42]].map(([s,b,c,w],i)=>(
                    <div key={s} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,.25)", width:16 }}>#{i+1}</span>
                          <span style={{ fontWeight:800, color:"rgba(255,255,255,.7)" }}>{s}</span>
                        </div>
                        <span style={{ fontWeight:900, color:c }}>{b}</span>
                      </div>
                      <div style={{ height:5, borderRadius:99, background:"rgba(255,255,255,.06)" }}>
                        <div style={{ height:"100%", borderRadius:99, background:c, width:`${w}%`, transition:"width .8s" }}/>
                      </div>
                    </div>
                  ))}
                </Glass>
              </div>

              <Glass style={{ padding:24 }}>
                <div style={{ fontWeight:900, color:"white", fontSize:16, marginBottom:20 }}>Bookings by Area</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                  {[["Koramangala","23%"],["HSR Layout","18%"],["Indiranagar","15%"],["Whitefield","14%"],["JP Nagar","11%"],["BTM Layout","9%"],["Marathahalli","7%"],["Others","3%"]].map(([area,pct])=>(
                    <div key={area} style={{ background:"rgba(255,255,255,.05)", borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
                      <div style={{ fontWeight:900, fontSize:20, color:"#818CF8" }}>{pct}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:700, marginTop:4 }}>{area}</div>
                    </div>
                  ))}
                </div>
              </Glass>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════
   APP ROOT
════════════════════════════════════════════════ */
export default function App() {
  const [role, setRole]       = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [bookingSvc, setBookingSvc] = useState(null);

  useEffect(()=>{
    document.title = "ServiceMate";
    const el = document.createElement("style");
    el.textContent = `* { box-sizing:border-box; margin:0; padding:0; } body { background:#070B14; }`;
    document.head.appendChild(el);
    return ()=>document.head.removeChild(el);
  },[]);

  const handleLogin  = (r) => { setRole(r); setShowAuth(false); };
  const handleLogout = () => { setRole(null); setShowAuth(false); };
  const handleBook   = (s) => { if(!role){ setShowAuth(true); setBookingSvc(s); } else setBookingSvc(s); };

  if (showAuth && !role) return (
    <>
      <AuthPage onLogin={handleLogin}/>
      {bookingSvc && role && <BookModal svc={bookingSvc} onClose={()=>setBookingSvc(null)}/>}
    </>
  );
  if (role==="customer") return <>
    <CustomerDashboard onLogout={handleLogout} onBook={handleBook}/>
    {bookingSvc && <BookModal svc={bookingSvc} onClose={()=>setBookingSvc(null)}/>}
  </>;
  if (role==="provider") return <ProviderDashboard onLogout={handleLogout}/>;
  if (role==="admin")    return <AdminDashboard onLogout={handleLogout}/>;

  return <>
    {showAuth && <AuthPage onLogin={handleLogin}/>}
    {!showAuth && <>
      <LandingPage onLogin={()=>setShowAuth(true)} onBook={handleBook}/>
      {bookingSvc && <BookModal svc={bookingSvc} onClose={()=>setBookingSvc(null)} onConfirm={()=>{setShowAuth(true);setBookingSvc(null);}}/>}
    </>}
  </>;
}
