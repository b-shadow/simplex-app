import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const Inicio = () => {
  const [hablando, setHablando] = useState(false);

  const handleHover = () => {
    if (!hablando) {
      setHablando(true);
      setTimeout(() => {
        setHablando(false);
      }, 5000); // 5 segundos hablando
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center text-center px-6 py-12">
      {/* Título principal */}
      <motion.h1
        className="text-5xl md:text-8xl font-extrabold text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Método Simplex
      </motion.h1>

      {/* Tarjeta explicativa (no desplazada) */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center max-w-xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <p className="text-gray-800 text-lg md:text-xl font-medium text-center">
          Simulador visual paso a paso para resolver problemas de programación
          lineal con animaciones y claridad.
        </p>
      </motion.div>

      {/* Contenido restante desplazado hacia abajo */}
      <div className="mt-16 flex flex-col items-center w-full px-4">
        {/* 🦉 Búho con globo arriba */}
        <div className="relative flex flex-col items-center justify-center mb-12">
          {hablando && (
            <motion.div
              className="absolute -top-24 bg-white border border-gray-300 px-4 py-2 rounded-xl shadow-md text-base text-gray-800 z-10 w-64 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              🦉 Exploremos el método Simplex
              <div className="absolute left-1/2 top-full -translate-x-1/2 w-4 h-4 bg-white border-l border-b border-gray-300 rotate-45 z-0" />
            </motion.div>
          )}

          <motion.div
            onMouseEnter={handleHover}
            className="relative flex flex-col items-center"
            animate={
              hablando
                ? { y: 0 }
                : {
                    y: [0, -10, 0],
                    transition: {
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          >
            <img src="/assets/buho.png" alt="Búho" className="w-32 md:w-40" />
            {hablando && (
              <motion.div
                className="absolute top-[48%] left-[47%] -translate-x-1/2 w-3 h-3 bg-black rounded-full z-10"
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ duration: 0.25, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>

        {/* Botón */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-10"
        >
          <Link
            to="/configurar"
            className="text-lg bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full shadow-lg transition duration-300"
          >
            🚀 Empezar Simulación
          </Link>
        </motion.div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full px-4">
          <Feature icon="⚙️" title="Fácil de usar" />
          <Feature icon="🧠" title="Resolución lógica" />
          <Feature icon="📊" title="Resultados claros" />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title }) => (
  <motion.div
    className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition flex flex-col items-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
  </motion.div>
);

export default Inicio;
