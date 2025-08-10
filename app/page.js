"use client";

import'./globals.css';
import { useEffect, useState } from "react";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";

import {
  Thermometer, Droplet, Wind, Activity, Volume2, Weight, AlertTriangle, CheckCircle
} from "lucide-react";

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Home() {
  const [sensor, setSensor] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [filterMode, setFilterMode] = useState("semua"); // 'semua' atau 'rentang'
  const [range, setRange] = useState({ from: "", to: "" });
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

  const filteredData = (() => {
    if (filterMode === "semua") return riwayat;
    if (filterMode === "rentang" && range.from && range.to) {
      const fromDate = new Date(range.from);
      const toDate = new Date(range.to);
      return riwayat.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    return [];
  })();

  const chartData = filteredData.map(item => ({
    waktuLabel: item.waktu,
    suhu: item.suhu,
    kelembaban: item.kelembaban,
    gas: item.gas,
    suara: item.suara,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <nav className="bg-green-600 shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-600">🐝 Monitoring Kelulut Dashboard</h1>
        <span className="text-sm text-gray-500">Realtime Monitoring</span>
      </nav>

      <main className="p-6 space-y-4">
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Card Data Sensor */}
          <div className="flex-1 grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-2">
            <SensorCard icon={<Thermometer color="red"/>} label="Suhu" unit="°C" value={sensor?.suhu} color="text-red-500" onClick={() => setSelectedSensor("suhu")} active={selectedSensor === "suhu"} />
            <SensorCard icon={<Droplet />} label="Kelembaban" unit="%" value={sensor?.kelembaban} color="text-blue-500" onClick={() => setSelectedSensor("kelembaban")} active={selectedSensor === "kelembaban"} />
            <SensorCard icon={<Activity color="darkgray" />} label="Gas" unit="ppm" value={sensor?.gas} color="text-purple-500" onClick={() => setSelectedSensor("gas")} active={selectedSensor === "gas"} />
            <SensorCard icon={<Volume2 color="black" />} label="Suara" unit="dB" value={sensor?.suara} color="text-orange-500" onClick={() => setSelectedSensor("suara")} active={selectedSensor === "suara"} />
          </div>
        <section className="bg-white rounded-xl shadow p-4">
          <h2 className="text-md font-bold text-gray-600 mb-2">Pilih Tanggal Monitoring:</h2>
          <div className="space-y-3">
            <div className="flex gap-2 mt-4 mb-5">
            <button
              onClick={() => setFilterMode("semua")}
              className={`px-4 py-2 rounded font-semibold ${
                filterMode === "semua"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Semua Data
            </button>
            <button
              onClick={() => setFilterMode("rentang")}
              className={`px-4 py-2 rounded font-semibold ${
                filterMode === "rentang"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Rentang Tanggal
            </button>
          </div>

            {filterMode === "rentang" && (
              <div className="flex gap-4">
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={range.from}
                  onChange={(e) => setRange({ ...range, from: e.target.value })}
                />
                <span className="mt-2">sampai</span>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={range.to}
                  onChange={(e) => setRange({ ...range, to: e.target.value })}
                />
              </div>
            )}
          </div>
        
          {/* Grafik */}
          <div className="flex-1 bg-white rounded-xl shadow p-6">
          <h2 className="text-black font-bold mb-4 flex items-center gap-2">
            📊 Grafik {selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)}       {filterMode === "semua" ? "Semua Data" : `${range.from} - ${range.to}`}
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
  const isSuhu = label === "Suhu";
  const isKelembaban = label === "Kelembaban";

  const displayColor = isSuhu
    ? getTemperatureColor(value)
    : isKelembaban
    ? getHumidityColor(value)
    : undefined;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-orange-300 rounded-xl shadow w-full h-60 flex flex-col items-center justify-center p-4 transition-transform hover:scale-95 ${
        active ? "ring-2 ring-yellow-500" : ""
      }`}
    >
      <div className={`p-2 rounded-full mb-2`} style={{ color: displayColor || undefined }}>
        {icon}
      </div>
      <p className="text-md text-gray-600 mb-2">{label}</p>

      {(isSuhu || isKelembaban) && value !== undefined ? (
        <div className="w-24 h-24">
          <CircularProgressbar
            value={value}
            maxValue={isSuhu ? 50 : 100}
            text={`${value}${unit}`}
            styles={buildStyles({
              pathColor: displayColor,
              textColor: "#111827",
              trailColor: "#e5e7eb",
              strokeLinecap: "round",
            })}
          />
        </div>
      ) : (
        <p className={`text-2xl font-bold text-gray-800`}>
          {value} {unit}
        </p>
      )}
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

function getTemperatureColor(temp) {
  if (temp >= 30 && temp <= 35) return '#22c55e'; // Hijau (optimal)
  if (temp < 30) return '#3b82f6'; // Biru (dingin)
  return '#ef4444'; // Merah (terlalu panas)
}

function getHumidityColor(hum) {
  if (hum >= 60 && hum <= 80) return '#22c55e'; // Hijau (optimal)
  if (hum < 60) return '#f59e0b'; // Kuning (kering)
  return '#06b6d4'; // Cyan (lembab banget)
}
