// UserCartWrapper.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

// ----------------- Types -----------------
export interface CartItem {
  productId: string;
  title: string;
  image?: string;
  quantity: number;
  price: number;
  salePrice?: number;
}

interface UserCartWrapperProps {
  cartItems: CartItem[];
  setOpenCartSheet: (open: boolean) => void;
}

// ----------------- Component -----------------
function UserCartWrapper({ cartItems, setOpenCartSheet }: UserCartWrapperProps) {
  const navigate = useNavigate();

  const totalCartAmount = cartItems?.length
    ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          ((currentItem.salePrice && currentItem.salePrice > 0
            ? currentItem.salePrice
            : currentItem.price) *
            currentItem.quantity),
        0
      )
    : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems?.length
          ? cartItems.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))
          : null}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
