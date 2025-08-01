import { create } from "zustand";

type SaleData = {
    productIds: string[];
    customerId: string;
    businessId: string;
    paymentMethod: string;
    setProductIds: (productIds: string[]) => void;
    addProductId: (productId: string) => void;
    removeProductId: (productId: string) => void;
    setCustomerId: (customerId: string) => void;
    setBusinessId: (businessId: string) => void;
    resetSale: () => void;
};

export const useSaleStore = create<SaleData>()((set) => ({
    productIds: [],
    customerId: "",
    businessId: "",
    paymentMethod: "",

    setProductIds: (productIds) => set({ productIds }),
    setPaymentMethod: (paymentMethod: string) => set({ paymentMethod }),
    addProductId: (productId) =>
        set((state) => ({
            productIds: [...state.productIds, productId],
        })),
    removeProductId: (productId) =>
        set((state) => ({
            productIds: state.productIds.filter((id) => id !== productId),
        })),
    setCustomerId: (customerId) => set({ customerId }),
    setBusinessId: (businessId) => set({ businessId }),
    resetSale: () =>
        set({
            productIds: [],
            customerId: "",
            businessId: "",
        }),
}));
