import axios from "axios";

export default class ProveedorService {
  static myInstance = null;
  static getInstance() {
    if (ProveedorService.myInstance == null) {
      ProveedorService.myInstance = new ProveedorService();
    }
    return this.myInstance;
  }

  async getAllProveedores() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/proveedor`);
  }

  async getProveedoresQueSonProductores(sonProductores) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/proveedor/${sonProductores}`);
  }
}
