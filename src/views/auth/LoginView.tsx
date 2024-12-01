import { authenticateUser } from "@/api/authAPI";
import ErrorMessage from "@/components/ErrorMessage";
import { useAuth } from "@/hooks/useauth";
import { userLoginSchema } from "@/schemas/authSchemas";
import { UserLoginForm } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginView() {
    const navigate = useNavigate();
    const { refetch } = useAuth();

    const initialValues: UserLoginForm = {
        email: "",
        password: "",
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserLoginForm>({
        defaultValues: initialValues,
        resolver: zodResolver(userLoginSchema),
    });

    const { mutate } = useMutation({
        mutationFn: authenticateUser,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async () => {
            const { data: user } = await refetch();
            if (user?.role === "manager") {
                navigate("/");
            } else {
                navigate("/tickets");
            }
        },
    });

    const handleLogin = (formData: UserLoginForm) => {
        console.log(formData);
        mutate(formData);
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="space-y-8 p-10 rounded-lg bg-white shadow-lg mt-10"
                noValidate
            >
                <div className="text-center">
                    <h1 className="text-5xl font-black">Login</h1>
                    <p className="text-xl font-light mt-5">
                        Enter your email and password to access your account
                    </p>
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
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border-gray-300 border rounded-lg"
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value="Log in"
                    className="bg-black hover:opacity-80 w-full p-3 text-white font-black text-xl cursor-pointer transition-opacity rounded-lg"
                />

                <nav className="mt-10 flex flex-col space-y-4 text-sm md:text-base">
                    <Link
                        to={"/auth/registration"}
                        className="text-center font-normal hover:underline"
                    >
                        Don't have an account? Create one
                    </Link>
                    <Link
                        to={"/auth/forgot-password"}
                        className="text-center font-normal hover:underline"
                    >
                        Trouble logging in? Reset your password.
                    </Link>
                </nav>
            </form>
        </>
    );
}

export default LoginView;
