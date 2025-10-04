import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";

// ✅ Props interface
interface StarRatingComponentProps {
  rating: number; // current rating value (1-5)
  handleRatingChange?: (newRating: number) => void; // optional callback
}

const StarRatingComponent: React.FC<StarRatingComponentProps> = ({
  rating,
  handleRatingChange,
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`p-2 rounded-full transition-colors ${
            star <= rating
              ? "text-yellow-500 hover:bg-black"
              : "text-black hover:bg-primary hover:text-primary-foreground"
          }`}
          variant="outline"
          size="icon"
          onClick={handleRatingChange ? () => handleRatingChange(star) : undefined} // TS-safe
        >
          <StarIcon
            className={`w-6 h-6 ${
              star <= rating ? "fill-yellow-500" : "fill-black"
            }`}
          />
        </Button>
      ))}
    </div>
  );
};

export default StarRatingComponent;
