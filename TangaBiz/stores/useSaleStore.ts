import { create } from "zustand";

type SaleData = {
    productIds: string[];
    customerId: string;
    businessId: string;
    paymentMethod: string;
    total: number;
    zigTotal: number;
    setProductIds: (productIds: string[]) => void;
    setPaymentMethod: (paymentMethod: string) => void;
    setTotal: (total: number) => void;
    setZigTotal: (zigTotal: number) => void;
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
    total: 0,
    zigTotal: 0,

    setProductIds: (productIds) => set({ productIds }),
    setPaymentMethod: (paymentMethod: string) => set({ paymentMethod }),
    setTotal: (total: number) => set({ total }),
    setZigTotal: (zigTotal: number) => set({ zigTotal }),
    addProductId: (productId: string) =>
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
            paymentMethod: "",
            total: 0,
            zigTotal: 0,
        }),
}));
