import Choice from './components/Choice';
import Home from './components/Home';
import {Routes, Route} from 'react-router-dom'; 
import {Helmet} from "react-helmet";

function App() {


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Midnight Menace</title>
      </Helmet><Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/story/" element={<Choice />} />
      </Routes></>
  );
}

export default App;
