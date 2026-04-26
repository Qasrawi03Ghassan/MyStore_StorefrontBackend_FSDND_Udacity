export type Product = {
    id?: number;
    name: string;
    price: string;
    category: string;
};
export declare const getProducts: () => Promise<Product[]>;
export declare const showProduct: (productId: number) => Promise<Product>;
export declare const createProduct: (product: Product) => Promise<Product>;
export declare const getProductsByCategory: (productCategory: string) => Promise<Product[]>;
export declare const getTop5MostPopularProducts: () => Promise<Product[]>;
//# sourceMappingURL=product.d.ts.map