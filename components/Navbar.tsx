import { Coffee } from "lucide-react"
import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between w-full px-4 py-2 border-b-2 border-dotted">
            <Link href={"/"}>
                <h1 className="text-2xl font-bold"><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">ai</span>.CVscan</h1>
            </Link>
            <button className="flex items-center justify-center gap-3">
                Buy me a<Coffee />
            </button>
        </nav>
    )
}

export default Navbar