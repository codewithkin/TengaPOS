import { ImageIcon, Plus, Trash } from "lucide-react-native";
import { Image, Text, View, Pressable } from "react-native";
import { Product } from "~/types";

export default function ProductPreview({
    product,
    cardWidth,
    selected,
    onToggleSelect
}: {
    product: Product,
    cardWidth: any,
    selected: boolean,
    onToggleSelect: () => void
}) {
    return (
        <View className="p-2 mb-2" style={{ width: cardWidth }}>
            {product.imageUrl ? (
                <Image
                    className="w-full h-36 rounded-xl mb-2"
                    source={{
                        uri: product.imageUrl || 'https://via.placeholder.com/150?text=No+Image',
                    }}
                    resizeMode="cover"
                />
            ) : (
                <View className="rounded-xl bg-gray-400 w-full h-36 flex flex-col justify-center items-center mb-2">
                    <ImageIcon color="white" size={40} strokeWidth={1.8} />
                </View>
            )}

            <Text className="text-black dark:text-white font-medium text-base">
                {product.name}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                ${product.price}
            </Text>

            <Pressable
                onPress={onToggleSelect}
                className={`rounded-xl p-4 flex flex-row items-center justify-center gap-1 ${selected ? "bg-red-500" : "border border-yellow-500"}`}
            >
                {
                    selected ? (
                        <Trash size={18} color="white" />
                    ) : (
                        <Plus size={18} color="#eab308" />
                    )
                }
                <Text className={`font-medium ${selected ? "text-white" : "text-yellow-500"}`}>{selected ? "Remove" : "Add"}</Text>
            </Pressable>
        </View>
    );
}