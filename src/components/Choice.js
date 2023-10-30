import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { AppBar } from '@mui/material';
import Typography from '@mui/material/Typography';
import ChoiceTheme from './ChoiceTheme';
import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/system';

const baseUrl = 'http://localhost:4000';

function Choice() {
  const [currentStorySegment, setCurrentStorySegment] = useState(null);
  const [choices, setChoices] = useState([]);
  const [error, setError] = useState(null);
  const [ gameOver, setGameOver] = useState(false);
  const [ survived, setSurvived] = useState(false);
  const [ loopback, setLoopback] = useState(false);
  const [goodEnding27, setGoodEnding27] = useState(false);
  const [badEnding27, setBadEnding27] = useState(false);
  const [goodEnding29, setGoodEnding29] = useState(false);
  const [badEnding29, setBadEnding29] = useState(false);
  const [goodEnding71, setGoodEnding71] = useState(false);
  const [badEnding71, setBadEnding71] = useState(false);
  const location = useLocation();
  const [playerData, setPlayerData] = useState(null);
  const [ hp, setHp ] = useState(100);

  //Hp updating without put method
  const updateHp = (amount, callback) => {
    setHp((prevHp) => {
      const newHp = prevHp - amount;
      callback(newHp); 
      return newHp;
    });
  };

    // This callback function will be called with the updated HP value
    const handleHpUpdate = (newHp) => {
      console.log('Updated HP:', newHp);
    };

     // This useEffect will run every time hp is updated
  useEffect(() => {
    console.log(hp);
  }, [hp]);

  // Observe "survived" changes and handle conditions
  useEffect(() => {
    if (survived) {
      console.log('Survived');
    }
  }, [survived]);

  //fetch and set the beginning of the story and the connected choices
  const fetchInitialStory = async () => {
    try {
      const [initialStoryResponse, response] = await Promise.all([
        fetch(`${baseUrl}/story/78`),
        fetch(`${baseUrl}/storychoices/78`)
      ]);
  
      if (!initialStoryResponse.ok || !response.ok) {
        throw new Error('Error fetching data');
      }
  
      const [initialData, storyChoicesData] = await Promise.all([
        initialStoryResponse.json(),
        response.json()
      ]);
  
      setCurrentStorySegment(initialData.storySegment);
      setChoices([storyChoicesData.choice1, storyChoicesData.choice2]);
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data:', error);
    }
  };
  
  //Use effect for when you click the startButton, start the beginning of the game
    useEffect(() => {
        fetchInitialStory();
      }, []);

  //Handle all the various options of choices clicked and different exceptions
  const handleChoiceClicked = async (choice) => {
    try {
      const selectedChoice = choices.find((c) => c.choiceId === choice.choiceId);
    
      if (selectedChoice) {
        const storySegmentResponse = await fetch(`${baseUrl}/story/${selectedChoice.storySegment.id}`);
        const newChoicesResponse = await fetch(`${baseUrl}/storychoices/${selectedChoice.storySegment.id}`);
        
        if (storySegmentResponse.ok && newChoicesResponse.ok) {
          const storySegmentData = await storySegmentResponse.json();
          const newChoicesData = await newChoicesResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          const storyChoices = [newChoicesData.choice1, newChoicesData.choice2];
          setChoices(storyChoices);
        }

        //handle hp damage 
        if (choice.choiceId === 20 || choice.choiceId === 21 || choice.choiceId === 36 || choice.choiceId === 67 || choice.choiceId === 71) {
          //health - 33
          updateHp(33, handleHpUpdate);
          console.log('hp 33', hp)
        } else if (choice.choiceId === 29 || choice.choiceId === 56) {
          //health - 34
          updateHp(34, handleHpUpdate);
          console.log('hp 34', hp)
        } else if (choice.choiceId === 26 || choice.choiceId === 27) {
          //health -17
          updateHp(17, handleHpUpdate);
          console.log('hp 34', hp)
        }
        console.log('Current HP:', hp);

        //handel different endings: Game over, survived and loop back to beginning
        const gameoverChoices = [4, 6, 10, 13, 18, 25, 28, 30, 40, 46, 49, 52, 55, 60, 63, 66, 70, 72, 73];
        const survivedChoices = [14, 19, 23, 51, 61, 64];

        if (gameoverChoices.includes(choice.choiceId)) {
          // Handle game over
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setGameOver(true);
          console.log('game over');
        } else if (survivedChoices.includes(choice.choiceId)) {
          // Handle survived
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setSurvived(true);
          console.log('survived');
        } else if ( choice.choiceId === 43 ) {
            // Handle loop back to beginning
            const storySegmentData = await storySegmentResponse.json();
            setCurrentStorySegment(storySegmentData.storySegment);
            setLoopback(true);
        
            // Does show the begin story after 35 second, but not the options. So it's not completely looping back to the beginning yet.
            // setTimeout(() => {
            //     fetchInitialStory();
            //   }, 35000);
        }
        
        //Handle specific endings that are different depending your hp.
        console.log('before the loop', hp)
        if (choice.choiceId === 27 && hp > 17) {
          const storySegmentResponse = await fetch(`${baseUrl}/story/27`);
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setGoodEnding27(true);
          // setSurvived(true);
        } else if (choice.choiceId === 27 && hp <= 17) {
          const storySegmentResponse = await fetch(`${baseUrl}/story/27`);
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setBadEnding27(true);
          // setGameOver(true);
        } else if (choice.choiceId === 29 && hp > 35) {
          const storySegmentResponse = await fetch(`${baseUrl}/story/31`);
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setGoodEnding29(true);
          // setSurvived(true);
        } else if (choice.choiceId === 29 && hp <= 34) {
          const storySegmentResponse = await fetch(`${baseUrl}/story/31`);
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setBadEnding29(true);
          // setGameOver(true);
        } else if (choice.choiceId === 71 && hp > 33) {
          const storySegmentResponse = await fetch(`${baseUrl}/story/73`);
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setGoodEnding71(true);
          // setSurvived(true);
        } else if (choice.choiceId === 71 && hp <= 33) {
          const storySegmentResponse = await fetch(`${baseUrl}/story/73`);
          const storySegmentData = await storySegmentResponse.json();
          setCurrentStorySegment(storySegmentData.storySegment);
          setBadEnding71(true);
          // setGameOver(true);
        }
        console.log('after the loop', hp)
      } else {
        const storySegmentResponse = await fetch(`${baseUrl}/story/${selectedChoice.storySegment.id}`);
        setError('Error fetching story and choices');
        console.error('Error fetching story and choices:', storySegmentResponse.statusText);
      }
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  //Logic for showing the name you enter at the beginning of the game
  useEffect(() => {
    const playerId = location.state && location.state.playerId;

    if (playerId) {
      fetch(`${baseUrl}/player/${playerId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch player data');
          }
        })
        .then((data) => {
          setPlayerData(data);
        })
        .catch((error) => {
          console.error('Error fetching player data:', error);
        });
    }
  }, [location]);
  
  if (error) {
    return (
      <div>
        <p>An error occurred: {error}</p>
      </div>
    );
  }

  // used mui for most of the styling, had to put the text for the different hp endings in here to make it work.
  return (
    <ThemeProvider theme={ChoiceTheme}>
    <AppBar position="static" style={{ zIndex: 1 }}>
      <Typography align="left" variant="h4" style={{ fontFamily: 'Nosifer, sans-serif', color: 'black', fontSize: 18, padding: 10 }}>
        {playerData ? (
          <div>
            <p>Your name: {playerData.name}</p>
            <p>Your HP: {hp}</p>
          </div>
        ) : null}
      </Typography>
    </AppBar>
    
    <Box style={{ backgroundColor: 'black', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="center">
        {/* Left Box for text */}
        <Box mt={8} display={'flex'} width="65%">
          <Typography variant="body1" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: 'whitesmoke', textAlign: 'center' }}>
            {currentStorySegment}
          </Typography>
        </Box>
      </Box>

      <Box mt={5} display="flex" justifyContent="center" fontFamily={'Bebas Neue, sans-serif'} fontSize={22} color={'whitesmoke'} justifyItems={'center'}>
      {gameOver ? (
        <h1> Game Over </h1>
      ) : survived ? (
        <h1> Survived </h1>
      ) : loopback ? (
        <h1> ... </h1>
      ) : goodEnding27 ? (
        <h4 style={{textAlign: 'center', width: '65%', justifyContent:"center", fontFamily:'Bebas Neue, sans-serif', fontSize: 21, color:'whitesmoke'}}>The police find you unconscious, your body weakened by the loss of blood. You wake up in the hospital, surrounded by the comforting sounds of medical equipment and the warm presence of the hospital staff. You learn that the police have not yet captured the killer. While you've survived the horrifying night, you remain vigilant, knowing that the threat may still be out there. Your story ends with a mix of relief and lingering unease.
        <h1>Survived</h1>
        </h4> 
      ) : badEnding27 ? (
        <h4 style={{textAlign: 'center', width: '65%', justifyContent:"center", fontFamily:'Bebas Neue, sans-serif', fontSize: 21, color:'whitesmoke'}}>The police arrives to find your lifeless body, brutally beaten and covered in blood. It's a tragic end to a horrifying night, and your story concludes here.
        <h1>Game Over</h1>
        </h4>
      ) : goodEnding29 ? (
        <h4 style={{textAlign: 'center', width: '65%', justifyContent:"center", fontFamily:'Bebas Neue, sans-serif', fontSize: 21, color:'whitesmoke'}}>As you lie on the ground, your vision blurred from pain, the distant sound of approaching sirens grows louder. The red and blue lights of police cars flash through the dark, painting eerie patterns on the walls. Within moments, officers swarm around you, providing assistance and ensuring your safety. An ambulance arrives, its wailing siren piercing the night. Paramedics rush to your side, attending to your wounds with haste and precision. You are swiftly loaded into the ambulance, the doors closing with a sense of security and relief. As you're transported to the nearest hospital, you can't help but reflect on the night's horrors. There is no sign of the killer, and for now, the nightmare appears to be over. You find solace in the knowledge that you've escaped their clutches and have a chance at recovery, both physically and emotionally.
        <h1>Survived</h1>
        </h4>
      ) : badEnding29 ? (
        <h4 style={{textAlign: 'center', width: '65%', justifyContent:"center", fontFamily:'Bebas Neue, sans-serif', fontSize: 21, color:'whitesmoke', backgroundColor:'black'}}>As you lie on the ground, your vision blurred from pain, the distant sound of approaching sirens grows louder. The red and blue lights of police cars flash through the dark, painting eerie patterns on the walls. Within moments, officers swarm around you, providing assistance and ensuring your safety. An ambulance arrives, its wailing siren piercing the night. Paramedics rush to your side, attending to your visible wounds with haste and precision. However, as they work on you, you suddenly begin to cough up blood, a sign of potential internal injuries from your fall down the stairs. Despite their best efforts, your condition deteriorates rapidly during the ambulance ride. You struggle to breathe as the pain intensifies, and your vision fades. The paramedics desperately attempt to save you, but as you slip away, you can't help but feel that the night's terrors have taken their toll. 
        <h1>Game Over</h1>
        </h4>
      ) : goodEnding71 ? (
        <h4 style={{textAlign: 'center', width: '65%', justifyContent:"center", fontFamily:'Bebas Neue, sans-serif', fontSize: 21, color:'whitesmoke'}}>You wake up, and it's daylight. You're still in a lot of pain and feeling drowsy. Sirens and people talking outside reach your ears. You attempt to scream, although it doesn't come out as a typical scream. Fortunately, they do hear you. It's the police, and you're safe. However, the killer is nowhere to be found.
        <h1>Survived</h1>
        </h4>
      ) : badEnding71 ? (
        <h4 style={{textAlign: 'center', width: '65%', justifyContent:"center", fontFamily:'Bebas Neue, sans-serif', fontSize: 21, color:'whitesmoke'}}>You can only lose so much blood, and sadly, you didn't survive this night, not at the hand of the killer, but due to unlucky circumstances.
        <h1>Game Over</h1>
        </h4>
      ):(
        <div className="button-container">
        {choices.map((choice) => (
          <div key={choice.choiceId} className="choice-item">
            <Button style={{fontFamily: 'Nosifer, sans-serif', color: 'black', fontSize: 18 }}variant='contained' size="large" backgroundColor="#d3301b"  onClick={() => handleChoiceClicked(choice)}> Click wisely: </Button>
            <Box display="flex" justifyContent="center">
            <div className="choice-text">
              {choice.choiceOptions} 
             {choice.choiceText}
            </div>
            </Box>
          </div>
        ))}
      </div>
       )}
       <style>
    {`
      .button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .choice-item {
        display: flex;
        align-items: center;
        margin-bottom: 50px;
      }
      .choice-text {
        margin-left: 25px;
        margin t
      }
    `}
  </style>
      </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Choice;

