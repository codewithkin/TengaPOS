import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ChevronDown, DollarSign, ShoppingBag, User, Wallet } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'

const Home = () => {
    const [currency, setCurrency] = useState<"USD" | "ZiG">("USD");

    const amounts = {
        ZiG: "4,047.08",
        USD: "400.30"
    }

    const [showCurrencyChooser, setCurrencyChooserShow] = useState<boolean>(false);

    return (
        <View className="px-2 py-12 flex flex-col gap-8 h-full">
            <View className="flex flex-col justify-center items-center mb-4 gap-2">
                <View className="flex flex-col gap-1">
                    <Text className="text-gray-400 text-center">Total Received</Text>
                    <Text className="dark:text-white text-5xl text-center">${amounts[currency]}</Text>
                </View>

                <Pressable onPress={() => {
                    if (showCurrencyChooser) {
                        setCurrencyChooserShow(false);
                    } else {
                        setCurrencyChooserShow(true);
                    }
                }} className={`flex flex-row gap-1 items-center border ${currency === "USD" ? "bg-green-600" : "bg-indigo-500"} border-slate-600 dark:border-gray-400 px-12 py-2 rounded-3xl`}>
                    <Text className="text-slate-600 dark:text-slate-800 font-semibold">{currency}</Text>
                </Pressable>

                {
                    showCurrencyChooser && (
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

            <View className="w-full flex flex-col gap-2">
                <View className="w-full flex flex-row items-center gap-2 pr-2">
                    <View className="bg-green-600 rounded-3xl w-1/2 p-2">
                        <View className="w-full flex flex-row gap-2 items-center">
                            <View className="p-4 rounded-full bg-white">
                                <ShoppingBag color="#16a34a" />
                            </View>
                            <Text className="text-white font-semibold text-md">Sales</Text>
                        </View>

                        <Text className="text-white  p-2"><Text className="font-semibold text-3xl">121</Text><Text className="text-gray-300">total sales</Text></Text>
                    </View>

                    <View className="bg-indigo-600 rounded-3xl w-1/2 p-2">
                        <View className="w-full flex flex-row gap-2 items-center">
                            <View className="p-4 rounded-full bg-white">
                                <User color="#4f46e5" />
                            </View>
                            <Text className="text-white font-semibold text-md">Customers</Text>
                        </View>

                        <Text className="text-white  p-2"><Text className="font-semibold text-3xl">18</Text><Text className="text-gray-300">customers</Text></Text>
                    </View>
                </View>

                <View className="bg-yellow-600 rounded-3xl p-2 w-full">
                    <View className="w-full flex flex-row gap-2 items-center p-2">
                        <Text className="text-white font-semibold text-md">Products sold</Text>
                    </View>

                    <Text className="text-white  p-2 font-semibold text-3xl">1,380</Text>
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        padding: 36,
        alignItems: 'center',
    },
});

export default Home