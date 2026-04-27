export type Order = {
    id?: number;
    user_id?: number;
    status: string;
};
export declare const getCurrentOrders: (userId: number) => Promise<Order[]>;
export declare const getCompletedOrders: (userId: number) => Promise<Order[]>;
export declare const createOrder: (user_id: number, status: string, product_id: number, quantity: number) => Promise<Order>;
export declare const updateOrderStatus: (orderId: number, status: string) => Promise<Order>;
export declare const deleteOrder: (orderId: number) => Promise<Order>;
//# sourceMappingURL=order.d.ts.map