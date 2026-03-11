import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AppWindow,
  BarChart3,
  Star,
  Heart,
  Settings,
  FileText,
  Wallet,
  Menu,
} from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Apps", icon: AppWindow, to: "/apps" },
  { label: "Charts", icon: BarChart3, to: "/charts" },
  { label: "Bootstrap", icon: Star, to: "/bootstrap" },
  { label: "Plugins", icon: Heart, to: "/plugins" },
  { label: "Widget", icon: Settings, to: "/widget" },
  { label: "Forms", icon: FileText, to: "/forms" },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:w-[260px] md:shrink-0 md:flex-col md:border-r md:border-white/40 md:bg-white/70 md:p-4 md:backdrop-blur">
      <div className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700 to-fuchsia-500 text-white">
            <Wallet size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Admin</h1>
        </div>
        <button className="text-slate-800">
          <Menu size={22} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900">Hi, AC</p>
          <p className="text-xs text-slate-500">xyz@gmail.com</p>
        </div>
      </div>

      <nav className="mt-5 flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
