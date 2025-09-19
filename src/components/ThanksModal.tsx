

export default function ThanksModal({ active, setActiveModal, genText }: { active: boolean, setActiveModal: (active: boolean) => void, genText: string }) {
    
    const onClose = () => {
        setActiveModal(false);
    }
    
    return ( active &&
        <div className="fixed inset-0 bg-fuchsia-50/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Modal Header */}
                <div className="text-center mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <span className="text-2xl">🎉</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Gràcies!
                    </h3>
                </div>

                {/* Modal Body */}
                <div className="text-center mb-6">
                    <p className="text-gray-700 text-base leading-relaxed">
                        {genText || "Gràcies per la teva reserva!"}
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        D&apos;acord
                    </button>
                </div>
            </div>
        </div>
    );
}