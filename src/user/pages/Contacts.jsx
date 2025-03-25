import React from "react";
import FooterComponent from "../../shared/components/FooterComponent";
import ContactItems from "../components/ContactItems";

const Contacts = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center px-4 mt-10 mb-10">
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl">
                    {/* <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
                        Contact Us
                    </h1>
                    <p className="text-lg mb-6 text-center text-gray-600">
                        If you have any questions, feel free to reach out to us at{" "}
                        <a href="mailto:contact@lakbaycavite.com" className="text-blue-500 font-medium">
                            contact@lakbaycavite.com
                        </a>.
                    </p> */}

                    {/* Contact Hotlines */}
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
                            Emergency Contact Numbers
                        </h2>
                        <div className="overflow-hidden shadow-md rounded-lg">
                            <ContactItems />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterComponent />
        </div>
    );
};

export default Contacts;
