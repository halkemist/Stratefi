'use client';

// React
import { useEffect, useState } from "react";
import Link from "next/link";

// Constants
import { contractAddress as contractFactoryAddress, contractAbi as contractFactoryAbi } from "@/constants/strategyfactory";
import { contractAbi as contractStrategyAbi } from "@/constants/strategy";
import { useWatchContractEvent, useWatchBlockNumber } from "wagmi";
import { config } from "@/app/config";
import { useAccount } from "wagmi";

// UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa";

const Strategies = () => {

  const { address } = useAccount();

  // State
  const [strategiesAddresses, setStrategiesAddresses] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ currentBlockNumber, setCurrentBlockNumber ] = useState(0);

  useWatchBlockNumber({
    onBlockNumber(blockNumber) {
      setCurrentBlockNumber(Number(blockNumber))
    },
  });

  useWatchContractEvent({
    address: contractFactoryAddress,
    abi: contractFactoryAbi,
    fromBlock: BigInt(currentBlockNumber) - BigInt(4999),
    eventName: "StrategyCreated",
    onLogs(logs) {
      if (logs.length > 0) {
        const newAddresses = logs.map(log => log.args.strategyAddress)
        setStrategiesAddresses(prevAddresses => {
          const addressSet = new Set([...prevAddresses, ...newAddresses]);
          return Array.from(addressSet);
        });
      }
    }
  })

  useEffect(() => {
    setLoader(true);
  }, [])

  useEffect(() => {
    if(strategiesAddresses.length > 0) {
      fetchStrategies();
    }
  }, [strategiesAddresses])

  const fetchStrategies = async() => {
    const strategiesData = await Promise.all(strategiesAddresses.map(addy => fetchStrategy(addy)));
    setLoader(false);
    setStrategies(strategiesData);
  }

  const fetchStrategy = async(strategyAddy) => {
    try {
      const sName = await config.readContract({
        abi: contractStrategyAbi,
        address: strategyAddy,
        functionName: "strategyType",
        account: address,
      });

      const sCreator = await config.readContract({
        abi: contractStrategyAbi,
        address: strategyAddy,
        functionName: "creator",
        account: address,
      });

      const sVault = await config.readContract({
        abi: contractStrategyAbi,
        address: strategyAddy,
        functionName: "vault",
        account: address,
      });

      const sUses = await config.readContract({
        abi: contractStrategyAbi,
        address: strategyAddy,
        functionName: "uses",
        account: address,
      });

      return { address: strategyAddy, name: sName, creator: sCreator, vaultAddress: sVault, uses: sUses};
    } catch (error) {
      console.error("Failed to fetch strategy", error);
      return { address: strategyAddy, name: "Unknown", creator: "Unknown", vaultAddress: "Unknown", uses: "Unknow" };
    }
  }

  return (
    <>
      <h2 className="font-bold text-2xl">Strategies</h2>

      {loader ? (
        <div className="flex items-center gap-2">
          <FaSpinner className="spinner"/> 
          <span>Loading...</span>
        </div>
      ) : (
        <div className="mt-4">
        {strategies.map(strategy => (
            <Card key={strategy.address} className="w-1/3 mb-2">
              <CardHeader>
                <CardTitle>{strategy.name}</CardTitle>
                <CardDescription>Author: {strategy.creator}</CardDescription>
              </CardHeader>
              <CardContent>
                Uses: {strategy.uses}
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/strategies/${strategy.address}`}>
                  <Button disabled={strategy.creator === address ? true : false}>
                    Use Strategy
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default Strategies;