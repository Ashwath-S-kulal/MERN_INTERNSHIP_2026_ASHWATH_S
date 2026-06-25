import { useState } from "react";
export default function AiDescriptionInput({
    value,
    onChange,
}) {
    const [loading, setLoading] = useState(false);

    const generateDescription = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("accessToken");

            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/ai/generate-description`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prompt: value,
                }),
            });

            const data = await res.json();

            console.log("AI Response:", data);

            onChange(data.description);
        } finally {
            setLoading(false);
        }
    };


    return (
        <button
            type="button"
            disabled={loading}
            onClick={generateDescription}
            className={`
    relative inline-flex items-center justify-center gap-2 px-4 py-1.5 
    rounded-md text-[10px] font-black 
    transition-all duration-300 ease-out
    ${loading
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-slate-900 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 active:scale-95'
                }
  `}
        >
            {loading ? (
                <>
                    <div className="w-3 h-3 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                </>
            ) : (
                <>
                    <span className="text-[12px]">✨</span>
                    <span>AI Generate</span>
                </>
            )}
        </button>
    );
}