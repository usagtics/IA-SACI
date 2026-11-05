"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Planeacion {
  IdPlaneacion: number;
  CompetenciaGeneral?: string;
  TotalSecuencias: number;
  FechaRegistro: string;
}

export default function HistorialPage() {
  const [planeaciones, setPlaneaciones] = useState<Planeacion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    // Petición al backend
    axios
      .get("http://localhost:3001/api/planeaciones/1")
      .then((res) => {
        setPlaneaciones(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al consultar el historial:", err);
        // Alerta en caso de que el backend esté apagado o la ruta falle
        if (err.response?.status === 404 || !err.response) {
          alert(
            "Error de conexión: Asegúrate de que tu servidor Node.js (backend) esté encendido y en el puerto 3001.",
          );
        }
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-sm">
                Historial de Planeaciones
              </span>
              <span className="block text-[11px] text-blue-100/80 mt-1">
                Consulta y reportes PDF
              </span>
            </span>
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </Link>

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
                    d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                  />
                </svg>
              </div>
              <p className="text-sm font-bold text-white">Gestión académica</p>
            </div>
            <p className="text-xs text-slate-300/70 leading-relaxed">
              Consulta las planeaciones registradas y accede a sus reportes en
              formato PDF.
            </p>
          </div>
        </div>

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

      <main className="flex-1 min-w-0 p-7 xl:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-9">
            <div>
              <p className="text-blue-800 text-xs font-extrabold tracking-[0.18em] uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-700 animate-pulse" />
                Módulo de consultas y reportes
              </p>
              <h1 className="text-3xl xl:text-4xl font-black tracking-tight text-[#090E30]">
                Historial de Planeaciones
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Consulta las planeaciones que has registrado y genera sus
                reportes.
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="bg-[#1E40AF] hover:bg-[#1D4ED8] active:bg-[#1E3A8A] text-white px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nueva Planeación
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Planeaciones registradas
              </p>
              <p className="text-3xl font-black text-[#090E30] mt-2">
                {loading ? "—" : planeaciones.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estado del historial
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${loading ? "bg-amber-400" : "bg-emerald-500"}`}
                />
                <span className="font-bold text-sm text-slate-700">
                  {loading ? "Consultando registros" : "Consulta actualizada"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="font-extrabold text-slate-900">
                  Registros guardados
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Listado de planeaciones docentes
                </p>
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                {loading ? "Cargando..." : `${planeaciones.length} registros`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase text-slate-500 font-extrabold tracking-wider">
                    <th className="px-6 py-5">ID Doc.</th>
                    <th className="px-6 py-5">Competencia General</th>
                    <th className="px-6 py-5 text-center">Secuencias</th>
                    <th className="px-6 py-5 text-center">Fecha de Registro</th>
                    <th className="px-6 py-5 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <svg
                            className="animate-spin h-9 w-9 text-blue-700"
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
                          <p className="text-slate-400 font-medium">
                            Consultando registros históricos...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : planeaciones.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-slate-600 font-bold text-lg">
                          No hay planeaciones registradas
                        </p>
                        <p className="text-slate-400 mt-1">
                          Genera una nueva planeación para verla reflejada aquí.
                        </p>
                        <button
                          onClick={() => router.push("/")}
                          className="mt-5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                        >
                          Crear planeación
                        </button>
                      </td>
                    </tr>
                  ) : (
                    planeaciones.map((p) => (
                      <tr
                        key={p.IdPlaneacion}
                        className="hover:bg-blue-50/50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <span className="inline-flex bg-[#090E30] text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                            #{p.IdPlaneacion}
                          </span>
                        </td>
                        <td className="px-6 py-5 max-w-sm">
                          <p className="text-slate-800 font-semibold truncate group-hover:text-blue-800 transition-colors">
                            {p.CompetenciaGeneral ||
                              "Sin descripción registrada"}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full font-bold text-xs border border-blue-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            {p.TotalSecuencias} Secuencias
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center text-slate-500 font-medium">
                          {p.FechaRegistro
                            ? new Date(p.FechaRegistro).toLocaleDateString(
                                "es-MX",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "Sin fecha"}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() =>
                              router.push(
                                `/historial/imprimir?id=${p.IdPlaneacion}`,
                              )
                            }
                            className="bg-white hover:bg-blue-700 text-blue-800 hover:text-white border border-blue-200 hover:border-blue-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 mx-auto group-hover:shadow-md"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                              />
                            </svg>
                            Ver PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
