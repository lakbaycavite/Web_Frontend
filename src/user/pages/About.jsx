import { useState, useEffect } from 'react';
import IMAGES from '../../images/images';
import FooterComponent from '../../shared/components/FooterComponent';

// Icons
import {
    FaMapMarkedAlt,
    FaRoute,
    FaInfoCircle,
    FaMapSigns,
    FaBusAlt,
    FaCar,
    FaUsers,
    FaLandmark
} from 'react-icons/fa';
import { MdTravelExplore, MdEmojiPeople, MdDirections } from 'react-icons/md';
import DownloadButton from '../components/DownloadButton';

const About = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Animation effect on load
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Feature data
    const features = [
        {
            icon: <FaMapMarkedAlt className="text-3xl text-primary" />,
            title: "Interactive Maps",
            description: "Explore detailed maps of Imus Cavite with real-time routes information."
        },
        {
            icon: <FaRoute className="text-3xl text-primary" />,
            title: "Route Planning",
            description: "Get optimized routes for both public transportation and private vehicles."
        },
        {
            icon: <FaBusAlt className="text-3xl text-primary" />,
            title: "Public Transport Info",
            description: "Find information about jeepneys, buses, and other public transportation options."
        },
        {
            icon: <MdEmojiPeople className="text-3xl text-primary" />,
            title: "Community",
            description: "Connect with other users and share your experiences and tips."
        }
    ];

    // Team members (placeholder data - replace with actual team information)
    const teamMembers = [
        {
            name: "Lance Ballicud",
            role: "Lead Developer",
            image: IMAGES.PIC1 // Replace with actual team member image
        },
        {
            name: "Team Member 2",
            role: "UI/UX Designer",
            image: IMAGES.PIC1 // Replace with actual team member image
        },
        {
            name: "Team Member 3",
            role: "GIS Specialist",
            image: IMAGES.PIC1 // Replace with actual team member image
        }
    ];

    return (
        <div className="max-w-screen mx-auto">
            <div className="flex flex-col justify-between min-h-screen bg-base-100">
                {/* Hero Section */}
                <section className={`relative h-[70vh] w-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={IMAGES.about1}
                            alt="Cavite Landscape"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
                    </div>

                    <div className="relative h-full container mx-auto px-4 md:px-6 flex flex-col justify-center">
                        <div className="max-w-2xl animate-fadeIn">
                            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Discover Imus Cavite with Lakbay Cavite</h1>
                            <p className="text-xl text-white/90 mb-8 drop-shadow-md">
                                Your ultimate companion for navigating the historical and beautiful city of Imus.
                            </p>
                            <div className="flex flex-wrap gap-4">

                                <DownloadButton className="btn btn-success gap-2 text-white" />
                                {/* <button className="btn btn-outline text-white hover:bg-white hover:text-primary border-white gap-2">
                                    <MdDirections size={20} /> Get Started
                                </button> */}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex-grow">
                    {/* About Section */}
                    <section className="py-16 bg-base-100">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="md:w-1/2 animate-slideInLeft">
                                    <div className="relative">
                                        <img
                                            src={IMAGES.about2}
                                            alt="Cavite Navigation"
                                            className="rounded-lg shadow-xl"
                                        />
                                        <div className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-lg">
                                            <FaInfoCircle size={40} />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-1/2 animate-slideInRight">
                                    <div className="inline-block mb-4">
                                        <div className="badge bg-primary text-white text-sm font-semibold py-3 px-4">About Lakbay Cavite</div>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Navigate Imus Cavite with Confidence</h2>
                                    <p className="text-lg text-gray-600 mb-6">
                                        Lakbay Cavite is a comprehensive navigation app designed to help both locals and tourists
                                        easily navigate through the city of Imus in Cavite. Our app provides detailed information about
                                        public transportation routes, points of interest, and turn-by-turn directions.
                                    </p>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Whether you're commuting via public transport or driving your own vehicle, Lakbay Cavite
                                        offers the tools and information you need to reach your destination efficiently.
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="stats shadow">
                                            <div className="stat place-items-center">
                                                <div className="stat-title">Routes</div>
                                                <div className="stat-value text-primary">100+</div>
                                                <div className="stat-desc">Public transport routes</div>
                                            </div>

                                            <div className="stat place-items-center">
                                                <div className="stat-title">Locations</div>
                                                <div className="stat-value text-secondary">500+</div>
                                                <div className="stat-desc">Points of interest</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-16 bg-base-200">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center mb-12">
                                <div className="badge badge-success mb-4 py-3 px-4 text-white">App Features</div>
                                <h2 className="text-3xl font-bold text-gray-800">Discover What Makes Lakbay Cavite Special</h2>
                                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                    Our app is packed with features designed to make your journey through Imus Cavite seamless and enjoyable.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="mb-4 p-3 bg-primary/10 inline-block rounded-lg">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Mission Section */}
                    <section className="py-16 bg-primary text-white">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="md:w-1/2">
                                    <FaLandmark size={60} className="mb-6 text-white/90" />
                                    <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                                    <p className="text-lg text-white/90 mb-6">
                                        At Lakbay Cavite, our mission is to make navigation through Imus Cavite accessible to everyone.
                                        We believe that easy access to transportation information can greatly improve the quality
                                        of life for residents and enhance the experience of visitors.
                                    </p>
                                    <p className="text-lg text-white/90 mb-6">
                                        We're committed to continuously updating our app with the latest routes, landmarks, and
                                        transportation options to ensure you always have the most accurate information at your fingertips.
                                    </p>
                                </div>

                                <div className="md:w-1/2">
                                    <div className="rounded-lg overflow-hidden shadow-2xl">
                                        <img
                                            src={IMAGES.about3}
                                            alt="Cavite Historical Site"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team Section */}
                    {/* <section className="py-16 bg-base-100">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center mb-12">
                                <div className="badge badge-primary mb-4 py-3 px-4">Meet The Team</div>
                                <h2 className="text-3xl font-bold text-gray-800">The People Behind Lakbay Cavite</h2>
                                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                                    Our dedicated team works tirelessly to bring you the best navigation experience in Cavite.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {teamMembers.map((member, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                                    >
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2 text-gray-800">{member.name}</h3>
                                            <p className="text-gray-600 mb-4">{member.role}</p>
                                            <div className="flex justify-center gap-3">
                                                <button className="btn btn-circle btn-sm btn-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                                    </svg>
                                                </button>
                                                <button className="btn btn-circle btn-sm btn-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                                    </svg>
                                                </button>
                                                <button className="btn btn-circle btn-sm btn-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                                                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section> */}

                    {/* Call to Action Section */}
                    <section className="py-16 bg-secondary text-white">
                        <div className="container mx-auto px-4 md:px-6 text-center">
                            <h2 className="text-3xl font-bold mb-6">Ready to Explore Imus Cavite?</h2>
                            <p className="text-lg mb-8 max-w-3xl mx-auto">
                                Download Lakbay Cavite today and start exploring the beautiful city of Imus Cavite with ease and confidence.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">

                                <DownloadButton className="btn bg-white text-secondary hover:bg-gray-200 gap-2" />

                                {/* <button className="btn bg-white text-secondary hover:bg-gray-200 gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-apple" viewBox="0 0 16 16">
                                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                                        <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                                    </svg>
                                    App Store
                                </button> */}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <FooterComponent />

                {/* Add CSS for animations */}
                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes slideInLeft {
                        from { opacity: 0; transform: translateX(-50px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    
                    @keyframes slideInRight {
                        from { opacity: 0; transform: translateX(50px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    
                    .animate-fadeIn {
                        animation: fadeIn 1s ease-out;
                    }
                    
                    .animate-slideInLeft {
                        animation: slideInLeft 1s ease-out;
                    }
                    
                    .animate-slideInRight {
                        animation: slideInRight 1s ease-out;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default About;