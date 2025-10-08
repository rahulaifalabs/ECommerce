import React, { Fragment, useState, useEffect } from "react";
import ProductImageUpload from "@/components/admin-view/Image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import AdminProductTile from "@/components/admin-view/Product-tile";

// ---------------- Types ----------------
export interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  salePrice: string;
  totalStock: string;
  averageReview: number;
}

interface FeatureImage {
  _id: string;
  image: string;
}

const initialFormData: Omit<Product, "id"> = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  // -- Dashboard state --
  const [dashImageFile, setDashImageFile] = useState<File | null>(null);
  const [dashUploadedImageUrl, setDashUploadedImageUrl] = useState<string | null>(null);
  const [dashImageLoadingState, setDashImageLoadingState] = useState<boolean>(false);

  // -- Product form state --
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Dashboard feature images from store
  const { featureImageList } = useSelector(
    (state: RootState) => state.commonFeature
  ) as { featureImageList: FeatureImage[] };

  // Product list from store
  const productList = useSelector(
    (state: RootState) => state.adminProducts.productList
  ) as Product[];

  // ---- Dashboard: Upload feature image handler ----
  function handleUploadFeatureImage() {
    if (!dashUploadedImageUrl) return;

    dispatch(addFeatureImage(dashUploadedImageUrl)).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setDashImageFile(null);
        setDashUploadedImageUrl(null);
      }
    });
  }

  // Fetch dashboard feature images on mount
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // ---- Product form submit handler ----
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (currentEditedId) {
        // Edit Product Mode
        const resultAction = await dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          } as any)
        );

        if (resultAction?.payload?.success) {
          await dispatch(fetchAllProducts());
          toast({ title: "Product updated successfully" });
        } else {
          toast({ title: "Failed to update product", variant: "destructive" });
        }
      } else {
        // Add New Product Mode
        if (!uploadedImageUrl) {
          toast({ title: "Please upload an image before adding", variant: "destructive" });
          return;
        }

        const resultAction = await dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          } as any)
        );

        if (resultAction?.payload?.success) {
          await dispatch(fetchAllProducts());
          toast({ title: "Product added successfully" });
        } else {
          toast({ title: "Failed to add product", variant: "destructive" });
        }
      }

      // Reset form & close modal
      setFormData(initialFormData);
      setUploadedImageUrl(null);
      setImageFile(null);
      setCurrentEditedId(null);
      setOpenCreateProductsDialog(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  // Delete product handler
  const handleDelete = (id: string) => {
    if (!id) return;
    dispatch(deleteProduct(id)).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted successfully" });
      }
    });
  };

  // Form validation
  const isFormValid = (): boolean => {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .every((key) => Boolean(formData[key as keyof typeof formData]));
  };

  return (
    <Fragment>
      {/* === Dashboard Content moved here === */}
      <div className="mb-8">
        <ProductImageUpload
          imageFile={dashImageFile}
          setImageFile={setDashImageFile}
          uploadedImageUrl={dashUploadedImageUrl}
          setUploadedImageUrl={setDashUploadedImageUrl}
          setImageLoadingState={setDashImageLoadingState}
          imageLoadingState={dashImageLoadingState}
          isCustomStyling={true}
          isEditMode={false}
        />

        <Button
          onClick={handleUploadFeatureImage}
          className="mt-5 w-full"
          disabled={!dashUploadedImageUrl || dashImageLoadingState}
        >
          Upload Feature Image
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

      {/* === Existing Products Content below === */}
      <div className="mb-4 flex items-center justify-between bg-gray-400 mx-auto">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.map((product) => (
          <AdminProductTile
            key={product.id}
            product={product}
            setFormData={(p: Product) =>
              setFormData({
                image: p.image,
                title: p.title,
                description: p.description,
                category: p.category,
                brand: p.brand,
                price: p.price,
                salePrice: p.salePrice,
                totalStock: p.totalStock,
                averageReview: p.averageReview,
              })
            }
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          setOpenCreateProductsDialog(open);
          if (!open) {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrl(null);
            setImageFile(null);
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={Boolean(currentEditedId)}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditedId ? "Edit" : "Add"}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
