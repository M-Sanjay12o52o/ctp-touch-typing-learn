import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserDropdown from "./UserDropdown";
import Image from "next/image";

export default async function Navbar() {
  // Fetch user session on the server
  const session = await getServerSession(options);

  return (
    <nav className="flex items-center justify-between px-16 h-24 bg-white border-b border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="flex items-center cursor-pointer">
        <Image
          src={"/keystream_logo.svg"}
          width={100}
          height={100}
          alt="logo"
        />
        <Link href="/">
          <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent tracking-widest drop-shadow-sm">
            KEYSTREAM
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      {session?.user && (
        <div className="flex items-center space-x-10">
          {["Typing Test", "Learn", "Progress", "Lessons", "Certificate"].map(
            (item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                className="relative px-4 py-2 text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            ),
          )}
        </div>
      )}

      {/* User Profile Section */}
      {session ? (
        <UserDropdown user={session?.user} />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Hey! Log in
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 shadow-md border rounded-lg">
            <DropdownMenuItem>
              <Link
                href="/signup"
                className="block w-full px-6 py-2 text-white bg-blue-600 hover:bg-blue-500 font-bold text-center rounded-md transition-all duration-200"
              >
                Sign Up
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href="/signin"
                className="block w-full px-6 py-2 text-white bg-gray-800 hover:bg-gray-700 font-bold text-center rounded-md transition-all duration-200"
              >
                Sign In
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
}
