// app/(tabs)/inventory/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, Pressable, Image } from 'react-native';
import { useColorScheme } from 'nativewind';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { formatCurrency } from 'react-native-format-currency';
import { Check, PackageX, Plus } from 'lucide-react-native';
import Toast from 'react-native-root-toast';
import { router } from 'expo-router';

type Product = {
  id: string;
  name: string;
  description: string | null;
  inventory: number;
  price: number;
  imageUrl: string | null;
  totalSales: number;
};

type LocalInventoryMap = {
  [productId: string]: number;
};

const InventoryPage = () => {
  const { colorScheme } = useColorScheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'inventory' | 'sales'>('inventory');
  const [localInventory, setLocalInventory] = useState<LocalInventoryMap>({});
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinessId = async () => {
      const session = await SecureStore.getItemAsync("session");
      const parsed = JSON.parse(session || "{}");
      if (parsed?.id) {
        setBusinessId(parsed.id);
      } else {
        Alert.alert("Error", "Business session not found");
        setLoading(false);
      }
    };
    loadBusinessId();
  }, []);

  useEffect(() => {
    if (!businessId) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/products?businessId=${businessId}`);
        setProducts(response.data);
        setFilteredProducts(response.data);

        const inventoryMap: LocalInventoryMap = {};
        response.data.forEach((product: Product) => {
          inventoryMap[product.id] = product.inventory;
        });
        setLocalInventory(inventoryMap);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [businessId]);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'sales') return b.totalSales - a.totalSales;
      return b.inventory - a.inventory;
    });

    setFilteredProducts(result);
  }, [searchQuery, sortBy, products]);

  const changeInventory = (productId: string, delta: number) => {
    setLocalInventory(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + delta,
    }));
  };

  const updateInventory = async (productId: string) => {
    const newInventory = localInventory[productId];
    const originalInventory = products.find(p => p.id === productId)?.inventory || 0;
    const adjustment = newInventory - originalInventory;

    if (adjustment === 0) return;

    Alert.alert(
      'Confirm Update',
      `New inventory will be ${newInventory}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setProducts(prev =>
                prev.map(product =>
                  product.id === productId
                    ? { ...product, inventory: newInventory }
                    : product
                )
              );

              await axios.put(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tangabiz/products/inventory`, {
                productId,
                adjustment,
                businessId,
              });

              Toast.show('Inventory updated successfully', {
                backgroundColor: 'green',
                textColor: 'white',
                duration: Toast.durations.SHORT,
                hideOnPress: true,
                position: Toast.positions.BOTTOM,
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to update inventory');
              setLocalInventory(prev => ({ ...prev, [productId]: originalInventory }));
              setProducts(prev =>
                prev.map(product =>
                  product.id === productId
                    ? { ...product, inventory: originalInventory }
                    : product
                )
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      {/* Search & Sort */}
      <View className="mb-4">
        <TextInput
          placeholder="Search products..."
          className={`p-3 rounded-lg ${colorScheme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View className="flex-row justify-around mt-3">
          {['inventory', 'sales'].map(option => (
            <Pressable
              key={option}
              onPress={() => setSortBy(option as 'inventory' | 'sales')}
              className={`px-4 py-2 rounded-full ${sortBy === option ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <Text className="text-white capitalize">Sort by {option}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView>
        {filteredProducts.length === 0 ? (
          <View className="items-center justify-center py-20">
            <PackageX strokeWidth={1.5} size={120} color="gray" className="mb-4" />
            <Text className="text-gray-500 text-lg mb-4">No matching products found.</Text>
            <Pressable onPress={() => router.push('/actions/new-product')} className="bg-indigo-500 p-4 rounded-xl flex-row items-center gap-2">
              <Plus size={20} color="white" />
              <Text className="text-white font-bold">Add Product</Text>
            </Pressable>
          </View>
        ) : (
          filteredProducts.map(product => {
            const [formattedPrice] = formatCurrency({ amount: product.price, code: "USD" });
            const currentInventory = localInventory[product.id] ?? product.inventory;
            const hasChanges = currentInventory !== product.inventory;

            return (
              <View key={product.id} className="mb-4 border border-indigo-400 bg-indigo-200 dark:bg-slate-800 dark:border-blue-800 rounded-xl">
                <Image
                  source={{ uri: product.imageUrl || "https://via.placeholder.com/300x300.png?text=No+Image" }}
                  className="w-full h-80 rounded-tr-xl rounded-tl-xl"
                  resizeMode="cover"
                />
                <View className="p-4">
                  <Text className="text-xl font-bold dark:text-white">{product.name}</Text>
                  <Text className="text-gray-500 text-sm">{product.description || 'No description'}</Text>
                  <Text className="text-3xl font-bold dark:text-white mt-4 mb-2 text-green-500">{formattedPrice}</Text>

                  <View className="mt-2 flex-row gap-2">
                    <Text className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full">{currentInventory} in stock</Text>
                    <Text className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full">{product.totalSales} sold</Text>
                  </View>

                  {/* Inventory Controls */}
                  <View className="flex-row justify-between mt-4 space-x-2">
                    <View className="flex-row gap-2">
                      <Pressable onPress={() => changeInventory(product.id, -10)} className="bg-indigo-500 p-4 rounded-full">
                        <Text className="text-white">-10</Text>
                      </Pressable>
                      <Pressable onPress={() => changeInventory(product.id, -1)} className="bg-indigo-400 p-4 rounded-full">
                        <Text className="text-white">-1</Text>
                      </Pressable>
                    </View>
                    <View className="flex-row gap-2">
                      <Pressable onPress={() => changeInventory(product.id, 1)} className="bg-green-400 p-4 rounded-full">
                        <Text className="text-white">+1</Text>
                      </Pressable>
                      <Pressable onPress={() => changeInventory(product.id, 10)} className="bg-green-500 p-4 rounded-full">
                        <Text className="text-white">+10</Text>
                      </Pressable>
                    </View>
                  </View>

                  {hasChanges && (
                    <Pressable
                      onPress={() => updateInventory(product.id)}
                      className="flex-row items-center justify-center mt-4 bg-green-600 py-3 rounded-full"
                    >
                      <Check color="white" size={20} className="mr-2" />
                      <Text className="text-white font-bold">Save Changes</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default InventoryPage;
