import { styled, createTheme } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { amber } from '@mui/material/colors';

const black = '#000000';

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(black),
  backgroundColor: black,
  '&:hover': {
    backgroundColor: amber[300],
    color: theme.palette.getContrastText(amber[300]),
  },
}));

export function CustomizedButton() {
  return (
      <ColorButton variant="contained">Custom CSS</ColorButton>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6d6d6d",
      light: "#9e9e9e",
      dark: "#454545",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#6d6d6d",
    },
  },
  typography: {
    fontFamily: ['"Cormorant Garamond"', 'serif'].join(','),
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: 'inherit',
      },
    },
  },
});

export default theme;
