import { Stack } from 'expo-router';
import {
    View,
    TextInput,
    ScrollView,
    Text,
    Dimensions,
    RefreshControl,
    Pressable
} from 'react-native';
import { ImageIcon, Search, SearchX } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import { Product } from '~/types';
import * as SecureStore from "expo-secure-store";
import { MotiView } from 'moti';
import ProductPreview from '~/components/card/ProductPreview';
import Toast from 'react-native-root-toast';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

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

// Step 1: Product Selection
const StepOne = ({
    products,
    loading,
    error,
    searchTerm,
    refreshing,
    setSearchTerm,
    onRefresh,
    handleSearch,
    toggleSaleItem,
    isInSale,
}: any) => {
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

// Placeholder for Step 2
const StepTwo = () => (
    <View className="flex-1 justify-center items-center px-4">
        <Text className="text-xl text-slate-700 dark:text-white">Step 2: Coming Soon</Text>
    </View>
);

// Placeholder for Step 3
const StepThree = () => (
    <View className="flex-1 justify-center items-center px-4">
        <Text className="text-xl text-slate-700 dark:text-white">Step 3: Coming Soon</Text>
    </View>
);

const NewSale = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [saleItems, setSaleItems] = useState<Product[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);

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

    const toggleSaleItem = (product: Product) => {
        const exists = saleItems.find(item => item.id === product.id);
        if (exists) {
            setSaleItems(prev => prev.filter(item => item.id !== product.id));
        } else {
            setSaleItems(prev => [...prev, product]);
        }
    };

    const isInSale = (productId: string) => {
        return saleItems.some(item => item.id === productId);
    };

    useEffect(() => {
        getProducts();
    }, []);

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <StepOne
                        products={products}
                        loading={loading}
                        error={error}
                        searchTerm={searchTerm}
                        refreshing={refreshing}
                        setSearchTerm={setSearchTerm}
                        onRefresh={onRefresh}
                        handleSearch={handleSearch}
                        toggleSaleItem={toggleSaleItem}
                        isInSale={isInSale}
                    />
                );
            case 1:
                return <StepTwo />;
            case 2:
                return <StepThree />;
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Stack.Screen
                options={{
                    headerTitle: "New Sale",
                    headerTitleAlign: "center"
                }}
            />

            {renderStep()}

            {/* Bottom Controls */}
            <View className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 bg-white dark:bg-black">
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-sm text-slate-500 dark:text-slate-300">
                        Step {currentStep + 1} of 3
                    </Text>
                    <View className="flex-row gap-1">
                        {[0, 1, 2].map((step) => (
                            <View
                                key={step}
                                className={`h-2 w-6 rounded-full ${currentStep === step
                                    ? 'bg-indigo-600'
                                    : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                            />
                        ))}
                    </View>
                </View>

                <View className="flex-row justify-between gap-2">
                    <Pressable
                        onPress={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="flex-1 p-4 rounded-xl items-center bg-slate-500 disabled:bg-slate-800"
                    >
                        <Text className="text-white font-medium">Back</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setCurrentStep(prev => Math.min(2, prev + 1))}
                        disabled={currentStep === 2}
                        className="flex-1 p-4 rounded-xl items-center bg-green-600 disabled:bg-slate-300"
                    >
                        <Text className="text-white font-medium">Next</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default NewSale;