import FAQDetails from "@/components/FAQs/FAQDetails";
import { faqs } from "@/data/index";

export default function FAQsView() {
    return (
        <div className="h-screen w-full">
            <div className="mx-auto w-full max-w-screen-2xl shadow-xl rounded-lg bg-white">
                <h1 className="pl-6 pt-3 lg:p-6 text-lg md:text-2xl lg:text-3xl font-bold">
                    Frequently Asked Questions
                </h1>
                <div className="divide-y divide-slate-300">
                    {faqs.map((faq, index) => (
                        <FAQDetails key={index} faq={faq} />
                    ))}
                </div>
            </div>
        </div>
    );
}
