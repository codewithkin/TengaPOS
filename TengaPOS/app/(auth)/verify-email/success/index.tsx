import { Stack } from 'expo-router'
import { router } from 'expo-router'
import { Verified } from 'lucide-react-native'
import { View, Text, Pressable } from 'react-native'

const EmailVerified = () => {
    return (
        <View className="w-full flex flex-col h-full justify-center items-center gap-4 p-4">
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <Verified color="white" fill="green" size={150} strokeWidth={1.2} />
            <View className="flex flex-col justify0center items-center">
                <Text className="text-2xl font-semibold dark:text-white">Email verified successfully !</Text>
                <Text className='text-sm text-gray-400 text-center'>Your TengaPOS account has been verified ! Please sign in to continue</Text>
            </View>
            <Pressable
                className="mt-2 rounded-xl py-4 bg-green-600 w-full flex flex-col justify-center items-center"
                onPress={() => {
                    router.push("/(auth)/signin")
                }}
            >
                <Text className="text-white font-semibold">Go to sign in</Text>
            </Pressable>
        </View>
    )
}

export default EmailVerified