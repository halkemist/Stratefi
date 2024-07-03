'use client';

// UI
import { FaWallet } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaSpinner } from "react-icons/fa";

// React & Wagmi & Viem & Config
import { config } from "@/app/config";
import { getBalance } from "viem/actions";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

// Constants
import { contractAbi as SFTabi, contractAddress as SFTaddress } from "@/constants/token";

const Profile = () => {

  const { address: userAddress } = useAccount();

  const [balances, setBalances] = useState({
    eth: 0,
    sft: 0
  });

  const [loader, setLoader] = useState(true);

  const balanceETH = async() => {
    getBalance(config, {
      address: userAddress,
    }).then((response) => {
      const ethBalance = formatEther(response)
      if (ethBalance > 0) {
        setBalances((prevBalances) => ({
          ...prevBalances,
          eth: ethBalance
        }));
      }
    });
  };

  const balanceSFT = async() => {
    config.readContract({
      abi: SFTabi,
      address: SFTaddress,
      functionName: 'balanceOf',
      args: [
        userAddress
      ]
    }).then((response) => {
      const sftBalance = formatEther(response)
      if (sftBalance > 0) {
        setBalances((prevBalances) => ({
          ...prevBalances,
          sft: sftBalance
        }));
      }
    });
  };

  useEffect(() => {
    const fetchBalances = async() => {
      await balanceETH();
      await balanceSFT();
      setLoader(false);
    }

    if (userAddress) {
      fetchBalances();
    }
  }, [userAddress]);

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <FaWallet/>
        <h2>Wallet</h2>
      </div>
      {loader ? (<FaSpinner className="spinner"/>) : (
        <div className="w-2/3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Token</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">USD Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ETH</TableCell>
                <TableCell>$0</TableCell>
                <TableCell>{balances.eth}</TableCell>
                <TableCell className="text-right">$0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">SFT</TableCell>
                <TableCell>$0</TableCell>
                <TableCell>{balances.sft}</TableCell>
                <TableCell className="text-right">$0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default Profile;