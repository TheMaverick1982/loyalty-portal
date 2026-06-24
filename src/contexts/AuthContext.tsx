import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type UserStatus = 'pending' | 'approved' | 'revoked';
export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  autoApprove: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, password?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleAutoApprove: () => Promise<void>;
  updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAdmin: User = {
  id: 'admin-1',
  email: 'admin@company.com',
  name: 'Admin User',
  status: 'approved',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [autoApprove, setAutoApprove] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initial session check and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session?.user && mounted) {
          await loadUserProfile(session.user.id);
        } else if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        if (mounted) setIsLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && mounted) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT' && mounted) {
        setUser(null);
        setUsers([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('employee_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const currentUser: User = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        role: profileData.role,
        status: profileData.status,
        createdAt: profileData.created_at
      };

      setUser(currentUser);

      // If they are an admin, load the admin data too
      if (currentUser.role === 'admin') {
        await fetchAdminData();
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const { data: settingsData } = await supabase
        .from('admin_settings')
        .select('auto_approve')
        .single();
      
      if (settingsData) {
        setAutoApprove(settingsData.auto_approve);
      }

      const { data: allUsersData, error: usersError } = await supabase
        .from('employee_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      if (allUsersData) {
        setUsers(allUsersData.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          status: u.status,
          createdAt: u.created_at
        })));
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const login = async (email: string, password?: string) => {
    if (!password) return false;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return false;
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password?: string, name?: string) => {
    if (!password || !name) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Error signing up');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
  };

  const toggleAutoApprove = async () => {
    const newValue = !autoApprove;
    setAutoApprove(newValue); // Optimistic update
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ auto_approve: newValue })
        .eq('id', 1);
      
      if (error) throw error;
    } catch (err: any) {
      toast.error('Failed to update setting');
      setAutoApprove(!newValue); // Revert
    }
  };

  const updateUserStatus = async (userId: string, status: UserStatus) => {
    // Optimistic update
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status } : u)));
    if (user?.id === userId) {
      setUser(prev => (prev ? { ...prev, status } : null));
    }

    try {
      const { error } = await supabase
        .from('employee_profiles')
        .update({ status })
        .eq('id', userId);
      
      if (error) throw error;
    } catch (err: any) {
      toast.error('Failed to update user');
      // On error, re-fetch to fix state
      fetchAdminData();
    }
  };

  const deleteUser = async (userId: string) => {
    // Optimistic update
    setUsers(prev => prev.filter(u => u.id !== userId));

    try {
      // In Supabase, deleting from auth.users (via Edge Function) is often preferred,
      // but for this prototype, if RLS allows, we can try to delete the profile.
      // A robust system would call a Supabase RPC or Edge Function to delete the root auth user.
      const { error } = await supabase
        .from('employee_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    } catch (err: any) {
      toast.error('Failed to delete user');
      fetchAdminData();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      autoApprove,
      login,
      signup,
      logout,
      toggleAutoApprove,
      updateUserStatus,
      deleteUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
