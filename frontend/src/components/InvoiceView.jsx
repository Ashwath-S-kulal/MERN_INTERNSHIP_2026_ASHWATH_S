import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Download, ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function InvoiceView() {
    const location = useLocation();
    const navigate = useNavigate();
    const invoiceRef = useRef(null);
    const { booking, workerDetails } = location.state || {};

    const handleDownload = async () => {
        const element = invoiceRef.current;
        if (!element) return;
        try {
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff",
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`ServiceMate_Invoice_${booking?.transactionId}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
        }
    };

    if (!booking) return <div className="p-10 text-center font-black">NO INVOICE DATA FOUND</div>;

    const baseTotal = booking.hoursWorked * booking.price;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 flex flex-col items-center">
            <div className="w-full max-w-2xl flex justify-between mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                    <ArrowLeft size={16} /> Back 
                </button>
                <button onClick={handleDownload} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl hover:bg-blue-600 transition-all">
                    <Download size={16} /> Export PDF
                </button>
            </div>

            <div ref={invoiceRef} className="w-full max-w-2xl bg-white p-12 shadow-2xl rounded-sm border border-slate-100">

                <div className="flex justify-between items-start border-b-4 border-slate-900 pb-3 mb-8">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-blue-600 mb-1">ServiceMate.</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Professional Home Services</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                            <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Official Receipt</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400">DATE: {booking.invoiceDate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-8">
                    <div>
                        <h4 className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">User Details</h4>
                        <div className="flex items-center gap-4">
                            <img
                                src={booking.user?.profilePic || "https://ui-avatars.com/api/?name=User&background=random"}
                                className="w-8 h-8 rounded-2xl object-cover ring-4 ring-slate-50"
                                alt="Client"
                            />
                            <div>
                                <p className="text-md font-black text-slate-900 leading-tight">{booking.user?.firstName} {booking.user?.lastName}</p>
                                <p className="text-[10px] font-bold text-slate-400 italic">{booking?.user?.phoneNo}</p>
                            </div>
                        </div>
                        <div className="mt-2 space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><MapPin size={12} /> {booking.address?.area}, {booking.address?.city}</p>
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Phone size={12} /> {booking.user?.phoneNo}</p>
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Mail size={12} /> {booking.user?.email}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">Service Provider</h4>
                        <div className="flex items-center gap-4">
                            <img
                                src={booking.provider?.user?.profilePic || "https://ui-avatars.com/api/?name=Provider&background=random"}
                                className="w-8 h-8 rounded-2xl object-cover ring-4 ring-slate-50"
                                alt="Provider"
                            />
                            <div>
                                <p className="text-md font-black text-slate-900 leading-tight">{booking.provider?.user?.firstName} {booking.provider?.user?.lastName}</p>
                                <p className="text-[10px] font-black text-blue-600  tracking-widest">{booking.provider?.title || "Technician"}</p>
                            </div>
                        </div>
                        <div className="mt-2 space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><MapPin size={12} />  {booking.provider?.address},{booking.provider?.city}</p>
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Phone size={12} /> {booking.provider.user?.phoneNo}</p>
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"> <Mail size={12} /> {booking.provider?.user.email}</p>
                        </div>
                    </div>

                    <div className="col-span-2 p-4 mt-5  bg-slate-50/50 rounded-md border border-dashed border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={workerDetails.profilePic || "https://ui-avatars.com/api/?name=User&background=random"}
                                    className="w-10 h-10 rounded-2xl object-cover grayscale-[20%] border-2 border-white shadow-sm"
                                    alt="Worker"
                                />

                            </div>

                            <div>
                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Assigned Specialist</p>
                                <h3 className="text-md font-black text-slate-900 leading-tight">
                                    {workerDetails?.fullname}
                                </h3>
                                <p className="text-[8px] font-bold text-slate-500 italic uppercase tracking-wider">
                                    {workerDetails?.role || "Expert Technician"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 text-right border-l border-slate-200 pl-8">
                            <div className="flex items-center justify-start gap-2 text-slate-600 font-bold text-[10px]">
                                <Phone size={12} className="text-slate-400" />
                                <span>{workerDetails.phonenumber}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2 text-slate-600 font-bold text-[10px]">
                                <Mail size={12} className="text-slate-400" />
                                <span>{workerDetails.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-5 overflow-hidden rounded-md border border-slate-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                    Qty <span className="text-[9px] text-slate-300 font-bold">({booking.unit})</span>
                                </th>
                                <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                    Rate <span className="text-[9px] text-slate-300 font-bold">(/ {booking.unit})</span>
                                </th>
                                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="group">
                                <td className="py-5 px-4">
                                    <p className="font-bold text-slate-800 text-sm leading-tight">{booking.serviceType}</p>
                                    <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mt-1 block">Standard Service</span>
                                </td>
                                <td className="py-5 text-center text-sm font-bold text-slate-600">
                                    {booking.hoursWorked}
                                </td>
                                <td className="py-5 text-right text-sm font-bold text-slate-600">
                                    ₹{booking.price.toLocaleString()}
                                </td>
                                <td className="py-5 px-4 text-right text-sm font-black text-slate-900">
                                    ₹{baseTotal.toLocaleString()}
                                </td>
                            </tr>

                            {booking.extraCharges?.map((item, i) => (
                                <tr key={i} className="bg-slate-50/30">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                            <p className="font-bold text-slate-600 text-sm">{item.name}</p>
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase ml-3">Additional Charge</span>
                                    </td>
                                    <td className="py-4 text-center text-sm font-bold text-slate-500">1</td>
                                    <td className="py-4 text-right text-sm font-bold text-slate-500">₹{Number(item.price).toLocaleString()}</td>
                                    <td className="py-4 px-4 text-right text-sm font-black text-slate-700">₹{Number(item.price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end border-t-2 border-slate-100 pt-6">
                    <div className="w-64 space-y-3">

                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-slate-900 uppercase">Grand Total</span>
                            <span className="text-2xl font-black text-blue-600">₹{booking.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="text-right pt-2">
                            <span className="text-[9px] font-black uppercase px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full tracking-[0.1em]">
                                Payment {booking.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck size={18} className="text-blue-600" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Thank you for using ServiceMate</p>
                    </div>

                </div>
            </div>
        </div>
    );
}