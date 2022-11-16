import axios from "axios";

export default class ControlService {
  static myInstance = null;
  static getInstance() {
    if (ControlService.myInstance == null) {
      ControlService.myInstance = new ControlService();
    }
    return this.myInstance;
  }

  async getControlByIdEtapaIdTipoProducto(idEtapa, idTipoProducto) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(
      `${urlBackend}/api/control/${idEtapa}/${idTipoProducto}`
    );
  }

  async getControlsForAllEtapasByIdTipoProducto(idTipoProducto) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(
      `${urlBackend}/api/Control/${idTipoProducto}`
    );
  }
}
