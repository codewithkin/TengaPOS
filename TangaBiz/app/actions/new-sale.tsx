import { router, Stack } from 'expo-router';
import {
    View,
    Text,
    Dimensions,
    Pressable
} from 'react-native';
import { useState } from 'react';
import { Product } from '~/types';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import * as SecureStore from 'expo-secure-store';
import { useSaleStore } from '~/stores/useSaleStore';
import { MotiView } from 'moti';

import StepTwo from '~/components/sale/step-two';
import { StepOne } from '~/components/sale/step-one';
import { StepThree } from '~/components/sale/step-three';

const { width } = Dimensions.get('window');
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

export default function NewSale() {
    // Shared states
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1 states
    const [saleItems, setSaleItems] = useState<Product[]>([]);
    const [saving, setSaving] = useState(false);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // Sale store data
    const data = useSaleStore();

    const handleSaveSale = async () => {
        if (saving) return;
        if (saleItems.length === 0) {
            Toast.show("No items in the order", {
                backgroundColor: "red",
                textColor: "white",
            });
            return;
        }

        try {
            setSaving(true);
            const session = JSON.parse(SecureStore.getItem("session") || "{}");
            const businessId = session.id || "";

            await axios.post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/sale`,
                {
                    ...data,
                    businessId
                }
            );

            Toast.show("Sale recorded successfully", {
                backgroundColor: "green",
                textColor: "white",
            });

            data.resetSale();
            setCurrentStep(1);
            // Optionally navigate away or reset steps
            router.push("/(tabs)/home");
        } catch (e) {
            console.error("Error recording sale:", e);
            Toast.show("Failed to record sale. Please try again.", {
                backgroundColor: "red",
                textColor: "white",
            });
        } finally {
            setSaving(false);
        }
    };

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
                return <StepThree saleItems={saleItems} showRecordButton={false} />;
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
                        Step {currentStep} of 3
                    </Text>
                    <View className="flex-row gap-1">
                        {[1, 2, 3].map((step) => (
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
                    {currentStep === 3 ? (
                        <Pressable
                            onPress={handleSaveSale}
                            className={`flex flex-row gap-2 px-6 py-3 rounded-lg ${saving ? 'bg-green-800' : 'bg-green-600'}`}
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text className="text-white font-semibold">Saving Sale...</Text>
                                </>
                            ) : (
                                <Text className="text-white font-semibold">Save Sale</Text>
                            )}
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={() => setCurrentStep(prev => Math.min(prev + 1, 3))}
                            className="px-6 py-3 rounded-lg bg-indigo-600"
                        >
                            <Text className="text-white font-semibold">Next</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}