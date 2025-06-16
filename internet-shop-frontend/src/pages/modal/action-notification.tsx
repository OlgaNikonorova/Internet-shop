import { Snackbar, Alert, Slide, IconButton } from "@mui/material";
import { ShoppingCart, Favorite } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

interface ActionNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type: "cart" | "favorite" | "success" | "error";
}

export const ActionNotification = ({
  open,
  onClose,
  message,
  type,
}: ActionNotificationProps) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={3000}
      slots={{ transition: (props) => <Slide {...props} direction="left" /> }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ top: { xs: 70, sm: 80 } }}
    >
      <Alert
        icon={
          type === "cart" ? (
            <ShoppingCart fontSize="large" />
          ) : (
            <Favorite fontSize="large" />
          )
        }
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
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
      </Alert>
    </Snackbar>
  );
};
