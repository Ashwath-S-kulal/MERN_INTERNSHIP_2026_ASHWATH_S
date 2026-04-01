import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ChevronRight
} from "lucide-react";
import logo from "../assets/logo1.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Services",
      links: [
        { name: "Plumbing", path: "/service" },
        { name: "Electrician", path: "/service" },
        { name: "AC Repair", path: "/service" },
        { name: "Cleaning", path: "/service" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/" },
        { name: "Join as Pro", path: "/applyforservice" },
        { name: "Careers", path: "/" },
        { name: "Contact", path: "/" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/" },
        { name: "Terms of Use", path: "/" },
        { name: "Privacy Policy", path: "/" },
      ],
    },
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10 px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform overflow-hidden">
                <img
                  src={logo}
                  alt="ServiceMate Helper Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-black text-white text-xl tracking-tight uppercase">
                Service<span className="text-blue-500">Mate</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-8">
              Connecting India with verified home service professionals. Quality
              guaranteed, transparent pricing, and instant booking.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-zinc-800"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-white text-sm mb-6 uppercase tracking-widest">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-blue-400 transition-colors flex items-center group"
                    >
                      <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-1 text-blue-500" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-zinc-900 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 rounded-lg text-blue-500">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">Call Us</p>
              <p className="text-sm text-white font-medium">+91 8431294514</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 rounded-lg text-blue-500">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">Email Support</p>
              <p className="text-sm text-white font-medium">ashwathskulal2004@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 rounded-lg text-blue-500">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">Headquarters</p>
              <p className="text-sm text-white font-medium">Udupi, Karnataka, India</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <p>© {currentYear} SERVICEMATE PLATFORM PVT LTD.</p>
            <div className="hidden md:flex items-center gap-4 text-zinc-600">
              <a href="#" className="hover:text-white transition">SITEMAP</a>
              <a href="#" className="hover:text-white transition">SECURITY</a>
            </div>
          </div>
          <p className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-800">
            Made with <span className="text-red-500 animate-pulse">❤️</span> for India
          </p>
        </div>
      </div>
    </footer>
  );
}