import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Cormorant Garamond"',
      'serif'
    ].join(','),
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: 'inherit'
      }
    }
  }
});

export default theme;