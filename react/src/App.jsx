import {React, useState, useEffect} from "react";
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {

  return (
    <div className='min-h-screen flex flex-col dark:bg-gray-800 font-poppins'>
      <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer/>
    </Router>
    </div>
  )
}

export default App