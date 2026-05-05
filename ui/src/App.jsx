import { useState, useEffect } from "react";

export default function App() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setStatus(d.status))
      .catch(() => setStatus("API unreachable"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Fullstack Docker App</h1>
      <p>API status: <strong>{status}</strong></p>
    </div>
  );
}
