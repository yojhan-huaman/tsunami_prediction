import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../App.css";

export const FourComponent = ({ className }) => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [years, setYears] = useState([]);
  const [months] = useState([
    { value: 1, name: "Enero" }, { value: 2, name: "Febrero" },
    { value: 3, name: "Marzo" }, { value: 4, name: "Abril" },
    { value: 5, name: "Mayo" }, { value: 6, name: "Junio" },
    { value: 7, name: "Julio" }, { value: 8, name: "Agosto" },
    { value: 9, name: "Septiembre" }, { value: 10, name: "Octubre" },
    { value: 11, name: "Noviembre" }, { value: 12, name: "Diciembre" },
  ]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Cargar datos desde Firebase
  const loadData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "earthquakes"));
      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(docsData);

      // Obtener lista de años únicos
      const yearList = [...new Set(docsData.map((d) => Number(d.Year)))].sort(
        (a, b) => a - b
      );
      setYears(yearList);

      // Seleccionar último año/mes automáticamente
      if (yearList.length > 0) {
        const lastYear = yearList[yearList.length - 1];
        const lastMonth = Math.max(
          ...docsData.filter((d) => d.Year === lastYear).map((d) => d.Month)
        );
        setSelectedYear(lastYear);
        setSelectedMonth(lastMonth);
      }

      setMessage("✅ Datos cargados desde Firebase.");
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Error al cargar datos desde Firebase.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Filtrar datos por año y mes
  useEffect(() => {
    let filteredData = [...data];
    if (selectedYear)
      filteredData = filteredData.filter(
        (d) => Number(d.Year) === Number(selectedYear)
      );
    if (selectedMonth)
      filteredData = filteredData.filter(
        (d) => Number(d.Month) === Number(selectedMonth)
      );
    setFiltered(filteredData);
  }, [data, selectedYear, selectedMonth]);

  // 🔹 Eliminar documento de Firestore
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;

    try {
      await deleteDoc(doc(db, "earthquakes", id));
      setMessage("🗑️ Evento eliminado correctamente.");
      loadData();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al eliminar registro de Firebase.");
    }
  };

  return (
    <div className={`component-container fade-slide ${className}`}>
      <h2 className="component-title">🌎 Registro de Terremotos</h2>

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
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.magnitude}</td>
                  <td>{row.depth}</td>
                  <td>{row.latitude}</td>
                  <td>{row.longitude}</td>
                  <td>{row.Year}</td>
                  <td>{row.Month}</td>
                  <td>{row.tsunami}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="delete-button"
                    >
                      Eliminar
                    </button>
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
