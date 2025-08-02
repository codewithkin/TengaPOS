import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

type Product = {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  totalSold: number;
  totalRevenue: number;
};

type ApiResponse = {
  success: boolean;
  data?: {
    products: Product[];
    totalRevenue: number;
    percentageChange: number;
    period: string;
  };
  message?: string;
};

export default function TopSellingProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    products: Product[];
    totalRevenue: number;
    percentageChange: number;
    period: string;
  } | null>(null);

  const businessId = JSON.parse(SecureStore.getItem('session') || '{}').id;

  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/products/top-selling`,
        {
          params: {
            businessId: businessId,
            period: 'this-month',
            limit: 3,
          },
        }
      );
      
      if (response.data.success && response.data.data) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching top selling products:', err);
      setError('Failed to load top selling products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId) return;

    (async () => {
        await fetchData();
    })();
  }, [businessId]);

  if (error) {
    return (
      <View className="rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-red-500 text-center p-4">{error}</Text>
      </View>
    );
  }

  if (loading || !data) {
    return (
      <View className="rounded-xl p-4 mb-4 shadow-sm">
        {/* Header Skeleton */}
        <MotiView
          transition={{ type: 'timing' }}
          className="mb-4"
        >
          <Skeleton colorMode="light" width={150} height={24} radius="round" />
          <View className="flex-row items-center mt-2">
            <Skeleton colorMode="light" width={100} height={28} radius="round" />
            <Skeleton colorMode="light" width={80} height={20} radius="round" />
          </View>
        </MotiView>
        
        {/* Products List Skeleton */}
        {[1, 2, 3].map((item) => (
          <MotiView
            key={item}
            transition={{ type: 'timing' }}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <Skeleton colorMode="light" width={40} height={40} radius="round" />
            <Skeleton colorMode="light" width={120} height={16} radius="round" />
          </MotiView>
        ))}
      </View>
    );
  }

  const isPositiveChange = data.percentageChange >= 0;

  return (
    <View className="rounded-xl border dark:border-gray-800 p-4 mx-2 mt-8 mb-4 shadow-sm">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-2 dark:text-white">Top Selling Products</Text>
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold text-gray-800 mr-3 dark:text-gray-200">
            ${data.totalRevenue.toLocaleString()}
          </Text>
          <Text 
            className={`text-sm font-medium ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}
          >
            {data.period} {isPositiveChange ? '+' : ''}{data.percentageChange.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={data.products}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View className="flex-row items-center w-full justify-between py-3 border-b border-gray-100">
            <View className="flex flex-row gap-2 itenms-center">
                {item.imageUrl ? (
                <Image 
                    source={{ uri: item.imageUrl }} 
                    className="w-10 h-10 rounded-full mr-3" 
                />
                ) : (
                <View className="w-10 h-10 rounded-full mr-3 bg-gray-200" />
                )}
                <Text className="text-base text-gray-800 dark:text-white">{item.name}</Text>
            </View>

            {/* Number of sales */}
            <Text className="text-base text-gray-800 dark:text-gray-200">{item.totalSold} sales</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}