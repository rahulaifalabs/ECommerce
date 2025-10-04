// ShoppingOrderDetailsView.tsx
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { RootState } from "@/store/store";

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface AddressInfo {
  address?: string;
  city?: string;
  pincode?: string;
  phone?: string;
  notes?: string;
}

export interface OrderDetails {
  _id: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod?: string; // optional
  paymentStatus?: string; // optional
  orderStatus: "confirmed" | "rejected" | string;
  cartItems?: CartItem[];
  addressInfo?: AddressInfo;
}

interface Props {
  orderDetails: OrderDetails | null;
}

function ShoppingOrderDetailsView({ orderDetails }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails.paymentMethod ?? "N/A"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails.paymentStatus ?? "N/A"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails.cartItems?.map((item) => (
                <li key={item.productId} className="flex items-center justify-between">
                  <span>Title: {item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              )) ?? null}
            </ul>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName ?? "Guest"}</span>
              <span>{orderDetails.addressInfo?.address ?? ""}</span>
              <span>{orderDetails.addressInfo?.city ?? ""}</span>
              <span>{orderDetails.addressInfo?.pincode ?? ""}</span>
              <span>{orderDetails.addressInfo?.phone ?? ""}</span>
              <span>{orderDetails.addressInfo?.notes ?? ""}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
