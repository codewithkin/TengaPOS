import { create } from "zustand";

type Product = {
  id: string;
  quantity: number;
};

type SaleData = {
  products: {product: Product, quantity: number}[];
  customerId: string;
  businessId: string;
  paymentMethod: string;
  total: number;
  zigTotal: number;

  setProducts: (products: {product: Product, quantity: number}[]) => void;
  increaseProductQuantity: (product: Product) => void;
  decreaseProductQuantity: (product: Product) => void;
  updateProductQuantity: (product: Product, quantity: number) => void;

  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;

  setPaymentMethod: (paymentMethod: string) => void;
  setTotal: (total: number) => void;
  setZigTotal: (zigTotal: number) => void;

  setCustomerId: (customerId: string) => void;
  setBusinessId: (businessId: string) => void;

  resetSale: () => void;
  getProductQuantity: (product: Product) => number;
};

export const useSaleStore = create<SaleData>()((set, get) => ({
  products: [],
  customerId: "",
  businessId: "",
  paymentMethod: "",
  total: 0,
  zigTotal: 0,

  setProducts: (products) => set(() => ({ products })),
  increaseProductQuantity: (product) =>
    set((state) => {
      const existing = state.products.find((p) => p.product.id === product.id);
      if (existing) {
        return {
          products: state.products.map((p) =>
            p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        };
      }
      return {
        products: [...state.products, { product: product, quantity: 1 }],
      };
    }),

  decreaseProductQuantity: (product) =>
    set((state) => {
      const productData = state.products.find((p) => p.product.id === product.id);
      if (!productData) return {};
      if (productData.quantity <= 1) {
        return {
          products: state.products.filter((p) => p.product.id !== product.id),
        };
      }
      return {
        products: state.products.map((p) =>
          p.product.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        ),
      };
    }),

  updateProductQuantity: (product, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          products: state.products.filter((p) => p.product.id !== product.id),
        };
      }
      return {
        products: state.products.map((p) =>
          p.product.id === product.id ? { ...p, quantity } : p
        ),
      };
    }),

  addProduct: (product) =>
    set((state) => {
      const exists = state.products.some((p) => p.product.id === product.id);
      if (exists) {
        return {
          products: state.products.map((p: any) =>
            p.product.id === product.id
              ? { ...p, quantity: p.quantity + product.quantity }
              : p
          ),
        };
      }
      return {
        products: [...state.products, product],
      };
    }),

  removeProduct: (product) =>
    set((state) => ({
      products: state.products.filter((p) => p.product.id !== product.id),
    })),

  setPaymentMethod: (paymentMethod) => set(() => ({ paymentMethod })),
  setTotal: (total) => set(() => ({ total })),
  setZigTotal: (zigTotal) => set(() => ({ zigTotal })),

  setCustomerId: (customerId) => set(() => ({ customerId })),
  setBusinessId: (businessId) => set(() => ({ businessId })),

  resetSale: () =>
    set(() => ({
      products: [],
      customerId: "",
      businessId: "",
      paymentMethod: "",
      total: 0,
      zigTotal: 0,
    })),

  getProductQuantity: (product) => {
    const productData = get().products.find((p) => p.product.id === product.id);
    return productData?.quantity ?? 0;
  },
}));