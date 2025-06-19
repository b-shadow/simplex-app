import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Simulador = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenemos el número de variables y restricciones desde la configuración
  const { variables, restricciones } = location.state || { variables: 1, restricciones: 1 };

  // Estado para la función objetivo y las restricciones
  const [formData, setFormData] = useState({
    funcionObjetivo: Array(variables).fill(""),
    restricciones: Array(restricciones).fill(Array(variables).fill("")),
    resultados: Array(restricciones).fill(""), // Para almacenar el resultado de cada restricción
  });

  // Función para manejar los cambios en los inputs de las restricciones
  const handleChange = (e, restriccionIndex, variableIndex) => {
    const { value } = e.target;

    // Hacemos una copia de las restricciones y actualizamos solo el campo que cambió
    const newRestrictions = formData.restricciones.map((restriccion, idx) => {
      if (idx === restriccionIndex) {
        // Solo modificamos la restricción específica
        const newRestriccion = [...restriccion];
        newRestriccion[variableIndex] = value;  // Actualizamos el valor de la variable específica
        return newRestriccion;  // Retornamos la nueva restricción modificada
      }
      return restriccion;  // Para las demás restricciones, no las modificamos
    });

    // Actualizamos el estado
    setFormData((prevData) => ({
      ...prevData,
      restricciones: newRestrictions,
    }));
  };

  // Función para manejar los cambios en la función objetivo
  const handleFuncObjetivoChange = (e, variableIndex) => {
    const { value } = e.target;

    // Hacemos una copia de la función objetivo y actualizamos solo el campo que cambió
    const newFuncObjetivo = [...formData.funcionObjetivo];
    newFuncObjetivo[variableIndex] = value;

    // Actualizamos el estado
    setFormData((prevData) => ({
      ...prevData,
      funcionObjetivo: newFuncObjetivo,
    }));
  };

  // Función para manejar los cambios en los resultados
  const handleResultChange = (e, restriccionIndex) => {
    const { value } = e.target;

    // Hacemos una copia de los resultados y actualizamos solo el resultado de la restricción correspondiente
    const newResults = [...formData.resultados];
    newResults[restriccionIndex] = value;

    // Actualizamos el estado
    setFormData((prevData) => ({
      ...prevData,
      resultados: newResults,
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
  e.preventDefault();

  const regex = /^-?\d*(\.\d*)?$/;

  const todosValidos = [
    ...formData.funcionObjetivo,
    ...formData.resultados,
    ...formData.restricciones.flat()
  ].every(val => val === "" || regex.test(val));

  if (!todosValidos) {
    alert("⚠️ Verifica que todos los campos contengan solo números. \n⚠️ Recuerda usar '.' para los números con decimales.");
    return;
  }

  // Validar función objetivo
  const objetivoValido = formData.funcionObjetivo.some(val => val !== "" && parseFloat(val) !== 0);
  if (!objetivoValido) {
    alert("⚠️ Debes ingresar al menos un coeficiente distinto de cero en la función objetivo.");
    return;
  }

  // Validar que ninguna restricción esté vacía
  const restriccionInvalida = formData.restricciones.some((fila, index) => {
    const coeficientesValidos = fila.some(val => val !== "" && parseFloat(val) !== 0);
    const resultadoValido = formData.resultados[index] !== "" && !isNaN(parseFloat(formData.resultados[index]));
    return !coeficientesValidos || !resultadoValido;
  });

  if (restriccionInvalida) {
    alert("⚠️ Cada restricción debe tener al menos un coeficiente distinto de cero y un resultado numérico.");
    return;
  }

  // Si todo está bien, navegar
  navigate("/paso-a-paso", {
    state: {
      variables,
      restricciones,
      funcionObjetivo: formData.funcionObjetivo,
      restriccionesData: formData.restricciones,
      resultados: formData.resultados,
    },
  });
};
  return (
  <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 py-12">
    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
      Simulador Método Simplex
    </h1>

    <form onSubmit={handleSubmit} className="w-full max-w-6xl">
      {/* Función Objetivo */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-white mb-2 text-left">
          Función Objetivo:
        </label>
        <div className="overflow-x-auto">
          <table className="min-w-max table-auto border-collapse mx-auto text-center">
            <thead>
              <tr>
                {formData.funcionObjetivo.map((_, index) => (
                  <th key={index} className="px-3 py-2 text-white">{`x${index + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {formData.funcionObjetivo.map((_, index) => (
                  <td key={index}>
                    <input
                      type="text"
                      value={formData.funcionObjetivo[index]}
                      onChange={(e) => handleFuncObjetivoChange(e, index)}
                      className="p-2 w-20 border border-gray-300 rounded-lg"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Restricciones */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-white mb-2 text-left">
          Restricciones:
        </label>
        <div className="overflow-x-auto">
          <table className="min-w-max table-auto border-collapse mx-auto text-center">
            <thead>
              <tr>
                {formData.funcionObjetivo.map((_, index) => (
                  <th key={index} className="px-3 py-2 text-white">{`x${index + 1}`}</th>
                ))}
                <th className="px-3 py-2 text-white">Sol</th>
              </tr>
            </thead>
            <tbody>
              {formData.restricciones.map((restriccion, restriccionIndex) => (
                <tr key={restriccionIndex}>
                  {restriccion.map((_, variableIndex) => (
                    <td key={variableIndex}>
                      <input
                        type="text"
                        value={restriccion[variableIndex]}
                        onChange={(e) =>
                          handleChange(e, restriccionIndex, variableIndex)
                        }
                        className="p-2 w-20 border border-gray-300 rounded-lg"
                      />
                    </td>
                  ))}
                  <td>
                    <input
                      type="text"
                      value={formData.resultados[restriccionIndex]}
                      onChange={(e) => handleResultChange(e, restriccionIndex)}
                      className="p-2 w-20 border border-gray-300 rounded-lg"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full shadow-lg transition duration-300"
      >
        Resolver
      </button>

      <div className="mt-6 text-center">
        <Link
          to="/configurar"
          className="inline-block text-blue-600 hover:underline hover:text-blue-800 transition font-medium"
        >
          🔙 Volver
        </Link>
      </div>
    </form>
  </div>
);

};

export default Simulador;

