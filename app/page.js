"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Thermometer, Droplet, Wind, Activity, Volume2, Weight, AlertTriangle, CheckCircle
} from "lucide-react";

// export default function Home() {
//   const [sensor, setSensor] = useState(null);
//   const [riwayat, setRiwayat] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [availableDates, setAvailableDates] = useState([]);

//   // Fetch awal
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const res1 = await fetch("https://monitoring-api-vercel.vercel.app/api/latest");
//         const data1 = await res1.json();
//         setSensor(data1.data);

//         const res2 = await fetch("https://monitoring-api-vercel.vercel.app/api/history");
//         const data2 = await res2.json();

//         const formatted = data2.data.map(item => {
//           const date = new Date(item.timestamp);
//           return {
//             ...item,
//             waktu: date.toLocaleTimeString("id-ID", {
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit"
//             }),
//             tanggal: date.toLocaleDateString("id-ID", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric"
//             }),
//           };
//         });

//         setRiwayat(formatted);

//         const dates = [...new Set(formatted.map(item => item.tanggal))];
//         setAvailableDates(dates);

//         setSelectedDate(prev => prev || dates[dates.length - 1]);
//       } catch (e) {
//         console.error("Gagal fetch data:", e);
//       }
//     };

//     loadInitialData();
//   }, []);

//   // Update tiap 10 detik
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res1 = await fetch("https://monitoring-api-vercel.vercel.app/api/latest");
//         const data1 = await res1.json();
//         setSensor(data1.data);

//         const res2 = await fetch("https://monitoring-api-vercel.vercel.app/api/history");
//         const data2 = await res2.json();

//         const formatted = data2.data.map(item => {
//           const date = new Date(item.timestamp);
//           return {
//             ...item,
//             waktu: date.toLocaleTimeString("id-ID", {
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit"
//             }),
//             tanggal: date.toLocaleDateString("id-ID", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric"
//             }),
//           };
//         });

//         setRiwayat(formatted);

//         const dates = [...new Set(formatted.map(item => item.tanggal))];
//         setAvailableDates(dates);
//       } catch (e) {
//         console.error("Gagal update data:", e);
//       }
//     }, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   const filteredData = selectedDate === "Semua"
//     ? riwayat
//     : riwayat.filter(item => item.tanggal === selectedDate);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
//       {/* Navbar */}
//       <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-yellow-600">
//           🐝 Monitoring Kelulut Dashboard
//         </h1>
//         <span className="text-sm text-gray-500">Realtime Monitoring</span>
//       </nav>

//       {/* Main */}
//       <main className="p-6 space-y-6">
//         {/* Data Sensor */}
//         <section>
//           <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
//             Data Sensor Terbaru
//           </h2>

//           {sensor ? (
//             <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
//               <SensorCard icon={<Thermometer/>} label="Suhu" unit="°C" value={sensor.suhu} color="text-red-500" />
//               <SensorCard icon={<Droplet />} label="Kelembaban" unit="%" value={sensor.kelembaban} color="text-blue-500" />
//               <SensorCard icon={<Wind />} label="Tekanan" unit="hPa" value={sensor.tekanan} color="text-indigo-500" />
//               <SensorCard icon={<Activity />} label="Gas" unit="ppm" value={sensor.gas} color="text-purple-500" />
//               <SensorCard icon={<Volume2 />} label="Suara" unit="dB" value={sensor.suara} color="text-orange-500" />
//               <AnomalyCard isAnomaly={sensor.anomaly} />
//             </div>
//           ) : (
//             <p className="text-center text-gray-500">Memuat data...</p>
//           )}
//         </section>

//         {/* Tombol Tanggal */}
//         <section className="bg-white rounded-xl shadow p-4">
//           <h2 className="text-md font-bold text-gray-600 mb-2">Pilih Tanggal Monitoring:</h2>
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setSelectedDate("Semua")}
//               className={`px-4 py-2 rounded-full text-sm font-medium ${
//                 selectedDate === "Semua"
//                   ? "bg-yellow-500 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               Semua
//             </button>

//             {availableDates.map((tanggal) => (
//               <button
//                 key={tanggal}
//                 onClick={() => setSelectedDate(tanggal)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium ${
//                   selectedDate === tanggal
//                     ? "bg-yellow-500 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {tanggal}
//               </button>
//             ))}
//           </div>
//         </section>
//         {/* Grafik */}
//         <section className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-black font-bold mb-4 flex items-center gap-2">
//           📊 Grafik Suhu - {selectedDate}
//         </h2>

