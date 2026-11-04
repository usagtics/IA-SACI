import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const PlaneacionService = {
  guardar: async (datos: any) => {
    try {
      const response = await api.post("/planeacion", datos);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error al guardar la planeación",
      );
    }
  },

  enviarMensajeIA: async (mensaje: string, contextoProyecto: any) => {
    try {
      const response = await api.post("/chat", { mensaje, contextoProyecto });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Error al comunicarse con Gemini",
      );
    }
  },
};
