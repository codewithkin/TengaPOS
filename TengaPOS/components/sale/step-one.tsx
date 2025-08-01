import { Product } from "~/types";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { View, Text, Pressable, TextInput, ScrollView, Dimensions } from "react-native"
import Toast from "react-native-root-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react-native";
import { SkeletonCard } from "~/app/actions/new-sale";
import ProductPreview from "../card/ProductPreview";
import { addToSaleData } from "./saleData";
import { useSaleStore } from "~/stores/useSaleStore";

const { width, height } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

// Step 1: Product Selection
export const StepOne = ({
    saleItems,
    setSaleItems,
    products,
    setProducts,
    loading,
    setLoading,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    refreshing,
    setRefreshing,
}: {
    saleItems: Product[];
    setSaleItems: React.Dispatch<React.SetStateAction<Product[]>>;
    products: Product[] | null;
    setProducts: React.Dispatch<React.SetStateAction<Product[] | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    refreshing: boolean;
    setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const id = JSON.parse(SecureStore.getItem("session") || "{}").id;

    const addProductId = useSaleStore(state => state.addProductId);
    const removeProductId = useSaleStore(state => state.removeProductId);

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
    }, [id, setProducts, setRefreshing, setSearchTerm]);

    const toggleSaleItem = (product: Product) => {
        const exists = saleItems.find(item => item.id === product.id);
        if (exists) {
            // Add to data
            addProductId(product.id)

            setSaleItems(prev => prev.filter(item => item.id !== product.id));
        } else {
            // Remove from data
            removeProductId(product.id);

            setSaleItems(prev => [...prev, product]);
        }
    };

    const isInSale = (productId: string) => {
        return saleItems.some(item => item.id === productId);
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <View className="flex-1 px-4 pb-4">
            <View className="flex flex-row items-center bg-gray-200 dark:bg-gray-800 rounded-xl px-4 py-2 mt-4">
                <Search size={20} color="#6b7280" />
                <TextInput
                    value={searchTerm}
                    onChangeText={handleSearch}
                    className="flex-1 ml-2 text-base text-black dark:text-white"
                    placeholder="Search for a product"
                    placeholderTextColor="#6b7280"
                />
            </View>

            <View className="flex flex-col gap-2 mt-6">
                <Text className="text-lg font-semibold dark:text-white">Products</Text>

                {error && (
                    <Text className="text-red-500 mt-2">{error}</Text>
                )}

                {loading ? (
                    <View className="flex-row flex-wrap justify-between mt-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </View>
                ) : products?.length === 0 ? (
                    <View className="flex flex-col justify-center items-center h-80 gap-1">
                        <SearchX size={80} color="#6b7280" strokeWidth={1.2} />
                        <Text className="text-gray-500 text-base mt-2">No products found</Text>
                        <Pressable
                            onPress={() => onRefresh()}
                            disabled={refreshing}
                            className="w-full bg-green-600 disabled:bg-green-800 p-4 rounded-xl mt-4 flex items-center"
                        >
                            <Text className="text-white font-medium text-base">Refresh</Text>
                        </Pressable>
                    </View>
                ) : (
                    <ScrollView
                        className="mt-4"
                        style={{ maxHeight: height * 0.5 }}
                    >
                        <View className="flex-row flex-wrap justify-between">
                            {products?.map((product: Product, index: number) => (
                                <ProductPreview
                                    key={index}
                                    product={product}
                                    cardWidth={cardWidth}
                                    selected={isInSale(product.id)}
                                    onToggleSelect={() => toggleSaleItem(product)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};