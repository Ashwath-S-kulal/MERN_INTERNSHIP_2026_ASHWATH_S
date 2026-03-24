import { useState, useEffect } from "react";


const CATEGORIES = ["All", "Repair", "Cleaning", "Installation", "Emergency"];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

const SERVICES = [
  {
    id: 1,
    icon: "🔧",
    title: "Plumbing",
    desc: "Leaks, clogs, pipe repairs & installations",
    tag: "Most Booked",
    price: "₹299",
    rating: 4.9,
    reviews: 2341,
    duration: "1-2 hrs",
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50",
    accent: "text-sky-600",
    border: "border-sky-200",
    tagColor: "bg-sky-100 text-sky-700",
    category: "Repair",
    longDesc:
      "Our certified plumbers handle everything from minor leaks to full pipe replacements. We use premium fittings and guarantee leak-free results with a 30-day service warranty.",
    includes: [
      "Leak detection & repair",
      "Pipe replacement",
      "Tap & faucet fitting",
      "Drain unblocking",
      "Water heater installation",
    ],
  },
  {
    id: 2,
    icon: "⚡",
    title: "Electrician",
    desc: "Wiring, fuse box, switches & appliance fitting",
    tag: "Top Rated",
    price: "₹349",
    rating: 4.8,
    reviews: 3102,
    duration: "1-3 hrs",
    color: "from-amber-400 to-yellow-500",
    bg: "bg-amber-50",
    accent: "text-amber-600",
    border: "border-amber-200",
    tagColor: "bg-amber-100 text-amber-700",
    category: "Repair",
    longDesc:
      "ISI-certified electricians for safe, reliable electrical work. From fitting switches to complete rewiring, we ensure your home is powered safely.",
    includes: [
      "Switch & socket repair",
      "Fan installation",
      "MCB & fuse box work",
      "Lighting setup",
      "Appliance wiring",
    ],
  },
  {
    id: 3,
    icon: "❄️",
    title: "AC Service",
    desc: "Cleaning, gas refilling & AC installation",
    tag: "Summer Deal",
    price: "₹499",
    rating: 4.9,
    reviews: 1876,
    duration: "1-2 hrs",
    color: "from-cyan-400 to-teal-500",
    bg: "bg-cyan-50",
    accent: "text-cyan-600",
    border: "border-cyan-200",
    tagColor: "bg-cyan-100 text-cyan-700",
    category: "Cleaning",
    longDesc:
      "Keep your AC running at peak efficiency with our comprehensive service. We clean filters, refill gas, and diagnose issues before they become expensive problems.",
    includes: [
      "Filter deep clean",
      "Gas pressure check & refill",
      "Coil cleaning",
      "Drainage pipe flush",
      "Performance testing",
    ],
  },
  {
    id: 4,
    icon: "🏠",
    title: "Home Cleaning",
    desc: "Deep clean, sofa, carpet & bathroom cleaning",
    tag: "Popular",
    price: "₹799",
    rating: 4.7,
    reviews: 4520,
    duration: "3-5 hrs",
    color: "from-emerald-400 to-green-600",
    bg: "bg-emerald-50",
    accent: "text-emerald-600",
    border: "border-emerald-200",
    tagColor: "bg-emerald-100 text-emerald-700",
    category: "Cleaning",
    longDesc:
      "Trained cleaning professionals with eco-friendly products give your home a hotel-like finish. Includes all rooms, kitchen, and bathrooms.",
    includes: [
      "All rooms sweep & mop",
      "Kitchen deep clean",
      "Bathroom sanitization",
      "Sofa & upholstery clean",
      "Window & fan cleaning",
    ],
  },
  {
    id: 5,
    icon: "🎨",
    title: "Painting",
    desc: "Interior, exterior, texture & waterproofing",
    tag: "New",
    price: "₹15/sqft",
    rating: 4.8,
    reviews: 987,
    duration: "2-5 days",
    color: "from-rose-400 to-pink-600",
    bg: "bg-rose-50",
    accent: "text-rose-600",
    border: "border-rose-200",
    tagColor: "bg-rose-100 text-rose-700",
    category: "Installation",
    longDesc:
      "Premium quality painting with top-grade paints and skilled painters. We prep surfaces, apply primer, and deliver a flawless finish with color consultation included.",
    includes: [
      "Wall preparation & putty",
      "2-coat primer",
      "2-coat emulsion paint",
      "Color consultation",
      "Furniture protection",
    ],
  },
  {
    id: 6,
    icon: "🛠️",
    title: "Carpentry",
    desc: "Furniture repair, doors, cabinets & woodwork",
    tag: "",
    price: "₹399",
    rating: 4.6,
    reviews: 765,
    duration: "1-3 hrs",
    color: "from-orange-400 to-amber-600",
    bg: "bg-orange-50",
    accent: "text-orange-600",
    border: "border-orange-200",
    tagColor: "",
    category: "Repair",
    longDesc:
      "Skilled carpenters for all your woodwork needs. From fixing squeaky doors to building custom furniture, we bring craftsmanship to your home.",
    includes: [
      "Door & window repair",
      "Cabinet installation",
      "Furniture assembly",
      "Custom woodwork",
      "Lock & hinge fitting",
    ],
  },
  {
    id: 7,
    icon: "🚿",
    title: "Bathroom Reno",
    desc: "Tiles, faucets, waterproofing & makeover",
    tag: "",
    price: "₹2499",
    rating: 4.7,
    reviews: 432,
    duration: "1-3 days",
    color: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    accent: "text-violet-600",
    border: "border-violet-200",
    tagColor: "",
    category: "Installation",
    longDesc:
      "Complete bathroom makeovers or targeted fixes. Our team handles everything from waterproofing to premium tile laying and fixture installation.",
    includes: [
      "Waterproofing treatment",
      "Tile installation",
      "Shower & faucet fitting",
      "Vanity installation",
      "Exhaust fan setup",
    ],
  },
  {
    id: 8,
    icon: "🔒",
    title: "Locksmith",
    desc: "Lock change, key duplication & emergency unlock",
    tag: "24/7",
    price: "₹249",
    rating: 4.9,
    reviews: 1234,
    duration: "30-60 min",
    color: "from-slate-500 to-gray-700",
    bg: "bg-slate-50",
    accent: "text-slate-600",
    border: "border-slate-200",
    tagColor: "bg-slate-100 text-slate-700",
    category: "Emergency",
    longDesc:
      "Round-the-clock locksmith services. Whether you're locked out or need to upgrade your security, our locksmiths reach you within 30 minutes.",
    includes: [
      "Emergency unlock",
      "Lock replacement",
      "Duplicate key cutting",
      "Digital lock setup",
      "Door security audit",
    ],
  },
  {
    id: 9,
    icon: "🌿",
    title: "Pest Control",
    desc: "Cockroach, termite, rodent & bed bug treatment",
    tag: "Guaranteed",
    price: "₹999",
    rating: 4.8,
    reviews: 2109,
    duration: "2-3 hrs",
    color: "from-lime-400 to-green-500",
    bg: "bg-lime-50",
    accent: "text-lime-600",
    border: "border-lime-200",
    tagColor: "bg-lime-100 text-lime-700",
    category: "Cleaning",
    longDesc:
      "Herbal and chemical treatment options to eliminate pests completely. We provide a 3-month warranty — if pests return, we treat again for free.",
    includes: [
      "Cockroach treatment",
      "Termite control",
      "Rodent trapping",
      "Bed bug treatment",
      "3-month warranty",
    ],
  },
];

