"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main>
      <div className="pt-32 flex flex-col items-center space-y-6">
        <h1 className="text-6xl font-semibold">Upload your PDF for</h1>
        <div className="bg-secondary px-8 py-4 rounded-xl">
          <h2 className="text-6xl font-extrabold">Summarization</h2>
        </div>
        <h3 className="text-2xl font-semibold">and</h3>
        <div className="bg-secondary px-8 py-4 rounded-xl">
          <h2 className="text-6xl font-extrabold">Your own Tests</h2>
        </div>
        <h2 className="text-4xl font-semibold text-violet-400">with AI</h2>

        <Button
          className="px-8 py-6"
          onClick={() => {
            router.push("/projects");
          }}
        >
          Go to the Projects
        </Button>
      </div>
    </main>
  );
}
