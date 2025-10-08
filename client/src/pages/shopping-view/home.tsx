import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  Product as SliceProduct,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { RootState, AppDispatch } from "@/store/store";
import { UserObj } from "@/store/auth-slice";


// ------------------- Types -------------------
interface CategoryOrBrand {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface FeatureImage {
  _id: string;
  image: string;
}

interface Product extends SliceProduct {
  description?: string;
  salePrice?: number;
  totalStock?: number;
}

// ------------------- Constants -------------------
const categoriesWithIcon: CategoryOrBrand[] = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon: CategoryOrBrand[] = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

// ------------------- Component -------------------
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const productList = useSelector(
    (state: RootState) => state.shopProducts.productList
  ) as Product[];
  const productDetails = useSelector(
    (state: RootState) => state.shopProducts.productDetails
  ) as Product | null;
  const featureImageList = useSelector(
    (state: RootState) => state.commonFeature.featureImageList
  ) as FeatureImage[];
  const user = useSelector((state: RootState) => state.auth.user) as UserObj | null;

  // ------------------- Handlers -------------------
  function handleNavigateToListingPage(
    getCurrentItem: CategoryOrBrand,
    section: "category" | "brand"
  ) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

function handleGetProductDetails(productId: string) {
  dispatch(fetchProductDetails({ id: productId })); // ✅ wrap in object
}


  function handleAddtoCart(productId: string) {
    if (!user) return;
    dispatch(
      addToCart({ userId: user.id, productId, quantity: 1 })
    ).then((data: any) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  // ------------------- Effects -------------------
  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (featureImageList.length > 0) {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    dispatch(getFeatureImages());
  }, [dispatch]);

  // ------------------- Render -------------------
  return (
    <div className="flex flex-col min-h-screen">
    
      {/* Banner Slider */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList.map((slide, index) => (
          <img
            key={slide._id}
            src={slide.image.startsWith("/") ? `http://localhost:5001${slide.image}` : slide.image}
            className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + featureImageList.length) % featureImageList.length)
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