const PROFESSIONALS = [
  { id: 1, name: "Ravi Kumar",  role: "Master Plumber",   rating: 4.98, jobs: 1240, exp: "8 yrs",  avatar: "RK", color: "from-blue-500 to-sky-600",     badge: "Top Pro"  },
  { id: 2, name: "Anita Sharma", role: "Electrician",      rating: 4.95, jobs: 980,  exp: "6 yrs",  avatar: "AS", color: "from-amber-500 to-orange-500",  badge: "Verified" },
  { id: 3, name: "Suresh Babu", role: "AC Technician",    rating: 4.97, jobs: 1560, exp: "10 yrs", avatar: "SB", color: "from-cyan-500 to-teal-600",     badge: "Elite"    },
  { id: 4, name: "Priya Nair",  role: "Cleaning Expert",  rating: 4.92, jobs: 2300, exp: "5 yrs",  avatar: "PN", color: "from-emerald-500 to-green-600", badge: "Top Pro"  },
];

const TESTIMONIALS = [
  { id: 1, name: "Meera Iyer",    location: "Indiranagar, Bengaluru", service: "Home Cleaning", rating: 5, avatar: "MI", date: "2 days ago",  text: "Absolutely impressed! The team arrived on time, cleaned every nook and cranny. My apartment feels brand new. Will definitely book again!" },
  { id: 2, name: "Karthik Reddy", location: "HSR Layout, Bengaluru",  service: "Plumbing",      rating: 5, avatar: "KR", date: "1 week ago",  text: "Ravi fixed a persistent leak that two other plumbers couldn't solve. Professional, quick, and very reasonable pricing. Highly recommend!" },
  { id: 3, name: "Divya Menon",   location: "Koramangala, Bengaluru", service: "AC Service",    rating: 5, avatar: "DM", date: "3 days ago",  text: "Booked AC service at 9am, technician arrived by 10:30am. Super thorough job, explained everything he did. ServiceMate is now my go-to app!" },
  { id: 4, name: "Arjun Singh",   location: "Whitefield, Bengaluru",  service: "Painting",      rating: 4, avatar: "AS", date: "2 weeks ago", text: "Great color consultation and very neat work. The painters were tidy and finished a 2BHK in just 3 days. Minor delay but quality was top-notch." },
];

