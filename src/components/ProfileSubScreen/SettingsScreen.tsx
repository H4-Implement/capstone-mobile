//src/components/ProfileSubScreen/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

const PRIMARY_BUTTON_COLOR = '#415D7C';
const PRIMARY_BUTTON_TEXT_COLOR = '#fff';

const SettingsScreen: React.FC = () => {
  const { theme, setTheme, loadUserTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [authUid, setAuthUid] = useState<string | null>(null);
  const [updatingField, setUpdatingField] = useState<null | 'push_notifications' | 'two_factor_auth' | 'dark_mode'>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    async function fetchUserAndSettings() {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('User not found');
        setAuthUid(user.id);

        const { data, error } = await supabase
          .from('user_settings')
          .select('push_notifications, two_factor_auth, dark_mode')
          .eq('auth_uid', user.id)
          .single();

        if (data) {
          setPushNotifications(!!data.push_notifications);
          setTwoFactorAuth(!!data.two_factor_auth);
          setTheme(data.dark_mode ? 'dark' : 'light');
        }

        // Load account status (active/deactivated)
        const { data: userData } = await supabase
          .from('users')
          .select('is_active')
          .eq('auth_uid', user.id)
          .single();

        if (userData && typeof userData.is_active === 'boolean') {
          setIsActive(userData.is_active);
        }

      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndSettings();
    loadUserTheme();
  }, []);

  const handleToggle = async (field: 'push_notifications' | 'two_factor_auth' | 'dark_mode', value: boolean) => {
    if (!authUid) return;
    setUpdatingField(field);
    try {
      await supabase
        .from('user_settings')
        .update({ [field]: value })
        .eq('auth_uid', authUid);

      if (field === 'push_notifications') setPushNotifications(value);
      if (field === 'two_factor_auth') setTwoFactorAuth(value);
      if (field === 'dark_mode') setTheme(value ? 'dark' : 'light', true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update setting');
    } finally {
      setUpdatingField(null);
    }
  };

  const handleDeactivate = async () => {
    if (!authUid) return;
    Alert.alert(
      isActive ? 'Deactivate Account' : 'Reactivate Account',
      isActive
        ? 'Your account will be temporarily disabled. You can reactivate it anytime.'
        : 'Do you want to reactivate your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isActive ? 'Deactivate' : 'Reactivate',
          style: 'destructive',
          onPress: async () => {
            await supabase
              .from('users')
              .update({ is_active: !isActive })
              .eq('auth_uid', authUid);

            setIsActive(!isActive);
            if (isActive) {
              await supabase.auth.signOut();
            }
          },
        },
      ]
    );
  };

  return loading ? (
    <View className={`flex-1 justify-center items-center ${theme === "dark" ? "bg-[#222F3E]" : "bg-[#F8FAFC]"}`}>
      <ActivityIndicator size="large" color={PRIMARY_BUTTON_COLOR} />
    </View>
  ) : (
     <View className={`flex-1 ${theme === "dark" ? "bg-[#222F3E]" : "bg-[#F8FAFC]"}`}>

      <ScrollView
        className="px-5 pt-9 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text
          className={`text-[26px] font-bold ${theme === 'dark' ? 'text-blue-200' : 'text-[#1e293b]'} mb-8`}
        >
          Settings
        </Text>

        <View className="mb-5 flex-row items-center justify-between">
          <Text className={`text-base font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-[#1e293b]'}`}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={v => handleToggle('dark_mode', v)}
            trackColor={{ false: '#B0B7C3', true: '#415D7C' }}
            thumbColor={theme === 'dark' ? '#88A4D4' : '#fff'}
            disabled={updatingField === 'dark_mode'}
          />
        </View>

        <View className="mb-5 flex-row items-center justify-between">
          <Text className={`text-base font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-[#1e293b]'}`}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={v => handleToggle('push_notifications', v)}
            trackColor={{ false: '#B0B7C3', true: '#415D7C' }}
            thumbColor={pushNotifications ? '#88A4D4' : '#fff'}
            disabled={updatingField === 'push_notifications'}
          />
        </View>

        <View className="mb-5 flex-row items-center justify-between">
          <Text className={`text-base font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-[#1e293b]'}`}>Two-Factor Authentication</Text>
          <Switch
            value={twoFactorAuth}
            onValueChange={v => handleToggle('two_factor_auth', v)}
            trackColor={{ false: '#B0B7C3', true: '#415D7C' }}
            thumbColor={twoFactorAuth ? '#88A4D4' : '#fff'}
            disabled={updatingField === 'two_factor_auth'}
          />
        </View>

        {/* Account Section */}
        <View className="mt-9 border-t border-t-[#e5e7eb] dark:border-t-[#334155] pt-6">
          <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-[#0369A1]'} mb-4`}>
            Account
          </Text>
          <TouchableOpacity
            onPress={handleDeactivate}
            className="w-full py-4 bg-[#415D7C] rounded-lg items-center mb-3 active:opacity-80"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {isActive ? 'Deactivate Account' : 'Reactivate Account'}
            </Text>
          </TouchableOpacity>
          <Text className={`text-xs text-center ${theme === 'dark' ? 'text-slate-100' : 'text-slate-500'}`}>
            {isActive
              ? 'Deactivating your account will temporarily disable your access. You can reactivate anytime by logging in.'
              : 'Your account is currently deactivated. Press above to reactivate.'}
          </Text>
        </View>

        {errorMsg && (
          <Text className="text-red-600 mt-6">{errorMsg}</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;