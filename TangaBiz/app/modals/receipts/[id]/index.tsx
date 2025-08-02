import React, { useEffect, useState } from "react";
import { MotiView } from "moti";
import { View, Text, ScrollView, Pressable, Share, Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import axios from "axios";
import { useLocalSearchParams, Stack, router } from "expo-router";
import Toast from "react-native-root-toast";
import { ActivityIndicator } from "~/components/nativewindui/ActivityIndicator";
import { Sale, Product, Customer, Business } from "~/types";

import { AlertTriangle, RotateCcw, Home, DownloadCloud, Share2Icon, BadgeCheck } from "lucide-react-native";

const Skeleton = ({ width, height, className }: { width: number | string; height: number; className?: string }) => (
  <MotiView
    from={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{ loop: true, type: "timing", duration: 1000 }}
    style={{ width: width as any, height }}
    className={`bg-gray-200 dark:bg-gray-700 rounded-md mb-3 ${className ?? ""}`}
  />
);

interface FullSale extends Sale {
  items: Product[];
  customer?: Customer;
  business?: Business;
}

export default function Receipt() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [sale, setSale] = useState<FullSale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await axios.get<FullSale>(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sale?saleId=${id}`
        );
        setSale(res.data);
      } catch (e) {
        console.error("Failed to load sale", e);
        Toast.show("Failed to load receipt", {
          backgroundColor: "red",
          textColor: "white",
        });
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSale();
  }, [id]);

  if (loading) {
    return (
      <ScrollView className="flex-1 bg-white dark:bg-black px-4 py-6">
        {/* Header skeleton */}
        <Skeleton width="60%" height={24} />
        <Skeleton width="40%" height={16} />

        {/* Customer skeleton */}
        <View className="mt-8">
          <Skeleton width="50%" height={20} className="mb-2" />
          <Skeleton width="70%" height={16} />
        </View>

        {/* Items skeleton */}
        <View className="mt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={56} />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (error || !sale) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black px-6">
        <AlertTriangle color="#ef4444" size={64} />
        <Text className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-4">An error occurred</Text>
        <Text className="text-base text-center text-slate-600 dark:text-slate-300 mt-2">
          We could not load the receipt details. Please try again or go back home.
        </Text>

        <View className="flex-row gap-4 mt-6">
          <Pressable
            onPress={async () => {
              setRetrying(true);
              setError(false);
              try {
                const res = await axios.get<FullSale>(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sale?saleId=${id}`);
                setSale(res.data);
              } catch (e) {
                console.error(e);
                Toast.show("Still couldn't load receipt", { backgroundColor: "red", textColor: "white" });
                setError(true);
              } finally {
                setRetrying(false);
              }
            }}
            disabled={retrying}
            className={`flex-row items-center px-4 py-3 rounded-xl ${retrying ? 'bg-blue-800' : 'bg-blue-600'}`}
          >
            {retrying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <RotateCcw color="#fff" size={16} />
            )}
            <Text className="text-white font-semibold ml-2">{retrying ? 'Retrying...' : 'Retry'}</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/home')}
            className="flex-row items-center px-4 py-3 rounded-xl bg-gray-700"
          >
            <Home color="#fff" size={16} />
            <Text className="text-white font-semibold ml-2">Go Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Helpers
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black px-4 pt-6 pb-12">
      <Stack.Screen options={{ title: "Receipt Details" }} />

      <View className="flex flex-col pb-4 mb-4 gap-2 justify-center border-b dark:border-b-slate-700 items-center">
        <BadgeCheck size={64} color="lightgreen" />
        <Text className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
          Payment Success
        </Text>
      </View>

      {/* Header */}
      <View className="mb-6 items-center">
        <Text className="text-2xl font-semibold text-slate-800 dark:text-white mb-1">
          {sale.business?.businessName || "Sale Receipt"}
        </Text>
        <Text className="text-base text-slate-600 dark:text-slate-300">
          {formatDate(sale.createdAt)}
        </Text>
      </View>

      {/* Customer */}
      {sale.customer && (
        <View className="mb-6">
          <Text className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Customer
          </Text>
          <Text className="text-base text-slate-800 dark:text-white">
            {sale.customer.name}
          </Text>
          {sale.customer.phone && (
            <Text className="text-base text-slate-600 dark:text-slate-400">
              {sale.customer.phone}
            </Text>
          )}
        </View>
      )}

      {/* Items */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Items
        </Text>
        {sale.items.map((item) => (
          <View
            key={item.id}
            className="flex flex-row justify-between items-center mb-3 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-xl"
          >
            <Text className="text-slate-800 dark:text-slate-200 w-2/3" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-slate-800 dark:text-slate-200 font-medium">
              ${item.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View className="border-t border-gray-300 dark:border-gray-700 pt-4 mb-8">
        <View className="flex flex-row justify-between mb-2">
          <Text className="font-semibold text-slate-800 dark:text-white">
            Total (USD)
          </Text>
          <Text className="font-semibold text-slate-800 dark:text-white">
            ${sale.total.toFixed(2)}
          </Text>
        </View>
        <View className="flex flex-row justify-between mb-2">
          <Text className="font-semibold text-slate-800 dark:text-white">
            Total (ZiG)
          </Text>
          <Text className="font-semibold text-slate-800 dark:text-white">
            {sale.zigTotal.toFixed(2)} ZiG
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="font-semibold text-slate-800 dark:text-white">Payment</Text>
          <Text className="font-semibold text-slate-800 dark:text-white capitalize">
            {sale.paymentType}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="items-center">
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          Thank you for your business!
        </Text>
      </View>
    </ScrollView>
  );
}
