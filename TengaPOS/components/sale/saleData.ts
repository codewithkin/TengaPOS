import * as SecureStore from "expo-secure-store";

export function setSaleData(obj: any) {
    // Update the secureStore entry
    SecureStore.setItem("saleData", JSON.stringify(obj))
    console.log("Sale data: ", JSON.parse(SecureStore.getItem("saleData") || "{}"))
}

export function getSaleData() {
    console.log("Sale data: ", JSON.parse(SecureStore.getItem("saleData") || "{}"))
    return JSON.parse(SecureStore.getItem("saleData") || "{}");
}

export function addToSaleData(obj: any) {
    const existingData = getSaleData();
    console.log("Sale data: ", JSON.parse(SecureStore.getItem("saleData") || "{}"))

    SecureStore.setItem("saleData", JSON.stringify({
        ...obj,
        ...existingData
    }))
}