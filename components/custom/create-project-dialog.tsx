import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/firebase-client";
import PDFDropzone from "@/components/custom/pdf-dropzone";
import { useRouter } from "next/navigation";

export default function CreateProjectDialog({
  createProjectOpen,
  setCreateProjectOpen,
}: {
  createProjectOpen: boolean;
  setCreateProjectOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const [projectName, setProjectName] = useState<string>("");
  const [projectNameNotEmpty, setProjectNameNotEmpty] = useState<boolean>(true);

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setProjectNameNotEmpty(true);

    if (projectName.trim().length === 0) {
      setProjectNameNotEmpty(false);
      return;
    }

    if (uploadFile == null) {
      return;
    }

    setButtonDisabled(true);

    let formData = new FormData();

    formData.append("file", uploadFile);
    formData.append("uuid", auth.currentUser!.uid);
    formData.append("projectName", projectName);

    const response = await fetch("/api/createProject", {
      method: "POST",
      body: formData,
    });

    setButtonDisabled(false);

    router.replace(`/projects/${await response.text()}`);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    setUploadFile(acceptedFiles[0]);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setProjectName("");
      setUploadFile(null);
    }
    setCreateProjectOpen(isOpen);
  };

  return (
    <>
      <Dialog open={createProjectOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Project</DialogTitle>
            <DialogDescription>
              Upload your PDF for making summarization and tests.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-2">
            {uploadFile == null ? (
              <PDFDropzone onDrop={onDrop} />
            ) : (
              <h2>{uploadFile.name}</h2>
            )}

            <Input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            {!projectNameNotEmpty && (
              <p className="text-red-500 text-sm">Project Name is Empty.</p>
            )}

            <DialogFooter className="flex justify-between pt-2">
              <Button variant="default" type="submit" disabled={buttonDisabled}>
                Continue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
