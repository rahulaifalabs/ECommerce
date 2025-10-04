import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { RootState, AppDispatch } from "@/store/store";


// ---------------- Types ----------------
interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  totalStock: number;
}

interface Review {
  userName: string;
  reviewMessage: string;
  reviewValue: number;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface User {
  id: string;
  userName: string;
}

interface ProductDetailsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productDetails: Product | null;
}

// ---------------- Component ----------------
function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}: ProductDetailsDialogProps) {
  const [reviewMsg, setReviewMsg] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: User | null;
  };
  const cartItems = useSelector((state: RootState) => state.shopCart) as {
    cartItems: CartItem[];
  };
  const { reviews } = useSelector((state: RootState) => state.shopReview) as {
    reviews: Review[];
  };

  const { toast } = useToast();

  // handle rating
  function handleRatingChange(getRating: number) {
    setRating(getRating);
  }

  // add to cart
  function handleAddToCart(productId: string, totalStock: number) {
    if (!user) return;

    const getCartItems = cartItems?.cartItems || [];

    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === productId
    );

    if (indexOfCurrentItem > -1) {
      const getQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (getQuantity + 1 > totalStock) {
        toast({
          title: `Only ${getQuantity} quantity can be added for this item`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if ((data as any)?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  // dialog close
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails(null));
    setRating(0);
    setReviewMsg("");
  }

  // add review
  function handleAddReview() {
    if (!productDetails || !user) return;

    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user.id,
        userName: user.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if ((data as any)?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  useEffect(() => {
    if (productDetails) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  if (!productDetails) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={
              productDetails.image.startsWith("/")
                ? `http://localhost:5001${productDetails.image}`
                : productDetails.image
            }
            alt={productDetails.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-extrabold">{productDetails.title}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            {productDetails.description}
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails.price}
            </p>
            {productDetails.salePrice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails.salePrice}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          {/* Add to cart */}
          <div className="mt-5 mb-5">
            {productDetails.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(productDetails._id, productDetails.totalStock)
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />

          {/* Reviews */}
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            {/* Add review form */}
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
