import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { RootState, AppDispatch } from "@/store/store";

// ---------------- Types ----------------
interface MenuItem {
  id: string;
  label: string;
  path: string;
}

interface CartItem {
  productId: string;
  title: string;
  price: number;
  salePrice: number;
  quantity: number;
  image?: string;
}

interface User {
  id: string;
  userName: string;
}

interface CartState {
  items: CartItem[];
}

// ---------------- MenuItems ----------------
function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem: MenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem: MenuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// ---------------- HeaderRightContent ----------------
function HeaderRightContent() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // 🔧 FIX #1: Safely extract `cartItems` and ensure it’s *always* an array.
  // Many Redux slices return `{ items: [...] }` instead of just `[...]`.
  const cartData = useSelector((state: RootState) => state.shopCart.cartItems);
  const cartItems = Array.isArray(cartData?.items)
    ? cartData.items
    : Array.isArray(cartData)
    ? cartData
    : [];

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  function handleLogout() {
    navigate("/auth/login");
    dispatch(logoutUser());
  }

  // 🔧 FIX #2: Safely fetch user’s cart only when user is logged in
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          {/* 🔧 FIX #3: Use cartItems.length safely */}
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems.length}
          </span>
          <span className="sr-only">User cart</span>
        </Button>

        {/* 🔧 FIX #4: Safely map cartItems, fallback title if missing */}
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems.map((item) => ({
            ...item,
            title: item.title || (item as any).name || "Unnamed Product",
          }))}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName ? user.userName[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged in as {user?.userName ?? "Guest"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------- ShoppingHeader ----------------
function ShoppingHeader() {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth as { isAuthenticated: boolean }
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">senoopsy</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
