"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [sensor, setSensor] = useState({
    suhu: 0,
    kelembaban: 0,
    gas: 0,
    suara: 0,
    gerakan: 0,
  });
  const [history, setHistory] = useState([]);
  const [range, setRange] = useState({ start: "", end: "" });
  const [intervalSec, setIntervalSec] = useState(10);
  const [expanded, setExpanded] = useState({}); // Untuk dropdown tiap card

  // Realtime SSE untuk Card
  // useEffect(() => {
  //   const evtSource = new EventSource(
  //     "https://monitoring-api-vercel.vercel.app/api/sensor-realtime"
  //   );
  //   evtSource.onmessage = (e) => {
  //     try {
  //       const data = JSON.parse(e.data);
  //       setSensor((prev) => ({ ...prev, ...data }));
  //     } catch (err) {
  //       console.error("Gagal parsing data SSE:", err);
  //     }
  //   };
  //   return () => evtSource.close();
  // }, []);
// Polling setiap 5 menit untuk Card
useEffect(() => {
  const fetchLatest = async () => {
    try {
      const res = await fetch("https://monitoring-api-vercel.vercel.app/api/sensor-latest");
      const data = await res.json();
      setSensor((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error("Gagal fetch data latest:", err);
    }
  };

  // Ambil sekali saat mount
  fetchLatest();

  // Polling tiap 5 menit
  const intervalId = setInterval(fetchLatest, 300000);

  return () => clearInterval(intervalId);
}, []);

  // Fetch data chart sesuai rentang
  const fetchRangeData = async (start, end) => {
    if (!start || !end) return;
    try {
      const startISO = new Date(start).toISOString();
      const endISO = new Date(end).toISOString();

      const res = await fetch(
        `https://monitoring-api-vercel.vercel.app/api/sensor-range?start=${startISO}&end=${endISO}`
      );
      const json = await res.json();
      if (json.success) {
        const formatted = json.data.map((d) => ({
          ...d,
          timestamp: d.timestamp
            ? new Date(d.timestamp).toISOString()
            : null,
        }));
        setHistory(formatted);
      }
    } catch (err) {
      console.error("Gagal fetch range data:", err);
    }
  };

  // Default: load data hari ini
  useEffect(() => {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date();
    setRange({
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
    });
    fetchRangeData(start, end);
  }, []);

  const chartData = {
    labels: history.map((d) =>
      d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : ""
    ),
    datasets: [
      {
        label: "Suhu (°C)",
        data: history.map((d) => d.suhu ?? 0),
        borderColor: "red",
      },
      {
        label: "Kelembaban (%)",
        data: history.map((d) => d.kelembaban ?? 0),
        borderColor: "blue",
      },
      {
        label: "Gas",
        data: history.map((d) => d.gas ?? 0),
        borderColor: "green",
      },
      {
        label: "Suara",
        data: history.map((d) => d.suara ?? 0),
        borderColor: "orange",
      },
    ],
  };

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Cards - Realtime Data */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Suhu", value: `${sensor.suhu?.toFixed(2)} °C`, key: "suhu" },
          { label: "Kelembaban", value: `${sensor.kelembaban?.toFixed(2)} %`, key: "kelembaban" },
          { label: "Gas", value: sensor.gas?.toFixed(2), key: "gas" },
          { label: "Suara", value: sensor.suara, key: "suara" },
          { label: "Gerakan", value: sensor.gerakan, key: "gerakan" },
        ].map((item) => (
          <div
            key={item.key}
            className="bg-white shadow p-4 rounded cursor-pointer"
            onClick={() => toggleExpand(item.key)}
          >
            <h3 className="font-semibold">{item.label}</h3>
            <p className="text-xl">{item.value}</p>
            {expanded[item.key] && (
              <div className="mt-2 text-sm text-gray-500">
                Detail {item.label} - Data diambil realtime
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Mulai:</label>
          <input
            type="datetime-local"
            className="border rounded p-1"
            value={range.start}
            onChange={(e) => setRange({ ...range, start: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm">Selesai:</label>
          <input
            type="datetime-local"
            className="border rounded p-1"
            value={range.end}
            onChange={(e) => setRange({ ...range, end: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm">Interval:</label>
          <select
            className="border rounded p-1"
            value={intervalSec}
            onChange={(e) => setIntervalSec(Number(e.target.value))}
          >
            <option value={10}>10 Detik</option>
            <option value={60}>1 Menit</option>
            <option value={3600}>1 Jam</option>
            <option value={86400}>1 Hari</option>
          </select>
        </div>
        <button
          onClick={() => fetchRangeData(range.start, range.end)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Terapkan
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow">
        <Line data={chartData} />
      </div>
    </div>
  );
}
