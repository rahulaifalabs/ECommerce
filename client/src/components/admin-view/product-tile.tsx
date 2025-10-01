// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
import { Product } from "@/pages/admin-view/Products";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

interface AdminProductTileProps {
  product: Product;
  setFormData: (product: Product) => void;
  setOpenCreateProductsDialog: (open: boolean) => void;
  setCurrentEditedId: (id: string) => void;
  handleDelete: (id: string) => void;
}

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}: AdminProductTileProps) {
  const BASE_URL = "http://localhost:5001";

  return (
    <Card>
      <div className="w-full max-w-sm mx-auto">
        <div className="relative">
          <img
            src={
              product?.image
                ? `${BASE_URL}${product.image}`
                : "/placeholder-image.png"
            }
            alt={product?.title || "title"}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                Number(product?.salePrice) > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {Number(product?.salePrice) > 0 ? (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product.id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(product.id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
