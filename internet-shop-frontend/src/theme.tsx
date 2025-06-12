
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
