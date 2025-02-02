import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { AlertCircle, CheckCircle2, RotateCcw, Trophy } from "lucide-react"
import { Alert, AlertDescription } from "../ui/Alert"
import WORDS_DATA from "../../assets/words.json"
import "./index.css"
import { Trash2 } from "lucide-react"

const LanguageQuiz = () => {
  const QUESTIONS_OPTIONS = [10, 20, 50, 100]
  const [totalQuestions, setTotalQuestions] = useState(20)
  const [questions, setQuestions] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [previousScores, setPreviousScores] = useState([])

  // handle question count

  // generate a robust random number
  const getRandomIndex = (length) => {
    return (
      Math.floor((Math.random() + (Date.now() % 1000) / 1000) * length) % length
    )
  }
  // Generate a random question
  const generateQuestion = () => {
    const languages = Object.keys(WORDS_DATA)
    const correctLanguage = languages[getRandomIndex(languages.length)]
    const words = WORDS_DATA[correctLanguage]
    const word = words[getRandomIndex(words.length)]

    // Get 3 random wrong options
    const wrongOptions = languages
      .filter((lang) => lang !== correctLanguage)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options = [...wrongOptions, correctLanguage].sort(
      () => Math.random() - 0.5
    )

    return {
      word,
      options,
      correctAnswer: correctLanguage,
    }
  }
  // Generate all questions
  const generateQuestions = () => {
    const selectedWords = new Set() // Track selected words
    const newQuestions = []

    while (newQuestions.length < totalQuestions) {
      const question = generateQuestion()
      if (!selectedWords.has(question.word)) {
        selectedWords.add(question.word)
        newQuestions.push(question)
      }
    }

    setQuestions(newQuestions)
    setSelectedAnswers({})
    setShowResults(false)
  }

  // Load previous scores from localStorage
  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("quizScores") || "[]")
    setPreviousScores(scores)
  }, [])

  // Initialize questions on first load
  useEffect(() => {
    generateQuestions()
  }, [])

  const handleAnswer = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const handleCheck = () => {
    const score = calculateScore()
    const newScores = [
      ...previousScores,
      {
        date: new Date().toLocaleString(),
        score,
        totalQuestions,
      },
    ]
    localStorage.setItem("quizScores", JSON.stringify(newScores))
    setPreviousScores(newScores)
    setShowResults(true)
  }

  const handleReset = () => {
    generateQuestions()
  }
  const handleQuestionCountChange = (e) => {
    const newCount = parseInt(e.target.value)
    console.log(newCount)
    setTotalQuestions((prev) => {
      return newCount
    })
  }
  useEffect(() => {
    if (totalQuestions > 0) {
      // Ensuring it doesn't run on initial render
      handleReset()
    }
  }, [totalQuestions])

  const resetStorage = () => {
    try {
      localStorage.removeItem("quizScores")
      setPreviousScores([])
    } catch (error) {
      console.error("Error resetting scores:", error)
    }
  }

  const handleResetClick = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all scores? This cannot be undone."
      )
    ) {
      resetStorage()
    }
  }
  return (
    <div className='max-w-4xl mx-auto p-4 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <span>Bengali Language Origin Quiz</span>
              <select
                value={totalQuestions}
                onChange={handleQuestionCountChange}
                className='px-3 py-1 border rounded-md bg-white'
              >
                {QUESTIONS_OPTIONS.map((count) => (
                  <option key={count} value={count}>
                    {count} Questions
                  </option>
                ))}
              </select>
            </div>
            <div className='space-x-2 manual_style '>
              <Button onClick={handleReset} variant='outline'>
                <RotateCcw className='w-4 h-4' />
                Reset Quiz
              </Button>
              <Button
                onClick={handleCheck}
                disabled={
                  Object.keys(selectedAnswers).length < questions.length ||
                  showResults
                }
              >
                <CheckCircle2 className='w-4 h-4' />
                Check Answers
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {showResults && (
              <Alert className='mb-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Your score: {calculateScore()} out of {questions.length}
                </AlertDescription>
              </Alert>
            )}

            {questions.map((question, index) => (
              <div key={index} className='p-4 border rounded-lg space-y-4'>
                <div className='font-medium'>
                  {index + 1}. What is the origin language of the word "
                  {question.word}"?
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  {question.options.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleAnswer(index, option)}
                      variant={
                        selectedAnswers[index] === option
                          ? "default"
                          : "outline"
                      }
                      className={`${
                        showResults
                          ? option === question.correctAnswer
                            ? "bg-green-500 hover:bg-green-600"
                            : selectedAnswers[index] === option
                            ? "bg-red-500 hover:bg-red-600"
                            : ""
                          : ""
                      }`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Trophy className='w-5 h-5' />
            Previous Scores
          </CardTitle>
          <Button
            onClick={handleResetClick}
            variant='outline'
            size='icon'
            className='h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {previousScores.length === 0 ? (
              <p className='text-gray-500'>No previous scores yet</p>
            ) : (
              previousScores.map((score, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center p-2 border rounded'
                >
                  <span>{score.date}</span>
                  <span className='font-medium'>
                    {score.score}/{score.totalQuestions}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LanguageQuiz
