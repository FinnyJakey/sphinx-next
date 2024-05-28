"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase-client";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import TestCard from "@/components/custom/test-card";

export default function Project({ params }: { params: { projectId: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [project, setProject] = useState<any | null>(null);

  const [viewLoading, setViewLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        fetch(
          `/api/getProject?uuid=${authUser.uid}&projectId=${params.projectId}`,
          {
            method: "GET",
          },
        )
          .then(async (response: Response) => {
            if (response.status == 200) {
              setProject(await response.json());
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDownloadButtonClick = () => {
    setViewLoading(true);
    fetch(
      `/api/getOriginalPdf?uuid=${auth.currentUser!.uid}&projectId=${params.projectId}`,
      {
        method: "GET",
      },
    )
      .then(async (response: Response) => {
        if (response.status == 200) {
          const result = await response.json();

          const newWindow = window.open(
            result["url"],
            "_blank",
            "noopener,noreferrer",
          );

          if (newWindow) newWindow.opener = null;

          setViewLoading(false);
        }
      })
      .catch((error) => {
        setViewLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center pt-32">
          <Loader />
        </div>
      ) : (
        <>
          {project != null ? (
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold">Summarized</h1>
                <h3 className="text-gray-500">{project["summarized"]}</h3>
              </div>

              <div className="space-y-2">
                <h1 className="text-xl font-semibold">Tests</h1>
                <div className="px-10">
                  <Carousel orientation="horizontal">
                    <CarouselContent>
                      {project["tests"].map((test: any) => {
                        return (
                          <CarouselItem>
                            <Card>
                              <CardContent>
                                <TestCard test={test}></TestCard>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>

              <div className="flex flex-row items-center space-x-4">
                <h1 className="text-xl font-semibold">View Original PDF</h1>
                <Button
                  onClick={handleDownloadButtonClick}
                  disabled={viewLoading}
                >
                  View
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
