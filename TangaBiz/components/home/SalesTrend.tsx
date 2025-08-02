import { View, Text, useColorScheme, Pressable, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart } from "react-native-gifted-charts";
import { Skeleton } from "moti/skeleton";
import { AnimatePresence } from "moti";
import * as SecureStore from "expo-secure-store";
import { format, subMonths } from "date-fns";

const { width } = Dimensions.get("window");

type FilterType = "daily" | "weekly" | "monthly";

interface SalesEntry {
  label: string;
  total: number;
}

export default function SalesTrend() {
  const [sales, setSales] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("weekly");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const businessId = JSON.parse(SecureStore.getItem("session") || "{}").id;

  const fetchSalesTrend = async (range: FilterType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sales/analytics?range=${range}&businessId=${businessId}`
      );
      const rawData = res.data;

      const mappedData = rawData.map((entry: any) => ({
        label: entry.label || entry.date || entry.month,
        total: entry.total,
      }));

      setSales(mappedData);
    } catch (err) {
      console.error(err);
      setError("Failed to load sales trend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchSalesTrend(filter);
    })();
  }, [filter]);

  const getLabel = (index: number): string => {
    if (filter === "daily") {
      const dailyLabels = ["12am", "6am", "12pm", "6pm"];
      return dailyLabels[index] || "";
    }
    if (filter === "weekly") {
      const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return weeklyLabels[index] || "";
    }
    if (filter === "monthly") {
      const date = subMonths(new Date(), 5 - index); // 6 months from now
      return format(date, "MMM");
    }
    return "";
  };

  const chartData = sales.map((entry, index) => ({
    value: entry.total,
    label: getLabel(index),
    frontColor: isDark ? "#4F46E5" : "#6366F1",
  }));

  const filters: FilterType[] = ["daily", "weekly", "monthly"];

  console.log(sales);

  return (
    <View className="p-4 mt-8 rounded-xl w-full bg-white dark:bg-gray-800 shadow">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Sales Trend ({filter.charAt(0).toUpperCase() + filter.slice(1)})
      </Text>

      <View className="flex-row justify-between mb-4 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
        {filters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            className={`flex-1 py-2 rounded-full items-center ${
              filter === item ? "bg-indigo-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                filter === item ? "text-white" : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <AnimatePresence>
          <Skeleton
            show
            colorMode={isDark ? "dark" : "light"}
            width={width - 40}
            height={200}
            radius={10}
            transition={{ type: "timing", duration: 1000 }}
          />
        </AnimatePresence>
      ) : error ? (
        <Text className="text-red-600 dark:text-red-400 mt-4 text-base">{error}</Text>
      ) : sales.length === 0 ? (
        <View className="items-center justify-center py-16">
          <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100">No sales yet</Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 mt-1">
            Please create a sale to see it here
          </Text>
        </View>
      ) : (
        <BarChart
          data={chartData}
          barWidth={24}
          spacing={18}
          roundedTop
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          barBorderRadius={6}
          maxValue={Math.max(...chartData.map((d) => d.value)) + 50}
          noOfSections={4}
          yAxisTextStyle={{ color: isDark ? "#9CA3AF" : "#6B7280" }}
          xAxisLabelTextStyle={{ color: isDark ? "#D1D5DB" : "#6B7280", fontSize: 11 }}
        />
      )}
    </View>
  );
}