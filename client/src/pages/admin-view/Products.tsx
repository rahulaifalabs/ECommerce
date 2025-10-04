import React, { Fragment, useEffect, useState } from "react";
// import ProductImageUpload from "@/components/admin-view/image-upload";
import ProductImageUpload from "@/components/admin-view/image-upload";
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
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState<boolean>(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const productList = useSelector(
    (state: RootState) => state.adminProducts.productList
  ) as Product[];

  // Form submit handler
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentEditedId) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        } as any)
      ).then((data: any) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setUploadedImageUrl(null);
          setImageFile(null);
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        } as any)
      ).then((data: any) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setFormData(initialFormData);
          setUploadedImageUrl(null);
          setImageFile(null);
          toast({ title: "Product added successfully" });
        }
      });
    }
  };

  // Delete product handler
  const handleDelete = (id: string) => {
    if (!id) return;
    dispatch(deleteProduct(id)).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  };

  const isFormValid = (): boolean => {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .every((key) => Boolean(formData[key as keyof typeof formData]));
  };

  return (
    <Fragment>
      <div className="mb-4 flex items-center justify-between">
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

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl(null);
          setImageFile(null);
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
