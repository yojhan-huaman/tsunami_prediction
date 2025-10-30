const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Papa = require("papaparse");

admin.initializeApp();

exports.addEarthquake = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const newRow = req.body;
    const bucket = admin.storage().bucket();
    const file = bucket.file("data/earthquakes.csv");

    // Descargar el CSV existente
    const [data] = await file.download();
    const csv = Papa.parse(data.toString(), { header: true }).data;

    // Agregar la nueva fila
    csv.push(newRow);

    // Convertir de nuevo a CSV
    const updated = Papa.unparse(csv);

    // Guardar el CSV actualizado
    await file.save(updated, { contentType: "text/csv" });

    res.json({ success: true, message: "Registro agregado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar en el CSV" });
  }
});
