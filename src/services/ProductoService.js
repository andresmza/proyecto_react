import axios from "axios";

export default class ProductoService {
  static myInstance = null;
  static getInstance() {
    if (ProductoService.myInstance == null) {
      ProductoService.myInstance = new ProductoService();
    }
    return this.myInstance;
  }

  async getAllProductos() {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/producto`);
  }
}
