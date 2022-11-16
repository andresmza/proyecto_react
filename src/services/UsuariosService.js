import axios from "axios";

export default class UsuariosService {
  static myInstance = null;
  static getInstance() {
    if (UsuariosService.myInstance == null) {
      UsuariosService.myInstance = new UsuariosService();
    }
    return this.myInstance;
  }

  //GETs
  async login(username, password) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(
      `${urlBackend}/api/usuarios/login/${username}/${password}`
    );
  }

  async getPuestosByIdUsuario(idUsuario) {
    const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/usuarios/puestos/${idUsuario}`);
  }

  async getUsuarios() {
    //TODO: Reemplazar por endpoint de verdad cuando exista
    const urlBackend = import.meta.env.VITE_URL_BACKEND_DUMMY;
    // const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.get(`${urlBackend}/api/usuarios`);
  }

  //POSTs
  async createUsuario(usuario) {
    //TODO: Reemplazar por endpoint de verdad cuando exista
    const urlBackend = import.meta.env.VITE_URL_BACKEND_DUMMY;
    // const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.post(`${urlBackend}/api/usuarios`, usuario);
  }

  //DELETEs
  async deleteUsuario(idUsuario) {
    //TODO: Reemplazar por endpoint de verdad cuando exista
    const urlBackend = import.meta.env.VITE_URL_BACKEND_DUMMY;
    // const urlBackend = import.meta.env.VITE_URL_BACKEND;
    return await axios.delete(`${urlBackend}/api/usuarios/${idUsuario}`);
  }
}
