//src/components/BookingScreen.tsx
import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView,KeyboardAvoidingView, Platform, Pressable,} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

function formatDate(date: Date) {
  return date ? date.toISOString().split('T')[0] : '';
}
function calculateAge(birthDate: string) {
  if (!birthDate) return '';
  const today = new Date();
  const dob = new Date(birthDate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 0 && age < 200 ? String(age) : '';
}
function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}
function isValidPhone(phone: string) {
  return /^\+63\d{10}$/.test(phone);
}

const BookingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const [form, setForm] = useState({
    deceasedName: '',
    dateOfBirth: '',
    dateOfPassing: '',
    placeOfPassing: '',
    contactName: '',
    contactPhone: '+63',
    contactEmail: '',
  });

  const [errors, setErrors] = useState({
    deceasedName: '',
    dateOfBirth: '',
    dateOfPassing: '',
    placeOfPassing: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const [pickerType, setPickerType] = useState<'dob' | 'dop' | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  // Theme styles (all replaced by className below)

  // Real-time validation handlers

  const handleDeceasedNameChange = (name: string) => {
    setForm(f => ({ ...f, deceasedName: name }));
    setErrors(e => ({
      ...e,
      deceasedName: name.trim() === '' ? 'Full name is required' : '',
    }));
  };

  const handlePlaceOfPassingChange = (place: string) => {
    setForm(f => ({ ...f, placeOfPassing: place }));
    setErrors(e => ({
      ...e,
      placeOfPassing: place.trim() === '' ? 'Place of passing is required' : '',
    }));
  };

  const handleContactNameChange = (name: string) => {
    setForm(f => ({ ...f, contactName: name }));
    setErrors(e => ({
      ...e,
      contactName: name.trim() === '' ? 'Your name is required' : '',
    }));
  };

  const handlePhoneChange = (input: string) => {
    if (input.length < 3) {
      setForm(f => ({ ...f, contactPhone: '+63' }));
      setErrors(e => ({ ...e, contactPhone: 'Phone must start with +63 and be 10 digits' }));
      return;
    }
    if (!input.startsWith('+63')) {
      input = '+63' + input.replace(/[^0-9]/g, '').slice(0, 10);
    } else {
      input = '+63' + input.slice(3).replace(/[^0-9]/g, '').slice(0, 10);
    }
    setForm(f => ({ ...f, contactPhone: input }));

    setErrors(e => ({
      ...e,
      contactPhone: isValidPhone(input) ? '' : 'Phone must start with +63 and be 10 digits',
    }));
  };

  const handleEmailChange = (email: string) => {
    setForm(f => ({ ...f, contactEmail: email }));
    setErrors(e => ({
      ...e,
      contactEmail: isValidEmail(email) ? '' : 'Invalid email address',
    }));
  };

  // Date picker handlers with validation

  const openDatePicker = (type: 'dob' | 'dop') => {
    let date = new Date();
    if (type === 'dob' && form.dateOfBirth) date = new Date(form.dateOfBirth);
    if (type === 'dop' && form.dateOfPassing) date = new Date(form.dateOfPassing);
    setTempDate(date);
    setPickerType(type);
  };

  const handleTempDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) setTempDate(selectedDate);
  };

  const handlePickerDone = () => {
    if (pickerType === 'dob') {
      const dobStr = formatDate(tempDate);
      setForm(f => ({ ...f, dateOfBirth: dobStr }));

      // Validate DOB
      setErrors(e => ({
        ...e,
        dateOfBirth: dobStr ? '' : 'Date of birth is required',
      }));

      // Validate dateOfPassing if set
      if (form.dateOfPassing) {
        const dob = new Date(dobStr);
        const dop = new Date(form.dateOfPassing);
        setErrors(e => ({
          ...e,
          dateOfPassing: dop <= dob ? 'Date of passing must be after date of birth' : '',
        }));
      }
    } else if (pickerType === 'dop') {
      const dopStr = formatDate(tempDate);
      setForm(f => ({ ...f, dateOfPassing: dopStr }));

      // Validate DOP
      setErrors(e => ({
        ...e,
        dateOfPassing: dopStr ? '' : 'Date of passing is required',
      }));

      if (form.dateOfBirth) {
        const dob = new Date(form.dateOfBirth);
        const dop = new Date(dopStr);
        setErrors(e => ({
          ...e,
          dateOfPassing: dop <= dob ? 'Date of passing must be after date of birth' : '',
        }));
      }
    }
    setPickerType(null);
  };

  const handlePickerCancel = () => setPickerType(null);


  const validateAll = () => {
    const newErrors = {
      deceasedName: form.deceasedName.trim() ? '' : 'Full name is required',
      dateOfBirth: form.dateOfBirth ? '' : 'Date of birth is required',
      dateOfPassing: form.dateOfPassing ? '' : 'Date of passing is required',
      placeOfPassing: form.placeOfPassing.trim() ? '' : 'Place of passing is required',
      contactName: form.contactName.trim() ? '' : 'Your name is required',
      contactPhone: isValidPhone(form.contactPhone) ? '' : 'Phone must start with +63 and be 10 digits',
      contactEmail: isValidEmail(form.contactEmail) ? '' : 'Invalid email address',
    };

    // Additional date consistency check
    if (form.dateOfBirth && form.dateOfPassing) {
      const dob = new Date(form.dateOfBirth);
      const dop = new Date(form.dateOfPassing);
      if (dop <= dob) {
        newErrors.dateOfPassing = 'Date of passing must be after date of birth';
      }
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(e => !e);
  };

  const handleNext = () => {
    if (!validateAll()) return;
    navigation.navigate('FuneralPackages', { form });
  };

  const ageDisplay = calculateAge(form.dateOfBirth);

  // Dynamic class helpers
  const inputBorder = theme === 'dark'
    ? 'border-blue-900 focus:border-blue-400'
    : 'border-gray-300 focus:border-blue-400';
  const inputBg = theme === 'dark' ? 'bg-[#232b37]' : 'bg-white';
  const inputText = theme === 'dark' ? 'text-white' : 'text-black';
  const labelText = theme === 'dark' ? 'text-blue-200' : 'text-[#3B5998]';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`flex-1 ${theme === 'dark' ? 'bg-[#232b37]' : 'bg-[#F8FAFC]'}`}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: 36, paddingBottom: 120, paddingHorizontal: 18 }}
        keyboardShouldPersistTaps="handled"
        className="w-full"
      >
        <Text className={`text-3xl font-extrabold mb-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-[#415D7C]'}`}>
          Booking Form
        </Text>
        <Text className={`text-base mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Please provide information about your loved one.
        </Text>

        {/* Full Name */}
        <View className="mb-6">
          <Text className={`font-semibold mb-1 ${labelText}`}>Full Name</Text>
          <TextInput
            placeholder="Full name of the deceased"
            value={form.deceasedName}
            onChangeText={handleDeceasedNameChange}
            className={`border rounded-xl px-4 py-3 text-base ${
              errors.deceasedName ? 'border-red-500' : inputBorder
            } ${inputBg} ${inputText}`}
            placeholderTextColor={theme === 'dark' ? '#64748b' : '#A0AEC0'}
          />
          {errors.deceasedName ? (
            <Text className="text-red-500 text-xs mt-1">{errors.deceasedName}</Text>
          ) : null}
        </View>

        {/* Date of Birth & Age */}
        <View className="flex-row mb-6 space-x-4">
          <View className="flex-1">
            <Text className={`font-semibold mb-1 ${labelText}`}>
              Date of Birth{' '}
              <Text className="text-xs text-gray-400">(Age will be calculated automatically)</Text>
            </Text>
            <TouchableOpacity
              onPress={() => openDatePicker('dob')}
              activeOpacity={0.7}
              className={`border rounded-xl px-4 py-3 flex-row items-center min-h-[44px] ${
                errors.dateOfBirth ? 'border-red-500' : inputBorder
              } ${inputBg}`}
            >
              <Ionicons name="calendar-outline" size={18} color="#88A4D4" />
              <Text
                className={`ml-2 text-base ${
                  form.dateOfBirth ? inputText : 'text-gray-400'
                }`}
              >
                {form.dateOfBirth ? form.dateOfBirth : 'Select date of birth'}
              </Text>
            </TouchableOpacity>
            {errors.dateOfBirth ? (
              <Text className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</Text>
            ) : null}
          </View>
          <View className="items-center w-24">
            <Text className={`font-semibold mb-1 ${labelText}`}>Age</Text>
            <View
              className={`border ${inputBorder} ${
                theme === 'dark' ? 'bg-[#232b37]' : 'bg-gray-100'
              } rounded-xl px-4 py-3 flex-row items-center min-h-[44px] min-w-[64px]`}
            >
              <Ionicons name="person-outline" size={18} color="#88A4D4" />
              <Text className={`ml-2 text-base ${inputText}`}>{ageDisplay || '--'}</Text>
            </View>
          </View>
        </View>

        {/* Date of Passing */}
        <View className="mb-6">
          <Text className={`font-semibold mb-1 ${labelText}`}>Date of Passing</Text>
          <TouchableOpacity
            onPress={() => openDatePicker('dop')}
            activeOpacity={0.7}
            className={`border rounded-xl px-4 py-3 flex-row items-center min-h-[44px] ${
              errors.dateOfPassing ? 'border-red-500' : inputBorder
            } ${inputBg}`}
          >
            <Ionicons name="calendar-outline" size={18} color="#88A4D4" />
            <Text
              className={`ml-2 text-base ${
                form.dateOfPassing ? inputText : 'text-gray-400'
              }`}
            >
              {form.dateOfPassing ? form.dateOfPassing : 'Select date of passing'}
            </Text>
          </TouchableOpacity>
          {errors.dateOfPassing ? (
            <Text className="text-red-500 text-xs mt-1">{errors.dateOfPassing}</Text>
          ) : null}
        </View>

        {/* Place of Passing */}
        <View className="mb-6">
          <Text className={`font-semibold mb-1 ${labelText}`}>Place of Passing</Text>
          <TextInput
            placeholder="Hospital, home, etc."
            value={form.placeOfPassing}
            onChangeText={handlePlaceOfPassingChange}
            className={`border rounded-xl px-4 py-3 text-base ${
              errors.placeOfPassing ? 'border-red-500' : inputBorder
            } ${inputBg} ${inputText}`}
            placeholderTextColor={theme === 'dark' ? '#64748b' : '#A0AEC0'}
          />
          {errors.placeOfPassing ? (
            <Text className="text-red-500 text-xs mt-1">{errors.placeOfPassing}</Text>
          ) : null}
        </View>

        <View className="h-0.5 bg-gray-100 dark:bg-blue-900 my-8" />

        <Text className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-[#3B5998]'}`}>
          Contact Information
        </Text>
        <Text className={`text-base mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Please provide your contact details so we can reach you.
        </Text>

        {/* Contact Name */}
        <View className="mb-4">
          <Text className={`font-semibold mb-1 ${labelText}`}>Your Name</Text>
          <TextInput
            placeholder="Your full name"
            value={form.contactName}
            onChangeText={handleContactNameChange}
            className={`border rounded-xl px-4 py-3 text-base ${
              errors.contactName ? 'border-red-500' : inputBorder
            } ${inputBg} ${inputText}`}
            placeholderTextColor={theme === 'dark' ? '#64748b' : '#A0AEC0'}
          />
          {errors.contactName ? (
            <Text className="text-red-500 text-xs mt-1">{errors.contactName}</Text>
          ) : null}
        </View>

        {/* Contact Phone */}
        <View className="mb-4">
          <Text className={`font-semibold mb-1 ${labelText}`}>Phone Number</Text>
          <TextInput
            placeholder="+639123456789"
            keyboardType="phone-pad"
            maxLength={13}
            value={form.contactPhone}
            onChangeText={handlePhoneChange}
            className={`border rounded-xl px-4 py-3 text-base ${
              errors.contactPhone ? 'border-red-500' : inputBorder
            } ${inputBg} ${inputText}`}
            placeholderTextColor={theme === 'dark' ? '#64748b' : '#A0AEC0'}
          />
          {errors.contactPhone ? (
            <Text className="text-red-500 text-xs mt-1">{errors.contactPhone}</Text>
          ) : null}
        </View>

        {/* Contact Email */}
        <View className="mb-10">
          <Text className={`font-semibold mb-1 ${labelText}`}>Email Address</Text>
          <TextInput
            placeholder="Your email address"
            keyboardType="email-address"
            value={form.contactEmail}
            onChangeText={handleEmailChange}
            className={`border rounded-xl px-4 py-3 text-base ${
              errors.contactEmail ? 'border-red-500' : inputBorder
            } ${inputBg} ${inputText}`}
            placeholderTextColor={theme === 'dark' ? '#64748b' : '#A0AEC0'}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.contactEmail ? (
            <Text className="text-red-500 text-xs mt-1">{errors.contactEmail}</Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="px-6 pb-8 pt-2 bg-transparent">
        <TouchableOpacity
          onPress={handleNext}
          className="w-full py-4 rounded-lg items-center justify-center bg-[#415D7C] active:opacity-80"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">Next</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      {pickerType !== null && (
        <Pressable
          className="absolute inset-0 bg-black/25 justify-center items-center"
          onPress={handlePickerCancel}
        >
          <Pressable
            className="bg-white dark:bg-[#262626] rounded-2xl px-6 py-7 min-w-[340px] items-center"
            style={{ elevation: 8 }}
            onPress={e => e.stopPropagation()}
          >
            <Text
              className="font-bold text-lg mb-3 text-[#415D7C] dark:text-blue-400"
            >
              {pickerType === 'dob' ? 'Select Date of Birth' : 'Select Date of Passing'}
            </Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
              maximumDate={new Date()}
              onChange={handleTempDateChange}
              style={{ width: 300 }}
              themeVariant={Platform.OS === 'ios' ? 'light' : undefined}
            />
            <View className="flex-row mt-6 space-x-2">
              <TouchableOpacity
                onPress={handlePickerCancel}
                className="py-2 px-6 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-500 font-bold text-base">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePickerDone}
                className="py-2 px-6 rounded-lg bg-[#3B5998]"
              >
                <Text className="text-white font-bold text-base">Done</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
};

export default BookingScreen;