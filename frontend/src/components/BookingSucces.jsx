import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation logic
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30); // Matches the 3-second (3000ms) redirect

    const timer = setTimeout(() => {
      navigate("/userdashboard/userbookings");
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative">
      {/* Subtle Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="z-10 flex flex-col items-center">
        {/* Animated Icon Container */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ripple Rings */}
          <div className="absolute w-32 h-32 bg-green-200 rounded-full animate-ping opacity-20"></div>
          <div className="absolute w-40 h-40 border-2 border-green-100 rounded-full animate-pulse"></div>
          
          {/* Main Circle */}
          <div className="w-24 h-24 rounded-full bg-green-500 shadow-xl shadow-green-200 flex items-center justify-center relative transform transition-transform duration-500 hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 0,
                animation: "drawCheck 0.8s ease-out forwards"
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mt-10 space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 font-medium">
            Your service has been successfully scheduled.
          </p>
        </div>

        {/* Progress Redirect Section */}
        <div className="mt-12 w-64">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Redirecting</span>
            <span className="text-xs font-bold text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">
            Taking you to your dashboard
          </p>
        </div>
      </div>

      {/* Embedded CSS for the "Draw" effect */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drawCheck {
          0% { stroke-dashoffset: 100; opacity: 0; transform: scale(0.5); }
          100% { stroke-dashoffset: 0; opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
};

export default BookingSuccess;