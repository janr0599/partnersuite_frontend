import { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormSetFocus } from "react-hook-form";
import { TicketFormData } from "@/types/ticketsTypes";
import ErrorMessage from "../ErrorMessage";

type TaskFormProps = {
    register: UseFormRegister<TicketFormData>;
    errors: FieldErrors<TicketFormData>;
    setFocus: UseFormSetFocus<TicketFormData>;
};

function TicketForm({ register, errors, setFocus }: TaskFormProps) {
    useEffect(() => {
        setFocus("title");
    }, [setFocus]);

    return (
        <>
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="font-normal text-lg">
                    Title
                </label>
                <input
                    id="title"
                    className="w-full p-3 border border-gray-200 rounded-lg"
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
                <label htmlFor="category" className="font-normal text-lg">
                    Category
                </label>
                <select
                    id="title"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    {...register("category", {
                        required: "category is required",
                    })}
                />
                {errors.title && (
                    <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <label htmlFor="description" className="font-normal text-lg">
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
