import React from 'react'
import { useMetamask } from '@thirdweb-dev/react'

function Login() {

	const connectWithMetamask = useMetamask();

	return (
		<div className="bg-[#0f0f0f] min-h-screen flex flex-col items-center justify-center" >
			<div className='flex flex-col items-center mb-10 text-center' >
				<img className='h-36 w-auto object-contain mb-10' src="strawhat-logo.png" alt="login-logo" />
				<h1 className='text-6xl text-white font-bold' >ThirdWeb</h1>
				<h2 className='text-white' >Connect MetaMask</h2>
				<button onClick={connectWithMetamask} className='bg-green-400 px-8 py-5 mt-10 rounded-sm shadow-lg border hover:bg-[#0f0f0f] hover:text-green-400 hover:border-green-400 transition duration-200 ease-linear' >Login with MetaMask</button>
			</div>
		</div>
	)
}

export default Login