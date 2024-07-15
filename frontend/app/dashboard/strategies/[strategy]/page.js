'use client';

import { useParams } from 'next/navigation';
import { useAccount, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'viem/actions';
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
import { contractAddress as contractATokenAddress } from '@/constants/atoken';
import { contractAbi as contractATokenAbi } from '@/constants/atoken';

const Strategy = () => {
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
        args: [userAddress],
        value: parseEther(ethAmount),
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Deposit ETH error",
            description: error.cause.message
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleConvertEthToWeth = async() => {
    try {
      await writeContractAsync({
        abi: contractVaultAbi,
        address: strategy.vaultAddress,
        functionName: "convertToWeth",
        args: [parseEther(ethAmount)],
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Convert ETH error",
            description: error.cause.message
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleApproveWETH = async() => {
    try {
      await writeContractAsync({
        abi: contractVaultAbi,
        address: strategy.vaultAddress,
        functionName: "approveProtocol",
        args: [parseEther(ethAmount)],
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "WETh Approval error",
            description: error.cause.message
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleDepositProtocol = async() => {
    try {
      await writeContractAsync({
        abi: contractVaultAbi,
        address: strategy.vaultAddress,
        functionName: "depositInProtocol",
        args: [parseEther(ethAmount)],
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Deposit into protocol error",
            description: error.cause.message
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const approveAToken = async() => {
    try {
      await writeContractAsync({
        abi: contractATokenAbi,
        address: contractATokenAddress,
        functionName: "approve",
        args: [
          strategy.vaultAddress,
          parseEther(ethAmount)
        ],
      }, {
        onError: (error) => {
          console.log(error)
          toast({
            variant: "destructive",
            title: "aToken approval error",
            description: ""
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleWithdrawProtocol = async() => {
    try {
      await writeContractAsync({
        abi: contractVaultAbi,
        address: strategy.vaultAddress,
        functionName: "withdrawFromProtocol",
        args: [
          parseEther(ethAmount),
          contractATokenAddress // aToken Base Sepolia Testnet Address
        ],
      }, {
        onError: (error) => {
          console.log(error)
          toast({
            variant: "destructive",
            title: "Withdraw from protocol error",
            description: ""
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleConvertWethToEth = async() => {
    try {
      await writeContractAsync({
        abi: contractVaultAbi,
        address: strategy.vaultAddress,
        functionName: "convertToEth",
        args: [parseEther(ethAmount)],
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "WETH to ETH convert error",
            description: error.cause.message
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const handleWithdraw = async() => {
    try {
      await writeContractAsync({
        abi: contractVaultAbi,
        address: strategy.vaultAddress,
        functionName: "withdrawFromVault",
        args: [parseEther(ethAmount)],
      }, {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Withdraw from vault error",
            description: error.cause.message
          })
        },
        onSuccess: (data) => {
          waitForTx(data);
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const waitForTx = async(txHash) => {
    setLoader(true);
    try {
      const receipt = await config.waitForTransactionReceipt({
        hash: txHash,
      });
      if(receipt.status === 'success') {
        setTimeout(() => {
          fetchData();
        }, 1000)
      } else {
        setLoader(false);
        toast({
          variant: "destructive",
          title: "Transaction error, please refresh the page or retry",
          description: error.cause.message
        })
      }
    } catch (error) {
      setLoader(false);
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
        <div>Your Vault ETH Balance: <span className='font-bold'>{formatEther(Number(vault.ethBalance))}</span></div>
        <div>Your Vault WETH Balance: <span className='font-bold'>{formatEther(Number(vault.wethBalance))}</span></div>
        <hr className='w-20 my-2'></hr>
        <div>Please follow all of these steps:</div>
        <div className="flex gap-3 mt-2">
          <Button onClick={handleDepositEth}>Deposit ETH</Button>
          <Button onClick={handleConvertEthToWeth} disabled={(Number(vault.ethBalance) > 0) ? false : true}>Convert to WETH</Button>
          <Button onClick={handleApproveWETH} disabled={(Number(vault.wethBalance) > 0) ? false : true}>Approve WETH</Button>
          <Button onClick={handleDepositProtocol} disabled={(Number(vault.wethBalance) > 0) ? false : true}>Deposit to AAVE</Button>
          <Button onClick={approveAToken}>Approve aToken from AAVE</Button>
          <Button onClick={handleWithdrawProtocol}>Withdraw from AAVE</Button>
          <Button onClick={handleConvertWethToEth} disabled={(Number(vault.wethBalance) > 0) ? false : true}>Convert WETH to ETH</Button>
          <Button onClick={handleWithdraw} disabled={(Number(vault.ethBalance) > 0) ? false : true}>Withdraw from vault</Button>
        </div>
        <div className="flex gap-3 mt-2">
          <Input onChange={handleInputEthChange} type="number" placeholder="ETH Amount" className="w-1/2 rounded-xl"></Input>
        </div>
      </>
    )}
    </>
  )
}

export default Strategy;