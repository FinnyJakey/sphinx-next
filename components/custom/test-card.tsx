import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function TestCard({ test }: { test: any }) {
  const [explanationToggle, setExplanationToggle] = useState<boolean>(false);

  return (
    <div className="px-2 py-4 space-y-3">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Question</h1>
        <h2>{test["question"]}</h2>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Options</h1>
        {test["options"].map((option: string, index: number) => {
          const answer: number = test["answer"];
          const [currentIndex, setCurrentIndex] = useState<number | null>(null);

          return (
            <Button
              variant="ghost"
              onClick={() => {
                if (index != answer) {
                  toast("That's wrong! Select the other option.");
                }

                setCurrentIndex(index);
              }}
              className={`flex ${answer == currentIndex ? "bg-green-200" : null}`}
            >
              <h2 className="text-base font-normal text-gray-700">
                {index + 1}. {option}
              </h2>
            </Button>
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-xl font-semibold">Explanation</h1>
          <Switch
            checked={explanationToggle}
            onCheckedChange={setExplanationToggle}
          />
        </div>

        <h2>{explanationToggle ? test["explanation"] : ""}</h2>
      </div>
    </div>
  );
}
