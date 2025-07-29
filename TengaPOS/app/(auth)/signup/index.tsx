import { Link, router, Stack } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import { MotiView } from 'moti'
import { useState } from 'react'
import Toast from 'react-native-root-toast';
import axios, { AxiosError } from "axios"

const SignUp = () => {
    const [ownerName, setOwnerName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [businessEmail, setBusinessEmail] = useState('')
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignUp = async () => {
        if (!ownerName || !businessName || !businessEmail || !password) {
            Toast.show("Missing Fields", {
                containerStyle: {
                    backgroundColor: "red"
                }
            });
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/auth/signup`, {
                ownerName,
                businessEmail,
                businessName,
                password,
            });

            console.log("Data: ", response.data);

            if (response.status === 200) {
                Toast.show("Business registered successfully ! Please check your email", {
                    containerStyle: {
                        backgroundColor: "green"
                    },
                    textStyle: {
                        color: "white",
                        fontWeight: "600"
                    }
                });
            }

            return response.data;
        } catch (e: any) {
            Toast.show(e.response.data.message, {
                containerStyle: {
                    backgroundColor: "red"
                },
                textStyle: {
                    color: "white",
                    fontWeight: "500"
                }
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="h-full w-full dark:bg-green-900 bg-green-600 flex flex-col justify-between">
            {/* Header */}
            <View className="flex flex-row justify-between items-center px-2 pt-12">
                <Pressable
                    onPress={() => router.back()}
                    className="dark:bg-slate-500 bg-white p-2 rounded-lg"
                >
                    <ChevronLeft className="dark:stroke-white stroke-green-900" />
                </Pressable>
            </View>

            {/* Form */}
            <MotiView
                from={{ translateY: 500 }}
                animate={{ translateY: 0 }}
                transition={{ type: 'timing', duration: 600 }}
                className="bg-white dark:bg-slate-500 rounded-tr-3xl rounded-tl-3xl h-3/4 px-4 py-8"
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
                    className="rounded-xl p-4 mb-4 bg-gray-300 text-black dark:text-black dark:bg-white"
                />

                <View className="flex flex-col gap-2">
                    {/* Sign In Button */}
                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleSignUp}
                        className="bg-green-600 dark:bg-green-700 dark:disabled:bg-green-900 disabled:bg-green-800 rounded-xl py-3"
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? "Signing Up..." : "Sign Up"}
                        </Text>
                    </TouchableOpacity>

                    <Text className="flex flex-col justify-center items-center text-center dark:text-gray-300">
                        Already have an account ? <Link className="font-semibold underline text-green-600 dark:text-green-800" href="/(auth)/signin">Sign In</Link>
                    </Text>
                </View>
            </MotiView>
        </View>
    )
}

export default SignUp