import { Star, StarBorder } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  editable?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
  readOnly?: boolean;
}

const Rating = ({
  value,
  onChange,
  editable = false,
  className = "",
  size = "medium",
  readOnly = false,
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const getSize = () => {
    switch (size) {
      case "small":
        return "1rem";
      case "medium":
        return "1.5rem";
      case "large":
        return "2rem";
      default:
        return "1.5rem";
    }
  };

  const handleClick = (newValue: number) => {
    if ((editable || !readOnly) && onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          disabled={readOnly || !editable}
          className="!p-0 !mr-1"
          size="small"
        >
          {(hoverValue || value) >= star ? (
            <Star className="text-yellow-400" style={{ fontSize: getSize() }} />
          ) : (
            <StarBorder
              className="text-yellow-400"
              style={{ fontSize: getSize() }}
            />
          )}
        </IconButton>
      ))}
    </div>
  );
};

export default Rating;
