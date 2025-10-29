import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "../App.css";

export const CsvChart = ({ className }) => {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    Papa.parse("/earthquake_data_tsunami.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = result.data.filter((d) => d.Year && d.magnitude && d.depth);
        setData(parsed);

        const yearList = [...new Set(parsed.map((d) => d.Year))].sort((a, b) => a - b);
        setYears(yearList);

        setSelectedYear(yearList[0]);
      },
    });
  }, []);

  useEffect(() => {
    if (!data.length || !selectedYear) return;

    const filtered = data.filter((d) => d.Year === Number(selectedYear));

    if (!filtered.length) {
      setChartData(null);
      return;
    }

    const labels = filtered.map((_, i) => `Evento ${i + 1}`);
    const magnitudes = filtered.map((d) => d.magnitude);
    const depths = filtered.map((d) => d.depth);

    setChartData({
      labels,
      datasets: [
        {
          label: "Magnitud",
          data: magnitudes,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: "Profundidad (km)",
          data: depths,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.3)",
          borderWidth: 2,
          tension: 0.25,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    });
  }, [data, selectedYear]);

  return (
    <div className={`component-wrapper ocean-gradient-wrapper chart-wrapper ${className}`}>
      <h2 className="component-title">🌋 Visualizador de Terremotos por Año</h2>

      <div className="filters-container">
        <label htmlFor="year" className="filter-label">
          Selecciona un año:
        </label>

        <select
          id="year"
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

      <div className="chart-container">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    color: "#fff",
                    font: { size: 13 },
                  },
                },
                title: {
                  display: true,
                  text: `📆 Magnitud y Profundidad - ${selectedYear}`,
                  color: "#fff",
                  font: { size: 18, weight: "bold" },
                },
                tooltip: {
                  backgroundColor: "rgba(0,0,0,0.7)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "#888",
                  borderWidth: 1,
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`,
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: "#ddd", font: { size: 11 } },
                  grid: { color: "rgba(255,255,255,0.1)" },
                  title: {
                    display: true,
                    text: "Eventos del año",
                    color: "#aee1f9",
                  },
                },
                y: {
                  ticks: { color: "#ddd" },
                  grid: { color: "rgba(255,255,255,0.1)" },
                  title: { display: true, text: "Valor", color: "#aee1f9" },
                },
              },
            }}
            height={400}
          />
        ) : (
          <p className="empty-state">
            No hay datos para {selectedYear}.
          </p>
        )}
      </div>
    </div>
  );
};