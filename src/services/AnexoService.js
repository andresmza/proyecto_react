import axios from "axios";

export default class AnexoService {
  static myInstance = null;
  static getInstance() {
    if (AnexoService.myInstance == null) {
      AnexoService.myInstance = new AnexoService();
    }
    return this.myInstance;
  }

  //GETs
  async getAnexoByIdAnexo(idAnexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/anexo/${idAnexo}`);
  }

  async getAnexoADOByIdAnexo(idAnexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/anexo/ADO/${idAnexo}`);
  }

  //POSTs
  async createAnexo(anexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.post(`${urlBackend}/api/anexo`, anexo);
  }

  async registerControlsByEtapa(idEtapa, controlesAnexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.post(`${urlBackend}/api/Anexo/Controles/${idEtapa}`, controlesAnexo);
  }

  async registerControlsByEtapaBascula(idEtapa, controlesAnexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.post(`${urlBackend}/api/Anexo/Controles/Bascula/${idEtapa}`, controlesAnexo);
  }

  async registerControlsByEtapaDescargadero(idEtapa, controlesAnexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.post(`${urlBackend}/api/Anexo/Controles/Descargadero/${idEtapa}`, controlesAnexo);
  }

  //PUTs
  async updateAnexo(anexo) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.put(`${urlBackend}/api/anexo`, anexo);
  }
  
  async cerrarAnexo(idAnexo, accionCerrarIdEtapa) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.put(`${urlBackend}/api/Anexo/NotificacionAvance/${idAnexo}/${accionCerrarIdEtapa}`);
  }
}
