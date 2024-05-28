"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase-client";
import { User } from "firebase/auth";
import LoginNeeded from "@/components/custom/login-needed";
import { CirclePlus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateProjectDialog from "@/components/custom/create-project-dialog";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Projects() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Array<any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        fetch(`/api/getAllProjects?uuid=${authUser.uid}`, {
          method: "GET",
        })
          .then(async (response: Response) => {
            if (response.status == 200) {
              setProjects(await response.json());
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setIsLoading(false);
      }

      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  const [createProjectOpen, setCreateProjectOpen] = useState<boolean>(false);

  const handleCreateProjectOpen = () => {
    setCreateProjectOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      {user && projects !== null ? (
        <div className="grid grid-cols-6 gap-4">
          <Button
            variant="outline"
            className="w-auto h-44 m-6"
            onClick={handleCreateProjectOpen}
          >
            <div className="flex flex-col items-center space-y-2">
              <CirclePlus className="text-gray-400" />
              <p className="text-gray-400">Add a new project</p>
            </div>
          </Button>

          <CreateProjectDialog
            createProjectOpen={createProjectOpen}
            setCreateProjectOpen={setCreateProjectOpen}
          />

          {projects.map((project) => {
            return (
              <>
                <Button
                  variant="outline"
                  className="w-auto h-44 m-6"
                  onClick={() => {
                    handleProjectClick(project.file.split(".")[0]);
                  }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-primary">{project.projectName}</p>
                    <p className="text-gray-400">
                      {formatDate(
                        new Timestamp(
                          project.createdAt._seconds,
                          project.createdAt._nanoseconds,
                        ).toDate(),
                      )}
                    </p>
                  </div>
                </Button>
              </>
            );
          })}
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex flex-col items-center pt-32">
              <Loader />
            </div>
          ) : (
            <LoginNeeded />
          )}
        </>
      )}
    </>
  );
}
