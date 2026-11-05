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
    <div className="flex min-h-screen h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-700 selection:text-white w-full">
      <nav className="w-72 xl:w-[340px] 2xl:w-[360px] shrink-0 bg-gradient-to-b from-[#080D2B] via-[#101A46] to-[#111D50] text-white flex flex-col shadow-[12px_0_35px_-18px_rgba(8,13,43,0.55)] z-20 relative overflow-hidden">
        <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-28 -right-24 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="relative px-7 pt-8 pb-7 border-b border-white/10">
          <div className="w-full h-34 rounded-2xl bg-gradient-to-br from-[#102c65] to-[#071936] flex items-center justify-center px-5 py-3 shadow-xl ring-1 ring-white/10">
            <img
              src="/usag.png"
              alt="Universidad San Andrés de Guanajuato"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 backdrop-blur-sm">
            <p className="text-white text-sm font-semibold">
              Universidad San Andrés
            </p>
            <p className="text-blue-200/60 text-xs mt-1">
              Guanajuato · Plataforma docente
            </p>
          </div>
        </div>

        {/* Navegación */}
        <div className="relative flex-1 px-5 py-7">
          <div className="flex items-center justify-between px-3 mb-4">
            <p className="text-[10px] font-extrabold text-blue-200/50 uppercase tracking-[0.22em]">
              Menú principal
            </p>
            <span className="text-[9px] font-bold text-blue-200/40 border border-white/10 rounded-full px-2 py-1">
              SACI
            </span>
          </div>

          <div className="space-y-2">
            <Link
              href="/materias"
              className="group flex items-center gap-4 px-4 py-4 rounded-2xl text-blue-100/70 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all duration-200"
            >
              <span className="w-11 h-11 shrink-0 rounded-xl bg-white/[0.06] group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-sm">Mis materias</span>
                <span className="block text-[11px] text-blue-200/45 mt-1">
                  Consulta tus asignaturas
                </span>
              </span>
              <svg
                className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-70 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 18 6-6-6-6"
                />
              </svg>
            </Link>

            <Link
              href="/"
              className="group relative flex items-center gap-4 px-4 py-4 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-400/30 shadow-lg shadow-blue-950/40 transition-all duration-200"
            >
              <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-sky-200" />
              <span className="w-11 h-11 shrink-0 rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-white/15">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-5 8h4m-4 4h4"
                  />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-extrabold text-sm">
                  Planeación docente
                </span>
                <span className="block text-[11px] text-blue-100/75 mt-1">
                  Diseña y organiza tus clases
                </span>
              </span>
              <span className="ml-auto text-[9px] uppercase tracking-wider font-extrabold bg-white/15 rounded-full px-2.5 py-1">
                Actual
              </span>
            </Link>

            <Link
              href="/historial"
              className="group flex items-center gap-4 px-4 py-4 rounded-2xl text-blue-100/70 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all duration-200"
            >
              <span className="w-11 h-11 shrink-0 rounded-xl bg-white/[0.06] group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-sm">
                  Historial y reportes
                </span>
                <span className="block text-[11px] text-blue-200/45 mt-1">
                  Consulta tus planeaciones
                </span>
              </span>
              <svg
                className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-70 group-hover:translate-x-1 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 18 6-6-6-6"
                />
              </svg>
            </Link>
          </div>

          <div className="mt-9 mx-1 p-4 rounded-2xl border border-blue-300/15 bg-gradient-to-br from-blue-500/15 to-indigo-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-blue-400/20 flex items-center justify-center text-blue-200">
                ✦
              </span>
              <p className="text-xs font-extrabold text-white">
                Asistente SACI
              </p>
            </div>
            <p className="text-[11px] leading-relaxed text-blue-100/65">
              Recibe orientación para estructurar tus competencias, actividades
              y evaluaciones.
            </p>
          </div>
        </div>

        {/* Perfil del usuario */}
        <div className="relative p-5 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 rounded-2xl p-3 bg-white/[0.06] border border-white/[0.08]">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 flex items-center justify-center font-black text-sm shadow-lg ring-2 ring-white/10">
              RG
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-white text-sm truncate">
                Daniela Murillo Lopéz
              </p>
              <p className="text-[11px] text-blue-200/60 mt-1">
                Docente / Ing.
              </p>
            </div>
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]"
              title="Sesión activa"
            />
          </div>
          <p className="text-center text-[9px] text-blue-200/30 uppercase tracking-[0.2em] mt-4">
            Universidad San Andrés · SACI
          </p>
        </div>
      </nav>

      {/* ================= ÁREA DE CONTENIDO ================= */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 px-6 py-8 xl:px-10 2xl:px-12 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-blue-700 text-xs font-extrabold tracking-[0.18em] uppercase mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Módulo de Diseño Académico
                </p>
                <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900">
                  Planeación Docente
                </h1>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={revisarPlaneacionConIA}
                  disabled={revisandoIA}
                  className="bg-[#1E40AF] hover:bg-[#1D4ED8] active:bg-[#1E3A8A] text-white px-7 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/25 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-200 shadow-lg shadow-slate-900/15 flex items-center gap-2"
                >
                  Guardar Planeación
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-8 flex items-center justify-between gap-6">
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
                  className="w-full bg-[#f8f9fc] border border-gray-200 p-3.5 rounded-xl font-medium text-gray-800 outline-none focus:border-blue-600 transition-all"
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
              <div className="bg-blue-50/70 border border-blue-100 p-6 xl:p-7 rounded-2xl mb-8 space-y-5 shadow-sm">
                <h3 className="text-lg font-black text-blue-950 flex items-center gap-2">
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
                        <span className="font-bold text-sm text-blue-950 flex items-center gap-2">
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
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2">
                        <p className="text-sm text-blue-900 leading-relaxed">
                          <strong className="font-bold">Sugerencia:</strong>{" "}
                          {obs.sugerencia}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-7 xl:p-8 rounded-2xl shadow-sm border border-slate-200/80 mb-8 space-y-6">
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
                    className="w-full bg-[#f8f9fc] border border-slate-200 p-4 rounded-xl h-24 resize-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-gray-800 font-medium transition-all"
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
                    className="w-full bg-[#f8f9fc] border border-slate-200 p-4 rounded-xl h-24 resize-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-gray-800 font-medium transition-all"
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
                className="bg-blue-50 text-blue-800 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 border border-blue-200"
              >
                + Agregar Secuencia
              </button>
            </div>

            <div className="space-y-6">
              {secuencias.map((seq) => (
                <div
                  key={seq.id}
                  className="bg-white p-6 xl:p-7 rounded-2xl shadow-sm border border-slate-200/80 relative group transition-shadow hover:shadow-md"
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
                    <span className="bg-blue-800 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-sm">
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
                        className="w-full bg-[#f8f9fc] border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-sm h-24 resize-none transition-all font-medium text-gray-800"
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
                        className="w-full bg-[#f8f9fc] border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-sm transition-all font-medium text-gray-800 text-center"
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
                        className="w-full bg-[#f8f9fc] border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-sm transition-all font-medium text-gray-800 text-center"
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
                        className="w-full bg-[#f8f9fc] border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-sm h-28 resize-none transition-all font-medium text-gray-800"
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
                        className="w-full bg-[#f8f9fc] border border-slate-200 p-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none text-sm h-28 resize-none transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[390px] xl:w-[420px] 2xl:w-[460px] flex flex-col bg-white border-l border-slate-200 shadow-[-12px_0_35px_-20px_rgba(15,23,42,0.18)] z-10 relative">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1E40AF] text-white flex items-center justify-center font-black shadow-lg shadow-blue-900/20">
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
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mt-0.5">
                  Gemini Powered
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 custom-scrollbar">
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
            className="p-5 bg-white border-t border-slate-200"
          >
            <div className="relative flex items-center group">
              <input
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                placeholder="Pide un ejemplo o sugerencia..."
                className="w-full bg-slate-50 border border-slate-200 py-4 pl-5 pr-16 rounded-2xl text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium text-slate-800"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1E40AF] hover:bg-[#1D4ED8] active:bg-[#1E3A8A] text-white p-2.5 rounded-xl w-10 h-10 shadow-md shadow-blue-900/20 transition-colors disabled:opacity-50 flex items-center justify-center"
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
        <div className="flex h-screen items-center justify-center bg-slate-50 font-semibold text-slate-500">
          Cargando planeación...
        </div>
      }
    >
      <PlaneacionContenido />
    </Suspense>
  );
}
