import ReviewModel from "../../store/models/review/review";
import { format } from "date-fns";
import Rating from "./rating";
import { useGetUserByIdQuery } from "../../store/api/user-api";
import { Avatar } from "@mui/material";

interface ReviewProps {
  review: ReviewModel;
}

const Review = (props: ReviewProps) => {
  const { review } = props;

  const { data: user } = useGetUserByIdQuery(review.userId, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="flex flex-col justify-between gap-5">
      <div className="flex gap-5 items-center">
        <Avatar
          src={user?.avatar || "/default-avatar.png"}
          sx={{ width: 64, height: 64 }}
        />
        <div className="flex flex-col items-center">
          <h5 style={{ wordBreak: "break-word" }}>
            {user?.name ?? `Пользователь ${review.id.replaceAll("-", "")}`}
          </h5>
          <span className="text-xs text-gray">
            {format(new Date(review.createdAt), "dd.MM.yyyy")}
          </span>
        </div>
        <Rating value={review.rating} />
      </div>

      <p>{review.comment}</p>
    </div>
  );
};

export default Review;
