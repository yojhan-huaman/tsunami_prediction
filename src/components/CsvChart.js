import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export const CsvChart = () => {
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
        <div
            style={{
                width: "90%",
                margin: "3rem auto",
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                padding: "2rem",
                borderRadius: "20px",
                boxShadow: "0 0 25px rgba(0,0,0,0.3)",
                color: "#fff",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.3s ease-in-out",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    fontSize: "2rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "1px",
                }}
            >
                🌋 Visualizador de Terremotos por Año
            </h2>

            {/* Selector de Año */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "2rem",
                }}
            >
                <label
                    htmlFor="year"
                    style={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "#aee1f9",
                    }}
                >
                    Selecciona un año:
                </label>

                <select
                    id="year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                        padding: "0.6rem 1.2rem",
                        borderRadius: "10px",
                        border: "none",
                        outline: "none",
                        fontSize: "1rem",
                        backgroundColor: "#1b2838",
                        color: "#aee1f9",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#243b55")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#1b2838")}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            {/* Contenedor del gráfico */}
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "1.5rem",
                    borderRadius: "15px",
                    backdropFilter: "blur(10px)",
                    boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
                    transition: "transform 0.3s ease",
                }}
            >
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
                    <p style={{ textAlign: "center", color: "#ccc" }}>
                        No hay datos para {selectedYear}.
                    </p>
                )}
            </div>
        </div>
    );
};
