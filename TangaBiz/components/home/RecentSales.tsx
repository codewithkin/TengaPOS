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

  const getSales = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sales/recent`
      );
      setSales(response.data);
    } catch (e) {
      console.error("Failed to fetch sales:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  if (loading) {
    return (
      <View className="gap-3">
        <Text className="text-lg font-bold dark:text-white">Recent Sales</Text>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            className="flex-row justify-between p-3 bg-white dark:bg-slate-800 rounded-md"
          >
            <Skeleton width="45%" height={20} colorMode="dark" />
            <Skeleton width="40%" height={20} colorMode="dark" />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center mt-8 justify-center p-6 rounded-xl border border-red-300 bg-red-100 dark:bg-red-900">
        <AlertTriangle color="#dc2626" strokeWidth={1.5} size={72} />
        <Text className="mt-3 font-semibold text-red-700 text-lg dark:text-red-300">
          Failed to fetch sales
        </Text>
        <Text className="text-sm text-red-500 dark:text-red-400 text-center">
          Something went wrong. Please try again.
        </Text>

        <Pressable
          onPress={getSales}
          className="mt-5 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 flex-row items-center justify-center gap-2"
        >
          <RefreshCw size={18} color="#dc2626" />
          <Text className="text-red-600 font-medium dark:text-red-300">
            Reload
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="mt-6 gap-3">
      <Text className="text-lg font-bold dark:text-white">Recent Sales</Text>

      {/* Table Header */}
      <View className="flex-row justify-between px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-md">
        <Text className="font-semibold text-base w-1/2 dark:text-slate-300">
          Customer
        </Text>
        <Text className="font-semibold text-base w-1/2 text-right dark:text-slate-300">
          Amount ($)
        </Text>
      </View>

      {/* Sales List */}
      {sales.map((sale, index) => (
        <MotiView
          key={sale.id}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 80, type: "timing" }}
          className="flex-row justify-between px-3 py-2 border-b border-gray-200 dark:border-slate-700"
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