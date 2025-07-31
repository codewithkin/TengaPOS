import { Stack } from 'expo-router'
import { Upload } from 'lucide-react-native'
import { View, Text, TextInput, Pressable } from 'react-native'

const NewPost = () => {
    return (
        <View>
            <Stack.Screen
                options={{
                    headerTitle: "Add New Product",
                    headerTitleAlign: "center"
                }}
            />
            <View className="flex flex-col gap-4 p-4 pt-8">
                <TextInput
                    placeholder="Product Name"
                    className="bg-gray-300 dark:bg-gray-800 light:gray-400 rounded-xl p-4"
                />

                <TextInput
                    placeholder="Description"
                    numberOfLines={20}
                    className="bg-gray-300 dark:bg-gray-800 rounded-xl p-4 min-h-[100px] text-start"
                />

                <TextInput
                    placeholder="Selling Price (USD)"
                    className="bg-gray-300 dark:bg-gray-800 rounded-xl p-4"
                />

                <TextInput
                    placeholder="Selling Price (ZiG)"
                    className="bg-gray-300 dark:bg-gray-800 rounded-xl p-4"
                />

                <TextInput
                    placeholder="Stock"
                    className="bg-gray-300 dark:bg-gray-800 text-gray-600 rounded-xl p-4"
                    placeholderClassName='text-gray-800 dark:text-gray-400'
                />

                <Pressable
                    className="p-4 rounded-xl border border-dashed border-gray-800 light:gray-400 flex flex-col justify-center items-center gap-2 w-full"
                >
                    <View className="flex flex-col justify-center items-center rounded-full p-4 bg-green-600 self-center">
                        <Upload color="white" size={36} />
                    </View>
                    <View className="flex flex-col items-center justify-center">
                        <Text className="text-gray-800 light:gray-400 dark:text-white text-lg font-semibold">Upload an image of the product</Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-xs">Click <Text className="text-yellow-500 font-semibold">here</Text> to select an image from your gallery</Text>
                    </View>
                </Pressable>

                <Pressable className="rounded-xl dark:bg-yellow-600 p-4 flex flex-row justify-center items-center">
                    <Text className="text-white font-medium">
                        Add Product
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default NewPost