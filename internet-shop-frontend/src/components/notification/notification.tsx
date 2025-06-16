import { Error, Favorite } from "@mui/icons-material";
import { Alert, IconButton } from "@mui/material";
import { Check, ShoppingCart } from "react-feather";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

export interface NotificationProps {
  message: string;
  type: NotificationType;
}

export enum NotificationType {
  CART,
  FAVORITE,
  SUCCESS,
  ERROR,
}

export const showNotification = (props: NotificationProps) => {
  const { message, type } = props;

  const toastId = toast(
    <Alert
      icon={
        type === NotificationType.CART ? (
          <ShoppingCart fontSize="large" />
        ) : type === NotificationType.FAVORITE ? (
          <Favorite fontSize="large" />
        ) : type === NotificationType.ERROR ? (
          <Error fontSize="large" />
        ) : type === NotificationType.SUCCESS ? (
          <Check fontSize="large" />
        ) : undefined
      }
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => toast.dismiss(toastId)}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      }
      variant="filled"
      sx={{
        width: "100%",
        alignItems: "center",
        background: "black",
        color: "white",
        fontSize: "1.1rem",
        "& .MuiAlert-message": {
          fontSize: "1.1rem",
        },
      }}
    >
      {message}
    </Alert>,
    {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      closeButton: false,
    }
  );
};
