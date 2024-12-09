import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { AuthenticatedUser } from "@/types/authTypes";
import { UserProfileForm } from "@/types/profileTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, uploadImage } from "@/api/profileAPI";
import { toast } from "react-toastify";
import { useState } from "react";

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

    const [profileImage, setProfileImage] = useState(data.image || "");

    const queryClient = useQueryClient();
    const { mutate: updateProfileMutation } = useMutation({
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

    const { mutate: uploadImageMutation } = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            setProfileImage(data);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadImageMutation(e.target.files[0]);
        }
    };

    const handleEditProfile = (formData: UserProfileForm) => {
        updateProfileMutation(formData);
    };

    return (
        <>
            <div className="mx-auto max-w-2xl bg-white shadow-lg rounded-lg p-10 mt-10">
                <h1 className="text-3xl md:text-4xl font-black text-center">
                    My Profile
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-500 mt-5 text-center">
                    Update your profile information
                </p>

                <div className="flex items-center justify-center mt-10">
                    {/* Profile Image */}
                    <div className="relative group">
                        <img
                            src={profileImage || "/default-avatar.svg"} // Fallback image
                            alt="Profile Image"
                            className={`size-24 md:size-32 rounded-full object-cover border-2 border-gray-300 ${
                                !profileImage && "p-2"
                            }`}
                        />

                        {/* Transparent Black Overlay */}
                        <div className="absolute top-0 left-0 size-24 md:size-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-bold">
                                Upload Image
                            </span>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            id="file"
                            type="file"
                            className="absolute top-0 left-0 size-24 md:size-32 opacity-0 cursor-pointer rounded-full"
                            accept=".jpg,.jpeg,.png" // Adjust allowed formats as needed
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(handleEditProfile)}
                    className="space-y-5 mt-5 md:mt-10 rounded-lg"
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
