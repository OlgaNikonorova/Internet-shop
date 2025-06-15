import ReviewModel from "../../store/models/review/review";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useGetUserByIdQuery } from "../../store/api/user-api";
import { Avatar, IconButton, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState } from "react";
import Rating from "../rating/rating";

interface ReviewProps {
  review: ReviewModel;
  onEdit?: (review: ReviewModel) => void;
  onDelete?: (reviewId: string) => void;
  isOwn?: boolean;
}

const Review = ({ review, onEdit, onDelete, isOwn = false }: ReviewProps) => {
  const { data: user } = useGetUserByIdQuery(review.userId, {
    refetchOnMountOrArgChange: true,
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <Avatar
            src={user?.avatar || "/default-avatar.png"}
            sx={{ width: 56, height: 56 }}
            className="!bg-gray-200"
          />
          <div className="flex flex-col">
            <Typography variant="subtitle1" className="!font-medium">
              {user?.name ?? `Пользователь ${review.userId.slice(0, 8)}`}
            </Typography>
            <Typography variant="body2" className="!text-gray-500">
              {format(new Date(review.createdAt), "dd MMMM yyyy", { locale: ru })}
            </Typography>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Rating value={review.rating} readOnly />
          {isOwn && isHovered && (
            <div className="flex gap-1 ml-2">
              {onEdit && (
                <IconButton
                  onClick={() => onEdit(review)}
                  size="small"
                  className="!p-1"
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  onClick={() => onDelete(review.id)}
                  size="small"
                  className="!p-1"
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </div>
          )}
        </div>
      </div>

      <Typography variant="body1" className="!text-gray-700 !mt-2">
        {review.comment}
      </Typography>
    </div>
  );
};

export default Review;