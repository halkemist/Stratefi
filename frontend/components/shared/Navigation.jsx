import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="p-4">
      <ul>
        <li className="mb-4">
            <Button className="w-full" variant="outline">Home</Button>
        </li>
        <li className="mb-4">
            <Button className="w-full" variant="outline">Governance</Button>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;