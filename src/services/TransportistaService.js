import axios from "axios";

export default class TransportistaService {
  static myInstance = null;
  static getInstance() {
    if (TransportistaService.myInstance == null) {
      TransportistaService.myInstance = new TransportistaService();
    }
    return this.myInstance;
  }
  
  async getAllTransportistas() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/transportista`);
  }

}