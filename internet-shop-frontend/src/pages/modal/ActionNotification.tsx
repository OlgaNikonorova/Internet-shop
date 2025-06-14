import { Snackbar, Alert, Slide, SlideProps, IconButton } from "@mui/material";
import { CheckCircle, ShoppingCart, Favorite } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";

interface ActionNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type: "cart" | "favorite";
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
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
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ top: { xs: 70, sm: 80 }, 
      }}
    >
      <Alert
        icon={
          type === "cart" ? (
            <ShoppingCart fontSize="inherit" />
          ) : (
            <Favorite fontSize="inherit" />
          )
        }
        action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        variant="filled"
        sx={{ width: "100%", alignItems: "center", background: "black", color: "white" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};