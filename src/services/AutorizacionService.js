import axios from "axios";

export default class AutorizacionService {
  static myInstance = null;
  static getInstance() {
    if (AutorizacionService.myInstance == null) {
      AutorizacionService.myInstance = new AutorizacionService();
    }
    return this.myInstance;
  }

  async getAutorizaciones() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/autorizaciondata`);
  }
}