const QUICK_SEARCHES = ["Plumbing", "AC Service", "Deep Clean", "Electrician", "Pest Control"];

const BOOKING_STEPS = ["Date & Time", "Your Details", "Confirm"];

const TRUST_BADGES = [
  ["🛡️", "Insured",    "All work insured"],
  ["⏰", "On-time",    "Punctual pros"],
  ["💳", "Pay Later",  "After completion"],
];


function getUpcomingDates(count = 7) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

function formatDate(d) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}


function Stars({ rating, size = "sm" }) {
  const dim = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={dim} fill={i <= Math.round(rating) ? "#FBBF24" : "#E5E7EB"} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}


function BookingModal({ service, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [booked, setBooked] = useState(false);

  const dates = getUpcomingDates();

  function handleConfirm() {
    setBooked(true);
    setTimeout(onClose, 3000);
  }

  const gradientBtn = (disabled) =>
    disabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : `bg-gradient-to-r ${service.color} text-white shadow-lg hover:opacity-90`;

  if (booked) {
    return (
      <ModalShell>
        <div className="p-12 text-center">
          <div className="text-7xl mb-5" style={{ animation: "bounce 0.6s ease" }}>🎉</div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your <strong>{service.title}</strong> is booked for{" "}
            <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
            <br />A verified pro will be assigned shortly.
          </p>
          <div className="mt-6 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              style={{ animation: "fillBar 2.8s linear forwards" }}
            />
          </div>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell>
      {/* Header */}
      <div className={`bg-gradient-to-r ${service.color} p-6 text-white relative`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-lg font-bold"
        >
          ✕
        </button>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-4xl">{service.icon}</span>
          <div>
            <h3 className="text-xl font-black">Book {service.title}</h3>
            <p className="text-white/75 text-sm">Starting at {service.price}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex gap-2">
          {BOOKING_STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${step > i ? "bg-white" : "bg-white/25"}`} />
              <p className={`text-[10px] mt-1.5 font-bold ${step > i ? "text-white" : "text-white/40"}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {step === 1 && (
          <div>
            <SectionLabel>Select Date</SectionLabel>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {dates.map((d) => {
                const val = formatDate(d);
                const isSelected = selectedDate === val;
                return (
                  <button
                    key={val}
                    onClick={() => setSelectedDate(val)}
                    className={`flex-shrink-0 w-14 py-2.5 rounded-xl text-center border-2 transition-all ${
                      isSelected
                        ? `bg-gradient-to-b ${service.color} text-white border-transparent shadow-lg`
                        : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-60">
                      {d.toLocaleDateString("en-IN", { weekday: "short" })}
                    </div>
                    <div className="text-xl font-black">{d.getDate()}</div>
                    <div className="text-[10px] font-bold opacity-60">
                      {d.toLocaleDateString("en-IN", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>

            <SectionLabel>Select Time</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                    selectedTime === t
                      ? `bg-gradient-to-r ${service.color} text-white border-transparent shadow-md`
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(2)}
              className={`w-full mt-5 py-3.5 rounded-2xl font-black text-sm transition-all ${gradientBtn(!selectedDate || !selectedTime)}`}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <SectionLabel>Full Address</SectionLabel>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Flat no, Building, Street, Area, Bengaluru..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 resize-none transition"
              />
            </div>
            <div>
              <SectionLabel>Phone Number</SectionLabel>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 transition"
              />
            </div>

            <OrderSummary service={service} selectedDate={selectedDate} selectedTime={selectedTime} />

            <div className="flex gap-3">
              <BackButton onClick={() => setStep(1)} />
              <button
                disabled={!address || !phone}
                onClick={() => setStep(3)}
                className={`flex-1 py-3 rounded-2xl text-sm font-black transition-all ${gradientBtn(!address || !phone)}`}
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-5 mb-4 space-y-2.5 text-sm border border-indigo-100">
              <p className="font-black text-gray-900 text-base mb-3">Confirm Booking</p>
              {[
                ["Service", service.title],
                ["Date", selectedDate],
                ["Time", selectedTime],
                ["Address", address],
                ["Phone", phone],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-gray-400 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-gray-800 text-right text-xs leading-relaxed">{value}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-indigo-200 pt-3 mt-2">
                <span className="font-bold text-gray-600">Amount</span>
                <span className="font-black text-xl text-indigo-600">{service.price}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-xs text-green-800">
              <span className="text-base">✅</span>
              <span className="font-medium">
                Pay only after service is complete. No advance required. Satisfaction guaranteed.
              </span>
            </div>

            <div className="flex gap-3">
              <BackButton onClick={() => setStep(2)} />
              <button
                onClick={handleConfirm}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r ${service.color} text-white shadow-lg hover:opacity-90 transition`}
              >
                Confirm 🎉
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

// ─── SERVICE DETAIL MODAL ──────────────────────────────────────────────────────

function ServiceDetailModal({ service, onClose, onBook }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ animation: "slideUp 0.3s ease" }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${service.color} p-8 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-lg font-bold"
          >
            ✕
          </button>
          <div className="text-5xl mb-3">{service.icon}</div>
          <h2 className="text-2xl font-black mb-1">{service.title}</h2>
          <p className="text-white/80 text-sm mb-5 leading-relaxed">{service.longDesc}</p>
          <div className="flex gap-3 text-sm flex-wrap">
            {[
              [`⏱ ${service.duration}`],
              [`💰 From ${service.price}`],
              [`⭐ ${service.rating} (${service.reviews.toLocaleString()})`],
            ].map(([label]) => (
              <div key={label} className="bg-white/20 rounded-xl px-3 py-1.5 font-bold">
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
            <div className="text-3xl font-black text-yellow-500">{service.rating}</div>
            <div>
              <Stars rating={service.rating} size="md" />
              <p className="text-xs text-gray-500 mt-0.5">{service.reviews.toLocaleString()} verified reviews</p>
            </div>
            <div className="ml-auto">
              <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1.5 rounded-full">
                ✓ Highly Rated
              </span>
            </div>
          </div>

          {/* Includes */}
          <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide">What's Included</h3>
          <div className="space-y-2 mb-6">
            {service.includes.map((item) => (
              <div key={item} className={`flex items-center gap-3 p-3 rounded-xl ${service.bg} border ${service.border}`}>
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 font-semibold">{item}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {TRUST_BADGES.map(([icon, label, sub]) => (
              <div key={label} className="text-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-xl mb-1">{icon}</div>
                <p className="text-xs font-black text-gray-800">{label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onBook}
            className={`w-full py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r ${service.color} shadow-lg hover:opacity-90 transition`}
          >
            Book Now — Starting {service.price} →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SMALL SHARED COMPONENTS ───────────────────────────────────────────────────


// ─── SERVICE CARD ──────────────────────────────────────────────────────────────

function ServiceCard({ service }) {
  return (
    <div className={`relative rounded-2xl border-2 ${service.border} ${service.bg} p-6 card-hover cursor-pointer`}>
      {service.tag && (
        <span className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${service.tagColor}`}>
          {service.tag}
        </span>
      )}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl shadow-lg mb-4`}>
        {service.icon}
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-1">{service.title}</h3>
      <p className="text-sm text-gray-500 mb-2 leading-relaxed">{service.desc}</p>
      <div className="flex items-center gap-1.5 mb-4">
        <Stars rating={service.rating} />
        <span className="text-xs font-black text-gray-700">{service.rating}</span>
        <span className="text-xs text-gray-400">({service.reviews.toLocaleString()})</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-400">From </span>
          <span className={`text-base font-black ${service.accent}`}>{service.price}</span>
        </div>
        
      </div>
    </div>
  );
}

// ─── PROFESSIONAL CARD ─────────────────────────────────────────────────────────

function ProfessionalCard({ pro }) {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center card-hover shadow-sm">
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pro.color} flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg`}>
        {pro.avatar}
      </div>
      <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{pro.badge}</span>
      <h3 className="font-black text-gray-900 mt-3 mb-0.5">{pro.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{pro.role}</p>
      <div className="flex justify-center mb-4">
        <Stars rating={pro.rating} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["⭐", pro.rating,       "Rating"],
          ["🔨", `${pro.jobs}+`,  "Jobs"],
          ["📅", pro.exp,          "Exp"],
        ].map(([icon, val, label]) => (
          <div key={label} className="bg-gray-50 rounded-xl p-2.5">
            <div className="text-base">{icon}</div>
            <div className="text-xs font-black text-gray-900">{val}</div>
            <div className="text-[10px] text-gray-400">{label}</div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2.5 rounded-xl border-2 border-indigo-200 text-indigo-600 text-xs font-black hover:bg-indigo-50 transition">
        View Profile →
      </button>
    </div>
  );
}

// ─── TESTIMONIAL CARD ──────────────────────────────────────────────────────────

function TestimonialMini({ testimonial, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
        isActive
          ? "bg-white/15 border-indigo-400"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center gap-3 mb-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-black">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-black text-white text-sm">{testimonial.name}</p>
          <Stars rating={testimonial.rating} />
        </div>
        <span className="ml-auto text-[10px] text-indigo-400 font-bold">{testimonial.date}</span>
      </div>
      <p className="text-white/65 text-xs leading-relaxed line-clamp-2">"{testimonial.text}"</p>
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function ServiceMatePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingService, setBookingService] = useState(null);
  const [detailService, setDetailService] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(
      () => setActiveReview((r) => (r + 1) % TESTIMONIALS.length),
      4500
    );
    return () => clearInterval(timer);
  }, []);

  const filteredServices = SERVICES.filter((s) => {
    const matchCategory = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const currentTestimonial = TESTIMONIALS[activeReview];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes slideUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float    { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-8px); } }
        @keyframes fillBar  { from{ width:0%; } to{ width:100%; } }
        @keyframes bounce   { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.15); } }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-6px) scale(1.015); box-shadow: 0 24px 50px rgba(0,0,0,0.1); }
        .hero-in { animation: slideUp 0.7s ease both; }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 pt-28 pb-3 px-6">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%, #6366f1 0%, transparent 45%), radial-gradient(circle at 85% 20%, #7c3aed 0%, transparent 40%)",
          }}
        />
        <div className="absolute top-10 right-24 w-80 h-80 border border-white/5 rounded-full" />
        <div className="absolute top-20 right-12 w-44 h-44 border border-white/5 rounded-full" />

        <div className={`max-w-4xl mx-auto text-center relative z-10 ${mounted ? "hero-in" : "opacity-0"}`}>
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border-2 border-white/20 p-1.5">
              <span className="pl-3 flex items-center text-gray-400 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search service e.g. Plumbing, AC, Painting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-800 placeholder-gray-400 outline-none text-sm bg-transparent font-semibold"
              />
              <button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-black text-sm px-6 py-2.5 rounded-xl transition">
                Search
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => setSearchQuery(q)}
                  className="text-xs text-white/55 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-full transition font-semibold"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div>
            <p className="text-xs font-black tracking-widest text-indigo-500 uppercase mb-2">What We Offer</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">All Services</h2>
            <p className="text-gray-500 text-sm mt-1">
              {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm font-black px-5 py-2.5 rounded-xl border-2 transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDetails={() => setDetailService(service)}
              onBook={() => setBookingService(service)}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-28">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-black text-gray-700">No services found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different keyword or category</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-5 text-indigo-600 font-black text-sm underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* ── Professionals ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-black tracking-widest text-indigo-500 uppercase mb-2">Meet The Team</p>
          <h2 className="text-4xl font-black text-gray-900">Featured Professionals</h2>
          <p className="text-gray-500 text-sm mt-2">Background-verified, trained & highly rated pros</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROFESSIONALS.map((pro) => (
            <ProfessionalCard key={pro.id} pro={pro} />
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-widest text-indigo-400 uppercase mb-2">Customer Stories</p>
            <h2 className="text-4xl font-black text-white">What Our Customers Say</h2>
            <p className="text-indigo-300 text-sm mt-2">Real reviews from real Bengalurians</p>
          </div>

          {/* Featured review */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8 mb-6 relative overflow-hidden">
            <div className="absolute -top-2 right-6 text-8xl opacity-10 font-black text-white select-none">"</div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-black">
                {currentTestimonial.avatar}
              </div>
              <div>
                <p className="font-black text-white">{currentTestimonial.name}</p>
                <p className="text-indigo-300 text-xs">{currentTestimonial.location}</p>
              </div>
              <div className="ml-auto">
                <span className="bg-indigo-700/60 text-indigo-200 text-xs font-black px-3 py-1.5 rounded-full">
                  {currentTestimonial.service}
                </span>
              </div>
            </div>
            <Stars rating={currentTestimonial.rating} size="md" />
            <p className="text-white/90 mt-3 text-lg leading-relaxed font-medium">
              "{currentTestimonial.text}"
            </p>
            <p className="text-indigo-400 text-xs mt-4">{currentTestimonial.date}</p>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReview(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeReview ? "w-8 h-2.5 bg-indigo-400" : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Mini grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialMini
                key={t.id}
                testimonial={t}
                isActive={i === activeReview}
                onClick={() => setActiveReview(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Modals ── */}
      {detailService && !bookingService && (
        <ServiceDetailModal
          service={detailService}
          onClose={() => setDetailService(null)}
          onBook={() => { setBookingService(detailService); setDetailService(null); }}
        />
      )}
      {bookingService && (
        <BookingModal service={bookingService} onClose={() => setBookingService(null)} />
      )}
    </div>
  );
}
