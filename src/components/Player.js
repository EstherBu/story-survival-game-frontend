import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Grid from '@mui/system/Unstable_Grid';
import theme from './Theme';
import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';

const baseUrl = 'http://localhost:4000';

const Player = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGameStart = async (e) => {
    e.preventDefault();

    if (name.trim() === '') {
        setError('Name is required!');
      } else {
        try {
          const response = await axios.post(`${baseUrl}/player`, { name });
  
          if (response.data.status === 'success') {
            const { id, name } = response.data.data; 
            setError('');
  
            // Pass player information to the Choice component
            navigate('/story', { state: { playerId: id, playerName: name } });
          } else {
            setError('Error creating player');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setError('');
      };

      return (
        <ThemeProvider theme={theme}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh', backgroundColor: 'black' }}>
              <Box mt={4}>
              <img style={{ width: 550, height: 500,}} src={require('./assets/The Killer.png')} alt=""/>
              </Box>
           <Box mt={3} mb={0} align='center'>
              <form noValidate autoComplete="off" onSubmit={handleGameStart}>
              <TextField
                  label= "Please insert your name"
                  variant= "filled"
                  color= "warning"
                  required
                  type="text"
                    className="form-input"
                    id="name"
                  value={name}
                  onChange={handleNameChange}
                  inputProps={{style: {fontSize: 35, color: 'white', fontFamily: 'Bebas Neue, sans-serif'} }}
                  InputLabelProps={{style: { color: 'red',}, style: {fontSize: 20, color: 'white', fontFamily: 'Bebas Neue, sans-serif'}}}
                  />
                <Box mt={4} align='center'>
                <Grid item >
                  {error && ( <Typography fontFamily= 'Bebas Neue, sans-serif' color="white" fontSize={20
                  } align="center">
                    {error}
                  </Typography>
                  )}
                  <Button  variant="outlined" size="large" backgroundcolor="#d3301b" type="submit" >
                    Start the Game...
                  </Button>
                </Grid>
                </Box>
              </form>
              </Box>
          </Grid>
        </ThemeProvider>
      );
}

export default Player;