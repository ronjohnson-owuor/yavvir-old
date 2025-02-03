import React from 'react'

function Lessons() {
  return (
    <div className='shadow-md p-4 rounded-sm sm:rounded-none w-full min-h-[300px]'>
        <h1 className='font-bold my-4'>My Lessons</h1>
        <div className='flex flex-col my-10'>
            {/* lessons pending */}
            <div className='flex items-start justify-between my-1 shadow-lg rounded-md p-4'>
                <h3>Introduction....</h3>
                <span>19:00 PM</span>
                <p className='bg-main text-white text-sm p-1 px-2 rounded-[20px]'>pending</p>
            </div>
            <div className='flex items-start justify-between my-1 shadow-lg rounded-md p-4'>
                <h3>Introduction....</h3>
                <span>19:00 PM</span>
                <p className='bg-main text-white text-sm p-1 px-2 rounded-[20px]'>pending</p>
            </div>
            <div className='flex items-start justify-between my-1 shadow-lg rounded-md p-4'>
                <h3>Introduction....</h3>
                <span>19:00 PM</span>
                <p className='bg-main text-white text-sm p-1 px-2 rounded-[20px]'>pending</p>
            </div>

            <span className='underline my-2 text-sm'>view all</span>
        </div>

        <div className='flex items-center justify-between p-2'>
            <button className='btn bg-gray-600 border-none hover:bg-main'>create lesson</button>
            <button className='btn bg-gray-600 border-none hover:bg-main'>edit lessons</button>
        </div>

    </div>
  )
}

export default Lessons