//         {filteredData.length === 0 ? (
//           <p className="text-gray-500">Tidak ada data untuk tanggal ini.</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart
//               data={filteredData.map(item => ({
//                 ...item,
//                 // Jika "Semua", gabungkan waktu + tanggal agar tidak ambigu
//                 waktuLabel:
//                   selectedDate === "Semua"
//                     ? `${item.waktu} - ${item.tanggal}`
//                     : item.waktu
//               }))}
//             >
//               {/* Grid Chart */}
//               <CartesianGrid strokeDasharray="3 3" />

//               {/* Sumbu X - Waktu */}
//               <XAxis
//                 dataKey="waktuLabel"
//                 stroke="#000"
//                 tick={{ fill: '#000', fontSize: 11 }}
//                 label={{
//                   value: 'Waktu',
//                   position: 'insideBottom',
//                   offset: -5,
//                   fill: '#000',
//                   fontSize: 13,
//                 }}
//                 interval="preserveStartEnd"
//                 minTickGap={20}
//               />

//               {/* Sumbu Y - Suhu */}
//               <YAxis
//                 stroke="#000"
//                 tick={{ fill: '#000', fontSize: 12 }}
//                 label={{
//                   value: 'Suhu (°C)',
//                   angle: -90,
//                   position: 'insideLeft',
//                   offset: 10,
//                   fill: '#000',
//                   fontSize: 14,
//                 }}
//               />

//               {/* Tooltip & Line */}
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="suhu"
//                 stroke="#f59e0b"
//                 activeDot={{ r: 6 }}
//                 name="Suhu"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         )}
//       </section>
//       </main>
//     </div>
//   );
// }

// // SensorCard (kotak persegi)
// function SensorCard({ icon, label, value, unit, color }) {
//   return (
//     <div className="bg-purple-200 rounded-xl shadow hover:shadow-md w-105 h-50 flex flex-col items-center justify-center transition-transform hover:scale-105">
//       <div className={`p-2 bg-gray-100 rounded-full mb-1 ${color}`}>
//         {icon}
//       </div>
//       <p className="text-l text-gray-500">{label}</p>
//       <p className="text-2xl font-semibold text-gray-800">{value} {unit}</p>
//     </div>
//   );
// }

// // AnomalyCard (status aman/bahaya)
// function AnomalyCard({ isAnomaly }) {
//   return (
//     <div className="bg-white rounded-xl shadow hover:shadow-md w-300 h-40 flex flex-col items-center justify-center transition-transform hover:scale-105 col-span-full place-self-center">
//       <div className={`p-2 bg-gray-100 rounded-full mb-1 ${isAnomaly ? "text-red-600" : "text-green-600"}`}>
//         {isAnomaly ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
//       </div>
//       <p className="text-l text-gray-500 text-center">Status</p>
//       <p className={`text-2xl font-bold ${isAnomaly ? "text-red-600" : "text-green-600"}`}>
//         {isAnomaly ? "Anomali" : "Aman"}
//       </p>
//     </div>
//   );
// }

// ...[potongan import tetap sama]

