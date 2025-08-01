import React, { useEffect, useMemo, useState } from "react";
import { Customer } from "~/types";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Toast from "react-native-root-toast";
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Plus, Search } from "lucide-react-native";
import { ActivityIndicator } from "../nativewindui/ActivityIndicator";
import { addToSaleData, setSaleData } from "./saleData";
import { useSaleStore } from "~/stores/useSaleStore";

const StepTwo = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [customers, setCustomers] = useState<Customer[] | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<string>("cash");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [newCustomerPhone, setNewCustomerPhone] = useState("");
    const [addingLoading, setAddingLoading] = useState(false);
    const [addingError, setAddingError] = useState<string | null>(null);

    const id = JSON.parse(SecureStore.getItem("session") || "{}").id;

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/customers`,
                    { params: { id } }
                );
                setCustomers(res.data);
            } catch (e) {
                console.error("Error fetching customers:", e);
                setError("Failed to load customers");
                Toast.show("An error occurred while getting customers", {
                    backgroundColor: "red",
                    textColor: "white",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [id]);

    const handleSearch = async (value: string) => {
        setSearchTerm(value);
        setLoading(true);
        setError(null);

        try {
            if (searchTerm !== "") {
                const res = await axios.get(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/customers/search`,
                    { params: { searchTerm: value, id } }
                );

                setCustomers(res.data);
            }
        } catch (e) {
            console.error("Error during customer search:", e);
            setError("Search failed. Please try again.");
            Toast.show("Search failed. Please try again later", {
                backgroundColor: "red",
                textColor: "white",
            });
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = useMemo(
        () => [
            { id: "1", label: "Cash", value: "cash" },
            { id: "2", label: "Mobile Money (Ecocash, OneMoney)", value: "mobile" },
            { id: "3", label: "Card", value: "card" },
        ],
        []
    );

    const handleAddCustomer = async () => {
        if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
            setAddingError("Please fill out all fields.");
            return;
        }

        setAddingLoading(true);
        setAddingError(null);

        try {
            const res = await axios.post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tengapos/customers`,
                {
                    name: newCustomerName.trim(),
                    phone: newCustomerPhone.trim(),
                    id,
                }
            );

            setCustomers((prev) => (prev ? [res.data, ...prev] : [res.data]));
            setModalVisible(false);
            setNewCustomerName("");
            setNewCustomerPhone("");
        } catch (e) {
            console.error("Error adding customer:", e);
            setAddingError("Failed to add customer. Please try again.");
            Toast.show("Failed to add customer. Please try again.", {
                backgroundColor: "red",
                textColor: "white",
            });
        } finally {
            setAddingLoading(false);
        }
    };

    const setCustomerId = useSaleStore(state => state.setCustomerId);
    const setPaymentMethod = useSaleStore(state => state.setPaymentMethod);

    console.log("Customers :", customers);

    return (
        <ScrollView>
            <View className="flex-1 items-center px-4">
                {/* Search Input */}
                <View className="flex flex-col w-full gap-2 mt-4">
                    <View className="flex flex-row items-center bg-gray-200 dark:bg-gray-800 rounded-xl px-4 py-2">
                        <Search size={20} color="#6b7280" />
                        <TextInput
                            value={searchTerm}
                            onChangeText={handleSearch}
                            placeholder="Search customers..."
                            placeholderTextColor="#6b7280"
                            className="flex-1 ml-2 text-base text-black dark:text-white"
                        />
                    </View>
                </View>

                {/* Add Customer */}
                <View className="flex flex-row items-center justify-between w-full gap-2 py-4 mt-4">
                    <Text className="font-medium text-base text-gray-700 dark:text-gray-500">Add new customer</Text>
                    <Pressable onPress={() => setModalVisible(true)}>
                        <Plus color="#374151" />
                    </Pressable>
                </View>

                {/* Customers List */}
                <View className="flex flex-col w-full py-4 mt-4">
                    <Text className="font-semibold text-lg mb-2 dark:text-white">Customers</Text>

                    {loading && <ActivityIndicator size="large" color="#3b82f6" />}

                    {!loading && error && (
                        <Text className="text-red-600 dark:text-red-400">{error}</Text>
                    )}

                    {!loading && customers && customers.length === 0 && (
                        <Text className="text-gray-500 dark:text-gray-400">No customers found.</Text>
                    )}

                    {!loading && customers && customers.length > 0 && (
                        <ScrollView className="max-h-48">
                            {customers.map((customer, index) => {
                                const isSelected = selectedCustomer?.id === customer.id;
                                return (
                                    <Pressable
                                        key={index}
                                        onPress={() => {
                                            setCustomerId(customer.id);
                                            setSelectedCustomer(customer);
                                        }}
                                        className={`py-3 px-4 mb-2 rounded-xl border ${isSelected
                                            ? "bg-green-100 dark:bg-green-800 border-green-500"
                                            : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                            }`}
                                    >
                                        <Text
                                            className={`text-base ${isSelected ? "text-green-600 dark:text-lime-200" : "text-black dark:text-white"
                                                }`}
                                        >
                                            {customer.name} - {customer.phone}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* Payment Methods */}
                <View className="flex flex-col w-full gap-4 py-4 mt-4">
                    <Text className="font-semibold text-lg mb-2 ark:text-white">Payment Method</Text>
                    {paymentMethods.map(({ id, label, value }) => (
                        <Pressable
                            key={id}
                            onPress={() => {
                                // Update the sale data with the payment method
                                setPaymentMethod(value);
                                setSelectedPayment(value);
                            }}
                            className={`flex flex-row justify-between items-center w-full p-4 rounded-xl border ${selectedPayment === value
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                                : "border-gray-400 dark:border-gray-700 bg-transparent"
                                }`}
                        >
                            <Text className="text-black dark:text-white">{label}</Text>
                            <View
                                className={`w-5 h-5 flex justify-center items-center rounded-full border-2 ${selectedPayment === value
                                    ? "border-blue-600 bg-blue-600"
                                    : "border-gray-400 bg-transparent"
                                    }`}
                            >
                                <View className="w-2 h-2 rounded-full bg-white" />
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Add Customer Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        if (!addingLoading) setModalVisible(false);
                    }}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        className="flex-1 justify-center items-center bg-black bg-opacity-50 px-4"
                    >
                        <View className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 shadow-lg">
                            <Text className="text-xl font-semibold mb-4 text-black dark:text-white">
                                Add New Customer
                            </Text>

                            <TextInput
                                placeholder="Name"
                                placeholderTextColor="#6b7280"
                                value={newCustomerName}
                                onChangeText={setNewCustomerName}
                                editable={!addingLoading}
                                className="border border-gray-400 rounded-md px-3 py-2 mb-4 text-black dark:text-white"
                            />

                            <TextInput
                                placeholder="Phone Number"
                                placeholderTextColor="#6b7280"
                                keyboardType="phone-pad"
                                value={newCustomerPhone}
                                onChangeText={setNewCustomerPhone}
                                editable={!addingLoading}
                                className="border border-gray-400 rounded-md px-3 py-2 mb-4 text-black dark:text-white"
                            />

                            {addingError && (
                                <Text className="text-red-600 dark:text-red-400 mb-2">{addingError}</Text>
                            )}

                            <View className="flex flex-row justify-end gap-2">
                                <Pressable
                                    onPress={() => setModalVisible(false)}
                                    disabled={addingLoading}
                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md"
                                >
                                    <Text className="text-black dark:text-white">Cancel</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleAddCustomer}
                                    disabled={addingLoading}
                                    className="px-4 py-2 bg-blue-600 rounded-md"
                                >
                                    <Text className="text-white">Add</Text>
                                </Pressable>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </ScrollView>
    );
};

export default StepTwo;