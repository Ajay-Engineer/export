import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  login: (email, password) => Promise.resolve({}),
  logout: () => Promise.resolve(),
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin credentials from environment variables
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@rebeccaexim.com';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    // Check for existing session on mount
    const checkExistingSession = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {});

      if (cookies['authToken'] && cookies['userEmail'] && cookies['userName']) {
        // User has valid session
        const userData = {
          uid: cookies['authToken'],
          email: cookies['userEmail'],
          displayName: cookies['userName'],
          emailVerified: true
        };
        setUser(userData);
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (email, password) => {
    // Simple authentication check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = {
        uid: 'admin-user-' + Date.now(),
        email: email,
        displayName: 'Admin',
        emailVerified: true
      };

      setUser(userData);

      // Store user session in cookies (24 hours)
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));

      document.cookie = `authToken=${userData.uid}; path=/; expires=${expiryDate.toUTCString()}`;
      document.cookie = `userEmail=${encodeURIComponent(userData.email)}; path=/; expires=${expiryDate.toUTCString()}`;
      document.cookie = `userName=${encodeURIComponent(userData.displayName)}; path=/; expires=${expiryDate.toUTCString()}`;

      return userData;
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = async () => {
    setUser(null);

    // Clear all auth cookies
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
