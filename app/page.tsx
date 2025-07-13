'use client'

import { useState, useEffect } from "react"

export default function VotingPage() {
  const [votes, setVotes] = useState({ furina: 0, multifungsi: 0 })
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    const storedVotes = localStorage.getItem("votingData")
    const storedHasVoted = localStorage.getItem("hasVoted")
    if (storedVotes) setVotes(JSON.parse(storedVotes))
    if (storedHasVoted === "true") setHasVoted(true)
  }, [])

  const handleVote = (type: "furina" | "multifungsi") => {
    if (hasVoted) return
    const updatedVotes = { ...votes, [type]: votes[type] + 1 }
    setVotes(updatedVotes)
    setHasVoted(true)
    localStorage.setItem("votingData", JSON.stringify(updatedVotes))
    localStorage.setItem("hasVoted", "true")
  }

  const total = votes.furina + votes.multifungsi
  const percent = {
    furina: total ? (votes.furina / total) * 100 : 0,
    multifungsi: total ? (votes.multifungsi / total) * 100 : 0
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold">🗳️ Voting Bot Favoritmu</h1>
      {!hasVoted ? (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <button onClick={() => handleVote("furina")} className="bg-indigo-600 p-4 rounded-xl text-white font-semibold">BOT YANG SEKARANG FURINA</button>
          <button onClick={() => handleVote("multifungsi")} className="bg-purple-600 p-4 rounded-xl text-white font-semibold">BOT MULTIFUNGSI</button>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <p>✅ Terima kasih telah voting!</p>
          <div>
            <p className="mb-1">BOT FURINA: {percent.furina.toFixed(1)}%</p>
            <div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${percent.furina}%` }} /></div>
          </div>
          <div>
            <p className="mt-2 mb-1">BOT MULTIFUNGSI: {percent.multifungsi.toFixed(1)}%</p>
            <div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-purple-500 h-4 rounded-full" style={{ width: `${percent.multifungsi}%` }} /></div>
          </div>
          <p className="text-sm text-gray-400 text-center mt-4">Total suara: {total}</p>
        </div>
      )}
    </main>
  )
}
