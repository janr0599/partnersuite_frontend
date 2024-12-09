import { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetFocus } from "react-hook-form";
import { TicketFormData } from "@/types/ticketsTypes";
import ErrorMessage from "../ErrorMessage";
import { categoryTranslations } from "@/locales/en";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/api/ticketsAPI";
import { toast } from "react-toastify";

type TicketFormProps = {
    register: UseFormRegister<TicketFormData>;
    errors: FieldErrors<TicketFormData>;
    setFocus?: UseFormSetFocus<TicketFormData>;
    setFile: React.Dispatch<React.SetStateAction<string>>;
};

function TicketForm({ register, errors, setFocus, setFile }: TicketFormProps) {
    if (setFocus) {
        useEffect(() => {
            setFocus("title");
        }, [setFocus]);
    }

    const { mutate: uploadImageMutation } = useMutation({
        mutationFn: uploadFile,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            setFile(data);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadImageMutation(e.target.files[0]);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="font-semibold text-md">
                    Title
                </label>
                <input
                    id="title"
                    className="w-full p-3 border border-gray-200 rounded-md"
                    type="text"
                    placeholder="Title"
                    {...register("title", {
                        required: "tile is required",
                    })}
                />
                {errors.title && (
                    <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="font-semibold text-md">
                    Category
                </label>
                <select
                    id="category"
                    className="w-full p-3 border border-gray-200 rounded-md"
                    {...register("category", {
                        required: "category is required",
                    })}
                >
                    {Object.entries(categoryTranslations).map(
                        ([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        )
                    )}
                </select>
                {errors.category && (
                    <ErrorMessage>{errors.category.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="file" className="font-semibold text-md">
                    Attach Image (Optional)
                </label>
                <input
                    id="file"
                    type="file"
                    className="w-full p-3 border border-gray-200 rounded-md"
                    accept=".jpg,.jpeg,.png,.pdf" // Adjust allowed formats as needed
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="font-semibold text-md">
                    Ticket Description
                </label>
                <textarea
                    id="description"
                    className="w-full p-3 border border-gray-200 rounded-md"
                    placeholder="Ticket Description"
                    {...register("description", {
                        required: "the description is required",
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    );
}

export default TicketForm;
