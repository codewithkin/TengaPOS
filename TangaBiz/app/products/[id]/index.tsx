import { Link, router, Stack, useLocalSearchParams } from 'expo-router'
import { View, Text, Image, ScrollView, Pressable } from 'react-native'
import Toast from "react-native-root-toast"
import axios from "axios"
import { useEffect, useState } from 'react'
import { Skeleton } from 'moti/skeleton'
import { MotiView, AnimatePresence } from 'moti'
import { ImageIcon, ServerCrash } from 'lucide-react-native'

const ProductPage = () => {
    const { id } = useLocalSearchParams()
    const [product, setProduct] = useState<any | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const getProductData = async () => {
        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/products?productId=${id}`)
            setProduct(res.data)
        } catch (e) {
            console.log("An error occurred while fetching product data: ", e)
            setError(true)
            Toast.show(
                "An error occurred while fetching product data, please try again later",
                {
                    backgroundColor: "red",
                    textColor: "white"
                }
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductData()
    }, [id])

    console.log("Product: ", product);

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            className="bg-white flex-1"
        >
            <Stack.Screen
                options={{
                    headerTitle: "Product Details",
                    headerTitleAlign: "center"
                }}
            />

            {/* 🔄 Loading Skeleton */}
            {loading && (
                <View className="gap-4 px-4 py-6">
                    <Skeleton height={200} width={"100%"} radius="square" colorMode="light" />
                    <Skeleton height={30} width={"80%"} radius="square" colorMode="light" />
                    <Skeleton height={20} width={"60%"} radius="square" colorMode="light" />
                    <Skeleton height={20} width={"90%"} radius="square" colorMode="light" />
                </View>
            )}

            {/* ❌ Error Content */}
            {!loading && error && (
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="mt-10 flex flex-col h-full justify-between px-4 py-6"
                >
                    <View className="flex flex-col gap-2 items-center justify-center">
                        <ServerCrash color="#6b7280" size={120} strokeWidth={1.2} />
                        <Text className="text-center text-lg font-semibold">
                            We couldn't get the data for this product
                        </Text>
                        <Text className="text-gray-500 text-center">
                            Is this error persisting?{" "}
                            <Link className="text-green-600 font-semibold underline" href="emailto://kinzinzombe07@gmail.com">
                                Contact the developer
                            </Link>
                        </Text>
                    </View>

                    <Pressable className="rounded-xl p-4 mt-6 bg-yellow-500 flex flex-row justify-center items-center">
                        <Text className="text-white font-semibold">Go Home</Text>
                    </Pressable>
                </MotiView>
            )}

            {/* ✅ Product Content */}
            {!loading && !error && product && (
                <AnimatePresence>
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 500 }}
                        className="gap-4"
                    >
                        {product?.imageUrl ? (
                            <Image
                                source={{ uri: product?.imageUrl }}
                                className="w-full h-64"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="bg-indigo-100 dark:bg-indigo-200 flex flex-col justify-center items-center h-64">
                                <ImageIcon color="#6366f1" size={64} />
                            </View>
                        )}

                        <View className="flex flex-col gap-4 px-4 py-6">
                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: 100 }}
                            >
                                <Text className="text-black dark:text-white text-3xl font-semibold">
                                    {product.name}
                                </Text>
                                <Text className="text-gray-700 dark:text-gray-400 text-base">
                                    {product.description || "No description provided."}
                                </Text>
                            </MotiView>

                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: 200 }}
                                className="flex flex-row w-full items-center justify-between"
                            >
                                <Text className="text-gray-800 dark:text-gray-200 text-2xl font-semibold">
                                    ${product.price}
                                </Text>
                                <View className="flex flex-row gap-2 items-center">
                                    <View className="rounded-full bg-green-600 self-start py-2 px-6">
                                        <Text className="text-sm text-white font-medium">
                                            {product.inventory} items in store
                                        </Text>
                                    </View>
                                    <View className="rounded-full border-indigo-500 border self-start py-2 px-6">
                                        <Text className="text-sm font-medium text-indigo-500">
                                            {product._count.sales} sales
                                        </Text>
                                    </View>
                                </View>
                            </MotiView>

                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: 300 }}
                            >
                                <Pressable
                                    onPress={() => {
                                        router.push("/products/[id]/edit");
                                    }}
                                    className="rounded-xl bg-indigo-500 mt-4 p-4 flex flex-col justify-center items-center">
                                    <Text className="font-semibold text-lg text-white">Edit Product</Text>
                                </Pressable>
                            </MotiView>
                        </View>
                    </MotiView>
                </AnimatePresence>
            )}
        </ScrollView>
    )
}

export default ProductPage