export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
}

export interface UserInfo {
    username?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
}
