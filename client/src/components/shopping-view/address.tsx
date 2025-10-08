import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard, { AddressInfo } from "./address-card";
import { useToast } from "../ui/use-toast";
import { RootState, AppDispatch } from "@/store/store";

// ---- Form Data Type ----
interface AddressFormData {
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}

// ---- Props ----
interface AddressProps {
  setCurrentSelectedAddress?: (address: AddressInfo) => void;
  selectedId?: { _id: string } | null;
}

const initialAddressFormData: AddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }: AddressProps) {
  const [formData, setFormData] = useState<AddressFormData>(
    initialAddressFormData
  );
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { addressList } = useSelector((state: RootState) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event: React.FormEvent) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editaAddress({
          userId: user?.id ?? "",
          addressId: currentEditedId,
          formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (res.success) {
            dispatch(fetchAllAddresses(user?.id ?? ""));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({ title: "Address updated successfully" });
          }
        })
        .catch(() => {
          toast({ title: "Failed to update address", variant: "destructive" });
        });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id ?? "",
        })
      ).unwrap().then((res) => {
        if (res.success) {
          dispatch(fetchAllAddresses(user?.id ?? ""));
          setFormData(initialAddressFormData);
          toast({ title: "Address added successfully" });
        }
      });
    }
  }

  function handleDeleteAddress(address: AddressInfo) {
    dispatch(
      deleteAddress({ userId: user?.id ?? "", addressId: address._id })
    ).unwrap().then((data) => {
      if (data.success) {
        dispatch(fetchAllAddresses(user?.id ?? ""));
        toast({ title: "Address deleted successfully" });
      }
    });
  }

  function handleEditAddress(address: AddressInfo) {
    setCurrentEditedId(address._id);
    setFormData({
      address: address.address,
      city: address.city,
      phone: address.phone,
      pincode: address.pincode,
      notes: address.notes ?? "",
    });
  }

  function isFormValid() {
    return Object.values(formData).every((value) => value.trim() !== "");
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem: AddressInfo) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
