import axios from "axios";

export default class ReporteService {
  static myInstance = null;
  static getInstance() {
    if (ReporteService.myInstance == null) {
      ReporteService.myInstance = new ReporteService();
    }
    return this.myInstance;
  }

  //GETs
  async getCamionesRechazados(fechaDesde, fechaHasta) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND_DUMMY;
    return await axios.get(`${urlBackend}/api/reporte/camionesRechazados?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }

  async getConductores(fechaDesde, fechaHasta) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND_DUMMY;
    return await axios.get(`${urlBackend}/api/reporte/conductores?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }

  async getCamionesYCombustibles(fechaDesde, fechaHasta) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND_DUMMY;
    return await axios.get(`${urlBackend}/api/reporte/camionesYCombustibles?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }
}
