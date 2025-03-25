import React from 'react'
import FooterComponent from "../../shared/components/FooterComponent"
import IMAGES from "../../images/images"
import { MdMap, MdGroups2, MdCommute } from "react-icons/md";
import { RxDownload } from "react-icons/rx";
import { SlInfo } from "react-icons/sl";

import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-100 to-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[80vh] bg-base-100 py-8">
                <div className="hero-content flex-col lg:flex-row-reverse gap-8 max-w-7xl">
                    {/* Hero Image */}
                    <div className="lg:w-1/2 relative">
                        <img
                            src={IMAGES.homePageImg}
                            alt="Lakbay Cavite App"
                            className="rounded-lg shadow-2xl object-cover w-full h-[26rem] transform hover:scale-[1.02] transition-transform duration-300"
                        />
                        {/* <div className="badge badge-primary badge-lg absolute -top-3 -right-3 animate-pulse">New</div> */}
                    </div>

                    {/* Hero Content */}
                    <div className="lg:w-1/2 space-y-6">
                        <div className="relative">
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                Navigate your way
                            </h1>
                            <div className="w-24 h-1 bg-primary mt-2 rounded-full"></div>
                        </div>

                        <h2 className="text-3xl font-bold text-primary">Lakbay Cavite</h2>

                        <p className="py-4 text-lg leading-relaxed">
                            Navigate Your Way with Ease – Access Public Transportation Routes and Real-Time Updates.
                            Connect with a Community to Share Tips and Guides for Exploring the City.
                        </p>

                        {/* <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 text-primary-content">
                            <div className="stat">
                                <div className="stat-title">Users</div>
                                <div className="stat-value">10K+</div>
                                <div className="stat-desc">Active travelers</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Routes</div>
                                <div className="stat-value">200+</div>
                                <div className="stat-desc">Growing daily</div>
                            </div>
                        </div> */}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="dropdown dropdown-hover">
                                <button className="btn btn-primary">
                                    <RxDownload size={20} />

                                    Download App
                                </button>
                                {/* <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <a href="#" className="flex items-center">
                                            <img className='w-6 h-6 mr-2' src={IMAGES.dlAndroid} alt='Android icon' />
                                            Android
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v18m6-18v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                            </svg>
                                            iOS (Coming Soon)
                                        </a>
                                    </li>
                                </ul> */}
                            </div>

                            <button className="btn btn-outline btn-success" onClick={() => navigate('/about')}>
                                <SlInfo size={20} />

                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-base-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body items-center text-center">
                                <div className="rounded-full bg-primary/20 p-4 mb-4">
                                    <MdMap size={30} />
                                </div>
                                <h3 className="card-title">Real-Time Maps</h3>
                                <p>Explore Cavite with interactive maps showing real-time transportation updates.</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body items-center text-center">
                                <div className="rounded-full bg-secondary/20 p-4 mb-4">
                                    <MdGroups2 size={30} />
                                </div>
                                <h3 className="card-title">Community Guides</h3>
                                <p>Share and discover insider tips from locals and frequent travelers.</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body items-center text-center">
                                <div className="rounded-full bg-accent/20 p-4 mb-4">
                                    <MdCommute size={30} />

                                </div>
                                <h3 className="card-title">Transportation Routes</h3>
                                <p>Never miss a ride with accurate transportation routes and information.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Preview Section */}
            <div className="py-12 bg-secondary">
                <div className="container mx-auto px-4 text-center text-white">
                    <div className="max-w-xl mx-auto mb-10">
                        <h2 className="text-3xl font-bold mb-4">Ready to explore Cavite?</h2>
                        <p className="text-lg">Download Lakbay Cavite now and transform your travel experience!</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="w-64 h-16 transition-transform hover:scale-105">
                            <button className="btn text-secondary">
                                <RxDownload size={20} />

                                Download App
                            </button>                        </div>

                    </div>
                </div>
            </div>

            {/* Newsletter */}
            {/* <div className="bg-primary text-primary-content py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold">Stay Updated</h3>
                            <p>Get the latest Lakbay Cavite news and updates.</p>
                        </div>
                        <div className="join">
                            <input className="input join-item" placeholder="Email" />
                            <button className="btn btn-secondary join-item">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Footer */}
            <FooterComponent />
        </div>
    )
}

export default Home