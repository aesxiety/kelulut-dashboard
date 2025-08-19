"use client";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react"; // ikon hamburger

export default function Navbar() {
  const [timestamp, setTimestamp] = useState("");
  const [open, setOpen] = useState(false); // ✅ ini yang kurang

  useEffect(() => {
    const evtSource = new EventSource("https://monitoring-api-vercel.vercel.app/api/sensor-realtime");
    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.timestamp) {
          const localTime = new Date(data.timestamp).toLocaleString();
          setTimestamp(localTime);
        }
      } catch {}
    };
    return () => evtSource.close();
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex items-center">
        {/* Tombol hamburger (muncul hanya di mobile) */}
        <button onClick={() => setOpen(!open)} className="md:hidden mr-2">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Kelulut Monitoring Dashboard</h1>
      </div>
      <span className="text-sm">
        {timestamp ? `Last update: ${timestamp}` : "Loading..."}
      </span>
    </nav>
  );
}
