"use client";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { PlaneacionService } from "./services/PlaneacionService";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PlaneacionContenido() {
  const searchParams = useSearchParams();
  const idOfertaParam = searchParams.get("idOferta");
  const nombreMateriaParam = searchParams.get("nombre");

  const idEmpleadoActual = 1;

  const [materiasAsignadas, setMateriasAsignadas] = useState<any[]>([]);
  const [selectedOferta, setSelectedOferta] = useState<string>(
    idOfertaParam ? idOfertaParam : "",
  );

  const [cabecera, setCabecera] = useState({
    idEmpleado: idEmpleadoActual,
    idOfertaAcademica: idOfertaParam ? parseInt(idOfertaParam) : 1,
    competenciaGeneral: "",
    competenciasEspecificas: "",
  });

  const [nombreMateria, setNombreMateria] = useState(
    nombreMateriaParam
      ? decodeURIComponent(nombreMateriaParam)
      : "Selecciona una materia",
  );

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/mis-materias/${idEmpleadoActual}`)
      .then((res) => {
        setMateriasAsignadas(res.data);

        if (!idOfertaParam && res.data.length > 0) {
          setSelectedOferta(String(res.data[0].idOferta));
          setCabecera((prev) => ({
            ...prev,
            idOfertaAcademica: res.data[0].idOferta,
          }));
          setNombreMateria(res.data[0].nombre);
        } else if (idOfertaParam) {
          setSelectedOferta(idOfertaParam);
          if (nombreMateriaParam) {
            setNombreMateria(decodeURIComponent(nombreMateriaParam));
          } else {
            const encontrada = res.data.find(
              (m: any) => String(m.idOferta) === idOfertaParam,
            );
            if (encontrada) setNombreMateria(encontrada.nombre);
          }
        }
      })
      .catch((err) => console.error("Error al cargar materias:", err));
  }, [idOfertaParam, nombreMateriaParam]);

  const handleMateriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ofertaId = e.target.value;
    setSelectedOferta(ofertaId);
    const materiaEncontrada = materiasAsignadas.find(
      (m) => String(m.idOferta) === ofertaId,
    );
    if (materiaEncontrada) {
      setNombreMateria(materiaEncontrada.nombre);
      setCabecera((prev) => ({
        ...prev,
        idOfertaAcademica: parseInt(ofertaId),
      }));
    }
  };

  const [secuencias, setSecuencias] = useState([
    {
      id: 1,
      numeroSecuencia: 1,
      horasAbordaje: 0,
      temasSubtemas: "",
      aprendizajeEsperado: "",
      actividadesAprendizaje: "",
      porcentajeEvaluacion: 0,
      criteriosEvaluacion: "",
      tipoEvaluacion: "Formativa",
      usoMoodle: false,
      modalidad: "Presencial",
      esPractica: false,
    },
  ]);

  const [chat, setChat] = useState<{ role: string; text: string }[]>([
    {
      role: "ai",
      text: "¡Hola! Soy tu Copiloto SACI. Estoy analizando tu planeación en tiempo real. ¿En qué te puedo asesorar hoy?",
    },
  ]);
  const [inputChat, setInputChat] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [observacionesIA, setObservacionesIA] = useState<any[]>([]);
  const [revisandoIA, setRevisandoIA] = useState(false);

  const handleCabeceraChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCabecera({ ...cabecera, [e.target.name]: e.target.value });
  };

  const handleSecuenciaChange = (id: number, field: string, value: any) => {
    setSecuencias((prev) =>
      prev.map((seq) => (seq.id === id ? { ...seq, [field]: value } : seq)),
    );
  };

  const agregarSecuencia = () => {
    const nuevoId = secuencias.length + 1;
    setSecuencias([
      ...secuencias,
      {
        id: nuevoId,
        numeroSecuencia: nuevoId,
        horasAbordaje: 0,
        temasSubtemas: "",
        aprendizajeEsperado: "",
        actividadesAprendizaje: "",
        porcentajeEvaluacion: 0,
        criteriosEvaluacion: "",
        tipoEvaluacion: "Formativa",
        usoMoodle: false,
        modalidad: "Presencial",
        esPractica: false,
      },
    ]);
  };

  const eliminarSecuencia = (id: number) => {
    if (secuencias.length > 1) {
      setSecuencias(
        secuencias
          .filter((seq) => seq.id !== id)
          .map((seq, idx) => ({ ...seq, numeroSecuencia: idx + 1 })),
      );
    }
  };

  const guardarPlaneacion = async () => {
    try {
      const payload = {
        ...cabecera,
        secuencias,
      };
      await PlaneacionService.guardar(payload);
      alert(
        "¡Planeación y secuencias guardadas exitosamente en la base de datos de SACI!",
      );
    } catch (error: any) {
      console.error(error);
      alert(
        error.message || "Error al guardar la planeación. Revisa la consola.",
      );
    }
  };

  const revisarPlaneacionConIA = async () => {
    setRevisandoIA(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/revisar-planeacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planeacion: {
              competenciaGeneral: cabecera.competenciaGeneral,
              competenciasEspecificas: cabecera.competenciasEspecificas,
              secuencias: secuencias,
            },
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hubo un problema en el servidor de IA");
      }

      setObservacionesIA(data.observaciones || []);

      if (data.observaciones?.length === 0) {
        alert(
          "¡Excelente! La IA determinó que tu planeación cumple con todos los criterios institucionales.",
        );
      } else {
        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            text: `He terminado de revisar tu planeación. Encontré ${data.observaciones.length} observaciones pedagógicas. Revísalas en el panel central para realizar los ajustes.`,
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error al procesar la revisión:", error);
      alert(
        "Error al conectar con el servicio de revisión de IA: " + error.message,
      );
    } finally {
      setRevisandoIA(false);
    }
  };

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const textoUsuario = inputChat;
    setChat((prev) => [...prev, { role: "user", text: textoUsuario }]);
    setInputChat("");
    setIsTyping(true);

    try {
      const contexto = {
        materia: nombreMateria,
        competencia: cabecera.competenciaGeneral,
        seccionActual: "General",
      };
      const respuesta = await PlaneacionService.enviarMensajeIA(
        textoUsuario,
        contexto,
      );
      setChat((prev) => [...prev, { role: "ai", text: respuesta.respuesta }]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Error al conectar con Gemini." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-800 font-sans selection:bg-[#090E30] selection:text-white w-full">
      <nav className="w-64 bg-gradient-to-b from-[#090E30] to-[#121945] text-white flex flex-col shadow-2xl z-20 relative">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black tracking-tight">SACI</h2>
          </div>
          <p className="text-[#8c94c9] text-[10px] font-bold uppercase tracking-[0.2em] ml-1">
            Universidad San Andrés
          </p>
        </div>

        <div className="flex-1 py-8 px-5 space-y-3">
          <p className="px-2 text-xs font-bold text-[#5c689e] uppercase tracking-wider mb-2">
            Workspace
          </p>

          <Link
            href="/materias"
            className="flex items-center gap-3 text-[#8c94c9] hover:bg-white/5 hover:text-white p-3.5 rounded-xl font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Mis Materias
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 bg-white/10 text-white p-3.5 rounded-xl font-medium shadow-sm border border-white/5 backdrop-blur-sm transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Planeación Docente
          </Link>

          <Link
            href="/historial"
            className="flex items-center gap-3 text-[#8c94c9] hover:bg-white/5 hover:text-white p-3.5 rounded-xl font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Historial / Reportes PDF
          </Link>
        </div>

        <div className="p-6 bg-black/20 backdrop-blur-md border-t border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-[#090E30]">
            RG
          </div>
          <div>
            <p className="font-bold text-white text-sm">Roberto Gómez</p>
            <p className="text-xs text-[#8c94c9]">Docente / Ing.</p>
          </div>
        </div>
      </nav>

      {/* ================= ÁREA DE CONTENIDO ================= */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[#090E30] text-sm font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#090E30] animate-pulse"></span>
                  Módulo de Diseño Académico
                </p>
                <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#090E30] to-blue-800">
                  Planeación Docente
                </h1>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={revisarPlaneacionConIA}
                  disabled={revisandoIA}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {revisandoIA ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analizando...
                    </>
                  ) : (
                    "✨ Revisa mi planeación"
                  )}
                </button>

                <button
                  onClick={guardarPlaneacion}
                  className="bg-[#090E30] hover:bg-[#151c4a] text-white px-8 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_8px_20px_rgba(9,14,48,0.25)] flex items-center gap-2"
                >
                  Guardar Planeación
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 mb-8 flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                  Materia Seleccionada para Planeación
                </label>
                <p className="text-sm font-extrabold text-[#090E30]">
                  {nombreMateria}
                </p>
              </div>
              <div className="w-1/2">
                <select
                  value={selectedOferta}
                  onChange={handleMateriaChange}
                  className="w-full bg-[#f8f9fc] border border-gray-200 p-3.5 rounded-xl font-medium text-gray-800 outline-none focus:border-[#090E30] transition-all"
                >
                  {materiasAsignadas.length === 0 ? (
                    <option value="">Cargando materias...</option>
                  ) : (
                    materiasAsignadas.map((mat, idx) => (
                      <option
                        key={`${mat.idOferta}-${idx}`}
                        value={mat.idOferta}
                      >
                        {mat.nombre} (Grupo {mat.grupo})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {observacionesIA.length > 0 && (
              <div className="bg-indigo-50/50 border border-indigo-100 p-7 rounded-3xl mb-8 space-y-5 shadow-sm">
                <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                  <span className="text-xl">💡</span> Observaciones del Comité
                  Pedagógico (IA)
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {observacionesIA.map((obs, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm space-y-3 transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                        <span className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          {obs.campo}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold ${
                            obs.gravedad === "Alta"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : obs.gravedad === "Media"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}
                        >
                          {obs.gravedad}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pt-1">
                        <strong className="text-gray-900 font-bold">
                          Observación:
                        </strong>{" "}
                        {obs.observacion}
                      </p>
                      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 mt-2">
                        <p className="text-sm text-indigo-900 leading-relaxed">
                          <strong className="font-bold">Sugerencia:</strong>{" "}
                          {obs.sugerencia}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 mb-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">
                Datos Generales
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                    Competencia General
                  </label>
                  <textarea
                    name="competenciaGeneral"
                    value={cabecera.competenciaGeneral}
                    onChange={handleCabeceraChange}
                    className="w-full bg-[#f8f9fc] border border-transparent p-4 rounded-xl h-24 resize-none focus:bg-white focus:ring-2 focus:ring-[#090E30]/20 focus:border-[#090E30] outline-none text-gray-800 font-medium transition-all"
                    placeholder="Describe la competencia principal de la materia..."
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                    Competencias Específicas
                  </label>
                  <textarea
                    name="competenciasEspecificas"
                    value={cabecera.competenciasEspecificas}
                    onChange={handleCabeceraChange}
                    className="w-full bg-[#f8f9fc] border border-transparent p-4 rounded-xl h-24 resize-none focus:bg-white focus:ring-2 focus:ring-[#090E30]/20 focus:border-[#090E30] outline-none text-gray-800 font-medium transition-all"
                    placeholder="Lista las competencias secundarias..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Secuencias Didácticas
              </h3>
              <button
                onClick={agregarSecuencia}
                className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 border border-blue-100"
              >
                + Agregar Secuencia
              </button>
            </div>

            <div className="space-y-6">
              {secuencias.map((seq) => (
                <div
                  key={seq.id}
                  className="bg-white p-7 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 relative group"
                >
                  {secuencias.length > 1 && (
                    <button
                      onClick={() => eliminarSecuencia(seq.id)}
                      className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors font-bold"
                    >
                      ✕
                    </button>
                  )}
                  <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                    <span className="bg-[#090E30] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm">
                      {seq.numeroSecuencia}
                    </span>
                    <h4 className="font-bold text-gray-800 text-lg">
                      Secuencia {seq.numeroSecuencia}
                    </h4>
                  </div>

                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 md:col-span-8">
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        Temas y Subtemas
                      </label>
                      <textarea
                        value={seq.temasSubtemas}
                        onChange={(e) =>
                          handleSecuenciaChange(
                            seq.id,
                            "temasSubtemas",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#f8f9fc] border border-transparent p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#090E30]/20 focus:border-[#090E30] outline-none text-sm h-24 resize-none transition-all font-medium text-gray-800"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        Horas
                      </label>
                      <input
                        type="number"
                        value={seq.horasAbordaje}
                        onChange={(e) =>
                          handleSecuenciaChange(
                            seq.id,
                            "horasAbordaje",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full bg-[#f8f9fc] border border-transparent p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#090E30]/20 focus:border-[#090E30] outline-none text-sm transition-all font-medium text-gray-800 text-center"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        % Evaluación
                      </label>
                      <input
                        type="number"
                        value={seq.porcentajeEvaluacion}
                        onChange={(e) =>
                          handleSecuenciaChange(
                            seq.id,
                            "porcentajeEvaluacion",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full bg-[#f8f9fc] border border-transparent p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#090E30]/20 focus:border-[#090E30] outline-none text-sm transition-all font-medium text-gray-800 text-center"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        Actividades de Aprendizaje
                      </label>
                      <textarea
                        value={seq.actividadesAprendizaje}
                        onChange={(e) =>
                          handleSecuenciaChange(
                            seq.id,
                            "actividadesAprendizaje",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#f8f9fc] border border-transparent p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#090E30]/20 focus:border-[#090E30] outline-none text-sm h-28 resize-none transition-all font-medium text-gray-800"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        Criterios de Evaluación
                      </label>
                      <textarea
                        value={seq.criteriosEvaluacion}
                        onChange={(e) =>
                          handleSecuenciaChange(
                            seq.id,
                            "criteriosEvaluacion",
                            e.target.value,
                          )
                        }
                        className="w-full bg-[#f8f9fc] border border-transparent p-4 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#090E30]/20 focus:border-[#090E30] outline-none text-sm h-28 resize-none transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[450px] 2xl:w-[550px] flex flex-col bg-white border-l border-gray-100 shadow-[-15px_0_40px_-15px_rgba(0,0,0,0.03)] z-10 relative">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-extrabold text-gray-900 text-lg">
                  Copiloto IA
                </h2>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-0.5">
                  Gemini Powered
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fc] custom-scrollbar">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-5 py-4 max-w-[85%] text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#090E30] text-white rounded-2xl rounded-br-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 text-gray-800 text-sm flex items-center gap-2 shadow-sm">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={enviarMensaje}
            className="p-6 bg-white border-t border-gray-100"
          >
            <div className="relative flex items-center group">
              <input
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Pide un ejemplo o sugerencia..."
                className="w-full bg-[#f8f9fc] border border-transparent py-4 pl-6 pr-16 rounded-2xl text-sm focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium text-gray-800 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#090E30] hover:bg-indigo-600 text-white p-2.5 rounded-xl w-10 h-10 shadow-md transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={isTyping || !inputChat.trim()}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PlaneacionDocentePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center font-bold text-gray-500">
          Cargando planeación...
        </div>
      }
    >
      <PlaneacionContenido />
    </Suspense>
  );
}
