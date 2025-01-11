import React, { useEffect } from 'react'
import { GiBookshelf } from 'react-icons/gi'
import { IoHomeOutline } from 'react-icons/io5'
import { RiParentLine } from 'react-icons/ri'
import { SiGoogleclassroom } from 'react-icons/si'
import AOS from 'aos';
import 'aos/dist/aos.css';


function Whyus() {

  useEffect(() => {
    AOS.init();
  }, [])
  return (
    <div data-aos="fade-up"  className='mt-32 bg-beige_light p-4'>
        <center><h1 className='font-bold text-[40px] my-4'>Why yavvir?</h1></center>

        {/* listing main boxes */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 w-[90%] mx-[5%] p-4'>
            <div data-aos="flip-right">
            <SiGoogleclassroom className='text-[60px] text-center w-full my-4 text-beige' />
            <h3 className='font-bold my-4 w-full text-center text-main'>quality virtual classroom</h3>
            <p>Enjoy top-notch lessons through our in-website video classrooms, designed to deliver an immersive classroom experience.</p>
            </div>
            <div data-aos="flip-right">
            <GiBookshelf className='text-[60px] text-center w-full my-4 text-beige' />
            <h3 className='font-bold my-4 w-full text-center text-main'>Resources</h3>
            <p>Access a wealth of resources and materials tailored to help you succeed, all in one place! All these resources will be made availlable to you once by your respective teachers. </p>
            </div>
            <div data-aos="flip-right">
            <RiParentLine className='text-[60px] text-center w-full my-4 text-beige' />
            <h3 className='font-bold my-4 w-full text-center text-main'>Parental Insights</h3>
            <p>Stay Fully Involved in Your Child's Education: Our platform allows parents to easily track every aspect of their child's learning progress at home</p>
            </div>
            <div data-aos="flip-right">
            <IoHomeOutline className='text-[60px] text-center w-full my-4 text-beige' />
                <h3 className='font-bold my-4 w-full text-center text-main'>physical Homeschooling</h3>
                <p>teachers,are availlable to offer you homeschooling services right at your doorstep at a flexible price.</p>
            </div>
        </div>
    </div>
  )
}

export default Whyus