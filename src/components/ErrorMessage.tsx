import { ReactNode } from "react";

function ErrorMessage({ children }: { children: ReactNode }) {
    return (
        <div className="text-center bg-red-100 text-red-600 font-bold p-3 uppercase text-sm rounded my-2">
            {children}
        </div>
    );
}

export default ErrorMessage;
