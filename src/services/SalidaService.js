import axios from "axios";

export default class SalidaService {
  static myInstance = null;
  static getInstance() {
    if (SalidaService.myInstance == null) {
      SalidaService.myInstance = new SalidaService();
    }
    return this.myInstance;
  }

  async getSalida() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/salidaData`);
  }
}
