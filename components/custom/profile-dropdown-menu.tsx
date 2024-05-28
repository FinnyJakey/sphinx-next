"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FolderOpenDot, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { auth } from "@/firebase/firebase-client";
import { useEffect, useState } from "react";
import SignInDialog from "@/components/custom/sign-in-dialog";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfileDropdownMenu() {
  const router = useRouter();

  const [signInOpen, setSignInOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);

      if (authUser != null) {
        fetch(`/api/getUsername?uuid=${authUser.uid}`, {
          method: "GET",
        }).then(async (response: Response) => {
          if (response.status == 200) {
            setUsername(await response.text());
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignInClick = () => {
    setSignInOpen(true);
  };

  const handleSignOutClick = async () => {
    router.replace("/");

    await auth.signOut();
  };

  const handleProjectsClick = () => {
    router.push("/projects");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <UserIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          {user ? (
            <>
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProjectsClick}>
                <FolderOpenDot className="mr-2 h-4 w-4 text-blue-400" />
                <span>Projects</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOutClick}>
                <LogOut className="mr-2 h-4 w-4 text-red-400" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={handleSignInClick}>
              <LogIn className="mr-2 h-4 w-4 text-green-400" />
              <span>Sign in</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <SignInDialog isOpen={signInOpen} setIsOpen={setSignInOpen} />
    </>
  );
}
