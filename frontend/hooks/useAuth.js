import { useState, useCallback } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!Cookies.get('token'));

  const logout = useCallback(() => {
    Cookies.remove('token');
    setIsLoggedIn(false);
  }, []);

  return { isLoggedIn, logout };
}
