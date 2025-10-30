import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Importa la conexión
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Guardando en Firebase...");

    try {
      // Guarda el registro en la colección "earthquakes"
      await addDoc(collection(db, "earthquakes"), {
        ...form,
        timestamp: new Date(),
      });

      setStatus("✅ Evento agregado correctamente a Firebase.");
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

      if (onEarthquakeAdded) onEarthquakeAdded(form);
    } catch (error) {
      console.error(error);
      setStatus("❌ Error al guardar en Firebase.");
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
        <p
          className={`status-message ${
            status.includes("✅")
              ? "status-success"
              : status.includes("❌")
              ? "status-error"
              : "status-warning"
          }`}
        >
          {status}
        </p>
      )}

      {preview && (
        <div className="preview-container">
          <h3 className="preview-title">📋 Registro añadido:</h3>
          <pre className="preview-content">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
