// app/page.js
"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
        waktu: new Date(item.timestamp).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }));
    setRiwayat(formatted);
    } catch (e) {
      console.error("Gagal fetch data:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto update tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-center text-yellow-600">
          Monitoring Kelulut
        </h1>
      </nav>

      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Data Sensor Terbaru
        </h2>

        {sensor ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card label="Suhu (°C)" value={sensor.suhu} />
              <Card label="Kelembaban (%)" value={sensor.kelembaban} />
              <Card label="Tekanan (hPa)" value={sensor.tekanan} />
              <Card label="Gas (ppm)" value={sensor.gas} />
              <Card label="Suara (dB)" value={sensor.suara} />
              <Card label="Berat (g)" value={sensor.berat ?? "-"} />
              <Card
                label="Anomali"
                value={sensor.anomaly ? "Ya" : "Aman"}
                className={sensor.anomaly ? "text-red-600" : "text-green-600"}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-bold mb-4">📊 Grafik Suhu Terakhir</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={riwayat}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="waktu" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="suhu" stroke="#ff7300" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Memuat data...</p>
        )}
      </main>
    </div>
  );
}

function Card({ label, value, className = "" }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold ${className}`}>{value}</p>
    </div>
  );
}
