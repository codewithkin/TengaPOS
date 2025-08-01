import * as SecureStore from "expo-secure-store";
import { Customer, Product } from "~/types";

export type SaleData = {
    id?: string;
    products?: Product[];
    customer?: Customer;
    paymentMethod?: string;
}

export function setSaleData(obj: SaleData) {
    // Update the secureStore entry
    SecureStore.setItem("saleData", JSON.stringify(obj));
    console.log(
        "Sale data: ",
        JSON.parse(SecureStore.getItem("saleData") || "{}")
    );
}

export function getSaleData() {
    console.log(
        "Sale data: ",
        JSON.parse(SecureStore.getItem("saleData") || "{}")
    );
    return JSON.parse(SecureStore.getItem("saleData") || "{}");
}

export function addToSaleData(obj: SaleData) {
    const existingData = getSaleData();
    console.log(
        "Sale data: ",
        JSON.parse(SecureStore.getItem("saleData") || "{}")
    );

    SecureStore.setItem(
        "saleData",
        JSON.stringify({
            ...obj,
            ...existingData,
        })
    );
}

export function removeFromSaleData({
    type,
    name,
}: {
    type: "product" | "customer";
    name: string;
}) {
    const existingData = getSaleData();

    if (type === "product") {
        const updatedProducts =
            existingData.products?.filter(
                (p: Product) => p.name.toLowerCase() !== name.toLowerCase()
            ) || [];
        existingData.products = updatedProducts;
    }

    if (type === "customer") {
        const updatedCustomers =
            existingData.customers?.filter(
                (c: Customer) => c.name.toLowerCase() !== name.toLowerCase()
            ) || [];
        existingData.customers = updatedCustomers;
    }

    SecureStore.setItem("saleData", JSON.stringify(existingData));
    console.log("Updated sale data: ", existingData);
}