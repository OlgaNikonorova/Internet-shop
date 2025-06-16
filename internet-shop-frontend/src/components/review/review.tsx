import ReviewModel from "../../store/models/review/review";
import { format } from "date-fns";
import { useGetUserByIdQuery } from "../../store/api/user-api";
import { Avatar, Box, Rating as MuiRating } from "@mui/material";

interface ReviewProps {
  review: ReviewModel;
  isOwn?: boolean;
}

const Review = (props: ReviewProps) => {
  const { review, isOwn } = props;

  const { data: user } = useGetUserByIdQuery(review.userId, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div
      className="flex flex-col justify-between gap-5"
      style={{ fontSize: "1.1rem" }}
    >
      <div className="flex gap-5 items-center">
        <Avatar
          src={
            user?.avatar
              ? process.env.REACT_APP_API_BASE_URL + user?.avatar
              : "/default-avatar/png"
          }
          sx={{ width: 64, height: 64 }}
        />
        <div className="flex flex-col items-center">
          <h5 style={{ wordBreak: "break-word", fontSize: "1.1rem", color: isOwn ? "#C0A062" : "" }}>
            {user?.username ?? `Пользователь ${review.id.replaceAll("-", "")}`}
          </h5>
          <span className="text-sm text-gray">
            {format(new Date(review.createdAt), "dd.MM.yyyy")}
          </span>
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontStyle: "italic",
            fontSize: "1.25rem",
          }}
        >
          <MuiRating
            component="span"
            value={parseFloat(review.rating.toFixed(1))}
            precision={0.1}
            readOnly
            sx={{
              "& .MuiRating-iconFilled": {
                color: "black",
              },
              "& .MuiRating-iconEmpty": {
                color: "black",
                opacity: 0.3,
              },
            }}
          />
        </Box>
      </div>

      <p style={{ fontSize: "1.1rem" }}>{review.comment}</p>
    </div>
  );
};

export default Review;
