import { validateToken } from "@/api/authAPI";
import { ConfirmToken } from "@/types/authTypes";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type NewPasswordTokenProps = {
    token: ConfirmToken["token"];
    setToken: React.Dispatch<React.SetStateAction<string>>;
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
    token,
    setToken,
    setIsValidToken,
}: NewPasswordTokenProps) {
    const handleChange = (token: ConfirmToken["token"]) => {
        setToken(token);
    };

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            setIsValidToken(true);
        },
    });

    const handleComplete = (token: ConfirmToken["token"]) => {
        mutate({ token });
    };

    return (
        <>
            <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
                <label className="font-normal text-2xl text-center block">
                    6-digit code
                </label>
                <div className="flex justify-center gap-5">
                    <PinInput
                        value={token}
                        onChange={handleChange}
                        onComplete={handleComplete}
                    >
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-slate-700 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-slate-700 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-slate-700 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-slate-700 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-slate-700 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-slate-700 border placeholder-white" />
                    </PinInput>
                </div>
            </form>

            <nav className="mt-10 flex flex-col space-y-4 text-sm md:text-base">
                <Link
                    to="/auth/forgot-password"
                    className="text-center font-normal hover:underline"
                >
                    Request a new code
                </Link>
            </nav>
        </>
    );
}
