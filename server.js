const express = require("express");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CSV_FILE = path.join(__dirname, "public", "earthquake_data_tsunami.csv");

// Función para leer CSV
function readCSV() {
  const file = fs.readFileSync(CSV_FILE, "utf8");
  return Papa.parse(file, { header: true, dynamicTyping: true }).data;
}

// Función para escribir CSV
function writeCSV(data) {
  const csv = Papa.unparse(data);
  fs.writeFileSync(CSV_FILE, csv, "utf8");
}

// ✅ GET: Obtener todos los registros
app.get("/api/earthquakes", (req, res) => {
  try {
    const data = readCSV();
    res.json(data);
  } catch {
    res.status(500).json({ error: "No se pudo leer el CSV" });
  }
});

// ✅ POST: Agregar un nuevo registro
app.post("/api/earthquakes", (req, res) => {
  try {
    const data = readCSV();
    const newRecord = req.body;

    // Validar campos obligatorios
    const requiredFields = [
      "magnitude","cdi","mmi","sig","nst","dmin","gap",
      "depth","latitude","longitude","Year","Month","tsunami"
    ];
    for (const field of requiredFields) {
      if (newRecord[field] === undefined) {
        return res.status(400).json({ error: `Falta el campo ${field}` });
      }
    }

    data.push(newRecord);
    writeCSV(data);

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo agregar el registro" });
  }
});

// ✅ PUT: Actualizar un registro por índice
app.put("/api/earthquakes/:index", (req, res) => {
  try {
    const index = Number(req.params.index);
    const data = readCSV();

    if (index < 0 || index >= data.length)
      return res.status(400).json({ error: "Índice inválido" });

    const updated = req.body;
    const fields = [
      "magnitude","cdi","mmi","sig","nst","dmin","gap",
      "depth","latitude","longitude","Year","Month","tsunami"
    ];

    fields.forEach(f => {
      if (updated[f] !== undefined) data[index][f] = updated[f];
    });

    writeCSV(data);
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ error: "No se pudo actualizar el registro" });
  }
});

// ✅ DELETE: Eliminar un registro por índice
app.delete("/api/earthquakes/:index", (req, res) => {
  try {
    const index = Number(req.params.index);
    const data = readCSV();

    if (index < 0 || index >= data.length)
      return res.status(400).json({ error: "Índice inválido" });

    data.splice(index, 1);
    writeCSV(data);
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ error: "No se pudo eliminar el registro" });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));