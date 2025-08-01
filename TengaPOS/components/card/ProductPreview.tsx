import { ImageIcon } from "lucide-react-native";
import { FlexStyle, Image, Text, View } from "react-native";
import { Product } from "~/types";

export default function ProductPreview({ product, cardWidth }: { product: Product, cardWidth: any }) {
    return (
        <View
            key={product.id}
            className="p-2 b-2"
            style={{ width: cardWidth }}
        >
            {
                product.imageUrl ? (
                    <Image
                        className="w-full h-36 rounded-xl mb-2"
                        source={{
                            uri: product?.imageUrl || 'https://via.placeholder.com/150?text=No+Image',
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View className="rounded-xl bg-gray-400 w-full h-36 flex flex-col justify-center items-center">
                        <ImageIcon color="white" size={40} strokeWidth={1.8} />
                    </View>
                )
            }
            <Text className="text-black dark:text-white font-medium text-base">
                {product.name}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 text-sm">
                ${product.price}
            </Text>
        </View>
    )
}