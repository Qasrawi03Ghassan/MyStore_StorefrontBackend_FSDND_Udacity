export type Order = {
    id?: number;
    user_id?: number;
    status: string;
};
export declare const getCurrentOrders: (userId: number) => Promise<Order[]>;
export declare const getCompletedOrders: (userId: number) => Promise<Order[]>;
export declare const createOrder: (order: Order, product_id: number, quantity: number) => Promise<Order>;
//# sourceMappingURL=order.d.ts.map