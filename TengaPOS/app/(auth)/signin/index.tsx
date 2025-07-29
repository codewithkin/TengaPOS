import { Link, router, Stack } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import { MotiView } from 'moti'
import { useState } from 'react'
import Toast from 'react-native-root-toast'

const SignIn = () => {
    const [businessEmail, setBusinessEmail] = useState('')
    const [businessPassword, setBusinessPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
        if (!businessEmail || !businessPassword) {
            Toast.show('Missing Fields', {
                containerStyle: {
                    backgroundColor: 'red'
                },
                textStyle: {
                    color: 'white',
                    fontWeight: '500'
                }
            })
            return
        }

        try {
            setLoading(true)

            // Placeholder for sign-in logic
            console.log('Signing in with:', businessEmail, businessPassword)

            Toast.show('Sign in logic not implemented yet', {
                containerStyle: {
                    backgroundColor: 'orange'
                },
                textStyle: {
                    color: 'white',
                    fontWeight: '500'
                }
            })

        } catch (e: any) {
            Toast.show('Something went wrong', {
                containerStyle: {
                    backgroundColor: 'red'
                },
                textStyle: {
                    color: 'white',
                    fontWeight: '500'
                }
            })
        } finally {
            setLoading(false)
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
                        Welcome back to <Text className="text-yellow-600">TengaPOS</Text>
                    </Text>
                </View>

                <TextInput
                    placeholder="Business Email"
                    placeholderTextColor="#475569"
                    value={businessEmail}
                    onChangeText={setBusinessEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="text-black rounded-xl p-4 mb-4 bg-gray-300 dark:text-black dark:bg-white"
                />

                <View className="w-full flex flex-col mb-4 gap-2">
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#475569"
                        value={businessPassword}
                        onChangeText={setBusinessPassword}
                        secureTextEntry
                        className="rounded-xl p-4 bg-gray-300 text-black dark:text-black dark:bg-white"
                    />
                    <Link className="self-end text-yellow-600 dark:text-green-800 font-semibold" href="/(auth)/forgot-password">Forgot password ?</Link>
                </View>

                <View className="flex flex-col gap-2">
                    {/* Sign In Button */}
                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleSignIn}
                        className="bg-green-600 dark:bg-green-700 dark:disabled:bg-green-900 disabled:bg-green-800 rounded-xl py-3"
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <Text className="flex flex-col justify-center items-center text-center dark:text-gray-300">
                        Don’t have an account?{' '}
                        <Link className="font-semibold underline text-green-600 dark:text-green-800" href="/(auth)/signup">
                            Sign Up
                        </Link>
                    </Text>
                </View>
            </MotiView>
        </View>
    )
}

export default SignIn