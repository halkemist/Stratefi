'use client';

import { useParams } from 'next/navigation';
import { useAccount, useWriteContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { config } from '@/app/config';
import { parseEther, formatEther } from 'viem';

// UI components
import { FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

// Constants
import { contractAbi as contractStrategyAbi } from '@/constants/strategy';
import { contractAbi as contractVaultAbi } from '@/constants/vault';

const strategy = () => {
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  const { strategy: strategyAddress } = useParams();
  const { address: userAddress } = useAccount();

  const [strategy, setStrategy] = useState([]);
  const [vault, setVault] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ethAmount, setEthAmount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [strategyAddress])

  const fetchStrategy = async() => {
    try {
      const sName = await config.readContract({
        abi: contractStrategyAbi,
        address: strategyAddress,
        functionName: "strategyType",
        account: userAddress,
      });

      const sVault = await config.readContract({
        abi: contractStrategyAbi,
        address: strategyAddress,
        functionName: "vault",
        account: userAddress,
      });

      return { name: sName, vaultAddress: sVault };
    } catch (error) {
      console.error("Failed to fetch strategy", error);
      return { name: "Unknown", vaultAddress: "Unknown" };
    }
  }

  const fetchVault = async(vaultAddress) => {
    try {
      const vETHBalance = await config.readContract({
        abi: contractVaultAbi,
        address: vaultAddress,
        functionName: "getBalance",
        args: [userAddress],
      });

      const vWETHBalance = await config.readContract({
        abi: contractVaultAbi,
        address: vaultAddress,
        functionName: "getWETHBalance",
        args: [userAddress],
      });

      return { ethBalance: vETHBalance, wethBalance: vWETHBalance };
    } catch (error) {
      console.error("Failed to fetch vault", error);
      return { ethBalance: "Unknown", wethBalance: "Unknown" };
    }
  }

  const fetchData = async() => {
    setLoader(true);

    if (strategyAddress) {
      const strategyData = await fetchStrategy(strategyAddress);
      setStrategy(strategyData);
      const vaultData = await fetchVault(strategyData.vaultAddress);
      setVault(vaultData);
      console.log(strategyData)
      console.log(vaultData)
    }

    setLoader(false);
  }

  const handleDepositEth = async() => {
    try {
      await writeContractAsync({
        abi: contractStrategyAbi,
        address: strategyAddress,
        functionName: "executeStrategy",
        value: parseEther(ethAmount),
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Delegate error",
            description: error.cause.message
          })
        },
        onSuccess: (data) => {
          console.log(data)
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleInputEthChange = (event) => {
    setEthAmount(event.target.value);
  };

  return (
    <>
    <h2 className="font-bold text-2xl mb-4">Strategy</h2>
    {loader ? (
      <div className="flex items-center gap-2">
        <FaSpinner className="spinner"/> 
        <span>Loading...</span>
      </div>
    ) : (
      <>
        <div className="text-xl mb-2">{strategy.name}</div>
        <div>Your Vault ETH Balance: {formatEther(Number(vault.ethBalance))}</div>
        <div>Your Vault WETH Balance: {formatEther(Number(vault.wethBalance))}</div>
        <div className="flex gap-3 mt-2">
          <Button onClick={handleDepositEth}>Deposit ETH</Button>
          <Button disabled={(Number(vault.ethBalance) > 0) ? false : true}>Convert to WETH</Button>
          <Button disabled={(Number(vault.wethBalance) > 0) ? false : true}>Deposit to AAVE</Button>
        </div>
        <div className="flex gap-3 mt-2">
          <Input onChange={handleInputEthChange} type="number" placeholder="ETH Amount" className="w-1/2 rounded-xl"></Input>
        </div>
      </>
    )}
    </>
  )
}

export default strategy;