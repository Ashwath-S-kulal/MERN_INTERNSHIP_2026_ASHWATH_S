
import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <WifiOff className="h-12 w-12 text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          No Internet Connection
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-base leading-7 mb-8">
          Oops! It looks like you are not connected to the internet.
          Please check your network connection and try again.
        </p>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 py-3 text-white font-semibold shadow-md transition-all duration-200 hover:bg-blue-700 active:scale-95"
        >
          <RefreshCw size={18} />
          Try Again
        </button>

        <p className="mt-6 text-sm text-gray-400">
          Please check your Wi-Fi or mobile data connection.
        </p>

      </div>
    </div>
  );
};

export default NetworkStatus;
