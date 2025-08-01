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
import { ImageIcon, Plus, Search, SearchX } from 'lucide-react-native';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Customer, Product } from '~/types';
import * as SecureStore from "expo-secure-store";
import { MotiView } from 'moti';
import ProductPreview from '~/components/card/ProductPreview';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import StepTwo from '~/components/sale/step-two';

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

// Placeholder for Step 3
const StepThree = () => (
    <View className="flex-1 justify-center items-center px-4">
        <Text className="text-xl text-slate-700 dark:text-white">Step 3 content here</Text>
    </View>
);

export default function NewSale() {
    // Shared states
    const [currentStep, setCurrentStep] = useState(2);

    // Step 1 states
    const [saleItems, setSaleItems] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // You can add any other shared state or step 2/3 state here if needed

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepOne
                        saleItems={saleItems}
                        setSaleItems={setSaleItems}
                        products={products}
                        setProducts={setProducts}
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        refreshing={refreshing}
                        setRefreshing={setRefreshing}
                    />
                );
            case 2:
                return <StepTwo />;
            case 3:
                return <StepThree />;
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Stack.Screen options={{ title: `Step ${currentStep} of 3` }} />

            {renderStep()}

            <View className="flex flex-col p-4 border-t border-gray-300 dark:border-gray-700">
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

                <View className="flex flex-row items-center w-full justify-between">
                    <Pressable
                        onPress={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                        disabled={currentStep === 1}
                        className={`px-6 py-3 rounded-lg ${currentStep === 1 ? 'bg-gray-400' : 'bg-blue-600'}`}
                    >
                        <Text className="text-white font-semibold">Previous</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setCurrentStep(prev => Math.min(prev + 1, 3))}
                        className="px-6 py-3 rounded-lg bg-indigo-600"
                    >
                        <Text className="text-white font-semibold">Next</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}