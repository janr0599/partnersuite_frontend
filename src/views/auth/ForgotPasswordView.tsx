import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "@/types/authTypes";
import ErrorMessage from "@/components/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schemas/authSchemas";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/authAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = {
        email: "",
    };
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        defaultValues: initialValues,
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => [toast.success(message)],
    });

    const handleForgotPassword = (formData: ForgotPasswordForm) => {
        mutate(formData);
        reset();
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="space-y-8 p-10 rounded-lg bg-white mt-10"
                noValidate
            >
                <h1 className="text-2xl md:text-4xl font-black">
                    Reset your Password
                </h1>
                <p className="text-lg md:text-xl font-light mt-5">
                    Enter your email and receive instructions to set a new
                    password
                </p>
                <div className="flex flex-col gap-5">
                    <label className="font-normal text-xl" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border-gray-300 border rounded-lg"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value="Send Instructions"
                    className="bg-black hover:opacity-80 w-full p-2 md:p-3 text-white font-black text-lg md:text-xl cursor-pointer transition-opacity rounded-lg"
                />

                <nav className="mt-10 flex flex-col space-y-4 text-sm md:text-base">
                    <Link
                        to={"/auth/login"}
                        className="text-center font-normal hover:underline"
                    >
                        Already have an account? Login
                    </Link>
                    {/* <Link
                        to={"/auth/registration"}
                        className="text-center font-normal hover:underline"
                    >
                        Don't have an account? Create one
                    </Link> */}
                </nav>
            </form>
        </>
    );
}
