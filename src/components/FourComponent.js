import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "../App.css";

export const FourComponent = ({ className }) => {
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

  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:3001/events");
      const csvData = await res.json();
      setData(csvData);

      const yearList = [...new Set(csvData.map(d => d.Year))].sort((a,b)=>a-b);
      setYears(yearList);

      const lastYear = yearList[yearList.length - 1];
      const lastMonth = Math.max(...csvData.filter(d => d.Year === lastYear).map(d => d.Month));

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

  const handleDelete = async (index) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      const res = await fetch(`http://localhost:3001/events/${index}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Evento eliminado correctamente.");
        loadData();
      } else {
        setMessage("❌ Error al eliminar registro.");
      }
    } catch {
      setMessage("⚠️ No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className={`component-container fade-slide ${className}`}>
      <h2 className="component-title">🌎 Registro de Terremotos</h2>

      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Año: </label>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="filter-select">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Mes: </label>
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="filter-select">
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {message && <p className="status-message status-info">{message}</p>}

      {filtered.length === 0 ? (
        <p className="empty-state">No hay datos para los filtros seleccionados.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Magnitud</th>
                <th>Profundidad</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Año</th>
                <th>Mes</th>
                <th>Tsunami</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{row.magnitude}</td>
                  <td>{row.depth}</td>
                  <td>{row.latitude}</td>
                  <td>{row.longitude}</td>
                  <td>{row.Year}</td>
                  <td>{row.Month}</td>
                  <td>{row.tsunami}</td>
                  <td>
                    <button onClick={() => handleDelete(i)} className="delete-button">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
