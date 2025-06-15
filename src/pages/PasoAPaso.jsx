import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

const PasoAPaso = () => {
  const {
    funcionObjetivo = [],
    restriccionesData = [],
    resultados = []
  } = useLocation().state || {};

  const [initialTabla, setInitialTabla] = useState([]);
  const [finalTabla, setFinalTabla] = useState([]);
  const [rowNames, setRowNames] = useState([]);
  const [varNames, setVarNames] = useState([]);
  const [slackNames, setSlackNames] = useState([]);
  const [solucionOptima, setSolucionOptima] = useState(false);
  const [iteraciones, setIteraciones] = useState([]);
  const [mensajeBuhoPorIteracion, setMensajeBuhoPorIteracion] = useState({});

  useEffect(() => {
    const c = funcionObjetivo.map(v => parseFloat(v) || 0);
    const filas = restriccionesData.map(r => r.map(v => parseFloat(v) || 0));
    const A = filas.map(r => r.slice(0, c.length));
    const b = resultados.length === filas.length
      ? resultados.map(v => parseFloat(v) || 0)
      : filas.map(r => r[r.length - 1]);

    const vx = c.map((_, i) => `x${i + 1}`);
    const sx = A.map((_, i) => `s${i + 1}`);
    const rn = ["Z", ...sx.map(s => s.toUpperCase())];

    setRowNames(rn);
    setVarNames(vx);
    setSlackNames(sx);

    const m = A.length;
    const filaZ = [1, ...c.map(ci => -ci), ...Array(m).fill(0), 0];
    let tablaLocal = [filaZ];

    for (let i = 0; i < m; i++) {
      const holg = Array(m).fill(0); holg[i] = 1;
      tablaLocal.push([0, ...A[i], ...holg, b[i]]);
    }

    setInitialTabla(tablaLocal);

    let iter = 0;
    const maxIter = 20;
    const todasIteraciones = [];
    const buhoPorIter = {};
    let nombresFilasActuales = [...rn];

    while (iter++ < maxIter) {
      const coefZ = tablaLocal[0].slice(1, 1 + c.length);
      let minValor = Infinity;
      let indiceColPivote = -1;

      coefZ.forEach((valor, idx) => {
        if (valor < 0 && valor < minValor) {
          minValor = valor;
          indiceColPivote = idx + 1;
        }
      });

      if (indiceColPivote === -1) {
        setSolucionOptima(true);
        break;
      }

      const nombreCol = vx[indiceColPivote - 1];

      let mejorRatio = Infinity;
      let indiceFilaPivote = -1;

      for (let i = 1; i < tablaLocal.length; i++) {
        const valorCol = tablaLocal[i][indiceColPivote];
        const sol = tablaLocal[i][tablaLocal[i].length - 1];
        if (valorCol > 0) {
          const ratio = sol / valorCol;
          if (ratio < mejorRatio) {
            mejorRatio = ratio;
            indiceFilaPivote = i;
          }
        }
      }

      if (indiceFilaPivote === -1) break;

      const nombreFila = nombresFilasActuales[indiceFilaPivote];
      nombresFilasActuales[indiceFilaPivote] = nombreCol;

      const filaPivoteOriginal = tablaLocal[indiceFilaPivote];
      const valorPivote = filaPivoteOriginal[indiceColPivote];
      const nuevaFilaPivote = filaPivoteOriginal.map(celda => celda / valorPivote);

      const nuevaTabla = tablaLocal.map((fila, idx) => {
        if (idx === indiceFilaPivote) return nuevaFilaPivote;
        const coef = fila[indiceColPivote];
        return fila.map((celda, j) => celda - coef * nuevaFilaPivote[j]);
      });

      const iteracion = {
        numero: iter,
        tabla: nuevaTabla,
        fila: { nombre: nombreFila, ratio: mejorRatio },
        columna: { nombre: nombreCol },
        rowNames: [...nombresFilasActuales]
      };

      buhoPorIter[iter] = `\uD83D\uDCD8 Columna: ${nombreCol}\n\uD83D\uDCD8 Fila: ${nombreFila} \u2192 razón = ${mejorRatio.toFixed(2)}`;

      todasIteraciones.push(iteracion);
      tablaLocal = nuevaTabla;
      setFinalTabla(nuevaTabla);
    }

    setIteraciones(todasIteraciones);
    setMensajeBuhoPorIteracion(buhoPorIter);
  }, [funcionObjetivo, restriccionesData, resultados]);

  return (
  <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 py-12">
    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
      Método Simplex – Paso a Paso
    </h1>

    {/* Tabla inicial centrada */}
    <div className="overflow-x-auto w-full px-2 mb-6">
      <div className="w-max mx-auto">
        <table className="min-w-max table-auto border-collapse bg-white rounded-xl shadow-md">
          <thead>
            <tr>
              <th className="border p-2"></th>
              <th className="border p-2">Z</th>
              {varNames.map((v, i) => <th key={i} className="border p-2">{v}</th>)}
              {slackNames.map((s, i) => <th key={i} className="border p-2">{s}</th>)}
              <th className="border p-2">Sol</th>
            </tr>
          </thead>
          <tbody>
            {initialTabla.map((fila, i) => (
              <tr key={i}>
                <td className="border p-2 font-semibold">{rowNames[i]}</td>
                {fila.map((celda, j) => (
                  <td key={j} className="border p-2">
                    {typeof celda === "number" ? celda.toFixed(2) : celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Iteraciones */}
    {iteraciones.length > 0 && (
      <div className="mt-6 w-full">
        {iteraciones.map((it, index) => (
          <div key={index} className="mb-20 w-full">
            {/* Búho y mensaje */}
            <div className="flex flex-col items-center mb-4 relative">
              <motion.div
                className="mb-4 bg-white border border-gray-300 px-4 py-2 rounded-xl shadow-md text-sm text-gray-800 w-72 text-center whitespace-pre-line z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {mensajeBuhoPorIteracion[it.numero]}
              </motion.div>

              <motion.img
                src="/assets/buho.png"
                alt="Búho"
                className="w-20 md:w-24 z-0"
                animate={{
                  y: [0, -5, 0],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
              Iteración {it.numero}
            </h2>

            {/* Tabla de iteración centrada */}
            <div className="overflow-x-auto w-full px-2">
              <div className="w-max mx-auto">
                <table className="min-w-max table-auto border-collapse bg-white rounded-xl shadow-md">
                  <thead>
                    <tr>
                      <th className="border p-2"></th>
                      <th className="border p-2">Z</th>
                      {varNames.map((v, i) => <th key={i} className="border p-2">{v}</th>)}
                      {slackNames.map((s, i) => <th key={i} className="border p-2">{s}</th>)}
                      <th className="border p-2">Sol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {it.tabla.map((fila, i) => (
                      <tr key={i}>
                        <td className="border p-2 font-semibold">{it.rowNames[i]}</td>
                        {fila.map((celda, j) => (
                          <td key={j} className="border p-2">
                            {typeof celda === "number" ? celda.toFixed(2) : celda}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Mensaje de éxito */}
    {solucionOptima && (
      <div className="mt-4 text-2xl md:text-3xl font-bold text-green-600 flex items-center gap-2">
        ✅ ¡Solución óptima alcanzada!
      </div>
    )}

    {/* Solución final en tarjeta */}
    {solucionOptima && finalTabla.length > 0 && (
      <div className="mt-12 px-4 w-full max-w-xl">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">📌 Solución Final</h2>
          <ul className="list-disc ml-6 text-base text-left">
            {[...varNames].map((v, idx) => {
              const filaIdx = iteraciones.at(-1).rowNames.indexOf(v);
              const valor = filaIdx !== -1 ? finalTabla[filaIdx].at(-1) : 0;
              return (
                <li key={idx}>
                  {v} = {valor.toFixed(2)}
                </li>
              );
            })}
            <li><strong>Z</strong> = {finalTabla[0].at(-1).toFixed(2)}</li>
          </ul>
        </div>
      </div>
    )}

    <Link to="/configurar" className="inline-block text-blue-600 hover:underline mt-6">
      🔙 Volver a Colocar Parámetros
    </Link>
  </div>
);




};

export default PasoAPaso;
