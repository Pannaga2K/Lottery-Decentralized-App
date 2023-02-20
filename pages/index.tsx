import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import { useContract, useMetamask, useDisconnect, useAddress, useContractRead, useContractWrite, ConnectWallet } from "@thirdweb-dev/react";
import Login from '../components/Login';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import {ethers} from "ethers";
import { currency } from '../constants';
import CountdownTimer from '../components/CountdownTimer';
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from '../components/AdminControls';

const Home: NextPage = () => {

	const address = useAddress();
	const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
	const {data: remainingTickets} = useContractRead(contract, "RemainingTickets");
	const {data: currentWinningReward} = useContractRead(contract, "CurrentWinningReward");
	const {data: ticketPrice} = useContractRead(contract, "ticketPrice");
	const {data: ticketCommission} = useContractRead(contract, "ticketCommission");
	const {data: expiration} = useContractRead(contract, "expiration");
	const {data: tickets} = useContractRead(contract, "getTickets");
	const {data: winnings} = useContractRead(contract, "getWinningsForAddress", address);
	const {data: lastWinner} = useContractRead(contract, "lastWinner");
	const {data: lastWinnerAmount} = useContractRead(contract, "lastWinnerAmount");
	const {data: isLotteryOperator} = useContractRead(contract, "lotteryOperator");
	const {mutateAsync: BuyTickets} = useContractWrite(contract, "BuyTickets");
	const {mutateAsync: WithdrawWinnings} = useContractWrite(contract, "WithdrawWinnings");

	const [quantity, setQuantity] = useState<number>(1);
	const [userTickets, setUserTickets] = useState(0);

	useEffect(() => {
		if(!tickets) return;
		const totalTickets: string[] = tickets;
		const noOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0)	
	})

	if (isLoading) return <Loading/>
	if (!address) return <Login />

	const handleClick = async () => {
		if(!ticketPrice) return;
		const notify = toast.loading("Buying your Tickets...");
		try {
			const data = await BuyTickets([{
				value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString())
			}])
			toast.success("Tickets purchased Successfully!", {
				id: notify
			})
			setUserTickets(userTickets + 1);
		} catch(err) {
			toast.error("Whoooops something went wrong!", {
				id: notify
			})
			console.log("CONTRACT CALL FAILURE", err);
		}
	}

	const onWithdrawWinnings = async () => {
		const notify = toast.loading("Withdrawing Winnings...");
		try {
			const data = await WithdrawWinnings([{}])
			toast.success("Winnings Withdrawn Successfully!", {
				id: notify
			})
		} catch(err) {
			toast.error("Whoooops something went wrong!", {
				id: notify
			})
			console.log("CONTRACT CALL FAILURE", err);
		}
	}

	return (
		<div className="bg-[#0f0f0f] min-h-screen flex flex-col ">
			<Head>
				<title>DAPP</title>
			</Head>

			<div className='flex-1 overflow-y-scroll overflow-x-hidden z-0 scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-[#00ff00]/80' >
				<Header />
				<Marquee className='bg-[#0A1F1C] p-5 mb-5' gradient={false} speed={100} >
					<div className='flex space-x-2 mx-10' >
						<h4 className='text-white' >Last Winner: {lastWinner?.toString()}</h4>
						<h4 className='text-white' >Previous Winnings: {" "}{lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" " + currency + " "}</h4>
					</div>
				</Marquee>

				{isLotteryOperator === address && (
					<div className='flex justify-center' >
						<AdminControls/>
					</div>
				)}

				{winnings > 0 && (
					<div className='text-white max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5' >
						<button onClick={onWithdrawWinnings} className='p-5 bg-gradient-to-b from-black to-emerald-600 animate-pulse text-center rounded-xl w-full' >
							<p className='font-bold' >WINNER!</p>
							<p>Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" " + currency}</p>
							<br/>
							<p className='font-semibold' >Click here to Withdraw</p>
						</button>
					</div>
				)}

				{/* NEXT DRAW */}
				<div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5' >
					<div className='stats-container' >
						<h1 className='text-5xl text-white font-semibold text-center py-3' >The Next Draw</h1>
						<div className='flex justify-between p-2 space-x-2' >
							<div className='stats' >
								<h2 className='text-sm' >Total Pool</h2>
								<p className='text-xl' >{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())}{" " + currency}</p>
							</div>
							<div className="stats">
								<h2 className='text-sm' >Tickets Remaining</h2>
								<p className='text-xl' >{remainingTickets?.toNumber()}</p>
							</div>
						</div>
						{/* COUNTDOWN TIMER */}
						<div className='mt-5 mb-3' >
							<CountdownTimer/>
						</div>
					</div>
					<div className="stats-container space-y-2">
						<div className="stats-container">
							<div className='flex justify-between items-center text-white pb-2' >
								<h2>Price Per Ticket</h2>
								<p>{ticketPrice && ethers.utils.formatEther(ticketPrice.toString())}{" " + currency}</p>
							</div>
							<div className='flex text-white items-center space-x-2 bg-[#0f0f0f] border-[#004337] border p-4' >
								<p>Tickets</p>
								<input className='flex w-full bg-transparent text-right outline-none' type="number" min={1} max={10} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
							</div>
							<div className='space-y-2 mt-5' >
								<div className='flex items-center justify-between text-emerald-300 text-sm' >
									<p>Total Cost of Tickets</p>
									<p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice?.toString())) * quantity}{" " + currency}</p>
								</div>
								<div className="flex items-center justify-between text-emerald-300 text-xs" >
									<p>Service Fees</p>
									<p>{ticketCommission && ethers.utils.formatEther(ticketCommission.toString())}{" " + currency}</p>
								</div>
								<div className="flex items-center justify-between text-emerald-300 text-xs" >
									<p>+ Network Fees</p>
									<p>TBC</p>
								</div>
							</div>
							<button onClick={handleClick} disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0} className='mt-5 w-full bg-gradient-to-br from-black to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl font-semibold !transition-all duration-200 ease-linear hover:from-emerald-600 hover:to-black disabled:from-gray-600 disabled:to-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed' >Buy {quantity} Tickets for {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}{" " + currency}</button>
						</div>
						{userTickets > 0 && (
							<div className='stats' >
								<p className='text-lg mb-2' >You have {userTickets} in this Draw</p>
								<div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2' >
									{Array(userTickets).fill("").map((_, index) => (
										<p key={index} className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs" >{index + 1}</p>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
