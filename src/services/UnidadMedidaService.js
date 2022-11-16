import axios from "axios";

export default class UnidadMedidaService {
  static myInstance = null;
  static getInstance() {
    if (UnidadMedidaService.myInstance == null) {
      UnidadMedidaService.myInstance = new UnidadMedidaService();
    }
    return this.myInstance;
  }

  async getAllUnidadesDeMedida() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/unidadmedida`);
  }
}
