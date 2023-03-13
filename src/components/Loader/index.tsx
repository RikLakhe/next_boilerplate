import { useState, useEffect } from "react";

function Loader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleComplete = () => setIsLoading(false);
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        window.addEventListener("load", handleComplete);
        return () => {
            window.removeEventListener("load", handleComplete);
            clearTimeout(timeoutId);
        };
    }, []);

    return isLoading ? (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
                Loading ....
            </div>
        </div>
    ) : null;
}

export default Loader;
