import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./LandingPage"
import LanguageQuiz from "./component/LanguageQuiz"
import EnglishQuiz from "./component/EnglishQuiz"

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/bengali' element={<LanguageQuiz />} />
      <Route path='/english' element={<EnglishQuiz />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter
