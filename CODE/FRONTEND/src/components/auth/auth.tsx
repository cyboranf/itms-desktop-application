// auth.ts
export const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };

  export const logout = (): void => {
    localStorage.removeItem('accessToken');
    
  };