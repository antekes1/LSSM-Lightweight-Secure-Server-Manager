import React from "react";
import Topbar from "../components/dashboard/Topbar";
import StatCard from "../components/dashboard/StatCard";
import WalletCard from "../components/dashboard/WalletCard";
import OverviewCard from "../components/dashboard/OverviewCard";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Send,
  Server
} from "lucide-react";

const stats = [
  { title: "Total Servers", value: "2", icon: Server, variant: "purple" },
  { title: "Paid Invoices", value: "983", icon: CheckCircle2, variant: "pink" },
  { title: "Unpaid Invoices", value: "1256", icon: XCircle, variant: "violet" },
  { title: "Invoices Sent", value: "652", icon: Send, variant: "dark" },
];

const HomePage = () => {
  return (
    <div className="space-y-4">
      <Topbar />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <WalletCard />
        <OverviewCard />
      </section>
    </div>
  );
};

export default HomePage;
