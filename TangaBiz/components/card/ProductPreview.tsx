import { ImageIcon, Minus, Plus } from "lucide-react-native";
import { Image, Text, View, Pressable } from "react-native";
import { useSaleStore } from "~/stores/useSaleStore";
import { Product } from "~/types";

export default function ProductPreview({
    product,
    cardWidth,
}: {
    product: {product: Product, quantity: number},
    cardWidth: any,
}) {

    const getProductQuantity = useSaleStore(state => state.getProductQuantity);
    const productQuantity = getProductQuantity(product.product);
    const increaseProductQuantity = useSaleStore(state => state.increaseProductQuantity);
    const decreaseProductQuantity = useSaleStore(state => state.decreaseProductQuantity);

    return (
        <View className="p-2 mb-2" style={{ width: cardWidth }}>
            {product.product.imageUrl ? (
                <Image
                    className="w-full h-36 rounded-xl mb-2"
                    source={{
                        uri: product.product.imageUrl || 'https://via.placeholder.com/150?text=No+Image',
                    }}
                    resizeMode="cover"
                />
            ) : (
                <View className="rounded-xl bg-gray-400 w-full h-36 flex flex-col justify-center items-center mb-2">
                    <ImageIcon color="white" size={40} strokeWidth={1.8} />
                </View>
            )}

            <Text className="text-black dark:text-white font-medium text-base">
                {product.product.name}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                ${product.product.price}
            </Text>

            <View className="flex flex-row items-center justify-between">
                <Pressable className="p-2 bg-yellow-200 text-yellow-600 rounded-full" onPress={() => decreaseProductQuantity(product.product)}>
                    <Minus size={18} color="black" />
                </Pressable>
                <Text className="text-black dark:text-white font-medium text-base">
                    {productQuantity}
                </Text>
                <Pressable className="p-2 bg-yellow-200 text-yellow-600 rounded-full" onPress={() => increaseProductQuantity(product.product)}>
                    <Plus size={18} color="black" />
                </Pressable>
            </View>
        </View>
    );
}