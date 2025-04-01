'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { IRole, IUser } from '@/types';

interface IAuthContext {
  user: IUser | null;
  roles: IRole[] | null;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  roles: null,
});

const useAuthProvider = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<IUser | null>(null);
  const [roles, setRoles] = useState<IRole[] | null>(null);

  const fetchAuthUser = useCallback(async () => {
    const resp = await axiosClient.get('/api/user');
    if (resp.data) {
      setUser({
        ...resp?.data?.user,
        permissions: resp?.data?.permissions,
      });
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const roleResp = await axiosClient.get('/api/roles');
      setRoles(roleResp?.data || []);
    } catch (err) {
      toast({
        title: 'failed',
        description: 'Failed to fetch roles.',
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchAuthUser();
    fetchRoles();
  }, [fetchAuthUser, fetchRoles]);

  return {
    user,
    roles,
  };
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useAuthProvider();
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContextProvider;