export default function Home() {
  const [sensor, setSensor] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("suhu"); // default ke suhu

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res1 = await fetch("https://monitoring-api-vercel.vercel.app/api/latest");
        const data1 = await res1.json();
        setSensor(data1.data);

        const res2 = await fetch("https://monitoring-api-vercel.vercel.app/api/history");
        const data2 = await res2.json();

        const formatted = data2.data.map(item => {
          const date = new Date(item.timestamp);
          return {
            ...item,
            waktu: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            tanggal: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
          };
        });

        setRiwayat(formatted);

        const dates = [...new Set(formatted.map(item => item.tanggal))];
        setAvailableDates(dates);
        setSelectedDate(prev => prev || dates[dates.length - 1]);
      } catch (e) {
        console.error("Gagal fetch data:", e);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res1 = await fetch("https://monitoring-api-vercel.vercel.app/api/latest");
        const data1 = await res1.json();
        setSensor(data1.data);

        const res2 = await fetch("https://monitoring-api-vercel.vercel.app/api/history");
        const data2 = await res2.json();

        const formatted = data2.data.map(item => {
          const date = new Date(item.timestamp);
          return {
            ...item,
            waktu: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            tanggal: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
          };
        });

        setRiwayat(formatted);
        const dates = [...new Set(formatted.map(item => item.tanggal))];
        setAvailableDates(dates);
      } catch (e) {
        console.error("Gagal update data:", e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredData = selectedDate === "Semua"
    ? riwayat
    : riwayat.filter(item => item.tanggal === selectedDate);

  const chartData = filteredData.map(item => ({
    ...item,
    waktuLabel: selectedDate === "Semua" ? `${item.waktu} - ${item.tanggal}` : item.waktu,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-600">🐝 Monitoring Kelulut Dashboard</h1>
        <span className="text-sm text-gray-500">Realtime Monitoring</span>
      </nav>

      <main className="p-6 space-y-4">
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Card Data Sensor */}
          <div className="flex-1 grid gap-3 grid-cols-2 sm:grid-cols-3">
            <SensorCard icon={<Thermometer />} label="Suhu" unit="°C" value={sensor?.suhu} color="text-red-500" onClick={() => setSelectedSensor("suhu")} active={selectedSensor === "suhu"} />
            <SensorCard icon={<Droplet />} label="Kelembaban" unit="%" value={sensor?.kelembaban} color="text-blue-500" onClick={() => setSelectedSensor("kelembaban")} active={selectedSensor === "kelembaban"} />
            <SensorCard icon={<Wind />} label="Tekanan" unit="hPa" value={sensor?.tekanan} color="text-indigo-500" onClick={() => setSelectedSensor("tekanan")} active={selectedSensor === "tekanan"} />
            <SensorCard icon={<Activity />} label="Gas" unit="ppm" value={sensor?.gas} color="text-purple-500" onClick={() => setSelectedSensor("gas")} active={selectedSensor === "gas"} />
            <SensorCard icon={<Volume2 />} label="Suara" unit="dB" value={sensor?.suara} color="text-orange-500" onClick={() => setSelectedSensor("suara")} active={selectedSensor === "suara"} />
          </div>
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-md font-bold text-gray-600 mb-2">Pilih Tanggal Monitoring:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDate("Semua")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${selectedDate === "Semua" ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Semua
            </button>
            {availableDates.map((tanggal) => (
              <button
                key={tanggal}
                onClick={() => setSelectedDate(tanggal)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedDate === tanggal ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                {tanggal}
              </button>
            ))}
          </div>
        
          {/* Grafik */}
          <div className="flex-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-black font-bold mb-4 flex items-center gap-2">
            📊 Grafik {selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} - {selectedDate}
          </h2>
          {chartData.length === 0 ? (
            <p className="text-gray-500">Tidak ada data untuk tanggal ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <div style={{ minWidth: '600px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="waktuLabel"
                      tick={{ fill: '#000', fontSize: 11 }}
                      label={{ value: 'Waktu', position: 'insideBottom', offset: -5, fill: '#000', fontSize: 13 }}
                      interval={Math.floor(chartData.length / 5)}
                      minTickGap={20}
                      stroke="#000"
                    />
                    <YAxis
                      tick={{ fill: '#000', fontSize: 12 }}
                      label={{
                        value: selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1),
                        angle: -90,
                        position: 'insideLeft',
                        offset: 20,
                        fill: '#000',
                        fontSize: 14,
                        style: { textAnchor: 'middle' },
                      }}
                      stroke="#000"
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey={selectedSensor}
                      stroke="#f59e0b"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name={selectedSensor}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </section>
    </section>
        {/* Anomali */}
        <section>
          {sensor && <AnomalyCard isAnomaly={sensor.anomaly} />}
        </section>
      </main>
    </div>
  );
}

function SensorCard({ icon, label, value, unit, color, onClick, active }) {
  return (
    <div onClick={onClick} className={`cursor-pointer bg-purple-200 rounded-xl shadow w-full h-40 flex flex-col items-center justify-center transition-transform hover:scale-105 ${active ? "ring-2 ring-yellow-500" : ""}`}>
      <div className={`p-2 bg-gray-100 rounded-full mb-1 ${color}`}>{icon}</div>
      <p className="text-l text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-800">{value} {unit}</p>
    </div>
  );
}

function AnomalyCard({ isAnomaly }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md w-full h-40 flex flex-col items-center justify-center transition-transform hover:scale-105">
      <div className={`p-2 bg-gray-100 rounded-full mb-1 ${isAnomaly ? "text-red-600" : "text-green-600"}`}>
        {isAnomaly ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      </div>
      <p className="text-l text-gray-500 text-center">Status</p>
      <p className={`text-2xl font-bold ${isAnomaly ? "text-red-600" : "text-green-600"}`}>
        {isAnomaly ? "Anomali" : "Aman"}
      </p>
    </div>
  );
}
