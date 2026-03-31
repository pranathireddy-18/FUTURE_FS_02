import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('crmToken'));
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('crmAdmin')) || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('crmToken', token);
      localStorage.setItem('crmAdmin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('crmToken');
      localStorage.removeItem('crmAdmin');
    }
  }, [token, admin]);

  const login = (newToken, adminData) => {
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
