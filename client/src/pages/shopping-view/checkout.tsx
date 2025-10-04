import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { RootState, AppDispatch } from "@/store/store";
import { useToast } from "@/components/ui/use-toast";

// ⬇️ import CartItem type from your slice (not redefine it)
import { CartItem } from "@/store/shop/cart-slice";

// ------------------- Types -------------------
interface AddressType {
  _id: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes?: string;
}

interface OrderData {
  userId: string | undefined;
  cartItems: {
    productId: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  addressInfo: {
    addressId: string | undefined;
    address: string | undefined;
    city: string | undefined;
    pincode: string | undefined;
    phone: string | undefined;
    notes?: string;
  };
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate: Date;
  orderUpdateDate: Date;
  paymentId: string;
  payerId: string;
}

// ------------------- Component -------------------
function ShoppingCheckout() {
  const { cartItems } = useSelector(
    (state: RootState) => state.shopCart
  ) as { cartItems: CartItem[] }; // ✅ Now both sides use the same type

  const { user } = useSelector((state: RootState) => state.auth);
  const { approvalURL } = useSelector(
    (state: RootState) => state.shopOrder
  ) as { approvalURL: string | null };

  const [currentSelectedAddress, setCurrentSelectedAddress] =
    useState<AddressType | null>(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

const totalCartAmount: number =
  cartItems && cartItems.length > 0
    ? cartItems.reduce(
        (sum, currentItem) =>
          sum + ((currentItem.salePrice ?? currentItem.price) * currentItem.quantity),
        0
      )
    : 0;


  function handleInitiatePaypalPayment() {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData: OrderData = {
  userId: user?.id,
  cartItems: cartItems.map((singleCartItem) => ({
    productId: singleCartItem.productId,
    title: singleCartItem.title ?? "", // fallback to empty string
    image: singleCartItem.image ?? "", // fallback to empty string
    price: singleCartItem.salePrice ?? singleCartItem.price ?? 0, // fallback to 0 if undefined
    quantity: singleCartItem.quantity,
  })),
  addressInfo: {
    addressId: currentSelectedAddress?._id,
    address: currentSelectedAddress?.address ?? "",
    city: currentSelectedAddress?.city ?? "",
    pincode: currentSelectedAddress?.pincode ?? "",
    phone: currentSelectedAddress?.phone ?? "",
    notes: currentSelectedAddress?.notes,
  },
  orderStatus: "pending",
  paymentMethod: "paypal",
  paymentStatus: "pending",
  totalAmount: totalCartAmount,
  orderDate: new Date(),
  orderUpdateDate: new Date(),
  paymentId: "",
  payerId: "",
};


    dispatch(createNewOrder(orderData)).then((data) => {
      if ((data as any)?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
