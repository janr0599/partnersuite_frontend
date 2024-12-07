import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { AuthenticatedUser } from "@/types/authTypes";
import { UserProfileForm } from "@/types/profileTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/profileAPI";
import { toast } from "react-toastify";

type ProfileFormProps = {
    data: AuthenticatedUser;
};

export default function ProfileForm({ data }: ProfileFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserProfileForm>({
        defaultValues: data,
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (message) => {
            toast.success(message);
            queryClient.invalidateQueries({
                queryKey: ["user"],
            });
        },
    });

    const handleEditProfile = (formData: UserProfileForm) => {
        mutate(formData);
    };

    return (
        <>
            <div className="mx-auto max-w-3xl bg-white shadow-lg rounded-lg p-10 mt-10">
                <h1 className="text-3xl md:text-4xl font-black">My Profile</h1>
                <p className="text-xl md:text-2xl font-light text-gray-500 mt-5">
                    Update your profile information
                </p>

                <form
                    onSubmit={handleSubmit(handleEditProfile)}
                    className="space-y-5 mt-10 rounded-lg"
                    noValidate
                >
                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="your name"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            {...register("name", {
                                required: "username is required",
                            })}
                        />
                        {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mb-5 space-y-3">
                        <label
                            className="text-sm uppercase font-bold"
                            htmlFor="password"
                        >
                            E-mail
                        </label>
                        <input
                            id="text"
                            type="email"
                            placeholder="your email"
                            className="w-full p-3 border border-gray-200 rounded-lg"
                            {...register("email", {
                                required: "email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "invalid email",
                                },
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                    <input
                        type="submit"
                        value="Save changes"
                        className="bg-black w-full p-3 text-sm md:text-base text-white uppercase font-bold hover:opacity-80 cursor-pointer transition-opacity rounded-lg"
                    />
                </form>
            </div>
        </>
    );
}
