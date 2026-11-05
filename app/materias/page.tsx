"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MisMateriasPage() {
  const router = useRouter();
  const [materias, setMaterias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const idEmpleadoActual = 1;

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/mis-materias/${idEmpleadoActual}`)
      .then((res) => {
        setMaterias(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen h-screen bg-[#f5f7fc] text-slate-800 font-sans selection:bg-blue-800 selection:text-white">
      <nav className="w-[340px] xl:w-[360px] shrink-0 bg-gradient-to-b from-[#080D2B] via-[#101943] to-[#17265A] text-white flex flex-col shadow-2xl z-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-28 -left-24 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

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

        <div className="relative flex-1 py-8 px-6 space-y-3">
          <p className="px-3 text-[10px] font-extrabold text-blue-200/50 uppercase tracking-[0.22em] mb-5">
            Menú principal
          </p>

          <Link
            href="/materias"
            className="group flex items-center gap-4 px-4 py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 text-white border border-blue-400/30 shadow-lg shadow-blue-950/30 transition-all duration-200"
          >
            <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
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

            <span className="flex-1 min-w-0">
              <span className="block font-bold text-sm">Mis Materias</span>
              <span className="block text-[11px] text-blue-100/80 mt-1">
                Consulta tus asignaturas
              </span>
            </span>

            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </Link>

          <Link
            href="/"
            className="group flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-300/80 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-all duration-200"
          >
            <span className="w-11 h-11 rounded-xl bg-white/[0.06] group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </span>

            <span className="flex-1 min-w-0">
              <span className="block font-bold text-sm">
                Planeación Docente
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                Crear y editar planeaciones
              </span>
            </span>

            <svg
              className="w-4 h-4 text-slate-500 group-hover:text-blue-200 group-hover:translate-x-1 transition-all"
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
            href="/historial"
            className="group flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-300/80 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-all duration-200"
          >
            <span className="w-11 h-11 rounded-xl bg-white/[0.06] group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
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

            <span className="flex-1 min-w-0">
              <span className="block font-bold text-sm">
                Historial de Planeaciones
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                Consulta y reportes PDF
              </span>
            </span>

            <svg
              className="w-4 h-4 text-slate-500 group-hover:text-blue-200 group-hover:translate-x-1 transition-all"
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

          {/* TARJETA INFORMATIVA */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-200 flex items-center justify-center">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
                  />
                </svg>
              </div>

              <p className="text-sm font-bold text-white">Gestión académica</p>
            </div>

            <p className="text-xs text-slate-300/70 leading-relaxed">
              Revisa las materias que tienes asignadas y accede a su planeación
              docente.
            </p>
          </div>
        </div>

        {/* PERFIL DEL DOCENTE */}
        <div className="relative p-6 bg-black/20 border-t border-white/10">
          <div className="flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 p-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center font-black text-sm shadow-lg border border-white/20">
              RG
            </div>

            <div className="min-w-0">
              <p className="font-bold text-white text-sm truncate">
                Daniela Murillo Lopéz
              </p>
              <p className="text-xs text-blue-200/70 mt-1">Docente / Ing.</p>
            </div>

            <span
              className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
              title="Sesión activa"
            />
          </div>

          <p className="text-[9px] text-slate-500 text-center mt-4 uppercase tracking-[0.18em]">
            Plataforma institucional SACI
          </p>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 min-w-0 p-7 xl:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-9">
            <div>
              <p className="text-blue-800 text-xs font-extrabold tracking-[0.18em] uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-700 animate-pulse" />
                Gestión de carga académica
              </p>

              <h1 className="text-3xl xl:text-4xl font-black tracking-tight text-[#090E30]">
                Mis Materias Asignadas
              </h1>

              <p className="text-slate-500 text-sm mt-2">
                Consulta tus asignaturas y comienza a elaborar su planeación
                docente.
              </p>

              <div className="inline-flex items-center gap-2 mt-4 bg-blue-50 border border-blue-100 rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-blue-900">
                  Periodo Actual: 2026-2
                </span>
              </div>
            </div>
          </div>

          {!loading && materias.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Materias asignadas
                </p>
                <p className="text-3xl font-black text-[#090E30] mt-2">
                  {materias.length}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Planeaciones completadas
                </p>
                <p className="text-3xl font-black text-emerald-700 mt-2">
                  {materias.filter((m) => m.estado === "Completada").length}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-24">
              <svg
                className="animate-spin h-10 w-10 text-blue-700 mb-4"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>

              <p className="text-slate-500 font-bold">
                Cargando carga horaria...
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Estamos consultando tus materias asignadas.
              </p>
            </div>
          ) : materias.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
                  />
                </svg>
              </div>

              <p className="text-xl font-bold text-slate-700">
                No tienes materias asignadas para este periodo.
              </p>

              <p className="text-slate-400 mt-2 text-sm">
                Si consideras que esto es un error, consulta con el área
                académica.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Carga académica
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Selecciona una materia para elaborar o consultar su
                    planeación.
                  </p>
                </div>

                <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                  {materias.length} materias
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {materias.map((materia, idx) => (
                  <div
                    key={`${materia.idOferta}-${idx}`}
                    className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200 flex flex-col min-h-[285px] hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start gap-3 mb-6">
                      <span
                        className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          materia.estado === "Completada"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {materia.estado === "Completada"
                          ? "Planeación lista"
                          : "Falta planeación"}
                      </span>

                      <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 whitespace-nowrap">
                        Grupo {materia.grupo}
                      </span>
                    </div>

                    <div className="mb-7 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 flex items-center justify-center mb-4 group-hover:bg-blue-700 group-hover:text-white transition-colors">
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
                      </div>

                      <h3 className="text-xl font-extrabold text-[#090E30] leading-tight mb-2 group-hover:text-blue-800 transition-colors">
                        {materia.nombre}
                      </h3>

                      <p className="text-sm text-slate-500 font-medium">
                        {materia.carrera}
                      </p>

                      <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-wide">
                        {materia.semestre} <span className="mx-1">•</span>{" "}
                        {materia.alumnos} alumnos
                      </p>
                    </div>

                    {materia.estado === "Completada" ? (
                      <button
                        onClick={() => router.push("/historial")}
                        className="w-full bg-white border border-emerald-200 hover:border-emerald-600 hover:bg-emerald-50 text-emerald-800 py-3.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Ver en Historial
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          router.push(
                            `/?idOferta=${materia.idOferta}&nombre=${encodeURIComponent(materia.nombre)}`,
                          )
                        }
                        className="w-full bg-[#1E40AF] hover:bg-[#1D4ED8] active:bg-[#1E3A8A] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/15 hover:shadow-blue-900/25 flex justify-center items-center gap-2"
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
                            strokeWidth="1.8"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Realizar Planeación
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
