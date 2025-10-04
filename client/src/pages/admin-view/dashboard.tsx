import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ---------------- Types ----------------
interface FeatureImage {
  _id: string;
  image: string;
}

function AdminDashboard() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const { featureImageList } = useSelector(
    (state: RootState) => state.commonFeature
  ) as { featureImageList: FeatureImage[] };

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage(uploadedImageUrl)).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl(null);
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        isEditMode={false}
      />

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!uploadedImageUrl || imageLoadingState}
      >
        Upload
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((featureImgItem, index) => (
            <div key={featureImgItem._id || index} className="relative">
              <img
                src={
                  (featureImgItem.image || "").startsWith("/")
                    ? `http://localhost:5001${featureImgItem.image}`
                    : featureImgItem.image
                }
                className="w-full h-[300px] object-cover rounded-t-lg"
                alt={`Feature image ${index + 1}`}
              />
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
