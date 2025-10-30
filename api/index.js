import fs from "fs";
import path from "path";
import Papa from "papaparse";

const CSV_FILE = path.join(process.cwd(), "api", "earthquake_data_tsunami.csv");

function readCSV() {
  const file = fs.readFileSync(CSV_FILE, "utf8");
  return Papa.parse(file, { header: true, dynamicTyping: true }).data;
}

function writeCSV(data) {
  const csv = Papa.unparse(data);
  fs.writeFileSync(CSV_FILE, csv, "utf8");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = readCSV();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "No se pudo leer el CSV" });
    }
  }

  if (req.method === "POST") {
    try {
      const newRecord = req.body;
      const data = readCSV();
      data.push(newRecord);
      writeCSV(data);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ error: "No se pudo agregar el registro" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const index = Number(req.query.index);
      const data = readCSV();
      if (index < 0 || index >= data.length)
        return res.status(400).json({ error: "Índice inválido" });
      data.splice(index, 1);
      writeCSV(data);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ error: "No se pudo eliminar el registro" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
