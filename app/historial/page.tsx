"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HistorialPage() {
  const [planeaciones, setPlaneaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3001/api/planeaciones/1")
      .then((res) => {
        setPlaneaciones(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-[#f8f9fc] text-gray-800 font-sans selection:bg-[#090E30] selection:text-white">
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
            href="/"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Planeación Docente
          </Link>

          <Link
            href="/historial"
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

      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[#090E30] text-sm font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#090E30] animate-pulse"></span>
                Módulo de Consultas y Reportes
              </p>
              <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#090E30] to-blue-800">
                Historial de Planeaciones
              </h1>
            </div>

            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] flex items-center gap-2"
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

          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                  <th className="p-6">ID Doc.</th>
                  <th className="p-6">Competencia General</th>
                  <th className="p-6 text-center">Secuencias</th>
                  <th className="p-6 text-center">Fecha de Registro</th>
                  <th className="p-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <svg
                          className="animate-spin h-8 w-8 text-indigo-500"
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
                        <p className="text-gray-400 font-medium">
                          Consultando registros históricos...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : planeaciones.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-bold text-lg">
                        No hay planeaciones registradas
                      </p>
                      <p className="text-gray-400 mt-1">
                        Genera una nueva planeación para verla reflejada aquí.
                      </p>
                    </td>
                  </tr>
                ) : (
                  planeaciones.map((p) => (
                    <tr
                      key={p.IdPlaneacion}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="p-6">
                        <span className="bg-[#090E30] text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                          #{p.IdPlaneacion}
                        </span>
                      </td>
                      <td className="p-6 max-w-sm">
                        <p className="text-gray-800 font-medium truncate group-hover:text-indigo-900 transition-colors">
                          {p.CompetenciaGeneral || "Sin descripción registrada"}
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-xs border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {p.TotalSecuencias} Secuencias
                        </span>
                      </td>
                      <td className="p-6 text-center text-gray-500 font-medium">
                        {new Date(p.FechaRegistro).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() =>
                            router.push(
                              `/historial/imprimir?id=${p.IdPlaneacion}`,
                            )
                          }
                          className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-100 hover:border-indigo-300 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 mx-auto group-hover:shadow-md"
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
                              strokeWidth="2"
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
    </div>
  );
}
