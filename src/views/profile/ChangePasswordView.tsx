import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { ChangePasswordForm } from "@/types/profileTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/schemas/profileSchemas";
import { changePassword } from "@/api/profileAPI";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function ChangePasswordView() {
    const initialValues: ChangePasswordForm = {
        currentPassword: "",
        password: "",
        confirmPassword: "",
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordForm>({
        defaultValues: initialValues,
        resolver: zodResolver(changePasswordSchema),
    });

    const password = watch("password");

    const { mutate } = useMutation({
        mutationFn: changePassword,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            reset();
        },
    });

    const handleChangePassword = (formData: ChangePasswordForm) => {
        mutate(formData);
    };

    return (
        <>
            <div className="mx-auto max-w-3xl bg-white shadow-lg rounded-lg p-10 mt-10">
                <h1 className="text-3xl md:text-4xl font-black">
                    Change Password
                </h1>
                <form
                    onSubmit={handleSubmit(handleChangePassword)}
                    className="space-y-5 mt-10 rounded-lg"
                    noValidate
                >
                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="current_password"
                        >
                            Current Password
                        </label>
                        <input
                            id="current_password"
                            type="password"
                            placeholder="current password"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            {...register("currentPassword", {
                                required: "current password is required",
                            })}
                        />
                        {errors.currentPassword && (
                            <ErrorMessage>
                                {errors.currentPassword.message}
                            </ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="password"
                        >
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="new Password"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            {...register("password", {
                                required: "New Password is required",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must be at least 8 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <ErrorMessage>
                                {errors.password.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="mb-5 space-y-3">
                        <label
                            htmlFor="password_confirmation"
                            className="text-sm uppercase font-bold"
                        >
                            Repeat Password
                        </label>

                        <input
                            id="password_confirmation"
                            type="password"
                            placeholder="confirm password"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            {...register("confirmPassword", {
                                required: "confirm password is required",
                                validate: (value) =>
                                    value === password ||
                                    "passwords do not match",
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
                        value="Change Password"
                        className="bg-black w-full p-3 text-sm md:text-base text-white uppercase font-bold hover:opacity-80 cursor-pointer transition-opacity rounded-lg"
                    />
                </form>
            </div>
        </>
    );
}
