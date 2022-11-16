import axios from "axios";

export default class ConductorService {
  static myInstance = null;
  static getInstance() {
    if (ConductorService.myInstance == null) {
      ConductorService.myInstance = new ConductorService();
    }
    return this.myInstance;
  }

  async getCondutorByDni(dni) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/conductor/${dni}`);
  }
}
