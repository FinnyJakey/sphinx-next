import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from "@/firebase/firebase-client";
import { useRouter } from "next/navigation";

export default function SignUpDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [emailNotEmpty, setEmailNotEmpty] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [passwordNotEmpty, setPasswordNotEmpty] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [usernameNotEmpty, setUsernameNotEmpty] = useState<boolean>(true);
  const [signUpNotError, setSignUpNotError] = useState<boolean>(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailNotEmpty(true);
    setPasswordNotEmpty(true);
    setPasswordsMatch(true);
    setUsernameNotEmpty(true);
    setSignUpNotError(true);

    if (email.trim().length === 0) {
      setEmailNotEmpty(false);
      return;
    }

    if (password.trim().length === 0) {
      setPasswordNotEmpty(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    if (username.trim().length === 0) {
      setUsernameNotEmpty(false);
      return;
    }

    setButtonDisabled(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const response = await fetch("/api/signUp", {
        method: "POST",
        body: JSON.stringify({
          uuid: userCredential.user.uid,
          username: username,
          createdAt: new Date(),
        }),
      });

      if (response.status != 200) {
        throw new Error("Sign Up Error ");
      }

      router.replace("/projects");
    } catch (error) {
      setSignUpNotError(false);
      console.error("Error:", error);
    }

    setButtonDisabled(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>
            You need to sign up before continuing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {!emailNotEmpty && (
            <p className="text-red-500 text-sm">Email is Empty.</p>
          )}

          {!passwordNotEmpty && (
            <p className="text-red-500 text-sm">Password is Empty.</p>
          )}

          {!passwordsMatch && (
            <p className="text-red-500 text-sm">Passwords do not match.</p>
          )}

          {!usernameNotEmpty && (
            <p className="text-red-500 text-sm">Username is Empty.</p>
          )}

          {!signUpNotError && (
            <p className="text-red-500 text-sm">Sign Up Error Occurred.</p>
          )}

          <DialogFooter className="flex justify-between pt-2">
            <Button variant="default" type="submit" disabled={buttonDisabled}>
              Sign Up
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
