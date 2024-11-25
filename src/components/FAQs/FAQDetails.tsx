import { FAQ } from "@/types/FAQs";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

type FAQDetailsProps = {
    faq: FAQ;
};

const FAQDetails = ({ faq }: FAQDetailsProps) => {
    return (
        <Disclosure as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="text-sm lg:text-xl font-medium text-slate-900 group-data-[hover]:opacity-80 text-left">
                    {faq.question}
                </span>
                <FiChevronDown className="size-5 fill-slate-100 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
            </DisclosureButton>
            <div className="overflow-hidden">
                <DisclosurePanel
                    transition
                    className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 pt-6 text-xs lg:text-lg"
                >
                    {faq.answer}
                </DisclosurePanel>
            </div>
        </Disclosure>
    );
};

export default FAQDetails;
