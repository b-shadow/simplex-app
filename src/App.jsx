import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio"; // Página de inicio
import Configurar from "./pages/Configurar"; // Página de configuración
import Simulador from "./pages/Simulador"; // Página del simulador
import PasoAPaso from "./pages/PasoAPaso"; // Página de pasos del Simplex

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Inicio />} />

        {/* Página de configuración */}
        <Route path="/configurar" element={<Configurar />} />

        {/* Página del simulador */}
        <Route path="/simulador" element={<Simulador />} />

        {/* Página de pasos del Simplex */}
        <Route path="/paso-a-paso" element={<PasoAPaso />} />
      </Routes>
    </Router>
  );
}

export default App;
