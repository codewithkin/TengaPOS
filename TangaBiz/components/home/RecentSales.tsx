import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Sale } from "~/types";
import { Skeleton } from "moti/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react-native";
import { MotiView } from "moti";

export default function RecentSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch sales
  const getSales = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sales/recent`);
      setSales(response.data);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getSales();
    })();
  }, []);

  if (loading) {
    return (
      <View className="gap-2">
        <Text className="text-lg font-bold">Recent Sales</Text>
        {[...Array(5)].map((_, i) => (
          <View key={i} className="flex-row justify-between gap-4 p-2 bg-white dark:bg-slate-800 rounded-md">
            <Skeleton width="45%" height={20} colorMode="dark" />
            <Skeleton width="40%" height={20} colorMode="dark" />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center p-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-900">
        <AlertTriangle color="#dc2626" strokeWidth={1.5} size={72} />
        <Text className="mt-2 font-semibold text-red-600 text-lg">Failed to fetch sales</Text>
        <Text className="text-sm text-red-500">Something went wrong. Please try again.</Text>
        <Pressable
          onPress={getSales}
          className="mt-4 p-4 flex flex-row gap-2 justify-center items-center bg-white w-full rounded-xl"
        >
          <RefreshCw size={18} color="red" />
          <Text className="text-red-600 font-medium">Reload</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex mt-6 flex-col gap-2">
      <Text className="text-lg dark:text-white font-bold mb-2">Recent Sales</Text>

      {/* Table Headings */}
      <View className="flex-row justify-between px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
        <Text className="font-semibold dark:text-slate-300 text-base w-1/2">Customer Name</Text>
        <Text className="font-semibold dark:text-slate-300 text-base w-1/2 text-right">Amount ($)</Text>
      </View>

      {/* Sales Data with Animated Rows */}
      {sales.map((sale, index) => (
        <MotiView
          key={sale.id}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100, type: "timing" }}
          className="flex-row justify-between px-2 py-2 border-b border-gray-200 dark:border-slate-700"
        >
          <Text className="w-1/2 text-sm dark:text-white">
            {sale.customer?.name || "Unknown"}
          </Text>
          <Text className="w-1/2 text-sm text-right font-medium dark:text-white">
            ${sale.total.toFixed(2)}
          </Text>
        </MotiView>
      ))}
    </View>
  );
}