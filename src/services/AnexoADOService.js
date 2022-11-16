import axios from "axios";

export default class AnexoADOService {
  static myInstance = null;
  static getInstance() {
    if (AnexoADOService.myInstance == null) {
      AnexoADOService.myInstance = new AnexoADOService();
    }
    return this.myInstance;
  }

  async getTransicionEtapa(idEtapa, $idTipoProducto) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/Etapa/Transiciones/${idEtapa}/${$idTipoProducto}`);
  }
  
  async getMotivosRechazo() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/MotivoRechazo`);
  }

  async updateAnexoADO(anexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.put(`${urlBackend}/api/Anexo/ADO`, anexo);
  }
}
