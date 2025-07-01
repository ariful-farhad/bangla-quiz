import React from "react"
import { Link } from "react-router-dom"

const LandingPage = () => (
  <div className='min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50'>
    <h1 className='text-4xl font-bold mb-8'>Welcome to the Quiz App</h1>
    <div className='flex gap-6'>
      <Link to='/bengali'>
        <button className='px-6 py-3 bg-blue-600 text-white rounded-lg text-xl hover:bg-blue-700 transition'>
          Bengali Quiz
        </button>
      </Link>
      <Link to='/english'>
        <button className='px-6 py-3 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition'>
          English Quiz
        </button>
      </Link>
    </div>
  </div>
)

export default LandingPage
