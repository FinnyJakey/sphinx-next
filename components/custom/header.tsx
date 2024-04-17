import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggler";
import ProfileDropdownMenu from "@/components/custom/profile-dropdown-menu";

export default function Header() {
  return (
    <nav className="flex border-b p-2 items-center justify-between">
      <Link href="/" className="px-4 py-2 font-bold text-xl">
        SPHINX
      </Link>

      <div className="flex space-x-2 px-4">
        <ModeToggle />
        <ProfileDropdownMenu />
      </div>
    </nav>
  );
}
