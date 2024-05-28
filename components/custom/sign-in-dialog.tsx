import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignUpDialog from "@/components/custom/sign-up-dialog";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase-client";
import { useRouter } from "next/navigation";

export default function SignInDialog({
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

  const [signInNotError, setSignInNotError] = useState<boolean>(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailNotEmpty(true);
    setPasswordNotEmpty(true);
    setSignInNotError(true);

    if (email.trim().length === 0) {
      setEmailNotEmpty(false);
      return;
    }

    if (password.trim().length === 0) {
      setPasswordNotEmpty(false);
      return;
    }

    setButtonDisabled(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsOpen(false);
      router.replace("/projects");
    } catch (error) {
      setSignInNotError(false);
      console.error("Error:", error);
    }

    setButtonDisabled(false);
  };

  const [signUpOpen, setSignUpOpen] = useState(false);

  const handleSignUpClick = () => {
    setIsOpen(false);
    setSignUpOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              You need to sign in before continuing.
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

            {!emailNotEmpty && (
              <p className="text-red-500 text-sm">Email is Empty.</p>
            )}

            {!passwordNotEmpty && (
              <p className="text-red-500 text-sm">Password is Empty.</p>
            )}

            {!signInNotError && (
              <p className="text-red-500 text-sm">An Error Occurred.</p>
            )}

            <div className="flex justify-between pt-2">
              <div className="flex items-center">
                <DialogDescription>Do not have an account?</DialogDescription>
                <Button
                  variant="link"
                  size="sm"
                  type="button"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </Button>
              </div>

              <Button variant="default" type="submit" disabled={buttonDisabled}>
                Continue
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <SignUpDialog isOpen={signUpOpen} setIsOpen={setSignUpOpen} />
    </>
  );
}
