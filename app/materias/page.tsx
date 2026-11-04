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
            href="/materias"
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Mis Materias
          </Link>

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

      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[#090E30] text-sm font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Periodo Actual: 2026-2
              </p>
              <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#090E30] to-blue-800">
                Mis Materias Asignadas
              </h1>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="animate-spin h-10 w-10 text-indigo-500 mb-4"
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
              <p className="text-gray-500 font-bold">
                Cargando carga horaria...
              </p>
            </div>
          ) : materias.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xl font-bold text-gray-400">
                No tienes materias asignadas para este periodo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {materias.map((materia, idx) => (
                <div
                  key={`${materia.idOferta}-${idx}`}
                  className="bg-white rounded-3xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        materia.estado === "Completada"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {materia.estado === "Completada"
                        ? "Planeación Lista"
                        : "Falta Planeación"}
                    </span>
                    <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-lg text-xs font-bold border border-gray-100">
                      Grupo {materia.grupo}
                    </span>
                  </div>

                  <div className="mb-6 flex-1">
                    <h3 className="text-xl font-extrabold text-[#090E30] leading-tight mb-2 group-hover:text-indigo-700 transition-colors">
                      {materia.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {materia.carrera}
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wide">
                      {materia.semestre} • {materia.alumnos} Alumnos
                    </p>
                  </div>

                  {materia.estado === "Completada" ? (
                    <button
                      onClick={() => router.push("/historial")}
                      className="w-full bg-white border-2 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 py-3.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2"
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
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex justify-center items-center gap-2 group-hover:shadow-[0_8px_20px_rgba(79,70,229,0.3)]"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Realizar Planeación
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
