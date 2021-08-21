export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar: string;
    gender: boolean;
}

export interface UserInfo {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    gender?: boolean;
}
