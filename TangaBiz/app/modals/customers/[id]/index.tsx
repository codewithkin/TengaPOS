import axios from "axios";
import { formatDate } from "date-fns";
import { Stack, useLocalSearchParams } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useEffect, useState } from "react";
import {FlatList, Text, View} from "react-native";
import Toast from "react-native-root-toast";
import { Customer, Sale } from "~/types";

function CustomerSale({ sale }: { sale: Sale }) {
    return (
        <View className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-600 rounded-xl">
            <Text className="text-lg font-bold">{sale.total}</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">{formatDate(sale.createdAt, 'dd/MM/yyyy')}</Text>
        </View>
    )
}

export default function CustomerModal() {
    const { id } = useLocalSearchParams();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await axios.get<Customer>(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/customers/unique?id=${id}`);
            setCustomer(response.data);
        } catch (error) {
            console.error(error);

            Toast.show('Failed to fetch customer', {
                backgroundColor: 'red',
                textColor: 'white',
                position: Toast.positions.BOTTOM,
            });
        }
    }   

    useEffect(() => {
        (async () => {
            await fetchUser();
        })
    }, []);

    return (
        <View>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Customer Profile',
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerBackTitle: 'Back',
                }}
            />

            {/* Customer avatar with first letter of name, and phone number */}
            {
                !isLoading && customer ? (
                    <View className="flex flex-row items-center gap-2">
                        <View className="w-14 h-14 bg-gray-200 dark:bg-slate-700 rounded-full flex justify-center items-center">
                            <Text className="text-sm font-medium text-white">{customer.name.charAt(0)}</Text>
                        </View>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</Text>
                    </View>
                ) : (
                    <View className="flex flex-row items-center gap-2">
                        {/* Avatar Skeleton */}
                        <Skeleton />
                        {/* Name Skeleton */}
                        <Skeleton />
                        {/* Phone Skeleton */}
                        <Skeleton />
                    </View>
                )
            }

            {/* Customer sales */}
            <View className="flex flex-col gap-2 mt-4">
                <Text className="text-lg font-bold">Sales</Text>
                <FlatList
                    data={customer?.sales}
                    renderItem={({ item }) => <CustomerSale sale={item} />}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    )
}