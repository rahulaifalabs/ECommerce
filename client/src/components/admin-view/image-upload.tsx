import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import api from "@/utils/api";

// ✅ Props definition
interface ProductImageUploadProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imageLoadingState: boolean;
  setImageLoadingState: (loading: boolean) => void;
  uploadedImageUrl: string | null;
  setUploadedImageUrl: (url: string | null) => void;
  isEditMode: boolean;
  isCustomStyling?: boolean;
}

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Handle file selection
  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  // ✅ Drag & drop handlers
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  // ✅ Remove selected image
  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  // ✅ Upload image to server
  async function uploadImage() {
    if (!imageFile) return;
    try {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await api.post<{ success: boolean; result: { url: string } }>(
        "/admin/products/upload-image",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setImageLoadingState(false);
    }
  }

  // ✅ Trigger upload when file changes
  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
