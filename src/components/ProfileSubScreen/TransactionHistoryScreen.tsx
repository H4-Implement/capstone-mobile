//src/components/ProfileSubScreen/TransactionHistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

const TransactionHistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      if (!error && data) setTransactions(data);
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      className="flex-1 px-4 py-6"
      style={{ backgroundColor: theme === 'dark' ? '#222F3E' : '#F8FAFC' }}
    >
      <Text className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-900'}`}>Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#415D7C" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-white'}`}>
              <View className="flex-row justify-between mb-1">
                <Text className={`font-medium ${theme === 'dark' ? 'text-blue-200' : 'text-blue-900'}`}>{item.description}</Text>
                <Text className={`font-bold ${item.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {item.amount < 0 ? '-' : '+'}₱{Math.abs(item.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text className={`text-xs ${item.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>{item.status}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text className={`text-center mt-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No transactions found.</Text>}
        />
      )}
    </Animated.View>
  );
};

export default TransactionHistoryScreen;