import { Dialog, IconButton, Box } from "@mui/material";
import { Close, ChevronLeft, ChevronRight } from "@mui/icons-material";

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ImageModal = ({
  open,
  onClose,
  imageUrl,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ImageModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{ sx: { bgcolor: "rgba(0,0,0,0.9)" } }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          color: "white",
          zIndex: 1,
        }}
      >
        <Close fontSize="large" />
      </IconButton>

      {hasPrev && (
        <IconButton
          onClick={onPrev}
          sx={{
            position: "fixed",
            left: 16,
            top: "50%",
            color: "white",
            zIndex: 1,
          }}
        >
          <ChevronLeft fontSize="large" />
        </IconButton>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <img
          src={process.env.REACT_APP_API_BASE_URL + imageUrl}
          alt="Fullscreen"
          style={{
            maxHeight: "90vh",
            maxWidth: "90vw",
            objectFit: "contain",
          }}
        />
      </Box>

      {hasNext && (
        <IconButton
          onClick={onNext}
          sx={{
            position: "fixed",
            right: 16,
            top: "50%",
            color: "white",
            zIndex: 1,
          }}
        >
          <ChevronRight fontSize="large" />
        </IconButton>
      )}
    </Dialog>
  );
};