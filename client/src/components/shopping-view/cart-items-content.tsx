// UserCartItemsContent.tsx
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { RootState, AppDispatch } from "@/store/store";

// ----------------- Types -----------------
interface CartItem {
  productId: string;
  title: string;
  image?: string;
  quantity: number;
  price: number;
  salePrice?: number;
}

interface UserCartItemsContentProps {
  cartItem: CartItem;
}

type UpdateAction = "plus" | "minus";

// ----------------- Component -----------------
function UserCartItemsContent({ cartItem }: UserCartItemsContentProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.shopCart);
  const { productList } = useSelector((state: RootState) => state.shopProducts);

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // ---- Update Quantity ----
  function handleUpdateQuantity(item: CartItem, typeOfAction: UpdateAction) {
    if (typeOfAction === "plus") {
      const getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (c: CartItem) => c.productId === item?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === item?.productId
        );

        if (getCurrentProductIndex > -1) {
          const getTotalStock = productList[getCurrentProductIndex].totalStock;

          if (indexOfCurrentCartItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;

            if (getQuantity + 1 > getTotalStock) {
              toast({
                title: `Only ${getQuantity} quantity can be added for this item`,
                variant: "destructive",
              });
              return;
            }
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id ?? "",
        productId: item.productId,
        quantity: typeOfAction === "plus" ? item.quantity + 1 : item.quantity - 1,
      })
    ).then((data) => {
      if ((data?.payload as { success?: boolean })?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  // ---- Delete Cart Item ----
  function handleCartItemDelete(item: CartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id ?? "", productId: item.productId })
    ).then((data) => {
      if ((data?.payload as { success?: boolean })?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  const BASE_URL = "http://localhost:5001";

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image ? `${BASE_URL}${cartItem.image}` : "/placeholder.png"}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice && cartItem.salePrice > 0
              ? cartItem.salePrice
              : cartItem.price) * cartItem.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
