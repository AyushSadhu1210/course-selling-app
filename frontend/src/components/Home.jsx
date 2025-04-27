import React, { useEffect, useState } from 'react'
import logo from "../../public/logo.webp"
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"
import toast from "react-hot-toast"
import { BACKEND_URL } from '../../utils/utils';

function Home() {
    const [courses, setCourses] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const user = localStorage.getItem("user")
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])
    const handleLogout = async () => {
        try {
            const response = axios.get(`${BACKEND_URL}/user/logout`, {
                withCredentials: true
            })
            toast.success((await response).data.message)
            setIsLoggedIn(false)
        } catch (error) {
            console.log("Error in logout: ", error)
            toast.error(error.response.data.errors || "Error in logging out")
        }
    }

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/course/courses`, {
                    withCredentials: true
                })
                console.log(response.data.courses)
                setCourses(response.data.courses)
            } catch (error) {
                console.log("error in fetching: ", error)
            }
        }
        fetchCourse()
    }, [])

    var settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    return (
        <div className='bg-gradient-to-r from-white to-blue-400 min-h-screen flex flex-col'>
            <div className=' text-black container mx-auto'>

                {/* {Header} */}
                <header className='flex items-center justify-between p-2'>
                    <div className='flex items-center space-x-2'>
                        <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                        <h1 className='text-2xl text-orange-500 font-bold'>Course Selling App</h1>
                    </div>
                    <div className='space-x-4'>
                        {isLoggedIn ? (
                            <Link
                                onClick={handleLogout}
                                className='bg-transparen text-orange-500 py-2 px-4 border border-orange-500 rounded font-bold hover:bg-orange-500 hover:text-white'>
                                Logout
                            </Link>
                        ) : (<>
                            <Link
                                to={"/login"}
                                className='bg-transparen text-orange-500 py-2 px-4 border border-orange-500 rounded font-bold hover:bg-orange-500 hover:text-white'>
                                Login
                            </Link>
                            <Link
                                to={"/signup"}
                                className='bg-transparen text-orange-500 py-2 px-4 border border-orange-500 rounded font-bold hover:bg-orange-500 hover:text-white'>
                                Signup
                            </Link>
                        </>)}
                    </div>
                </header>

                {/* {Main Section} */}
                <section className='text-center py-4 '>
                    <h1 className='text-4xl font-semibold text-orange-500'>Course Selling App</h1>
                    <br />
                    <p className='text-gray-600'>Sharpen your skills with courses crafted by experts.</p>
                    <div className='space-x-4 mt-8'>
                        <Link to={'/courses'} className='bg-orange-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explorer Courses</Link>
                        <Link className='bg-orange-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black'>Courses Video</Link>
                    </div>
                </section>

                <section className="pt-4 pb-6">
                    <Slider className="" {...settings}>
                        {courses.map((course) => (
                            <div key={course._id} className="p-4">
                                <div className="relative w-full max-w-xs mx-auto transition-transform duration-300 transform hover:scale-105">
                                    <div className="bg-gray-600 rounded-lg overflow-hidden">
                                        <div className="flex justify-center items-center h-32 bg-white">
                                            <img
                                                className="h-24 object-contain"
                                                src={course.image.url}
                                                alt=""
                                            />
                                        </div>
                                        <div className="p-4 text-center space-y-3">
                                            <h2 className="text-md font-bold text-white break-words">
                                                {course.title}
                                            </h2>
                                            <Link
                                                to={`/buy/${course._id}`}
                                                className="bg-orange-500 text-white py-1 px-3 text-sm rounded-full hover:bg-white hover:text-black duration-300 inline-block"
                                            >
                                                Enroll Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </Slider>
                </section>

                <hr className="h-0.5 bg-gray-400  mx-25" />


                {/* {Footer} */}
                <footer className='mt-4 mb-2'>
                    <div className='grid grid-cols-1 md:grid-cols-3'>
                        <div className='flex flex-col items-center md:start'>
                            <div className='flex items-center space-x-2'>
                                <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                                <h1 className='text-2xl text-orange-500 font-bold'>Course Selling App</h1>
                            </div>
                            <div className='mt-3 ml-2 md:ml-8'>
                                <p className='mb-2 text-gray-600'>Follow us</p>
                                <div className='flex space-x-4'><a href="">
                                    <FaFacebook className='text-2xl 
                                    text-gray-600 hover:text-blue-500 duration-300' /></a>
                                    <a href=""><FaInstagramSquare className='text-2xl 
                                    text-gray-600 hover:text-pink-500 duration-300' /></a>
                                    <a href=""><FaSquareXTwitter className='text-2xl text-gray-600  hover:text-black duration-300' /></a>
                                </div>
                            </div>
                        </div>
                        <div className='items-center flex flex-col mt-2'>
                            <h3 className='text-lg font-semibold  mr-4.5 text-orange-500 mb-2'>Connects</h3>
                            <ul className='space-y-2  text-gray-600'>
                                <li className='hover:text-white cursor-pointer duration-300'>Coding Cloud</li>
                                <li className='hover:text-white cursor-pointer duration-300'>Linkedin</li>
                            </ul>
                        </div>

                        <div className='items-center flex flex-col'>
                            <h3 className='text-lg font-semibold mb-4 text-orange-500'>Copyrights &#169; 2025</h3>
                            <ul className='space-y-2 text-gray-600'>
                                <li className='hover:text-white cursor-pointer duration-300'>Terms & Conditions</li>
                                <li className='hover:text-white cursor-pointer duration-300'>Privacy Policy</li>
                                <li className='hover:text-white cursor-pointer duration-300'>Refund & Cancellation</li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home