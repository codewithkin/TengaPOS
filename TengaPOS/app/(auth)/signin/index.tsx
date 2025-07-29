import { Link, router } from 'expo-router'
import { ChevronLeft, Upload } from 'lucide-react-native'
import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import { MotiView } from 'moti'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'

const SignIn = () => {
    const [ownerName, setOwnerName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [businessEmail, setBusinessEmail] = useState('')
    const [password, setPassword] = useState('')
    const [businessLogo, setBusinessLogo] = useState<string | null>(null)

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })
        if (!result.canceled && result.assets.length > 0) {
            setBusinessLogo(result.assets[0].uri)
        }
    }

    return (
        <View className="h-full w-full dark:bg-green-900 bg-green-600 flex flex-col justify-between">
            {/* Header */}
            <View className="flex flex-row justify-between items-center px-2 pt-12">
                <Pressable
                    onPress={() => router.back()}
                    className="dark:bg-black bg-white p-2 rounded-lg"
                >
                    <ChevronLeft className="dark:stroke-white stroke-green-900" />
                </Pressable>
            </View>

            {/* Form */}
            <MotiView
                from={{ translateY: 500 }}
                animate={{ translateY: 0 }}
                transition={{ type: 'timing', duration: 600 }}
                className="bg-white dark:bg-black rounded-tr-3xl rounded-tl-3xl h-3/4 px-4 py-8"
            >
                <View className="flex flex-col gap-1">
                    <Text className="text-2xl dark:text-white font-semibold text-center mb-6">
                        Tenga<Text className="text-yellow-600">POS</Text>
                    </Text>
                </View>

                <TextInput
                    placeholder="Owner Name"
                    placeholderTextColor="#475569"
                    value={ownerName}
                    onChangeText={setOwnerName}
                    className="text-black rounded-xl p-4 mb-4 bg-gray-300 dark:text-black dark:bg-white"
                />

                <TextInput
                    placeholder="Business Name"
                    placeholderTextColor="#475569"
                    value={businessName}
                    onChangeText={setBusinessName}
                    className="text-black rounded-xl p-4 mb-4 bg-gray-300 dark:text-black dark:bg-white"
                />

                <TextInput
                    placeholder="Business Email"
                    placeholderTextColor="#475569"
                    value={businessEmail}
                    onChangeText={setBusinessEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="text-black rounded-xl p-4 mb-4 bg-gray-300 dark:text-black dark:bg-white"
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#475569"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="rounded-xl p-4 mb-4 bg-gray-300 dark:text-black dark:bg-white"
                />

                <View className="flex flex-col gap-2">
                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={() => console.log('Submit')}
                        className="bg-green-600 dark:bg-green-700 dark:disabled:bg-green-900 disabled:bg-green-800 rounded-xl py-4"
                    >
                        <Text className="text-white text-center font-semibold text-lg">Sign Up</Text>
                    </TouchableOpacity>

                    <Text className="flex flex-col justify-center items-center text-center dark:text-gray-300">
                        Already have an account yet ? <Link className="font-semibold underline text-green-600 dark:text-green-700" href="/(auth)/signin">Sign In</Link>
                    </Text>
                </View>
            </MotiView>
        </View>
    )
}

export default SignIn