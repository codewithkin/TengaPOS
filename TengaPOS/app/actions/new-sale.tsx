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
import { StepOne } from '~/components/sale/step-one';

const { width, height } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const SkeletonCard = () => (
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