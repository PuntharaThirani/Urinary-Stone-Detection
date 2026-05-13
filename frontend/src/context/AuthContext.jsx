import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login on app start
  useEffect(() => {
    const checkLogin = () => {
      const token  = localStorage.getItem('token');
      const role   = localStorage.getItem('userRole');
      const name   = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');

      if (token && role) {
        //  Token expiry check
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            localStorage.clear();
            setUser(null);
            setLoading(false);
            return;
          }
        } catch {
          localStorage.clear();
          setUser(null);
          setLoading(false);
          return;
        }
        setUser({ id: userId, name, role, token });
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  // Login
  const login = (userData) => {
    const { token, role, user: u } = userData;

    localStorage.setItem('token',    token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', u?.name || '');
    localStorage.setItem('userId',   u?.id || u?._id || ''); 

    setUser({
      id:    u?.id || u?._id,
      name:  u?.name,
      email: u?.email,
      role,
      token,
    });
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // admin-dashboard consistent
  const getDashboardPath = (role) => {
    const paths = {
      doctor:  '/doctor-dashboard',
      patient: '/patient-dashboard',
      staff:   '/staff-dashboard',
      admin:   '/admin-dashboard',
    };
    return paths[role] || '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      getDashboardPath,
      isAuthenticated: !!user,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};