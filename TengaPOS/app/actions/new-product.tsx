import { Stack } from 'expo-router'
import { Store, Upload } from 'lucide-react-native'
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    ActivityIndicator,
    ScrollView,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import Toast from 'react-native-root-toast'
import axios from 'axios'
import * as SecureStore from "expo-secure-store";

const generateFilename = (type: string) => {
    const ext = type.split('/')[1]
    return `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`
}

const NewProduct = () => {
    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [priceUSD, setPriceUSD] = useState('')
    const [priceZIG, setPriceZIG] = useState('')
    const [stock, setStock] = useState('')
    const [imageUri, setImageUri] = useState<string | null>(null)
    const [imageType, setImageType] = useState<string | null>(null)
    const [imageName, setImageName] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                base64: false,
            })

            if (!result.canceled && result.assets && result.assets[0]) {
                const asset = result.assets[0]
                setImageUri(asset.uri)
                setImageType(asset.type || 'image/jpeg')
                setImageName(generateFilename(asset.type || 'image/jpeg'))
            }
        } catch (error) {
            Toast.show('Failed to pick image.', { backgroundColor: 'red' })
            console.error('Image picker error:', error)
        }
    }


    axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/products`,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    const addProduct = async () => {
        if (!productName || !priceUSD || !stock || !imageUri || !imageType || !imageName) {
            Toast.show('Please fill all fields and select an image.', {
                backgroundColor: 'red',
            })
            return
        }

        setLoading(true)

        try {
            // Get the business' data
            const id = JSON.parse(SecureStore.getItem("session") || "{}").id;

            const formData = new FormData()
            formData.append('productName', productName);
            formData.append('id', id);
            formData.append('description', description)
            formData.append('priceUSD', priceUSD)
            formData.append('priceZIG', priceZIG)
            formData.append('stock', stock)

            formData.append('image', {
                uri: imageUri,
                name: imageName,
                type: imageType,
            } as any)

            await axios.post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/products`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            Toast.show('Product added successfully!', { backgroundColor: 'green' })

            setProductName('')
            setDescription('')
            setPriceUSD('')
            setPriceZIG('')
            setStock('')
            setImageUri(null)
            setImageType(null)
            setImageName(null)
        } catch (error) {
            console.error('Add product error:', error)
            Toast.show('Failed to add product.', { backgroundColor: 'red' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <View className="flex-1">
            <Stack.Screen
                options={{
                    headerTitle: 'Add New Product',
                    headerTitleAlign: 'center',
                }}
            />
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 32 }} className="flex-grow">
                <View className="flex flex-col gap-4">
                    <TextInput
                        placeholder="Product Name"
                        value={productName}
                        onChangeText={setProductName}
                        className="bg-gray-300 dark:bg-gray-800 dark:text-white rounded-xl p-4"
                    />

                    <TextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        className="bg-gray-300 dark:text-white dark:bg-gray-800 rounded-xl p-4 min-h-[100px] text-start text-base"
                        textAlignVertical="top"
                    />

                    <TextInput
                        placeholder="Selling Price (USD)"
                        value={priceUSD}
                        onChangeText={setPriceUSD}
                        keyboardType="numeric"
                        className="bg-gray-300 dark:text-white dark:bg-gray-800 rounded-xl p-4"
                    />

                    <TextInput
                        placeholder="Selling Price (ZiG)"
                        value={priceZIG}
                        onChangeText={setPriceZIG}
                        keyboardType="numeric"
                        className="bg-gray-300 dark:text-white dark:bg-gray-800 rounded-xl p-4"
                    />

                    <TextInput
                        placeholder="Stock"
                        value={stock}
                        onChangeText={setStock}
                        keyboardType="numeric"
                        className="bg-gray-300 dark:text-white dark:bg-gray-800 text-gray-600 rounded-xl p-4"
                    />

                    {!imageUri ? (
                        <Pressable
                            onPress={pickImage}
                            className="p-4 rounded-xl border border-dashed border-gray-800 dark:border-gray-400 flex flex-col justify-center items-center gap-2 w-full"
                        >
                            <View className="flex flex-col justify-center items-center rounded-full p-4 bg-green-600 self-center">
                                <Upload color="white" size={36} />
                            </View>
                            <View className="flex flex-col items-center justify-center">
                                <Text className="text-gray-800 dark:text-white text-lg font-semibold">
                                    Upload an image of the product
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-400 text-xs">
                                    Click <Text className="text-yellow-500 font-semibold">here</Text> to select an image from your gallery
                                </Text>
                            </View>
                        </Pressable>
                    ) : (
                        <Pressable onPress={pickImage} className="w-full">
                            <Image
                                source={{ uri: imageUri }}
                                className="w-full h-64 rounded-xl border border-gray-400"
                                resizeMode="cover"
                            />
                            <Text className="text-center text-gray-500 text-xs mt-2">Tap to change image</Text>
                        </Pressable>
                    )}

                    <Pressable
                        onPress={addProduct}
                        disabled={loading}
                        className="rounded-xl dark:bg-yellow-600 bg-yellow-600 p-4 flex flex-row justify-center items-center"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-medium">Add Product</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

export default NewProduct