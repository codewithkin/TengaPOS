export interface Business {
    id: string;
    ownerName: string;
    businessName: string;
    businessEmail: string;
    businessLogo?: string;

    password: string;
    verified: boolean;
    plan?: 'Basic' | 'Pro' | 'Unlimited';
    phoneNumber?: string;
    location?: string;
    isActive: boolean;
    slug?: string;

    createdAt: string;

    users?: never; // Excluded as per request
    products?: Product[];
    customers?: Customer[];
    sales?: Sale[];
}

export interface Product {
    id: string;

    name: string;
    description?: string;

    inventory: number;
    price: number;
    zigPrice: number;
    imageUrl?: string;
    quantity: number;

    businessId: string;
    business?: Business;

    createdAt: string;
    updatedAt: string;

    sales?: Sale[];
}

export interface Customer {
    id: string;

    name: string;
    phone?: string;

    totalSpent: number;
    totalSpentZig: number;

    businessId: string;
    business?: Business;

    createdAt: string;
    updatedAt: string;

    sales?: Sale[];
}

export interface Sale {
    id: string;

    total: number;
    zigTotal: number;

    paymentType: string;

    businessId: string;
    business?: Business;

    customerId?: string;
    customer?: Customer;

    createdAt: string;

    items?: Product[];
}

export interface SaleItem {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    saleId: string;
}