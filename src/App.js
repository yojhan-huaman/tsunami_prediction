import React, { useState } from "react";
import { FirstComponent } from "./components/FirstComponent";
import { CsvChart } from "./components/CsvChart";
import { FourComponent } from "./components/FourComponent";
import { SecondComponent } from "./components/SecondComponent";
import { ThreeComponent } from "./components/ThreeComponent";
import "./App.css"; // Para las animaciones CSS

export default function App() {
  const [visibleComponent, setVisibleComponent] = useState(null);

  const renderComponent = () => {
    switch (visibleComponent) {
      case "CsvChart":
        return <CsvChart className="fade-slide" />;
      case "FirstComponent":
        return <FirstComponent className="fade-slide" />;
      case "FourComponent":
        return <FourComponent className="fade-slide" />;
      case "SecondComponent":
        return <SecondComponent className="fade-slide" />;
      case "ThreeComponent":
        return <ThreeComponent className="fade-slide" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#d9534f" }}>🌋 Panel de Datos Sísmicos</h1>

      {/* Tabla explicativa estilizada */}
      <section style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#0275d8" }}>📊 Significado de los Campos Sísmicos</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          <thead style={{ backgroundColor: "#f7f7f7" }}>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Valor</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Traducción / Significado</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Explicación</th>
            </tr>
          </thead>
          <tbody>
            {[
              { valor: "magnitude", traduccion: "Magnitud", explicacion: "Indica la energía liberada por un terremoto. Se mide con distintas escalas como Richter o Mw." },
              { valor: "cdi", traduccion: "Índice de Intensidad Combinada (Community Determined Intensity)", explicacion: "Representa la intensidad percibida del sismo por la población en una escala de 1 a 10, basada en reportes ciudadanos." },
              { valor: "mmi", traduccion: "Escala de Mercalli Modificada (Modified Mercalli Intensity)", explicacion: "Mide la intensidad del sismo en efectos sobre personas y estructuras, de I (no sentido) a XII (destrucción total)." },
              { valor: "sig", traduccion: "Significancia", explicacion: "Indica la importancia estadística del evento sísmico, relacionada con la confianza en los datos." },
              { valor: "nst", traduccion: "Número de estaciones", explicacion: "Número de estaciones sísmicas que registraron el sismo, útil para la precisión de localización y magnitud." },
              { valor: "dmin", traduccion: "Distancia mínima", explicacion: "Distancia mínima (en grados o km) entre el sismo y las estaciones que lo detectaron." },
              { valor: "gap", traduccion: "Brecha azimutal", explicacion: "La mayor distancia angular sin cobertura de estaciones alrededor del epicentro. Entre más pequeña, mejor la precisión." },
              { valor: "depth", traduccion: "Profundidad", explicacion: "Profundidad del sismo bajo la superficie terrestre, generalmente en kilómetros." },
              { valor: "latitude", traduccion: "Latitud", explicacion: "Posición norte-sur del epicentro del sismo, en grados." },
              { valor: "longitude", traduccion: "Longitud", explicacion: "Posición este-oeste del epicentro del sismo, en grados." },
              { valor: "Year", traduccion: "Año", explicacion: "Año en que ocurrió el sismo." },
              { valor: "Month", traduccion: "Mes", explicacion: "Mes en que ocurrió el sismo." },
              { valor: "tsunami", traduccion: "Tsunami", explicacion: "Indica si el sismo generó o podría generar un tsunami. Suele ser 0 (no) o 1 (sí)." }
            ].map((item) => (
              <tr key={item.valor} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>{item.valor}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.traduccion}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.explicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Botones para mostrar componentes */}
      <section style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#5cb85c" }}>🔹 Ver Componentes</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["CsvChart", "FirstComponent", "FourComponent", "SecondComponent", "ThreeComponent"].map((comp) => (
            <button key={comp} onClick={() => setVisibleComponent(comp)}>{comp}</button>
          ))}
        </div>
      </section>

      <hr />

      {/* Renderizado condicional con animación */}
      <div className="component-container">{renderComponent()}</div>
    </div>
  );
}
