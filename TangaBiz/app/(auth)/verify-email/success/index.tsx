import { Stack, router } from 'expo-router'
import { Verified } from 'lucide-react-native'
import { View, Text, Pressable } from 'react-native'
import { MotiView, MotiText } from 'moti'

const EmailVerified = () => {
    return (
        <View className="w-full flex flex-col h-full justify-center items-center gap-4 p-4 bg-green-600 dark:bg-green-900">
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />

            <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 600 }}
            >
                <Verified color="white" fill="green" size={150} strokeWidth={1.2} />
            </MotiView>

            <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 300 }}
                className="flex flex-col justify-center items-center"
            >
                <MotiText
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 400, duration: 400 }}
                    className="text-2xl font-semibold dark:text-white text-white"
                >
                    Email verified successfully!
                </MotiText>

                <MotiText
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 600, duration: 400 }}
                    className="text-sm text-gray-200 text-center mt-2"
                >
                    Your TengaPOS account has been verified! Please sign in to continue
                </MotiText>
            </MotiView>

            <MotiView
                from={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500, delay: 800 }}
                className="w-full"
            >
                <Pressable
                    className="mt-4 rounded-xl py-4 bg-white w-full flex flex-col justify-center items-center"
                    onPress={() => {
                        router.push("/(auth)/signin")
                    }}
                >
                    <Text className="text-green-700 font-semibold">Go to Sign In</Text>
                </Pressable>
            </MotiView>
        </View>
    )
}

export default EmailVerified