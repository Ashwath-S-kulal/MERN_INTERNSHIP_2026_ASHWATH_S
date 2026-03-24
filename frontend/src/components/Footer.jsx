import React from "react";
import { Mail, Phone, MapPin, Leaf } from "lucide-react";

export default function Footer() {
  return (
          <footer className="bg-gray-950 text-gray-500 pt-14 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg">S</div>
                <span className="font-black text-white text-lg">ServiceMate</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">Bengaluru's most trusted home service platform. Quality service, verified pros, guaranteed results.</p>
              <div className="flex gap-3">
                {["📱","💬","📧"].map((icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition">{icon}</div>
                ))}
              </div>
            </div>
            {[
              { title:"Services", links:["Plumbing","Electrician","AC Service","Home Cleaning","Pest Control","Painting"] },
              { title:"Company", links:["About Us","Careers","Blog","Press","Partners","Sitemap"] },
              { title:"Support", links:["Help Center","Contact Us","Privacy Policy","Terms of Service","Refund Policy"] },
            ].map(col => (
              <div key={col.title}>
                <p className="font-black text-white text-sm mb-4">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(l => <li key={l}><a href="#" className="text-sm hover:text-white transition">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
            <p>© 2026 ServiceMate. All rights reserved.</p>
            <p>Made with ❤️ for Bengaluru</p>
          </div>
        </div>
      </footer>
  );
}