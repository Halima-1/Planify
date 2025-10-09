import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/form/login";
import Register from "./component/form/register";
import Header from "./component/layout/header";
import Home from './component/home/home';
import EventDetails from './component/eventDetails';
// import Footer from "./component/layout/footer";
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      {/* <div>
    </div> */}
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/event/:id" element={<EventDetails />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
