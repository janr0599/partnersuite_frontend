import { AuthenticatedUser } from "@/types/authTypes";

export const isManager = (user: AuthenticatedUser) => {
    return user.role === "manager";
};
