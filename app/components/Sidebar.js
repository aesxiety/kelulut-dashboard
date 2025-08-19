"use client";
import Link from "next/link";

export default function Sidebar({ open, setOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-60 bg-white shadow p-4 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0`}
    >
      {/* Header di sidebar mobile */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={() => setOpen(false)}>✖</button>
      </div>

      {/* Menu */}
      <h2 className="hidden md:block text-lg font-semibold mb-4">Menu</h2>
      <ul className="space-y-3">
        <li>
          <Link href="/" className="hover:text-blue-500">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/realtime" className="hover:text-blue-500">
            Data Realtime
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-blue-500">
            Pengaturan
          </Link>
        </li>
      </ul>
    </aside>
  );
}
