import axios from "axios";

export default class DestinatarioService {
  static myInstance = null;
  static getInstance() {
    if (DestinatarioService.myInstance == null) {
      DestinatarioService.myInstance = new DestinatarioService();
    }
    return this.myInstance;
  }

  async getAllDestinatarios() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/destinatario`);
  }
}
