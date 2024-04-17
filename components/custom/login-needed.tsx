import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginNeeded() {
  return (
    <div className="flex flex-col space-y-8 items-center pt-32">
      <h2 className="text-3xl font-bold">Sign In needed</h2>
      <p className="text-xl font-bold">
        You need to sign in before continuing.
      </p>
      <Link href="/">
        <Button className="my-4">Return Home</Button>
      </Link>
    </div>
  );
}
