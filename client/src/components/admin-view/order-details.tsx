import { useState, FormEvent } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { RootState, AppDispatch } from "@/store/store";
import { UserObj } from "@/store/auth-slice";

// ✅ Types for cart item and address
interface CartItem {
  title: string;
  quantity: number;
  price: number;
}

interface AddressInfo {
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes?: string;
}

interface OrderDetails {
  _id: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  cartItems: CartItem[];
  addressInfo: AddressInfo;
}

interface User {
  userName: string;
}

// ✅ Props for this component
interface AdminOrderDetailsViewProps {
  orderDetails: OrderDetails | null;
}

// ✅ Form data type
interface OrderStatusForm {
  status: string;
}

const initialFormData: OrderStatusForm = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }: AdminOrderDetailsViewProps) {
  const [formData, setFormData] = useState<OrderStatusForm>(initialFormData);

  // ✅ Typed useSelector
  const user: UserObj | null = useSelector((state: RootState) => state.auth.user);

  // ✅ Typed dispatch
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  // ✅ Typed form submit
  function handleUpdateStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { status } = formData;

    if (!orderDetails) return;

    dispatch(updateOrderStatus({ id: orderDetails._id, orderStatus: status }))
      .then((data: any) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails._id));
          dispatch(getAllOrdersForAdmin());
          setFormData(initialFormData);
          toast({ title: data.payload.message });
        }
      });
  }

  if (!orderDetails) return null;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        {/* Order Info */}
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
            <Label>{orderDetails.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails.paymentStatus}</Label>
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

        {/* Cart Items */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails.cartItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>Title: {item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            {user && (
  <div className="grid gap-0.5 text-muted-foreground">
    <span>{user.userName}</span>
    <span>{orderDetails.addressInfo.address}</span>
    <span>{orderDetails.addressInfo.city}</span>
    <span>{orderDetails.addressInfo.pincode}</span>
    <span>{orderDetails.addressInfo.phone}</span>
    {orderDetails.addressInfo.notes && <span>{orderDetails.addressInfo.notes}</span>}
  </div>
)}
          </div>
        </div>

        {/* Form to update status */}
        <div>
          <CommonForm<OrderStatusForm>
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Order Status"
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
