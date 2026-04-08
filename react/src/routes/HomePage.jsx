import React, { useState, useEffect } from "react";
import Topbar from "../components/dashboard/Topbar";
import StatCard from "../components/dashboard/StatCard";
import WalletCard from "../components/dashboard/WalletCard";
import OverviewCard from "../components/dashboard/OverviewCard";
import { FileText, CheckCircle2, XCircle, Send, Server as ServerIcon } from "lucide-react";
import API_BASE_URL from "../settings.jsx"

const USER_TOKEN = localStorage.getItem("token");

const HomePage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  const fetchServers = async () => {
    try {
      const serverRes = await fetch(`${API_BASE_URL}/server-api/view_servers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: USER_TOKEN })
      });
      const serverData = await serverRes.json();
      if (serverData.servers) setServers(serverData.servers);

      const alertRes = await fetch(`${API_BASE_URL}/core-api/get_alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: USER_TOKEN })
      });
      const alertData = await alertRes.json();
      if (alertData.alerts) setAlerts(alertData.alerts);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    // Funkcja rekurencyjna, lepsza od setInterval w React
    const pollServers = async () => {
      if (!isMounted) return;
      
      await fetchServers(); // Czekamy aż pobierze
      
      // Dopiero po zakończeniu pobierania odliczamy kolejne 3 sekundy
      timeoutId = setTimeout(pollServers, 3000); 
    };

    pollServers(); // Startujemy pętlę

    // Czyszczenie komponentu po opuszczeniu strony
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);


  // Obliczanie statystyk na podstawie pobranych danych
  const onlineCount = servers.filter(s => s.state === "online").length;
  const offlineCount = servers.filter(s => s.state === "offline" || s.state === "error").length;

  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  const stats = [
    { title: "Total Servers", value: servers.length.toString(), icon: ServerIcon, variant: "dark" },
    { title: "Online Servers", value: onlineCount.toString(), icon: CheckCircle2, variant: "purple" },
    { title: "Offline Servers", value: offlineCount.toString(), icon: XCircle, variant: "violet" },
    { title: "Alerts", value: "0", icon: Send, variant: "pink" },
  ];

  return (
    <div className="space-y-4">
      {/* <Topbar unreadAlerts={unreadAlertsCount} /> */}
      <Topbar alerts={alerts} refreshAlerts={fetchServers} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <WalletCard servers={servers} refreshServers={fetchServers} />
        <OverviewCard />
      </section>
    </div>
  );
};

export default HomePage;
