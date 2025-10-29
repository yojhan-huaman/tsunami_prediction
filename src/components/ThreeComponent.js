import React, { useEffect, useState } from "react";

export const ThreeComponent = () => {
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

  // Cargar datos
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

  // Filtrar por año y mes
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
    <div style={{
      padding:"2rem",
      maxWidth:"600px",
      margin:"2rem auto",
      background:"linear-gradient(135deg, #1e1f26, #2a2d3e)",
      borderRadius:"15px",
      color:"#fff",
      fontFamily:"'Poppins', sans-serif",
      boxShadow:"0 4px 20px rgba(0,0,0,0.3)"
    }}>
      <h2 style={{ textAlign:"center", color:"#4dd0e1", marginBottom:"1rem" }}>Editar Registro de Terremotos</h2>

      <div style={{ display:"flex", gap:"1rem", justifyContent:"center", marginBottom:"1rem", flexWrap:"wrap" }}>
        <div>
          <label>Año: </label>
          <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} style={{ padding:"0.4rem", borderRadius:"5px", border:"none", outline:"none" }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label>Mes: </label>
          <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} style={{ padding:"0.4rem", borderRadius:"5px", border:"none", outline:"none" }}>
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <select onChange={handleSelect} value={selectedIndex} style={{ width:"100%", padding:"0.5rem", borderRadius:"6px", marginBottom:"1rem" }}>
        <option value="">-- Selecciona un registro --</option>
        {filtered.map((r,i)=>(
          <option key={i} value={i}>Evento {i+1} - Magnitud: {r.magnitude}, Profundidad: {r.depth}km</option>
        ))}
      </select>

      {selectedIndex !== "" && (
        <form onSubmit={handleUpdate} style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <input name="magnitude" type="number" step="0.1" value={form.magnitude || ""} onChange={handleChange} placeholder="Magnitud" style={inputStyle}/>
          <input name="depth" type="number" step="0.1" value={form.depth || ""} onChange={handleChange} placeholder="Profundidad" style={inputStyle}/>
          <input name="latitude" type="number" step="0.0001" value={form.latitude || ""} onChange={handleChange} placeholder="Latitud" style={inputStyle}/>
          <input name="longitude" type="number" step="0.0001" value={form.longitude || ""} onChange={handleChange} placeholder="Longitud" style={inputStyle}/>
          <input name="tsunami" type="number" value={form.tsunami || ""} onChange={handleChange} placeholder="Tsunami (0 o 1)" style={inputStyle}/>
          <button type="submit" style={buttonStyle}>Actualizar</button>
        </form>
      )}

      {message && <p style={{ marginTop:"1rem", textAlign:"center", color:"#4dd0e1" }}>{message}</p>}
    </div>
  );
};

const inputStyle = {
  padding:"0.5rem",
  borderRadius:"6px",
  border:"none",
  outline:"none",
  width:"100%"
};

const buttonStyle = {
  padding:"0.6rem",
  borderRadius:"6px",
  border:"none",
  background:"#4dd0e1",
  color:"#1e1f26",
  fontWeight:"bold",
  cursor:"pointer",
  marginTop:"0.5rem"
};
