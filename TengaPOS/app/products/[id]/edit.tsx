import { Stack, useLocalSearchParams, router } from 'expo-router'
import { View, Text, TextInput, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import Toast from 'react-native-root-toast'
import { Upload } from 'lucide-react-native'

const EditProduct = () => {
    const { id } = useLocalSearchParams()

    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [priceUSD, setPriceUSD] = useState('')
    const [priceZIG, setPriceZIG] = useState('')
    const [stock, setStock] = useState('')
    const [imageUri, setImageUri] = useState<string | null>(null)
    const [imageBase64, setImageBase64] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    const getProduct = async () => {
        try {
            const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/products?productId=${id}`)
            const product = res.data
            setProductName(product.name)
            setDescription(product.description || '')
            setPriceUSD(product.price.toString())
            setPriceZIG(product.zigPrice?.toString() || '')
            setStock(product.inventory.toString())
            setImageUri(product.imageUrl)
        } catch (e) {
            console.error("Failed to fetch product:", e)
            Toast.show("Failed to fetch product data", { backgroundColor: 'red' })
        } finally {
            setInitialLoading(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, [id])

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                base64: true,
            })

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0]
                setImageUri(asset.uri)
                setImageBase64(asset.base64 || null)
            }
        } catch (e) {
            console.error("Image picker error:", e)
            Toast.show("Failed to pick image", { backgroundColor: 'red' })
        }
    }

    const updateProduct = async () => {
        if (!productName || !priceUSD || !stock) {
            Toast.show("Please fill all required fields", { backgroundColor: 'red' })
            return
        }

        setLoading(true)

        try {
            const payload = {
                name: productName,
                description,
                price: parseFloat(priceUSD),
                zigPrice: parseFloat(priceZIG || '0'),
                inventory: parseInt(stock, 10),
                imageBase64: imageBase64 || undefined, // Only send if new image selected
            }

            await axios.put(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/products/${id}`, payload)

            Toast.show("Product updated successfully!", { backgroundColor: 'green' })
            router.back()
        } catch (e) {
            console.error("Update error:", e)
            Toast.show("Failed to update product", { backgroundColor: 'red' })
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="text-gray-500 mt-4">Loading product...</Text>
            </View>
        )
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="bg-white px-4 py-6 flex-1">
            <Stack.Screen options={{ headerTitle: "Edit Product", headerTitleAlign: "center" }} />

            {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-full h-64 mb-4 rounded-xl" resizeMode="cover" />
            ) : (
                <View className="w-full h-64 bg-gray-100 rounded-xl mb-4 justify-center items-center">
                    <Upload color="#888" size={40} />
                    <Text className="text-gray-500 mt-2">No image</Text>
                </View>
            )}

            <Pressable onPress={pickImage} className="bg-indigo-100 p-3 rounded-xl mb-6 items-center">
                <Text className="text-indigo-600 font-medium">Change Image</Text>
            </Pressable>

            <View className="gap-4">
                <TextInput
                    value={productName}
                    onChangeText={setProductName}
                    placeholder="Product Name"
                    className="border border-gray-300 px-4 py-3 rounded-xl text-base"
                />
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    multiline
                    numberOfLines={3}
                    className="border border-gray-300 px-4 py-3 rounded-xl text-base"
                />
                <TextInput
                    value={priceUSD}
                    onChangeText={setPriceUSD}
                    placeholder="Price in USD"
                    keyboardType="numeric"
                    className="border border-gray-300 px-4 py-3 rounded-xl text-base"
                />
                <TextInput
                    value={priceZIG}
                    onChangeText={setPriceZIG}
                    placeholder="Price in ZIG (optional)"
                    keyboardType="numeric"
                    className="border border-gray-300 px-4 py-3 rounded-xl text-base"
                />
                <TextInput
                    value={stock}
                    onChangeText={setStock}
                    placeholder="Stock"
                    keyboardType="numeric"
                    className="border border-gray-300 px-4 py-3 rounded-xl text-base"
                />
            </View>

            <Pressable
                onPress={updateProduct}
                disabled={loading}
                className="bg-indigo-500 p-4 mt-6 rounded-xl items-center justify-center"
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-semibold text-lg">Save Changes</Text>
                )}
            </Pressable>
        </ScrollView>
    )
}

export default EditProduct