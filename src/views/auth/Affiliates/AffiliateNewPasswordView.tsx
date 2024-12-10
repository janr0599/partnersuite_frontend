import NewPasswordTokenAffiliate from "@/components/auth/affiliates/NewPasswordTokenAffiliate";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import { ConfirmToken } from "@/types/authTypes";

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken["token"]>("");
    const [isValidToken, setIsValidToken] = useState(false);

    return (
        <div className="space-y-8 p-10 rounded-lg bg-white mt-10">
            <h1 className="text-2xl md:text-4xl font-black">
                Set a new Password
            </h1>
            {!isValidToken ? (
                <p className="text-lg md:text-xl font-light mt-5">
                    Enter the code you received by email
                </p>
            ) : (
                <p className="text-lg md:text-xl font-light mt-5">
                    Set and confirm a new password
                </p>
            )}

            {!isValidToken ? (
                <NewPasswordTokenAffiliate
                    token={token}
                    setToken={setToken}
                    setIsValidToken={setIsValidToken}
                />
            ) : (
                <NewPasswordForm token={token} />
            )}
        </div>
    );
}
