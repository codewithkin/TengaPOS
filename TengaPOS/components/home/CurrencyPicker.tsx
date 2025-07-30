import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CurrencyPicker = () => {
    const [currency, setCurrency] = useState<"USD" | "ZiG">("USD");

    const zigAmount = "12,000";
    const usdAmount = "400";

    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <View className="w-full flex flex-col justify-center items-center my-4">
                <View className="flex flex-row gap-1 items-center border bg-yellow-500 border-slate-600 dark:border-slate-800 px-12 py-2 rounded-3xl">
                    <Text className="text-slate-600 dark:text-slate-800">{currency}</Text>
                </View>
            </View>
        </GestureHandlerRootView >
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

export default CurrencyPicker