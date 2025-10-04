// AUTO-CONVERTED: Fully typed
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems, CartItem } from "@/store/shop/cart-slice";
import { fetchProductDetails, Product } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "@/store/store";
import { UserObj } from "@/store/auth-slice";

function SearchProducts() {
  const [keyword, setKeyword] = useState<string>("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const searchResults = useSelector(
    (state: RootState) => state.shopSearch.searchResults
  ) as Product[];

  const productDetails = useSelector(
    (state: RootState) => state.shopProducts.productDetails
  ) as Product | null;

  const user = useSelector((state: RootState) => state.auth.user) as UserObj | null;

  const cartItems = useSelector(
    (state: RootState) => state.shopCart.cartItems
  ) as { items: CartItem[] };

  // ------------------- Effects -------------------
  useEffect(() => {
    if (keyword && keyword.trim().length > 3) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  // ------------------- Handlers -------------------
  function handleAddtoCart(getCurrentProductId: string, getTotalStock: number) {
    const currentCartItems = cartItems?.items || [];

    const existingItem = currentCartItems.find(
      (item) => item.productId === getCurrentProductId
    );

    if (existingItem && existingItem.quantity + 1 > getTotalStock) {
      toast({
        title: `Only ${existingItem.quantity} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    dispatch(
      addToCart({
        userId: user.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId: string) {
    dispatch(fetchProductDetails({ id: getCurrentProductId })); // ✅ pass object if slice expects {id: string}
  }

  // ------------------- Render -------------------
  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>

      {!searchResults.length && (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item: Product) => (
          <ShoppingProductTile
            key={item._id}
            product={item}
            handleAddtoCart={handleAddtoCart}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
