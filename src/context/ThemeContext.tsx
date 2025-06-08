//src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { supabase } from '../lib/supabase';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme, saveToUser?: boolean) => void;
  loadUserTheme: (authUid?: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {},
  loadUserTheme: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeState(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => listener.remove();
  }, []);

  const setTheme = async (newTheme: Theme, saveToUser = false) => {
    setThemeState(newTheme);
    if (saveToUser) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_settings')
            .update({ dark_mode: newTheme === 'dark' })
            .eq('auth_uid', user.id);
        }
      } catch (e) {
      }
    }
  };

  const loadUserTheme = async (authUid?: string) => {
    try {
      let userId = authUid;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }
      if (userId) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('dark_mode')
          .eq('auth_uid', userId)
          .single();
        if (!error && data && typeof data.dark_mode === 'boolean') {
          setThemeState(data.dark_mode ? 'dark' : 'light');
        }
      }
    } catch (e) {    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loadUserTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);