import { AffiliateFormData } from "@/types/affiliateTypes";
import { useEffect, useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetFocus } from "react-hook-form";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Import the styles for the tabs
import ErrorMessage from "../ErrorMessage";

type AffiliateFormProps = {
    register: UseFormRegister<AffiliateFormData>;
    errors: FieldErrors<AffiliateFormData>;
    setFocus: UseFormSetFocus<AffiliateFormData>;
};

function AffiliateForm({ register, errors, setFocus }: AffiliateFormProps) {
    useEffect(() => {
        setFocus("name");
    }, [setFocus]);

    const [activeTab, setActiveTab] = useState(0);
    const [isBaselineChecked, setIsBaselineChecked] = useState(false);

    const handleBaselineChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIsBaselineChecked(event.target.checked);
    };

    return (
        <div>
            <Tabs
                selectedIndex={activeTab}
                onSelect={(index) => setActiveTab(index)}
            >
                <TabList className="flex justify-around bg-gray-100 p-1 border border-slate-300 rounded-md text-sm md:text-base">
                    <Tab
                        className={`py-2 px-4 cursor-pointer rounded-md flex-1 transition-colors hover:bg-gray-200 ${
                            activeTab === 0
                                ? "font-bold bg-white hover:bg-white"
                                : "font-normal"
                        }`}
                    >
                        Account Details
                    </Tab>
                    <Tab
                        className={`py-2 px-4 cursor-pointer rounded-md flex-1 transition-colors hover:bg-gray-200 ${
                            activeTab === 1
                                ? "font-bold bg-white hover:bg-white"
                                : "font-normal"
                        }`}
                    >
                        Affiliate Details
                    </Tab>
                </TabList>

                <TabPanel className="space-y-3">
                    <div className="flex flex-col gap-2 mt-4">
                        <label
                            htmlFor="name"
                            className="font-semibold text-sm md:text-base"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="affiliate's name"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("name", {
                                required: "name is required",
                            })}
                        />
                        {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="font-semibold text-sm md:text-base"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="affiliate's email"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("email", {
                                required: "email is required",
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="font-semibold text-sm md:text-base"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="secret password"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
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
                            <ErrorMessage>
                                {errors.password.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="confirmPassword"
                            className="font-semibold text-sm md:text-base"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="confirm password"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
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
                </TabPanel>

                <TabPanel className="space-y-3">
                    <div className="flex flex-col gap-2 mt-2">
                        <label htmlFor="platform" className="font-semibold">
                            Platform
                        </label>
                        <input
                            id="platform"
                            type="text"
                            placeholder="platform"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("platform", {
                                required: "platform is required",
                            })}
                        />
                        {errors.platform && (
                            <ErrorMessage>
                                {errors.platform.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="contractType"
                            className="font-semibold text-sm md:text-base"
                        >
                            Contract Type
                        </label>
                        <select
                            id="contractType"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("contractType", {
                                required: "contractType is required",
                            })}
                        >
                            <option value="">Select Contract Type</option>
                            <option value="CPA">CPA</option>
                            <option value="RevShare">RevShare</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                        {errors.contractType && (
                            <ErrorMessage>
                                {errors.contractType.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <label
                            htmlFor="country"
                            className="font-semibold text-sm md:text-base"
                        >
                            Country
                        </label>
                        <input
                            id="country"
                            type="text"
                            placeholder="country"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("country", {
                                required: "country is required",
                            })}
                        />
                        {errors.country && (
                            <ErrorMessage>
                                {errors.country.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="CPA"
                            className="font-semibold text-sm md:text-base"
                        >
                            Bonus Amount
                        </label>
                        <input
                            id="BonusAmount"
                            type="number"
                            placeholder="Bonus amount"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("BonusAmount")}
                        />
                        {errors.BonusAmount && (
                            <ErrorMessage>
                                {errors.BonusAmount.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="CPA"
                            className="font-semibold text-sm md:text-base"
                        >
                            CPA
                        </label>
                        <input
                            id="CPA"
                            type="number"
                            placeholder="CPA amount"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("CPA")}
                        />
                        {errors.CPA && (
                            <ErrorMessage>{errors.CPA.message}</ErrorMessage>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="RevShare"
                            className="font-semibold text-sm md:text-base"
                        >
                            RevShare
                        </label>
                        <input
                            id="RevShare"
                            type="number"
                            placeholder="Revenue Share %"
                            className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                            {...register("RevShare")}
                        />
                        {errors.RevShare && (
                            <ErrorMessage>
                                {errors.RevShare.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <label
                            htmlFor="baselineCheckbox"
                            className="font-semibold text-sm md:text-base"
                        >
                            Add Baseline
                        </label>
                        <input
                            id="baselineCheckbox"
                            type="checkbox"
                            className="mr-2"
                            onChange={handleBaselineChange}
                        />
                    </div>

                    {isBaselineChecked && (
                        <div className="flex flex-col gap-2 mt-4">
                            <label
                                htmlFor="baseline"
                                className="font-semibold text-sm md:text-base"
                            >
                                Baseline Number
                            </label>
                            <input
                                id="baseline"
                                type="number"
                                placeholder="Baseline number"
                                className="w-full p-2 border border-gray-200 rounded-md text-sm md:text-base"
                                {...register("Baseline", {
                                    required: isBaselineChecked
                                        ? "Baseline number is required"
                                        : false,
                                })}
                            />
                            {errors.Baseline && (
                                <ErrorMessage>
                                    {errors.Baseline.message}
                                </ErrorMessage>
                            )}
                        </div>
                    )}
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default AffiliateForm;
