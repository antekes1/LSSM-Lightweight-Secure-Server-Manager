import React, { useState, useEffect } from "react";
import Topbar from "../components/dashboard/Topbar";
import StatCard from "../components/dashboard/StatCard";
import WalletCard from "../components/dashboard/WalletCard";
import OverviewCard from "../components/dashboard/OverviewCard";
import { FileText, CheckCircle2, XCircle, Send, Server as ServerIcon } from "lucide-react";
import API_BASE_URL from "../settings.jsx"

const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnRla2VzMSIsImlkIjoxLCJzZWN1cml0eV9jaGFyIjoicWNabjlWV2ZwUUtiVm5FeTdpZEFKTUZ2In0.tD9rCJHNM8c705IJLtDDWOq95mypwEN-e0SPwOctcEc"; 

const HomePage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

    // Pobieranie serwerów z FastAPI
  const fetchServers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/server-api/view_servers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: USER_TOKEN })
      });
      
      const data = await response.json();
      
      console.log("🔥 [FastAPI Response] /view_servers:", data);
      
      if (data.servers) {
        setServers(data.servers);
      } else {
        console.warn("⚠️ Ostrzeżenie: FastAPI nie zwróciło tablicy 'servers'. Sprawdź kod backendu.");
      }
    } catch (error) {
      console.error("❌ Failed to fetch servers:", error);
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

  const stats = [
    { title: "Total Servers", value: servers.length.toString(), icon: ServerIcon, variant: "dark" },
    { title: "Online Servers", value: onlineCount.toString(), icon: CheckCircle2, variant: "purple" },
    { title: "Offline Servers", value: offlineCount.toString(), icon: XCircle, variant: "violet" },
    { title: "Alerts", value: "0", icon: Send, variant: "pink" },
  ];

  return (
    <div className="space-y-4">
      <Topbar />

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
