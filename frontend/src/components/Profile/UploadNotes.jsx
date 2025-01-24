import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUploadFiles } from "@/hooks/useUploadFiles";
import "@/App.css";
import { addNotes } from "@/store/slices/notesSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
const UploadNotes = ({ open, setOpen }) => {
  const { toast } = useToast();
  const { loading, uploadFiles } = useUploadFiles();
  const [uploadedFilesList, setUploadedFilesList] = useState([]);
  const [files, setFiles] = useState(null);
  const [notes, setNotes] = useState({
    subject: "",
    branch: "Computer Science",
    files: [],
  });
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let totalfilesize = 0;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 10 * 1024 * 1024) {
        return toast({
          title: "Error uploading files",
          description:
            "Individual file size can't be grater than 10mb and total file size can't be greater than 50mb",
          variant: "destructive",
        });
      }
      totalfilesize += files[i].size;
    }

    if (totalfilesize > 50 * 1024 * 1024)
      return toast({
        title: "Error uploading files",
        description:
          "Individual file size can't be grater than 10mb and total file size can't be greater than 50mb",
        variant: "destructive",
      });

    for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
    const data = await uploadFiles(formData);

    if (data?.files) {
      setUploadedFilesList([...uploadedFilesList, ...data.files]);
      setNotes({ ...notes, files: [...notes.files, ...data.files] });
    } else {
      toast({
        title: "Internal Server Error",
        description: "Error uploading files",
        variant: "destructive",
      });
    }
  };

  const removeUploadedFile = (index) => {
    const files = [...uploadedFilesList];
    const newFiles = files.filter((item, idx) => idx != index);
    setUploadedFilesList(newFiles);
  };

  const handleSubmit = () => {
    dispatch(addNotes(notes)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Congratulations",
          description: "Files Uploaded Successfully.Once approved will be visible on the notes page",
        });
        handleClose();
        setNotes({
          subject: "",
          branch: "Computer Science",
          files: [],
        }) 
        setFiles(null)
      } else {
        toast({
          title: "Sorry !",
          description: "Error occurred while adding notes.",
          variant: "destructive",
        });
        setNotes({
          subject: "",
          branch: "Computer Science",
          files: [],
        }) 
        setFiles(null)
      }
    });
    
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={handleClose} className="relative">
        <DialogContent className="remove-scrollbar mx-auto max-h-[70vh] overflow-y-scroll max-w-[70vw] lg:max-w-[60vw] xl:max-w-[45vw]">
          <div className="w-full flex flex-col sm:flex-row  gap-4 justify-center items-center sm:justify-evenly mt-3">
            <div>
              <Input
                placeholder="Subject Name"
                className="w-[120px] text-[10px] md:text-[16px] h-[25px] md:w-40 md:h-10 border-[2px] border-[black]"
                value={notes?.subject || ""}
                onChange={(e) =>
                  setNotes({ ...notes, subject: e.target.value })
                }
              />
            </div>
            <div>
              <Select
                onValueChange={(value) => setNotes({ ...notes, branch: value })}
                value={notes.branch}
              >
                <SelectTrigger className="w-[150px] h-6 md:w-[180px] md:h-10 border-[2px] border-[black]">
                  <SelectValue
                    className="text-[10px] md:text-[16px]"
                    placeholder="Select Branch"
                  />
                </SelectTrigger>
                <SelectContent className="text-[10px] md:text-[16px]">
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Information Technology">
                    Information Technology
                  </SelectItem>
                  <SelectItem value="Electronics and Communication">
                    Electronics and Communication
                  </SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Chemical">Chemical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <form className="gap-x-5" encType="multipart/form-data">
              <Input
                type="file"
                className="cursor-pointer text-[10px] file:text-[10px] sm:file:text-[16px] file:bg-[#282f3c] file:px-5 file:py-2 file:rounded-3xl file:mr-5  file:text-[white] border-none  w-30 h-10"
                multiple={true}
                accept=".pdf, .jpg, .jpeg, .png, .ppt, .pptx, .gif, .bmp , .docx, .doc"
                onChange={(e) => setFiles(e.target.files)}
              />
              {loading ? (
                <div className="mx-auto flex justify-center mt-5">
                <Button
                  className="h-6 text-[10px] sm:text-[16px] sm:h-10 mt-2"
                >
                  Loading
                </Button>
              </div>
              ) : (
                <div className="mx-auto flex justify-center mt-5">
                  <Button
                    onClick={(e) => handleUpload(e)}
                    className="h-6 text-[10px] sm:text-[16px] sm:h-10 mt-2"
                  >
                    Upload Files
                  </Button>
                </div>
              )}
            </form>
          </div>
          <div className="flex flex-col gap-3">
            {uploadedFilesList.map((item, idx) => {
              return (
                <div key={idx} className="w-[80%] mx-auto flex justify-between">
                  <div>
                    <a href={item?.url}>{item?.originalname || ""}</a>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => removeUploadedFile(idx)}
                  >
                    <Trash2 />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center">
            <Button
              className="text-[10px] sm:text-[16px]"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadNotes;
