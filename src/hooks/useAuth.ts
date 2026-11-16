import { useApp } from '../context/AppContext.tsx';

export function useAuth() {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loginUser,
    registerUser,
    logout,
    registeredUsers,
    switchUser
  } = useApp();

  const signIn = async (emailOrName: string, password?: string) => {
    return loginUser(emailOrName, password);
  };

  const register = async (payload: {
    name: string;
    email: string;
    password?: string;
    schoolName?: string;
    role?: any;
    gradeLevel?: string;
    targetWpm?: number;
  }) => {
    return registerUser(payload);
  };

  return {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    signIn,
    register,
    signOut: logout,
    registeredUsers,
    switchUser
  };
}
