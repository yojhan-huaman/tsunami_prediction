import React, { useState, useEffect } from "react";
//import Papa from "papaparse";
//import { Line } from "react-chartjs-2";
//import { Chart as ChartJS } from "chart.js/auto";
import "../App.css";

export const ThreeComponent = ({ className }) => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [form, setForm] = useState({});
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

  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:3001/events");
      const csvData = await res.json();
      setData(csvData);

      const yearList = [...new Set(csvData.map(d => d.Year))].sort((a,b)=>a-b);
      setYears(yearList);

      const lastYear = yearList[yearList.length-1];
      const lastMonth = Math.max(...csvData.filter(d=>d.Year===lastYear).map(d=>d.Month));

      setSelectedYear(lastYear);
      setSelectedMonth(lastMonth);
    } catch {
      setMessage("⚠️ No se pudo cargar los datos del servidor.");
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    let filteredData = [...data];
    if (selectedYear) filteredData = filteredData.filter(d => d.Year === Number(selectedYear));
    if (selectedMonth) filteredData = filteredData.filter(d => d.Month === Number(selectedMonth));
    setFiltered(filteredData);
  }, [data, selectedYear, selectedMonth]);

  const handleSelect = e => {
    const index = e.target.value;
    setSelectedIndex(index);
    if (index !== "") setForm(filtered[index]);
    else setForm({});
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    if (selectedIndex === "") return;
    try {
      const res = await fetch(`http://localhost:3001/events/${selectedIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage("✅ Registro actualizado correctamente.");
        loadData();
      } else setMessage("❌ Error al actualizar el registro.");
    } catch {
      setMessage("⚠️ No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className={`component-wrapper dark-gradient-wrapper ${className}`} style={{ maxWidth: "600px" }}>
      <h2 className="component-title">Editar Registro de Terremotos</h2>

      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Año: </label>
          <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} className="filter-select">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Mes: </label>
          <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="filter-select">
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <select onChange={handleSelect} value={selectedIndex} className="record-select">
        <option value="">-- Selecciona un registro --</option>
        {filtered.map((r,i)=>(
          <option key={i} value={i}>Evento {i+1} - Magnitud: {r.magnitude}, Profundidad: {r.depth}km</option>
        ))}
      </select>

      {selectedIndex !== "" && (
        <form onSubmit={handleUpdate} className="form-grid">
          <input name="magnitude" type="number" step="0.1" value={form.magnitude || ""} onChange={handleChange} placeholder="Magnitud" className="form-input"/>
          <input name="depth" type="number" step="0.1" value={form.depth || ""} onChange={handleChange} placeholder="Profundidad" className="form-input"/>
          <input name="latitude" type="number" step="0.0001" value={form.latitude || ""} onChange={handleChange} placeholder="Latitud" className="form-input"/>
          <input name="longitude" type="number" step="0.0001" value={form.longitude || ""} onChange={handleChange} placeholder="Longitud" className="form-input"/>
          <input name="tsunami" type="number" value={form.tsunami || ""} onChange={handleChange} placeholder="Tsunami (0 o 1)" className="form-input"/>
          <button type="submit" className="update-button">Actualizar</button>
        </form>
      )}

      {message && <p className={`status-message ${
        message.includes("✅") ? "status-success" :
        message.includes("❌") ? "status-error" : "status-warning"
      }`}>{message}</p>}
    </div>
  );
};