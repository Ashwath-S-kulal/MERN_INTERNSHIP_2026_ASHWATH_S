import { motion } from "framer-motion";
import logo from "../assets/logo.png";

export default function Loader() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 overflow-hidden">

      <div className="relative flex flex-col items-center">

        <motion.div
          className="absolute w-40 h-40"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          <div className="relative w-full h-full">
            <span className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2" />
            <span className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full -translate-x-1/2" />
            <span className="absolute left-0 top-1/2 w-3 h-3 bg-blue-300 rounded-full -translate-y-1/2" />
            <span className="absolute right-0 top-1/2 w-3 h-3 bg-blue-600 rounded-full -translate-y-1/2" />
          </div>
        </motion.div>

        <motion.img
          src={logo}
          alt="ServiceMate"
          className="w-24 h-24 rounded-2xl shadow-2xl z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="mt-24 text-gray-600 font-medium text-lg tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <TypingText text="Loading ServiceMate..." />
        </motion.div>

      </div>
    </div>
  );
}

function TypingText({ text }) {
  return (
    <span>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: i * 0.01,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}