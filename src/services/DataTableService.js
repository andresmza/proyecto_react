import axios from "axios";

export default class DataTableService {
  static myInstance = null;
  static getInstance() {
    if (DataTableService.myInstance == null) {
      DataTableService.myInstance = new DataTableService();
    }
    return this.myInstance;
  }

  async getDataTable(idPuesto, nroGrilla) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/Anexo/${idPuesto}/${nroGrilla}`);
  }

  async getHistoricoAdo(fechaIngreso, fechaEgreso, idProducto) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/Anexo/Historico?FechaIngreso=${fechaIngreso}&FechaEgreso=${fechaEgreso}&IdProducto=${idProducto}`);
  }
}
