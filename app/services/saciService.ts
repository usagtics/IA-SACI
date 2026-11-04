const API_BASE_URL = "http://localhost:3001/api";

export const saciService = {
  async enviarMensajeChat(
    mensaje: string,
    contextoProyecto?: {
      materia?: string;
      competencia?: string;
      seccionActual?: string;
    },
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensaje, contextoProyecto }),
      });

      if (!response.ok) {
        throw new Error("Error al comunicarse con el asistente de IA.");
      }

      const data = await response.json();
      return data.respuesta;
    } catch (error) {
      console.error("Error en saciService.enviarMensajeChat:", error);
      throw error;
    }
  },

  async revisarPlaneacion(planeacionData: {
    competenciaGeneral: string;
    competenciasEspecificas: string;
    secuencias: any[];
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/revisar-planeacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planeacion: planeacionData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la revisión pedagógica.");
      }

      const data = await response.json();
      return data.observaciones;
    } catch (error) {
      console.error("Error en saciService.revisarPlaneacion:", error);
      throw error;
    }
  },

  async guardarPlaneacion(planeacionPayload: {
    idEmpleado: number;
    idOfertaAcademica: number;
    competenciaGeneral: string;
    competenciasEspecificas: string;
    secuencias: any[];
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/planeacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planeacionPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo guardar la planeación.");
      }

      return data; // Retorna éxito e idPlaneacion
    } catch (error) {
      console.error("Error en saciService.guardarPlaneacion:", error);
      throw error;
    }
  },

  async obtenerPlaneacionesPorEmpleado(idEmpleado: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/planeaciones/${idEmpleado}`,
      );
      if (!response.ok) throw new Error("Error al obtener el historial.");
      return await response.json();
    } catch (error) {
      console.error(
        "Error en saciService.obtenerPlaneacionesPorEmpleado:",
        error,
      );
      throw error;
    }
  },

  async obtenerDetallePlaneacion(idPlaneacion: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/planeacion-detalle/${idPlaneacion}`,
      );
      if (!response.ok) throw new Error("Error al obtener el detalle.");
      return await response.json();
    } catch (error) {
      console.error("Error en saciService.obtenerDetallePlaneacion:", error);
      throw error;
    }
  },
};
