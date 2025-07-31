import { Stack } from 'expo-router'
import { Upload } from 'lucide-react-native'
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

const R2_BUCKET_NAME = 'tengapos-object-storage-ajcxq'
const R2_ENDPOINT = 'https://f6d1d15e6f0b37b4b8fcad3c41a7922d.r2.cloudflarestorage.com'
const R2_ACCESS_KEY = '0191009d0e80e1c4f036121122a4b058'
const R2_SECRET_KEY = 'eeba2759e674ff54b04b446090e97651305008cec640476f1d2440c1e2721c7c'

const generateFilename = (type: string) => {
    const ext = type.split('/')[1]
    return `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`
}

const NewPost = () => {
    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [priceUSD, setPriceUSD] = useState('')
    const [priceZIG, setPriceZIG] = useState('')
    const [stock, setStock] = useState('')
    const [imageUri, setImageUri] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const uploadToR2 = async (blob: Blob, filename: string) => {
        const url = `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${filename}`

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': blob.type,
                'x-amz-acl': 'public-read',
                Authorization:
                    'Basic ' +
                    btoa(`${R2_ACCESS_KEY}:${R2_SECRET_KEY}`),
            },
            body: blob,
        })

        if (!res.ok) {
            console.log(res);

            throw new Error('Failed to upload image');
        }

        return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${filename}`
    }

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 1,
                base64: false,
            })

            if (!result.canceled && result.assets && result.assets[0]?.uri) {
                const uri = result.assets[0].uri
                setImageUri(uri)

                const response = await fetch(uri)
                const blob = await response.blob()

                const filename = generateFilename(blob.type)

                Toast.show('Uploading image...', { backgroundColor: '#444' })

                const uploadedUrl = await uploadToR2(blob, filename)

                setImageUrl(uploadedUrl)
                Toast.show('Image uploaded successfully!', { backgroundColor: 'green' })
            }
        } catch (error) {
            Toast.show('Image upload failed.', { backgroundColor: 'red' })
            console.error('Upload error:', error)
        }
    }

    const addProduct = async () => {
        setLoading(true)

        try {
            // Simulated request
            await new Promise((resolve) => setTimeout(resolve, 2000))

            Toast.show('Product added successfully!', {
                backgroundColor: 'green',
            })

            setProductName('')
            setDescription('')
            setPriceUSD('')
            setPriceZIG('')
            setStock('')
            setImageUri(null)
            setImageUrl(null)
        } catch (error) {
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
                        className="bg-gray-300 dark:bg-gray-800 rounded-xl p-4"
                    />

                    <TextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        className="bg-gray-300 dark:bg-gray-800 rounded-xl p-4 min-h-[100px] text-start text-base"
                        textAlignVertical="top"
                    />

                    <TextInput
                        placeholder="Selling Price (USD)"
                        value={priceUSD}
                        onChangeText={setPriceUSD}
                        keyboardType="numeric"
                        className="bg-gray-300 dark:bg-gray-800 rounded-xl p-4"
                    />

                    <TextInput
                        placeholder="Selling Price (ZiG)"
                        value={priceZIG}
                        onChangeText={setPriceZIG}
                        keyboardType="numeric"
                        className="bg-gray-300 dark:bg-gray-800 rounded-xl p-4"
                    />

                    <TextInput
                        placeholder="Stock"
                        value={stock}
                        onChangeText={setStock}
                        keyboardType="numeric"
                        className="bg-gray-300 dark:bg-gray-800 text-gray-600 rounded-xl p-4"
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

export default NewPost