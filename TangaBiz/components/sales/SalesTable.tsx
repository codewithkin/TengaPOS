// src/components/SalesTable.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { subDays, subWeeks, subMonths, format } from 'date-fns';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from 'nativewind';

// Updated type definitions to match the backend response
type Product = {
  id: string;
  name: string;
  price: number;
  zigPrice: number;
};

type SaleItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  totalSpentZig: number;
};

type Sale = {
  id: string;
  total: number;
  zigTotal: number;
  paymentType: string;
  businessId: string;
  customerId: string;
  createdAt: string;
  customer: Customer;
  items: SaleItem[];
};

type SalesResponse = {
  data: Sale[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const SalesTable = () => {
  const { colorScheme } = useColorScheme();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const getBusinessId = () => {
    try {
      const businessData = SecureStore.getItem('session');
      return businessData ? JSON.parse(businessData).id : null;
    } catch (error) {
      console.error('Error parsing business data:', error);
      return null;
    }
  };

  const fetchSales = async () => {
    const businessId = getBusinessId();
    if (!businessId) {
      setError('No business found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<SalesResponse>(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sales`,
        { 
          params: { 
            businessId,
            page,
            limit
          } 
        }
      );

      // Use the response data directly as it matches our types
      setSales(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError('Failed to load sales data');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, period]);

  const filterSalesByPeriod = (salesData: Sale[] = []) => {
    if (period === 'all') return salesData;
    if (!salesData.length) return [];
    
    const cutoff = period === 'day'
      ? subDays(new Date(), 1)
      : period === 'week'
        ? subWeeks(new Date(), 1)
        : subMonths(new Date(), 1);
    
    return salesData.filter(sale => new Date(sale.createdAt) > cutoff);
  };

  const filteredSales = filterSalesByPeriod(sales);
  const paginatedSales = filteredSales.slice(0, limit); // Already paginated by backend

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
  };

  const tableHeaders = ['Date', 'Customer', 'Total'];
  const isDarkMode = colorScheme === 'dark';

  // Color scheme styles
  const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const headerBgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const buttonBgColor = isDarkMode ? 'bg-gray-600' : 'bg-gray-200';
  const activeButtonBgColor = isDarkMode ? 'bg-blue-600' : 'bg-blue-500';
  const buttonTextColor = isDarkMode ? 'text-white' : 'text-gray-900';

  if (loading) {
    return (
      <View className={`p-4 ${bgColor} rounded-lg items-center justify-center`}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
        <Text className={`mt-2 ${textColor}`}>Loading sales data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`p-4 m-2 ${bgColor} rounded-lg`}>
        <Text className="text-red-500">{error}</Text>
        <Pressable
          onPress={fetchSales}
          className="mt-2 p-2 bg-blue-500 rounded"
        >
          <Text className="text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!filteredSales.length) {
    return (
      <View className={`p-4 m-2 ${bgColor} rounded-lg`}>
        <Text className={textColor + " text-center"}>No sales data available for the selected period.</Text>
        <Pressable
          onPress={() => {
            setPeriod('all');
            setPage(1);
          }}
          className="mt-2 p-2 bg-blue-500 rounded flex flex-col justify-center items-center"
        >
          <Text className="text-white">View All Sales</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className={`rounded-lg m-2 ${bgColor}`}>
      {/* Filters */}
      <View className={`p-4 border-b ${borderColor}`}>
        <Text className={`text-lg font-semibold mb-3 ${textColor}`}>Sales History</Text>
        <View className="flex-row flex-wrap gap-2">
          {['Day', 'Week', 'Month', 'All'].map((p) => {
            const periodValue = p.toLowerCase() as 'day' | 'week' | 'month' | 'all';
            return (
              <Pressable
                key={p}
                onPress={() => {
                  setPeriod(periodValue);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full ${
                  period === periodValue ? activeButtonBgColor : buttonBgColor
                }`}
              >
                <Text className={buttonTextColor}>{p}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Table */}
      <ScrollView horizontal className="p-4">
        <View>
          <Table borderStyle={{ borderWidth: 0 }}>
            <Row
              data={tableHeaders}
              style={{ backgroundColor: headerBgColor, height: 40, paddingVertical: 8, color: "white" }}
              textStyle={{ color: "white", fontWeight: 'bold', fontSize: 16 }}
            />
            {paginatedSales.map((sale) => (
              <Row
                key={sale.id}
                style={{ borderBottomWidth: 1, borderColor: "lightgray", paddingVertical: 8, width: "100%", borderBottomColor: borderColor, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}
                data={[
                  format(new Date(sale.createdAt), 'EEE, MMM d'),
                  sale.customer?.name || 'Customer',
                  `$${sale.total.toFixed(2)}`
                ]}
                textStyle={{ fontSize: 14, color: "lightgray" }}
              />
            ))}
          </Table>
        </View>
      </ScrollView>

      {/* Pagination */}
      <View className={`flex-row justify-between items-center p-4 border-t ${borderColor}`}>
        <Pressable
          onPress={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${page === 1 ? 'opacity-50' : ''} ${buttonBgColor}`}
        >
          <Text className={buttonTextColor}>Previous</Text>
        </Pressable>
        
        <Text className={textColor}>
          Page {page} of {totalPages}
        </Text>
        
        <Pressable
          onPress={() => setPage(p => p + 1)}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-lg ${page >= totalPages ? 'opacity-50' : ''} ${buttonBgColor}`}
        >
          <Text className={buttonTextColor}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SalesTable;