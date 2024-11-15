import { createAccount } from "@/api/authAPI";
import ErrorMessage from "@/components/ErrorMessage";
import { userRegistrationSchema } from "@/schemas/authSchemas";
import { UserRegistrationForm } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RegistrationView() {
    const navigate = useNavigate();

    const initialValues: UserRegistrationForm = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserRegistrationForm>({
        defaultValues: initialValues,
        resolver: zodResolver(userRegistrationSchema),
    });

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            navigate("/auth/login");
        },
    });

    const handleCreateAccount = (formData: UserRegistrationForm) => {
        console.log(formData);
        mutate(formData);
    };
    return (
        <>
            <form
                onSubmit={handleSubmit(handleCreateAccount)}
                className="space-y-5 p-10 rounded-lg bg-white shadow-lg"
                noValidate
            >
                <div className="text-center">
                    <h1 className="text-5xl font-black">Registration</h1>
                    <p className="text-xl font-light mt-5">
                        Enter your information to create an account
                    </p>
                </div>
                <div className="flex flex-col gap-5">
                    <label className="font-normal text-xl">Name</label>

                    <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        className="w-full p-2 border-gray-300 border rounded-lg"
                        {...register("name", {
                            required: "name is required",
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-xl">Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border-gray-300 border rounded-lg"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-xl">Password</label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Registration password"
                        className="w-full p-2 border-gray-300 border rounded-lg"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must be at least 8 characters",
                            },
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-xl">
                        Confirm Password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="w-full p-2 border-gray-300 border rounded-lg"
                        {...register("confirmPassword", {
                            required: "Password must be confirmed",
                        })}
                    />

                    {errors.confirmPassword && (
                        <ErrorMessage>
                            {errors.confirmPassword.message}
                        </ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value="Create account"
                    className="bg-black hover:opacity-80 w-full p-3 text-white font-black text-xl cursor-pointer transition-opacity rounded-lg"
                />

                <nav className="mt-10 flex flex-col space-y-4">
                    <Link
                        to={"/auth/login"}
                        className="text-center font-normal"
                    >
                        Already have an account? Login
                    </Link>
                    <Link
                        to={"/auth/forgot-password"}
                        className="text-center font-normal"
                    >
                        Trouble logging in? Reset your password.
                    </Link>
                </nav>
            </form>
        </>
    );
}

export default RegistrationView;
