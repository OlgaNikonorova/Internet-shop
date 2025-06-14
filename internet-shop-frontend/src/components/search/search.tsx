import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";

export interface SearchProps {
  search: string;
  handleSearch: (search: string) => void;
}

export const Search = ({ search, handleSearch }: SearchProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        margin: "0 auto",
        padding: "0 10px",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск товаров..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: search && (
              <IconButton
                onClick={() => {
                  handleSearch("");
                }}
              >
                <ClearIcon />
              </IconButton>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            backgroundColor: "background.paper",
          },
        }}
      />
    </Box>
  );
};
