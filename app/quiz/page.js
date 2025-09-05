"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchQuestions = async () => {
      let { data } = await supabase
        .from("questions")
        .select("*")
        .limit(10) // lấy 10 câu để demo
      setQuestions(data || [])
    }
    fetchQuestions()
  }, [])

  const handleSelect = (id, choice) => {
    setAnswers({ ...answers, [id]: choice })
  }

  const handleSubmit = () => {
    let s = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) s++
    })
    setScore(s)
    setSubmitted(true)
  }

  if (!questions.length) return <p className="p-6">Đang tải dữ liệu...</p>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Luyện thi (Demo 10 câu)</h1>
      {questions.map(q => (
        <div key={q.id} className="mb-6 border-b pb-4">
          <p className="font-semibold mb-2">{q.id}. {q.question_text}</p>
          {Object.entries(q.choices).map(([key, value]) => (
            <label key={key} className="block">
              <input
                type="radio"
                name={`q-${q.id}`}
                value={key}
                checked={answers[q.id] === key}
                onChange={() => handleSelect(q.id, key)}
              />
              <span className="ml-2">{key}. {value}</span>
            </label>
          ))}
        </div>
      ))}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Nộp bài
        </button>
      ) : (
        <div className="mt-6">
          <p className="text-lg font-bold">
            Điểm số: {score}/{questions.length}
          </p>
        </div>
      )}
    </div>
  )
}
