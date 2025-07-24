import Link from "next/link";

export default function SidebarDashboard() {
    return (
        <div className="absolute top-0 left-0 w-56 h-screen overflow-y-auto mt-16 bg-amber-400" >
            <div className="flex flex-col gap-4 text-2lg">
                <Link href={"/dashboard/learnscategories"}>
                    Learn Categories
                </Link>
                <Link href={"/dashboard/learn"}>
                    Learn
                </Link>
                <Link href={"/dashboard/mycomponents"}>
                    My Components
                </Link>
                <Link href={"/dashboard/users"}>
                    Users
                </Link>
            </div>
        </div>
    )
}