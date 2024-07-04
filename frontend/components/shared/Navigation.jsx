'use client';

import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {

  const pathname = usePathname();

  return (
    <nav className="border-t">
      <div className="absolute right-0 p-6">
        <ConnectButton/>
      </div>
      <h1 className="text-xl font-bold border-b p-4">STRATEFI</h1>
      <ul className="p-4">
        <li className="mb-4">
          <Button className={`w-full hover:bg-black hover:text-white ${pathname === '/dashboard' ? 'bg-black text-white' : ''}`} variant="outline" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </li>
        <li className="mb-4">
          <Button className={`w-full hover:bg-black hover:text-white ${pathname === '/dashboard/strategies' ? 'bg-black text-white' : ''}`} variant="outline" asChild>
            <Link href="/dashboard/strategies">Strategies</Link>
          </Button>
        </li>
        <li className="mb-4">
          <Button className={`w-full hover:bg-black hover:text-white ${pathname.includes('/dashboard/strategy-maker') ? 'bg-black text-white' : ''}`} variant="outline" asChild>
            <Link href="/dashboard/strategy-maker">Become Strategy Maker</Link>
          </Button>
        </li>
        <li className="mb-4">
          <Button className={`w-full hover:bg-black hover:text-white ${pathname === '/dashboard/profile' ? 'bg-black text-white' : ''}`} variant="outline" asChild>
            <Link href="/dashboard/profile">Profile</Link>
          </Button>
        </li>
        <li className="mb-4">
          <Button className={`w-full hover:bg-black hover:text-white ${pathname.includes('/dashboard/governance') ? 'bg-black text-white' : ''}`} variant="outline" asChild>
            <Link href="/dashboard/governance">Governance</Link>
          </Button>
        </li>
        <li className="mb-4">
          <Button className={`w-full hover:bg-black hover:text-white ${pathname === '/dashboard/project-details' ? 'bg-black text-white' : ''}`} variant="outline" asChild>
            <Link href="/dashboard/project-details">Project Details</Link>
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;