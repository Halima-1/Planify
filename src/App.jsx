import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./components/Layout/MainLayout";
import Login from "./components/Form/Login";
import Register from "./components/Form/Register";
import Home from './components/Home/Home';
import EventDetails from './components/EventDetails';
// import Footer from "./component/layout/footer";
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
          </MainLayout>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
    </>
  )
}

export default App
