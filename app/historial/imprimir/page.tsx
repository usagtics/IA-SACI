"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function ImprimirContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/api/planeacion-detalle/${id}`)
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!data)
    return (
      <div className="p-20 text-center font-bold text-[#090E30]">
        Cargando formato institucional de la Universidad San Andrés de
        Guanajuato...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:p-0 font-sans">
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-800 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all"
        >
          ← Volver al Historial
        </button>
        <button
          onClick={() => window.print()}
          className="bg-[#090E30] hover:bg-blue-950 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2"
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Imprimir / Guardar PDF
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-200 print:shadow-none print:border-none print:p-0 print:w-full">
        <div className="border-b-4 border-[#090E30] pb-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#090E30]">
              Universidad San Andrés de Guanajuato
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mt-1">
              Módulo de Diseño Académico — Planeación Docente Oficial
            </p>
          </div>
          <div className="text-right text-xs bg-gray-50 p-4 rounded-xl border border-gray-200 print:border-none print:bg-transparent print:p-0">
            <p className="font-bold text-gray-800">
              Periodo Escolar:{" "}
              <span className="font-normal text-gray-900">2026-2</span>
            </p>
            <p className="font-bold text-gray-800 mt-0.5">
              Docente:{" "}
              <span className="font-normal text-gray-900">
                Daniela Murillo Lopéz
              </span>
            </p>
          </div>
        </div>

        <div className="bg-[#f8f9fc] border-l-4 border-[#090E30] border-y border-r border-gray-200 p-6 rounded-r-2xl mb-6 print:bg-white print:border-black print:p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 block mb-1">
                Asignatura Evaluada
              </span>
              <h2 className="text-xl font-black text-[#090E30]">
                {data.cabecera.NombreMateria || "Materia General Asignada"}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 block mb-1">
                Clave / Clientes
              </span>
              <span className="text-xs font-bold bg-[#090E30] text-white px-3 py-1 rounded-lg">
                {data.cabecera.ClaveMateria || "ING-WEB-08"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#f8f9fc] border border-gray-200 p-6 rounded-2xl mb-8 space-y-4 print:bg-white print:border-black print:p-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#090E30] border-b border-gray-200 pb-2">
            Competencias de la Asignatura
          </h3>
          <div className="grid grid-cols-1 gap-4 text-xs">
            <div>
              <span className="font-bold text-gray-800 uppercase tracking-wide block mb-1">
                Competencia General:
              </span>
              <p className="text-gray-900 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-gray-100 print:border-none print:p-0">
                {data.cabecera.CompetenciaGeneral || "No especificada"}
              </p>
            </div>
            <div>
              <span className="font-bold text-gray-800 uppercase tracking-wide block mb-1">
                Competencias Específicas:
              </span>
              <p className="text-gray-900 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-gray-100 print:border-none print:p-0">
                {data.cabecera.CompetenciasEspecificas || "No especificadas"}
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#090E30] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#090E30]"></span>
          Secuencias Didácticas Registradas
        </h3>
        <div className="overflow-x-auto mb-12">
          <table className="w-full border-collapse border border-gray-300 text-xs text-left">
            <thead>
              <tr className="bg-[#090E30] text-white text-center font-bold uppercase text-[10px] tracking-wider">
                <th className="border border-gray-300 p-3.5 w-12">Seq</th>
                <th className="border border-gray-300 p-3.5 w-1/4">
                  Temas y Subtemas
                </th>
                <th className="border border-gray-300 p-3.5 w-16">Horas</th>
                <th className="border border-gray-300 p-3.5">
                  Actividades de Aprendizaje
                </th>
                <th className="border border-gray-300 p-3.5 w-16">% Eval</th>
                <th className="border border-gray-300 p-3.5">
                  Criterios de Evaluación
                </th>
                <th className="border border-gray-300 p-3.5 w-24">
                  Moodle / Mod
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.secuencias.map((seq: any) => (
                <tr
                  key={seq.IdSecuencia}
                  className="align-top hover:bg-gray-50"
                >
                  <td className="border border-gray-300 p-3 text-center font-bold text-[#090E30]">
                    {seq.NumeroSecuencia}
                  </td>
                  <td className="border border-gray-300 p-3 font-medium text-gray-800">
                    {seq.TemasSubtemas}
                  </td>
                  <td className="border border-gray-300 p-3 text-center font-semibold text-gray-700">
                    {seq.HorasAbordaje} hrs
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-700">
                    {seq.ActividadesAprendizaje}
                  </td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-[#090E30]">
                    {seq.PorcentajeEvaluacion}%
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-700">
                    {seq.CriteriosEvaluacion}
                  </td>
                  <td className="border border-gray-300 p-3 text-center text-xs">
                    <span className="block font-bold text-gray-900">
                      {seq.Modalidad}
                    </span>
                    {seq.UsoMoodle && (
                      <span className="text-[10px] bg-gray-100 text-[#090E30] px-1.5 py-0.5 rounded font-bold mt-1 inline-block border border-gray-200">
                        Moodle
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ZONA DE FIRMAS */}
        <div className="grid grid-cols-2 gap-20 mt-24 pt-10 text-center text-xs">
          <div className="border-t-2 border-[#090E30] pt-3">
            <p className="font-extrabold uppercase text-[#090E30]">
              Roberto Gómez
            </p>
            <p className="text-gray-500 font-semibold mt-0.5">
              Firma del Docente
            </p>
          </div>
          <div className="border-t-2 border-[#090E30] pt-3">
            <p className="font-extrabold uppercase text-[#090E30]">
              Dirección Académica
            </p>
            <p className="text-gray-500 font-semibold mt-0.5">
              Firma y Sello Institucional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImprimirPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-bold text-[#090E30]">
          Cargando formato de la Universidad San Andrés de Guanajuato...
        </div>
      }
    >
      <ImprimirContent />
    </Suspense>
  );
}
