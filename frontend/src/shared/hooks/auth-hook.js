import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

const useAuth = () => {
  // Auth context
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpiredDate, setTokenExpiredDate] = useState(null);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    // expirationDate || new Date(new Date().getTime() + 5000);
    setTokenExpiredDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpiredDate(null);
    localStorage.removeItem('userData');
  }, []);

  // Auto login (basic version)
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      storedData.expiration &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  // Auto logout (when token expired)
  useEffect(() => {
    if (token && tokenExpiredDate) {
      const remainingTime = tokenExpiredDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiredDate]);

  return { token, login, logout, userId };
};

export default useAuth;
