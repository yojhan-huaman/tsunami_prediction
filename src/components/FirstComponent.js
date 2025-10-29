import React, { useState } from "react";

export const FirstComponent = ({ onEarthquakeAdded }) => {
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
    <div
      style={{
        background: "linear-gradient(135deg, #141E30, #243B55)",
        padding: "2rem",
        borderRadius: "12px",
        color: "#fff",
        maxWidth: "950px",
        margin: "2rem auto",
        boxShadow: "0 0 15px rgba(0,0,0,0.4)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        🌎 Registrar nuevo evento sísmico
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label
              htmlFor={key}
              style={{
                fontWeight: "bold",
                color: "#aee1f9",
                fontSize: "0.9rem",
              }}
            >
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
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1B2838",
                color: "#aee1f9",
                outline: "none",
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            gridColumn: "1 / -1",
            marginTop: "1rem",
            background: "#00C9A7",
            color: "#fff",
            padding: "0.8rem",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#1DE9B6")}
          onMouseLeave={(e) => (e.target.style.background = "#00C9A7")}
        >
          Guardar Evento
        </button>
      </form>

      {status && (
        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: status.includes("✅")
              ? "#7CFC00"
              : status.includes("❌")
              ? "#ff6b6b"
              : "#FFD700",
          }}
        >
          {status}
        </p>
      )}

      {preview && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#aee1f9" }}>📋 Registro añadido:</h3>
          <pre style={{ color: "#fff" }}>{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};