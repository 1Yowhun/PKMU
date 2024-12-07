import React from "react";

type SummaryItemsProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
    additionalInfo?: string;
    cs?: any;
};

const SummaryItems: React.FC<SummaryItemsProps> = ({ icon, title, value, additionalInfo, cs }) => {
    return (
        <div className="rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4">
                <div className={`bg-black rounded-xl ${cs ? cs: "p-2"}`}>
                    {icon}
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-gray-400 mb-1">{title}</h1>
                    {additionalInfo ? (
                            <p className="text-3xl font-extrabold">
                                {value} <span className="text-xl text-gray-600">{additionalInfo}</span>
                            </p>
                        )
                        :
                        (
                            <p className="text-3xl font-extrabold">
                                {value} 
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
};

export default SummaryItems;