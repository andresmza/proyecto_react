import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const localStorageSession = () => {
    let user = null;
    if(!(localStorage.getItem('user') === null)){
      user = JSON.parse(localStorage.getItem('user'));
      return user;
    }
  };

  const login = () => {
    setIsAuthenticated("true");
  };

  const logout = () => {
    setIsAuthenticated("false");
  };

  const auth = useAuth();
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, localStorageSession }}>
      {children}
    </AuthContext.Provider>
  );
};

