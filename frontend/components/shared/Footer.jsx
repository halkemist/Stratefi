import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-center w-full p-8">
      <div className="flex justify-center text-gray-400 text-lg">
        <div className="mr-2">Brand assets</div>
        <div className="mr-2">|</div>
        <div className="mr-2">Find us on</div>
        <div className="flex items-center">
          <div className="mr-2"><FaDiscord /></div>
          <div className="mr-2"><FaTwitter/></div>
          <div className="mr-2"><FaGithub/></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;