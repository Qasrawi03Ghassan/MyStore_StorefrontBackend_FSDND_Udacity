export type Order = {
    id?: number;
    userId?: number;
    status: string;
};
export declare const getCurrentOrder: (userId: number) => Promise<Order>;
export declare const getCompletedOrders: (userId: number) => Promise<Order[]>;
//# sourceMappingURL=order.d.ts.map