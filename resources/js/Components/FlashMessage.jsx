import { useEffect } from "react";


const FlashMessage = ({ flash }) => {

    useEffect(() => {
        if (flash.success || flash.error) {
            setTimeout(() => {
                flash.success = '';
                flash.error = '';
            }, 3000);
        }
    }, [flash]);
    if (!flash.success && !flash.error) return null;
    return (
        <div className={`p-4 ${flash.success ? 'bg-green-500' : 'bg-red-500'} mb-4 rounded border p-4`}>
            <p>{flash.success || flash.error}</p>
        </div>
    );
};

export default FlashMessage;
