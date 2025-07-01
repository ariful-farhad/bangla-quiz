import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { AlertCircle, CheckCircle2, RotateCcw, Trophy } from "lucide-react"
import { Alert, AlertDescription } from "../ui/Alert"
import ENGLISH_QUESTIONS from "../../assets/bcs-masters-noun-part-only-mcq.json"
import "./index.css"

import { Trash2 } from "lucide-react"

const QUESTIONS_OPTIONS = [10, 20, 50, 100, "all"]

const EnglishQuiz = () => {
  const [totalQuestions, setTotalQuestions] = useState(20)
  const [questions, setQuestions] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [previousScores, setPreviousScores] = useState([])

  useEffect(() => {
    // Shuffle and select totalQuestions from ENGLISH_QUESTIONS
    const shuffled = [...ENGLISH_QUESTIONS].sort(() => Math.random() - 0.5)
    if (totalQuestions === "all") {
      setQuestions(shuffled)
    } else {
      setQuestions(shuffled.slice(0, totalQuestions))
    }
    setSelectedAnswers({})
    setShowResults(false)
  }, [totalQuestions])

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("englishQuizScores") || "[]")
    setPreviousScores(scores)
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
      if (selectedAnswers[index] === question.answer) {
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
    localStorage.setItem("englishQuizScores", JSON.stringify(newScores))
    setPreviousScores(newScores)
    setShowResults(true)
  }

  const handleReset = () => {
    // Shuffle and select new questions
    const shuffled = [...ENGLISH_QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, totalQuestions))
    setSelectedAnswers({})
    setShowResults(false)
  }

  const handleQuestionCountChange = (e) => {
    const value = e.target.value
    if (value === "all") {
      setTotalQuestions("all")
    } else {
      setTotalQuestions(parseInt(value))
    }
  }

  const resetStorage = () => {
    try {
      localStorage.removeItem("englishQuizScores")
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
              <span>English Quiz</span>
              <select
                value={totalQuestions}
                onChange={handleQuestionCountChange}
                className='px-3 py-1 border rounded-md bg-white'
              >
                {QUESTIONS_OPTIONS.map((count) => (
                  <option key={count} value={count}>
                    {count === "all" ? "All Questions" : `${count} Questions`}
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
                  {index + 1}. {question.question_text}
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {question.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      onClick={() => handleAnswer(index, option[0])}
                      variant={
                        selectedAnswers[index] === option[0]
                          ? "default"
                          : "outline"
                      }
                      className={`text-left whitespace-pre-line break-words min-h-[3rem] w-full h-auto py-3 px-4 flex items-center justify-start
                        ${
                          showResults
                            ? option[0] === question.answer
                              ? "bg-green-500 hover:bg-green-600"
                              : selectedAnswers[index] === option[0]
                              ? "bg-red-500 hover:bg-red-600"
                              : ""
                            : ""
                        }
                      `}
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

export default EnglishQuiz
