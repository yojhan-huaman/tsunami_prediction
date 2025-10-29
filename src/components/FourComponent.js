import React, { useEffect, useState } from "react";

export const FourComponent = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [years, setYears] = useState([]);
  const [months] = useState([
    { value: 1, name: "Enero" }, { value: 2, name: "Febrero" }, { value: 3, name: "Marzo" },
    { value: 4, name: "Abril" }, { value: 5, name: "Mayo" }, { value: 6, name: "Junio" },
    { value: 7, name: "Julio" }, { value: 8, name: "Agosto" }, { value: 9, name: "Septiembre" },
    { value: 10, name: "Octubre" }, { value: 11, name: "Noviembre" }, { value: 12, name: "Diciembre" },
  ]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [message, setMessage] = useState("");

  // Cargar datos desde backend
  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:3001/events");
      const csvData = await res.json();
      setData(csvData);

      const yearList = [...new Set(csvData.map((d) => d.Year))].sort((a, b) => a - b);
      setYears(yearList);

      const lastYear = yearList[yearList.length - 1];
      const lastMonth = Math.max(...csvData.filter((d) => d.Year === lastYear).map((d) => d.Month));

      setSelectedYear(lastYear);
      setSelectedMonth(lastMonth);
    } catch {
      setMessage("⚠️ No se pudo cargar los datos del servidor.");
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    let filteredData = [...data];
    if (selectedYear) filteredData = filteredData.filter((d) => d.Year === Number(selectedYear));
    if (selectedMonth) filteredData = filteredData.filter((d) => d.Month === Number(selectedMonth));
    setFiltered(filteredData);
  }, [data, selectedYear, selectedMonth]);

  // Eliminar registro persistente
  const handleDelete = async (index) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      const res = await fetch(`http://localhost:3001/events/${index}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Evento eliminado correctamente.");
        loadData(); // recargar
      } else {
        setMessage("❌ Error al eliminar registro.");
      }
    } catch {
      setMessage("⚠️ No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "2rem auto", background: "#1e1f26", borderRadius: "15px", color: "#fff" }}>
      <h2 style={{ textAlign: "center", color: "#4dd0e1" }}>🌎 Registro de Terremotos</h2>

      {/* FILTROS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <div>
          <label>Año: </label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div>
          <label>Mes: </label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map((m) => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {message && <p style={{ textAlign: "center", color: "#4dd0e1" }}>{message}</p>}

      {/* TABLA */}
      {filtered.length === 0 ? <p style={{ textAlign: "center", color: "#bbb" }}>No hay datos para los filtros seleccionados.</p> :
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead style={{ backgroundColor: "#333", color: "#fff" }}>
            <tr>
              <th>#</th><th>Magnitud</th><th>Profundidad</th><th>Latitud</th><th>Longitud</th>
              <th>Año</th><th>Mes</th><th>Tsunami</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{row.magnitude}</td>
                <td>{row.depth}</td>
                <td>{row.latitude}</td>
                <td>{row.longitude}</td>
                <td>{row.Year}</td>
                <td>{row.Month}</td>
                <td>{row.tsunami}</td>
                <td><button onClick={() => handleDelete(i)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};
