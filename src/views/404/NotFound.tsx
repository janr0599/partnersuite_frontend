import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <>
            <div className="flex-flex flex-col space-y-10 mt-10">
                <h1 className="font-black text-xl md:text-xl lg:text-3xl text-center">
                    Oops.. The page you are looking for does not exist
                </h1>
                <img
                    src="/not-found.svg"
                    alt="404 not found"
                    className="mx-auto size-[300px] md:size-[400px]"
                />
                <p className="text-center">
                    <Link
                        to="/"
                        className="font-bold hover:underline inline-flex items-center gap-2"
                    >
                        <FiArrowLeft /> Go back to home
                    </Link>
                </p>
            </div>
        </>
    );
}

export default NotFound;
