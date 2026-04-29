export type ProductOrder = {
    product_id: number;
    order_id: number;
    quantity: number;
};
export declare const getProductsOrders: () => Promise<ProductOrder[]>;
export declare const createProductOrder: (productOrder: ProductOrder) => Promise<ProductOrder>;
//# sourceMappingURL=productOrder.d.ts.map