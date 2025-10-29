import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "../App.css";

export const FirstComponent = ({ onEarthquakeAdded, className }) => {
  const [form, setForm] = useState({
    magnitude: "",
    cdi: "",
    mmi: "",
    sig: "",
    nst: "",
    dmin: "",
    gap: "",
    depth: "",
    latitude: "",
    longitude: "",
    Year: "",
    Month: "",
    tsunami: "",
  });

  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Guardando en CSV...");

    try {
      const response = await fetch("http://localhost:3001/api/earthquakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setStatus("✅ Evento agregado correctamente al CSV.");
        setPreview(form);
        setForm({
          magnitude: "",
          cdi: "",
          mmi: "",
          sig: "",
          nst: "",
          dmin: "",
          gap: "",
          depth: "",
          latitude: "",
          longitude: "",
          Year: "",
          Month: "",
          tsunami: "",
        });
        
        if (onEarthquakeAdded) onEarthquakeAdded(updatedData);
      } else {
        setStatus("❌ Error al guardar en el CSV.");
      }
    } catch (error) {
      console.error(error);
      setStatus("⚠️ No se pudo conectar con el servidor.");
      setPreview(form);
    }
  };

  return (
    <div className={`component-wrapper ${className}`}>
      <h2 className="component-title">🌎 Registrar nuevo evento sísmico</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        {Object.keys(form).map((key) => (
          <div key={key} className="form-field">
            <label htmlFor={key} className="form-label">
              {key}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={`Ingrese ${key}`}
              step="any"
              required
              className="form-input"
            />
          </div>
        ))}

        <button type="submit" className="submit-button">
          Guardar Evento
        </button>
      </form>

      {status && (
        <p className={`status-message ${
          status.includes("✅") ? "status-success" :
          status.includes("❌") ? "status-error" : "status-warning"
        }`}>
          {status}
        </p>
      )}

      {preview && (
        <div className="preview-container">
          <h3 className="preview-title">📋 Registro añadido:</h3>
          <pre className="preview-content">{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};