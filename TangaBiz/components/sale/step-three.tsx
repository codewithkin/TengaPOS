import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import axios from "axios";
import Toast from "react-native-root-toast";
import * as SecureStore from "expo-secure-store";

import { Product, Customer } from "~/types";
import { useSaleStore } from "~/stores/useSaleStore";
import { ActivityIndicator } from "../nativewindui/ActivityIndicator";

interface StepThreeProps {
  saleItems: Product[];
  showRecordButton?: boolean;
}

export const StepThree: React.FC<StepThreeProps> = ({ saleItems, showRecordButton = true }) => {
  // Sale data coming from the zustand store
  const { productIds, customerId, paymentMethod, resetSale } = useSaleStore();

  // Local states
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [fetchingCustomer, setFetchingCustomer] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const businessId = JSON.parse(SecureStore.getItem("session") || "{}").id;

  // Fetch customer details when a customer was selected in step-two
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId) return;
      try {
        setFetchingCustomer(true);
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/customers?id=${businessId}`,
          { params: { customerId } }
        );
        setCustomer(res.data);
      } catch (e) {
        console.error("Error fetching customer details:", e);
      } finally {
        setFetchingCustomer(false);
      }
    };

    fetchCustomer();
  }, [customerId, businessId]);

  // Compute totals for USD and ZiG
  const { totalUsd, totalZig } = useMemo(() => {
    const usd = saleItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const zig = saleItems.reduce((acc, item) => acc + (item.zigPrice || 0), 0);
    return { totalUsd: usd, totalZig: zig };
  }, [saleItems]);

  const handleRecordSale = async () => {
    if (submitting) return;
    if (saleItems.length === 0) {
      Toast.show("No items in the order", {
        backgroundColor: "red",
        textColor: "white",
      });
      return;
    }

    try {
      setSubmitting(true);

      const session = JSON.parse(SecureStore.getItem("session") || "{}");
      const businessId = session.id || "";

      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sale`,
        {
          productIds,
          name: customer?.name || "Guest",
          phone: customer?.phone || "",
          total: totalUsd,
          zigTotal: totalZig,
          paymentType: paymentMethod || "cash",
        },
        {
          params: {
            businessId,
          },
        }
      );

      Toast.show("Sale recorded successfully", {
        backgroundColor: "green",
        textColor: "white",
      });

      // Reset the sale data so that a new sale can be started
      resetSale();
    } catch (e) {
      console.error("Error recording sale:", e);
      Toast.show("Failed to record sale. Please try again.", {
        backgroundColor: "red",
        textColor: "white",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 px-4 py-4 bg-white dark:bg-black">
      <Text className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Order Summary
      </Text>

      {/* Customer Section */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Customer
        </Text>
        {fetchingCustomer ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className="text-base text-slate-600 dark:text-slate-400">
            {customer ? `${customer.name}${customer.phone ? ` • ${customer.phone}` : ""}` : "Guest"}
          </Text>
        )}
      </View>

      {/* Items Section */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Items
        </Text>
        {saleItems.map((item, idx) => (
          <View
            key={`${item.id}-${idx}`}
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
        <View className="flex flex-row justify-between mb-3">
          <Text className="font-semibold text-slate-800 dark:text-white">
            Total (USD)
          </Text>
          <Text className="font-semibold text-slate-800 dark:text-white">
            ${totalUsd.toFixed(2)}
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="font-semibold text-slate-800 dark:text-white">
            Total (ZiG)
          </Text>
          <Text className="font-semibold text-slate-800 dark:text-white">
            {totalZig.toFixed(2)} ZiG
          </Text>
        </View>
      </View>

      {/* Record Sale Button */}
      {showRecordButton && (
      <Pressable
        onPress={handleRecordSale}
        disabled={submitting}
        className={`w-full py-4 rounded-xl flex flex-row items-center justify-center ${submitting ? "bg-indigo-800" : "bg-indigo-600"}`}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">Record Sale</Text>
        )}
      </Pressable>
      )}
    </ScrollView>
  );
};
