import { ChevronDown, ShoppingBag, User } from 'lucide-react-native'
import { useState } from 'react';
import { View, Text } from 'react-native'

const Home = () => {
    const [currency, setCurrency] = useState<"USD" | "zIg">("USD");

    const zigAmount = "12,000";
    const usdAmount = "400";

    return (
        <View className="px-2 py-12 flex flex-col gap-8">
            <View className="flex flex-col justify-center items-center mt-8">
                <Text className="text-gray-400">Total Received</Text>
                <Text className="dark:text-white text-5xl text-center">$4,000.00</Text>
                <View className="w-full flex flex-col justify-center items-center my-4">
                    <View className="flex flex-row gap-1 items-center border bg-yellow-500 border-slate-600 dark:border-slate-800 px-12 py-2 rounded-3xl">
                        <Text className="text-slate-600 dark:text-slate-800">USD</Text>
                    </View>
                </View>
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

export default Home