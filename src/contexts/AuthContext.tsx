import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase, Usuario } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  usuario: Usuario | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<Usuario>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUsuario(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUsuario(session.user.id);
      } else {
        setUsuario(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUsuario = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('id_usuario', userId)
        .maybeSingle();

      if (error) throw error;
      setUsuario(data);
    } catch (error) {
      console.error('Error loading usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Usuario>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) return { error: authError };
      if (!authData.user) return { error: new Error('No user returned') as AuthError };

      const { error: dbError } = await supabase
        .from('usuario')
        .insert({
          id_usuario: authData.user.id,
          email,
          ...userData,
        });

      if (dbError) {
        console.error('Error creating usuario:', dbError);
        return { error: dbError as AuthError };
      }

      await loadUsuario(authData.user.id);

      return { error: null };
    } catch (error) {
      console.error('SignUp error:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, usuario, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
