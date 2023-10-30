
import React from 'react';
import Player from './Player';
import { AppBar } from '@mui/material';
import HomeTheme from './HomeTheme';
import { ThemeProvider } from '@emotion/react';
import Typography from '@mui/material/Typography';

function Home() {

  // homepage that shows the name input and start button (Player)
  return (
      <ThemeProvider theme={HomeTheme}>
        <div>
          <AppBar position="static">
            <Typography align="center" variant="h4" style={{ fontFamily: 'Nosifer, sans-serif', color: 'black', fontSize: 55, padding: 15 }}>
              Midnight menace:
            </Typography> 
            <Typography align="center" variant="h6" style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'black', fontSize: 30, padding: 10 }}>
              A Halloween survival tale
            </Typography>
          </AppBar>
          <Player />
        </div>
      </ThemeProvider>
    );
  }

export default Home;