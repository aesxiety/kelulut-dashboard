'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [sensor, setSensor] = useState(null);
  const [riwayat, setRiwayat] = useState([]);

  const fetchData = async () => {
    try {
      const res1 = await fetch('https://monitoring-api-vercel.vercel.app/api/latest');
      const data1 = await res1.json();
      setSensor(data1.data);

      const res2 = await fetch('https://monitoring-api-vercel.vercel.app/api/history');
      const data2 = await res2.json();
      setRiwayat(data2.data);
    } catch (e) {
      console.error('Gagal fetch data:', e);
    }
  };

  useEffect(() => {
    fetchData(); // fetch awal
    const interval = setInterval(fetchData, 10000); // tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">🐝 Dashboard Sensor Kelulut</h1>

      {sensor ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card label="Suhu (°C)" value={sensor.suhu} />
            <Card label="Kelembaban (%)" value={sensor.kelembaban} />
            <Card label="Tekanan (hPa)" value={sensor.tekanan} />
            <Card label="Gas (ppm)" value={sensor.gas} />
            <Card label="Berat (g)" value={sensor.berat} />
            <Card label="Anomali" value={sensor.anomaly ? '⚠️ YA' : '✅ Aman'} danger={sensor.anomaly} />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-bold mb-4">📊 Grafik Suhu Terakhir</h2>
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
        <p>Memuat data sensor...</p>
      )}
    </main>
  );
}

function Card({ label, value, danger }) {
  return (
    <div className={`rounded-xl p-4 shadow-md ${danger ? 'bg-red-100' : 'bg-white'}`}>
      <p className="text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${danger ? 'text-red-700' : 'text-gray-800'}`}>{value}</p>
    </div>
  );
}
