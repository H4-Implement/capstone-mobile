//src/components/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfileScreen = ({ setLoggedIn, email: initialEmail, navigation }: any) => {
  const [userData, setUserData] = useState({ name: '', email: initialEmail });
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [originalName, setOriginalName] = useState('');
  const [originalEmail, setOriginalEmail] = useState(initialEmail);
  const [isSaving, setIsSaving] = useState(false);

  const { theme, loadUserTheme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }
        if (user) {
          const metaData = user.user_metadata || {};
          const userName = metaData.full_name || 'No name provided';
          const userEmail = user.email || initialEmail;
          setUserData({ name: userName, email: userEmail });
          setNameInput(userName);
          setEmailInput(userEmail);
          setOriginalName(userName);
          setOriginalEmail(userEmail);
          await loadUserTheme();
        }
      } catch (err) {
        console.error('Error in fetchUserData:', err);
      }
    };
    fetchUserData();
  }, [initialEmail]);

  const hasChanges = () => {
    return (
      nameInput.trim() !== originalName.trim() ||
      emailInput.trim() !== originalEmail.trim()
    );
  };

  const isValidInput = () => {
    return (
      nameInput.trim().length > 0 &&
      emailInput.trim().length > 0 &&
      isValidEmail(emailInput.trim())
    );
  };

  const isSaveEnabled = () => {
    return hasChanges() && isValidInput() && !isSaving;
  };

  const handleSaveProfile = async () => {
    if (!isValidInput()) {
      Alert.alert('Invalid Input', 'Please check your name and email address.');
      return;
    }

    setIsSaving(true);

    try {
      const { error: authError } = await supabase.auth.updateUser({
        email: emailInput.trim(),
        data: { full_name: nameInput.trim() },
      });

      if (authError) throw authError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({
            name: nameInput.trim(),
            email: emailInput.trim(),
          })
          .eq('auth_uid', user.id);
      }

      const newName = nameInput.trim();
      const newEmail = emailInput.trim();

      setUserData({ name: newName, email: newEmail });
      setOriginalName(newName);
      setOriginalEmail(newEmail);
      setIsEditing(false);

    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Unable to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setNameInput(originalName);
    setEmailInput(originalEmail);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            setLoggedIn(false);
          },
        },
      ]
    );
  };

  const renderMenuItem = (
    title: string,
    screenName: string,
    iconName: React.ComponentProps<typeof Ionicons>['name']
  ) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(screenName)}
      className={`flex-row items-center justify-between ${theme === 'dark' ? 'bg-[#263043]' : 'bg-white'} px-4 py-4 border-b ${theme === 'dark' ? 'border-b-[#1e293b]' : 'border-b-[#F3F4F6]'}`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 items-center justify-center">
          <Ionicons name={iconName} size={22} color={theme === 'dark' ? '#cbd5e1' : '#6B7280'} />
        </View>
        <Text className={`ml-3 text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme === 'dark' ? '#64748b' : '#9CA3AF'} />
    </TouchableOpacity>
  );

  return (
    <ScrollView className={`flex-1 ${theme === 'dark' ? 'bg-[#222F3E]' : 'bg-[#F9FAFB]'}`} showsVerticalScrollIndicator={false}>
      <View className={`${theme === 'dark' ? 'bg-[#263043]' : 'bg-white'} px-6 py-8`}>
        <View className="items-center">
          {/* Avatar with initials only */}
          <View className="w-24 h-24 rounded-full bg-[#E5E7EB] items-center justify-center mb-3">
            <Text className="text-4xl font-bold text-[#415D7C]">
              {getInitials(userData.name)}
            </Text>
          </View>
          <View className="mt-4 w-full">
            {isEditing ? (
              <View className="gap-4">
                <View>
                  <Text className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-[#B0B7C3]' : 'text-[#374151]'}`}>Full Name</Text>
                  <TextInput
                    value={nameInput}
                    onChangeText={setNameInput}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#18181b]' : 'bg-[#F9FAFB]'} rounded-lg border border-[#E5E7EB] text-base ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    editable={!isSaving}
                  />
                </View>
                <View>
                  <Text className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-[#B0B7C3]' : 'text-[#374151]'}`}>Email Address</Text>
                  <TextInput
                    value={emailInput}
                    onChangeText={setEmailInput}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#18181b]' : 'bg-[#F9FAFB]'} rounded-lg border border-[#E5E7EB] text-base ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    editable={!isSaving}
                  />
                </View>
                <View className="flex-row gap-3 mt-6">
                  <TouchableOpacity
                    onPress={cancelEditing}
                    disabled={isSaving}
                    className={`flex-1 px-4 py-3 rounded-lg items-center ${theme === 'dark' ? 'bg-[#374151]' : 'bg-[#F3F4F6]'}`}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-[#374151]'}`}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    disabled={!isSaveEnabled()}
                    className={`flex-1 px-4 py-3 rounded-lg items-center ${isSaveEnabled() ? 'bg-[#3B82F6]' : 'bg-[#D1D5DB]'}`}
                    activeOpacity={0.8}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className={`font-medium ${isSaveEnabled() ? 'text-white' : 'text-[#6B7280]'}`}>
                        Save Changes
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="items-center">
                <Text className={`text-xl font-semibold text-center ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>
                  {userData.name}
                </Text>
                <Text className={`text-base mt-1 text-center ${theme === 'dark' ? 'text-[#B0B7C3]' : 'text-[#6B7280]'}`}>
                  {userData.email}
                </Text>
                <TouchableOpacity
                  onPress={startEditing}
                  className="mt-4 px-6 py-2 bg-blue-50 rounded-full"
                  activeOpacity={0.7}
                >
                  <Text className="text-[#2563EB] font-medium">
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className={`mt-6 ${theme === 'dark' ? 'bg-[#263043]' : 'bg-white'}`}>
        {renderMenuItem('Settings', 'Settings', 'settings-outline')}
        {renderMenuItem('Transaction History', 'Transactions', 'time-outline')}
        {renderMenuItem('Help & Support', 'Help', 'help-circle-outline')}
        {renderMenuItem('Privacy Policy', 'PrivacyPolicy', 'document-text-outline')}
        {renderMenuItem('Terms & Conditions', 'Terms', 'reader-outline')}
      </View>
      <View className="mt-6 mb-8 px-6">
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full py-4 bg-[#415D7C] rounded-lg items-center flex-row justify-center shadow"
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text className="ml-2 text-white font-bold text-base">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;