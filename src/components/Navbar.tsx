import Link from "next/link";

const Navbar = () => {
    return <>
        <div className="flex flex-row gap-4 bg-red-500 mx-4 text-4xl">
            <Link href={"/"}>Home</Link>
            <Link href={"/login"}>Login</Link>
        </div>
    </>
}

export default Navbar;