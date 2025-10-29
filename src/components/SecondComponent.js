import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export const SecondComponent = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [years, setYears] = useState([]);
  const [months] = useState([
    { value: 1, name: "Enero" },
    { value: 2, name: "Febrero" },
    { value: 3, name: "Marzo" },
    { value: 4, name: "Abril" },
    { value: 5, name: "Mayo" },
    { value: 6, name: "Junio" },
    { value: 7, name: "Julio" },
    { value: 8, name: "Agosto" },
    { value: 9, name: "Septiembre" },
    { value: 10, name: "Octubre" },
    { value: 11, name: "Noviembre" },
    { value: 12, name: "Diciembre" },
  ]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  // 🔹 Cargar CSV y establecer último mes/año
  useEffect(() => {
    Papa.parse("/earthquake_data_tsunami.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = result.data.filter((d) => d.Year && d.Month);
        setData(parsed);

        const yearList = [...new Set(parsed.map((d) => d.Year))].sort((a, b) => a - b);
        setYears(yearList);

        const lastYear = yearList[yearList.length - 1];
        const lastMonth = Math.max(...parsed.filter((d) => d.Year === lastYear).map((d) => d.Month));

        setSelectedYear(lastYear);
        setSelectedMonth(lastMonth);
        setLoading(false);
      },
    });
  }, []);

  // 🔹 Filtrar datos y calcular estadísticas
  useEffect(() => {
    if (!data.length) return;
    let filteredData = [...data];
    if (selectedYear) filteredData = filteredData.filter((d) => d.Year === Number(selectedYear));
    if (selectedMonth) filteredData = filteredData.filter((d) => d.Month === Number(selectedMonth));
    setFiltered(filteredData);

    if (filteredData.length > 0) {
      const magnitudes = filteredData.map((d) => d.magnitude);
      const depths = filteredData.map((d) => d.depth);
      const tsunamiCount = filteredData.filter((d) => d.tsunami === 1).length;

      setStats({
        avgMagnitude: (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(2),
        avgDepth: (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(1),
        total: filteredData.length,
        tsunamiPercent: ((tsunamiCount / filteredData.length) * 100).toFixed(1),
      });
    } else {
      setStats({});
    }
  }, [data, selectedYear, selectedMonth]);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1400px",
        margin: "2rem auto",
        background: "linear-gradient(135deg, #1e1f26, #2a2d3e)",
        borderRadius: "15px",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#4dd0e1", marginBottom: "1.5rem" }}>
        🌎 Lista de Terremotos (CSV)
      </h2>

      {/* FILTROS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <label>Año: </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ padding: "0.4rem 0.6rem", borderRadius: "5px", border: "none", outline: "none" }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Mes: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: "0.4rem 0.6rem", borderRadius: "5px", border: "none", outline: "none" }}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RESUMEN ESTADÍSTICO */}
      {filtered.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem 1.5rem", borderRadius: "10px", textAlign: "center", flex: "1 1 200px" }}>
            <h3 style={{ color: "#4dd0e1" }}>Promedio Magnitud</h3>
            <p style={{ fontSize: "1.6rem", fontWeight: "bold" }}>{stats.avgMagnitude}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem 1.5rem", borderRadius: "10px", textAlign: "center", flex: "1 1 200px" }}>
            <h3 style={{ color: "#4dd0e1" }}>Promedio Profundidad</h3>
            <p style={{ fontSize: "1.6rem", fontWeight: "bold" }}>{stats.avgDepth} km</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem 1.5rem", borderRadius: "10px", textAlign: "center", flex: "1 1 200px" }}>
            <h3 style={{ color: "#4dd0e1" }}>Eventos Totales</h3>
            <p style={{ fontSize: "1.6rem", fontWeight: "bold" }}>{stats.total}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem 1.5rem", borderRadius: "10px", textAlign: "center", flex: "1 1 200px" }}>
            <h3 style={{ color: "#4dd0e1" }}>% Tsunamis</h3>
            <p style={{ fontSize: "1.6rem", fontWeight: "bold" }}>{stats.tsunamiPercent}%</p>
          </div>
        </div>
      )}

      {/* TABLA */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando datos...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "#bbb" }}>
          No hay registros para {months[selectedMonth - 1]?.name} {selectedYear}.
        </p>
      ) : (
        <div style={{ overflowX: "auto", maxHeight: "600px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "rgba(255,255,255,0.05)", textAlign: "center" }}>
            <thead style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "#aee1f9", position: "sticky", top: 0 }}>
              <tr>
                <th>#</th>
                <th>Magnitud</th>
                <th>Profundidad (km)</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Año</th>
                <th>Mes</th>
                <th>Tsunami</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)" }}>
                  <td>{i + 1}</td>
                  <td>{row.magnitude}</td>
                  <td>{row.depth}</td>
                  <td>{row.latitude}</td>
                  <td>{row.longitude}</td>
                  <td>{row.Year}</td>
                  <td>{row.Month}</td>
                  <td>{row.tsunami}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
