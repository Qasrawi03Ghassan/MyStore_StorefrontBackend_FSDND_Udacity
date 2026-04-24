export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    passwordHash: string;
};
export declare const getUsers: () => Promise<User[]>;
export declare const showUserById: (userId: number) => Promise<User>;
export declare const showUserByFirstNameAndLastName: (firstName: string, lastName: string) => Promise<User>;
export declare const createUser: (user: User) => Promise<User>;
//# sourceMappingURL=user.d.ts.map