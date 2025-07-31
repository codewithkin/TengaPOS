import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import axios from 'axios';
import { ChevronDown, DollarSign, Plus, ShoppingBag, User, Wallet } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';
import * as Store from "expo-secure-store";
import { MotiView, AnimatePresence } from 'moti';

const Home = () => {
    const [currency, setCurrency] = useState<"USD" | "ZiG">("USD");
    const [data, setData] = useState<null | any[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showCurrencyChooser, setCurrencyChooserShow] = useState<boolean>(false);

    const amounts = {
        ZiG: "4,047.08",
        USD: "400.30"
    }

    // Get the business' id;
    const business = JSON.parse(Store.getItem("session") || "{}");

    const getData = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos?businessId=${business.id}`);

            if (res.status === 200) {
                setData(res.data);
            } else {
                Toast.show("Could not fetch your data");
            }
        } catch (e) {
            console.log("An error occurred while fetching data: ", e);
            Toast.show("Could not fetch your data");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <View className="px-2 py-12 flex flex-col gap-8 h-full bg-white dark:bg-black">
            {/* Total Received */}
            <View className="flex flex-col justify-center items-center mb-4 gap-2">
                <AnimatePresence>
                    {isLoading ? (
                        <MotiView
                            from={{ opacity: 0.3 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: 'timing', duration: 800 }}
                            className="w-40 h-12 rounded-xl bg-gray-300 dark:bg-gray-700"
                        />
                    ) : (
                        <View className="flex flex-col gap-1">
                            <Text className="text-gray-400 text-center">Total Received</Text>
                            <Text className="dark:text-white text-5xl text-center">
                                {data?.sales?.length === 0 ? "$0.00" : amounts[currency]}
                            </Text>
                        </View>
                    )}
                </AnimatePresence>

                {/* Currency Switcher */}
                {!isLoading && (
                    <Pressable
                        onPress={() => setCurrencyChooserShow(!showCurrencyChooser)}
                        className={`flex flex-row gap-1 items-center border ${currency === "USD" ? "bg-green-600" : "bg-indigo-500"} border-slate-600 dark:border-gray-400 px-12 py-2 rounded-3xl`}
                    >
                        <Text className="text-slate-600 dark:text-slate-800 font-semibold">{currency}</Text>
                    </Pressable>
                )}

                {/* Currency Chooser */}
                {
                    showCurrencyChooser && !isLoading && (
                        <View className="top-28 w-full z-20 p-4 absolute bg-white rounded-3xl flex flex-col gap-2">
                            <Text className="text-lg font-semibold">Select your currency</Text>
                            <Pressable onPress={() => {
                                setCurrency("USD");
                                setCurrencyChooserShow(false);
                            }} className="w-full bg-green-400 rounded-3xl py-2 px-4 flex flex-row items-center gap-4">
                                <View className="p-4 rounded-full bg-white text-green-800">
                                    <DollarSign strokeWidth={2.8} color="#166534" />
                                </View>
                                <View className="flex flex-col">
                                    <Text className="font-semibold text-base text-green-800">USD</Text>
                                    <Text className="text-xs text-slate-700">Show USD earnings</Text>
                                </View>
                            </Pressable>

                            <Pressable onPress={() => {
                                setCurrency("ZiG");
                                setCurrencyChooserShow(false);
                            }} className="w-full bg-indigo-500 rounded-3xl py-2 px-4 flex flex-row items-center gap-4">
                                <View className="p-4 rounded-full bg-white text-indigo-800">
                                    <Wallet strokeWidth={2.8} color="#3730a3" />
                                </View>
                                <View className="flex flex-col">
                                    <Text className="font-semibold text-base text-indigo-900">ZiG</Text>
                                    <Text className="text-xs text-slate-700">Show ZiG earnings</Text>
                                </View>
                            </Pressable>
                        </View>
                    )
                }
            </View>

            {/* Cards Section */}
            <View className="w-full flex flex-col gap-2">
                {
                    isLoading ? (
                        <>
                            <MotiView
                                from={{ opacity: 0.3 }}
                                animate={{ opacity: 1 }}
                                transition={{ loop: true, type: 'timing', duration: 800 }}
                                className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded-3xl"
                            />
                            <MotiView
                                from={{ opacity: 0.3 }}
                                animate={{ opacity: 1 }}
                                transition={{ loop: true, type: 'timing', duration: 800 }}
                                className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded-3xl"
                            />
                            <MotiView
                                from={{ opacity: 0.3 }}
                                animate={{ opacity: 1 }}
                                transition={{ loop: true, type: 'timing', duration: 800 }}
                                className="h-24 w-full bg-gray-300 dark:bg-gray-700 rounded-3xl"
                            />
                        </>
                    ) : (
                        <>
                            <View className="w-full flex flex-row items-center gap-2 pr-2">
                                <View className="bg-green-600 rounded-3xl w-1/2 p-2">
                                    <View className="w-full flex flex-row gap-2 items-center">
                                        <View className="p-4 rounded-full bg-white">
                                            <ShoppingBag color="#16a34a" />
                                        </View>
                                        <Text className="text-white font-semibold text-md">Sales</Text>
                                    </View>
                                    <Text className="text-white p-2">
                                        <Text className="font-semibold text-3xl">{data?.sales?.length || 0}</Text>
                                        <Text className="text-gray-300"> total sales</Text>
                                    </Text>
                                </View>

                                <View className="bg-indigo-600 rounded-3xl w-1/2 p-2">
                                    <View className="w-full flex flex-row gap-2 items-center">
                                        <View className="p-4 rounded-full bg-white">
                                            <User color="#4f46e5" />
                                        </View>
                                        <Text className="text-white font-semibold text-md">Customers</Text>
                                    </View>
                                    <Text className="text-white p-2">
                                        <Text className="font-semibold text-3xl">{data?.customers?.length || 0}</Text>
                                        <Text className="text-gray-300"> customers</Text>
                                    </Text>
                                </View>
                            </View>

                            <View className="bg-yellow-600 rounded-3xl p-2 w-full">
                                <View className="w-full flex flex-row gap-2 items-center p-2">
                                    <Text className="text-white font-semibold text-md">Products sold</Text>
                                </View>
                                <Text className="text-white p-2 font-semibold text-3xl">{data?.products?.length || 0}</Text>
                            </View>
                        </>
                    )
                }
            </View>

            {/* Floating Add Button */}
            {
                !isLoading && (
                    <Pressable className="bg-green-600 rounded-full p-6 flex right-4 absolute bottom-4 flex-row gap-2 items-center self-start">
                        <Plus className="w-fit" color="white" size={24} strokeWidth={2.2} />
                    </Pressable>
                )
            }
        </View>
    );
}

export default Home;
