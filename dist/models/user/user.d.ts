export type User = {
    id?: number;
    first_name: string;
    last_name: string;
    password_digest: string;
};
export declare const getUsers: () => Promise<User[]>;
export declare const showUserById: (userId: number) => Promise<User>;
export declare const showUserByFirstNameAndLastName: (firstName: string, lastName: string) => Promise<User>;
export declare const createUser: (user: User) => Promise<User>;
//# sourceMappingURL=user.d.ts.map