import axios from "axios";

export default class BasculaService {
  static myInstance = null;
  static getInstance() {
    if (BasculaService.myInstance == null) {
      BasculaService.myInstance = new BasculaService();
    }
    return this.myInstance;
  }

  //GETs
  async getPesada() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/Bascula/Pesada`);
  }
}
