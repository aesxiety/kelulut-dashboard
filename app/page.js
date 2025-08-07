// // app/page.js
// "use client";

// import { useEffect, useState } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// export default function Home() {
//   const [sensor, setSensor] = useState(null);
//   const [riwayat, setRiwayat] = useState([]);

//   const fetchData = async () => {
//     try {
//       const res1 = await fetch("https://monitoring-api-vercel.vercel.app/api/latest");
//       const data1 = await res1.json();
//       setSensor(data1.data);

//       const res2 = await fetch("https://monitoring-api-vercel.vercel.app/api/history");
//       const data2 = await res2.json();
//       const formatted = data2.data.map(item => ({
//         ...item,
//         waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', {
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit'
//         })
//       }));
//     setRiwayat(formatted);
//     } catch (e) {
//       console.error("Gagal fetch data:", e);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 10000); // Auto update tiap 10 detik
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow p-4">
//         <h1 className="text-2xl font-bold text-center text-yellow-600">
//           Monitoring Kelulut
//         </h1>
//       </nav>

//       <main className="p-6">
//         <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
//           Data Sensor Terbaru
//         </h2>

//         {sensor ? (
//           <>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
//               <Card label="Suhu (°C)" value={sensor.suhu} />
//               <Card label="Kelembaban (%)" value={sensor.kelembaban} />
//               <Card label="Tekanan (hPa)" value={sensor.tekanan} />
//               <Card label="Gas (ppm)" value={sensor.gas} />
//               <Card label="Suara (dB)" value={sensor.suara} />
//               <Card label="Berat (g)" value={sensor.berat ?? "-"} />
//               <Card
//                 label="Anomali"
//                 value={sensor.anomaly ? "Ya" : "Aman"}
//                 className={sensor.anomaly ? "text-red-600" : "text-green-600"}
//               />
//             </div>

//             <div className="bg-white rounded-xl shadow p-4">
//               <h2 className="text-lg font-bold mb-4">📊 Grafik Suhu Terakhir</h2>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={riwayat}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="waktu" />
//                   <YAxis domain={['auto', 'auto']} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="suhu" stroke="#ff7300" activeDot={{ r: 6 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </>
//         ) : (
//           <p className="text-center text-gray-500">Memuat data...</p>
//         )}
//       </main>
//     </div>
//   );
// }

// function Card({ label, value, className = "" }) {
//   return (
//     <div className="bg-white rounded-xl shadow p-4">
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className={`text-2xl font-semibold ${className}`}>{value}</p>
//     </div>
//   );
// }



// app/page.js
"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Thermometer, Droplet, Wind, Activity, Volume2, Weight, AlertTriangle, CheckCircle
} from "lucide-react";

export default function Home() {
  const [sensor, setSensor] = useState(null);
  const [riwayat, setRiwayat] = useState([]);

  const fetchData = async () => {
    try {
      const res1 = await fetch("https://monitoring-api-vercel.vercel.app/api/latest");
      const data1 = await res1.json();
      setSensor(data1.data);

      const res2 = await fetch("https://monitoring-api-vercel.vercel.app/api/history");
      const data2 = await res2.json();
      const formatted = data2.data.map(item => ({
        ...item,
        waktu: new Date(item.timestamp).toLocaleTimeString("id-ID", {
          hour: "2-digit", minute: "2-digit", second: "2-digit"
        }),
      }));
      setRiwayat(formatted);
    } catch (e) {
      console.error("Gagal fetch data:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-600">
          🐝 Monitoring Kelulut Dashboard
        </h1>
        <span className="text-sm text-gray-500">Realtime Monitoring</span>
      </nav>

      {/* Main */}
      <main className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
            Data Sensor Terbaru
          </h2>

          {sensor ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SensorCard icon={<Thermometer />} label="Suhu" unit="°C" value={sensor.suhu} color="text-red-500" />
              <SensorCard icon={<Droplet />} label="Kelembaban" unit="%" value={sensor.kelembaban} color="text-blue-500" />
              <SensorCard icon={<Wind />} label="Tekanan" unit="hPa" value={sensor.tekanan} color="text-indigo-500" />
              <SensorCard icon={<Activity />} label="Gas" unit="ppm" value={sensor.gas} color="text-purple-500" />
              <SensorCard icon={<Volume2 />} label="Suara" unit="dB" value={sensor.suara} color="text-orange-500" />
              <SensorCard icon={<Weight />} label="Berat" unit="g" value={sensor.berat ?? "-"} color="text-pink-500" />
              <AnomalyCard isAnomaly={sensor.anomaly} />
            </div>
          ) : (
            <p className="text-center text-gray-500">Memuat data...</p>
          )}
        </section>

        {/* Grafik */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            📊 Grafik Suhu Terakhir
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riwayat}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="waktu" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="suhu" stroke="#f59e0b" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}

// Card Sensor
function SensorCard({ icon, label, value, unit, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div className={`p-3 bg-gray-100 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value} {unit}</p>
      </div>
    </div>
  );
}

// Card Anomali
function AnomalyCard({ isAnomaly }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div className={`p-3 bg-gray-100 rounded-full ${isAnomaly ? "text-red-600" : "text-green-600"}`}>
        {isAnomaly ? <AlertTriangle /> : <CheckCircle />}
      </div>
      <div>
        <p className="text-sm text-gray-500">Status Anomali</p>
        <p className={`text-xl font-bold ${isAnomaly ? "text-red-600" : "text-green-600"}`}>
          {isAnomaly ? "Terdeteksi" : "Aman"}
        </p>
      </div>
    </div>
  );
}
