import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Drawing from './components/DrawingView/Draw'
import Guessing from './components/GuessView/Guess'
import Waiting from './components/WaitingView/Waiting'
import Welcome from './components/WelcomeView/Welcome'
import WordChoosing from './components/WordChoosingView/WordChoose'
import './App.css'
// import axios from "axios";
import SwapRoles from './components/SwapRoles/SwapRoles'




 
const App = () => {
   

  // const playerNum = await axios.get("http://localhost:2000/WelcomeNav").then(res => res.data.status);

  // const getWelcomeData =async () =>{
  //   return await axios({
  //     method: "get",
  //     url: "http://localhost:2000/WelcomeNav"
  //   }).catch((e)=> {
  //     console.log("[Welcome] => " + e);
  //   }).then(res =>{ 
  //      return res.data.status;
  //   });

  // }

  let disclaimer = '444';
// if (playerNum === '1stPlayer'){
// disclaimer = "1";}
// else if (playerNum === '2ndPlayer'){
//   disclaimer="2";
// }

  return (
    <Router>
      <div className='container'>
        <Routes>
          <Route exact path='/' element={<Welcome playerPos={disclaimer}/>} />
          <Route path='/choosing' element={<WordChoosing />} />
          <Route path='/drawing' element={<Drawing />} />
          <Route path='/guessing' element={<Guessing />} />
          <Route path='/waiting' element={<Waiting />} />
          <Route path='/SwapRoles' element={<SwapRoles />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
