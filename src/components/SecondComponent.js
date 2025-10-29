import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "../App.css";

export const SecondComponent = ({ className }) => {
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
    <div className={`component-wrapper dark-gradient-wrapper ${className}`}>
      <h2 className="component-title">🌎 Lista de Terremotos (CSV)</h2>

      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Año: </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="filter-select"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Mes: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="filter-select"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="stats-container">
          <div className="stat-card">
            <h3 className="stat-title">Promedio Magnitud</h3>
            <p className="stat-value">{stats.avgMagnitude}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-title">Promedio Profundidad</h3>
            <p className="stat-value">{stats.avgDepth} km</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-title">Eventos Totales</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-title">% Tsunamis</h3>
            <p className="stat-value">{stats.tsunamiPercent}%</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="loading-state">Cargando datos...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">
          No hay registros para {months[selectedMonth - 1]?.name} {selectedYear}.
        </p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
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
                <tr key={i}>
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