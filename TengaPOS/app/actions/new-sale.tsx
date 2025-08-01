import { Stack } from 'expo-router';
import {
    View,
    TextInput,
    ScrollView,
    Text,
    Dimensions,
    Image,
    RefreshControl,
    Pressable
} from 'react-native';
import { ImageIcon, Search, SearchX } from 'lucide-react-native';
import { Container } from '~/components/Container';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Product } from '~/types';
import * as SecureStore from "expo-secure-store";
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 24px padding on each side, 8px gap

const SkeletonCard = () => (
    <MotiView
        from={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
            loop: true,
            type: 'timing',
            duration: 1000,
        }}
        className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"
        style={{ width: cardWidth }}
    />
);

const NewSale = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const id = JSON.parse(SecureStore.getItem("session") || "{}").id;

    const getProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/products?id=${id}`);
            setProducts(res.data);
        } catch (e) {
            console.error("Error fetching products:", e);
            setError("Failed to load products");
            Toast.show("An error occurred while getting products", {
                backgroundColor: "red",
                textColor: "white"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (value: string) => {
        setSearchTerm(value);
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/products/search`, {
                params: {
                    searchTerm: value,
                    id
                }
            });

            setProducts(res.data);
        } catch (e) {
            console.error("Error during product search:", e);
            setError("Search failed. Please try again.");
            Toast.show("Search failed. Please try again.", {
                backgroundColor: "red",
                textColor: "white"
            });
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setSearchTerm('');
        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/products?id=${id}`);
            setProducts(res.data);
        } catch (e) {
            console.error("Error refreshing products:", e);
            Toast.show("Refresh failed", {
                backgroundColor: "red",
                textColor: "white"
            });
        } finally {
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <ScrollView
            className="flex-1 bg-white dark:bg-black"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Stack.Screen
                options={{
                    headerTitle: "New Sale",
                    headerTitleAlign: "center"
                }}
            />

            <View className="p-4">
                {/* Search Bar */}
                <View className="flex flex-row items-center bg-gray-200 dark:bg-gray-800 rounded-xl px-4 py-2">
                    <Search size={20} color="#6b7280" />
                    <TextInput
                        value={searchTerm}
                        onChangeText={handleSearch}
                        className="flex-1 ml-2 text-base text-black dark:text-white"
                        placeholder="Search for a product"
                        placeholderTextColor="#6b7280"
                    />
                </View>
            </View>

            <View className="flex flex-col gap-2 px-4 pb-8 mt-4">
                <Text className="text-lg font-semibold dark:text-white">Products</Text>

                {error && (
                    <Text className="text-red-500 mt-2">{error}</Text>
                )}

                {loading ? (
                    <View className="flex-row flex-wrap justify-between">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </View>
                ) : products?.length === 0 ? (
                    <View className="flex flex-col justify-center items-center h-full gap-1">
                        <SearchX size={80} color="#6b7280" strokeWidth={1.2} />
                        <Text className="text-gray-500 text-base mt-2">No products found</Text>
                        <Pressable
                            onPress={() => {
                                onRefresh();
                            }}
                            disabled={refreshing}
                            className="w-full bg-green-600 disabled:bg-green-800 p-4 rounded-xl mt-4 flex flex-col justify-center items-center">
                            <Text className="text-white font-medium text-base">Refresh</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap justify-between items-center">
                        {products?.map(product => (
                            <View
                                key={product.id}
                                className="p-2 b-2"
                                style={{ width: cardWidth }}
                            >
                                {
                                    product.imageUrl ? (
                                        <Image
                                            className="w-full h-36 rounded-xl mb-2"
                                            source={{
                                                uri: product?.imageUrl || 'https://via.placeholder.com/150?text=No+Image',
                                            }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View className="rounded-xl bg-gray-400 w-full h-36 flex flex-col justify-center items-center">
                                            <ImageIcon color="white" size={40} strokeWidth={1.8} />
                                        </View>
                                    )
                                }
                                <Text className="text-black dark:text-white font-medium text-base">
                                    {product.name}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-300 text-sm">
                                    ${product.price}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default NewSale;