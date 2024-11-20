import { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetFocus } from "react-hook-form";
import { TicketFormData } from "@/types/ticketsTypes";
import ErrorMessage from "../ErrorMessage";
import { categoryTranslations } from "@/locales/en";

type TicketFormProps = {
    register: UseFormRegister<TicketFormData>;
    errors: FieldErrors<TicketFormData>;
    setFocus: UseFormSetFocus<TicketFormData>;
};

function TicketForm({ register, errors, setFocus }: TicketFormProps) {
    useEffect(() => {
        setFocus("title");
    }, [setFocus]);

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
                <label htmlFor="description" className="font-semibold text-md">
                    Task Description
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
