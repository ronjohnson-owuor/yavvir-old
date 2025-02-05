import React from 'react'
import Lessonlist from './Lessonlist'

function Lessons() {
  return (
    <div className='w-full shadow-sm'>
       <Lessonlist/>
       <div className='p-4  mt-10'>
        <h1 className='font-bold'>my Statistics</h1>
        <div className='grid grid-cols-3 gap-4 my-4'>
            <div className='flex items-center justify-center p-4 shadow-sm rounded-lg flex-col'>
                <span className='text-[30px] font-bold'>200+</span>
                <h1>total lessons</h1>
            </div>
            <div className='flex items-center justify-center p-4 shadow-sm rounded-lg flex-col'>
                <span className='text-[30px] font-bold'>5</span>
                <h1>pending lessons</h1>
            </div>
            <div className='flex items-center justify-center p-4 shadow-sm rounded-lg flex-col'>
                <span className='text-[30px] font-bold'>195+</span>
                <h1>closed lessons</h1>
            </div>
        </div>
        <button className='btn w-full bg-main text-white border-none'>create lesson</button>
       </div>

    </div>
  )
}

export default Lessons