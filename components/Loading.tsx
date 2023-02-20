import React from 'react'
import { PropagateLoader } from 'react-spinners'

function Loading() {
    return (
        <div className='bg-[#0f0f0f] h-screen flex flex-col items-center justify-center' >
			<div className='flex  items-center justify-center space-x-2 mb-10' >
				<img className='h-20 w-20' src="strawhat-logo.png" alt="" />
				<h1 className='text-lg text-white font-bold' >LOADING...</h1>
			</div>
			<PropagateLoader color='white' size={30} />
		</div>
    )
}

export default Loading