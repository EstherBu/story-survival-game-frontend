import { createTheme} from '@mui/material/styles';

const Theme = createTheme({
    typography: {
      fontFamily: 'Nosifer, sans-serif',
      fontSize: 30,
      padding: 50,
    },
    palette: {
      primary: {
        main: '#a81310', 
      },
      background: {
        default: '#25344c',
      }
    },
    form: {
        

    }
    });

export default Theme;
