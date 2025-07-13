'use client'

import { useEffect, useState } from "react"
import { db } from "./firebase"
import { ref, onValue, runTransaction } from "firebase/database"

export default function VotingPage() {
  const [votes, setVotes] = useState({ furina: 0, multifungsi: 0 })
  const [hasVoted, setHasVoted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const isAdminParam = params.get("admin") === "1"
    setIsAdmin(isAdminParam)

    const voted = localStorage.getItem("hasVoted")
    if (voted === "true") setHasVoted(true)

    const votesRef = ref(db, "votes")
    onValue(votesRef, (snapshot) => {
      const data = snapshot.val() || {}
      setVotes({
        furina: data.furina || 0,
        multifungsi: data.multifungsi || 0
      })
    })
  }, [])

  const handleVote = async (type: "furina" | "multifungsi") => {
    if (hasVoted && !isAdmin) return

    const voteRef = ref(db, `votes/${type}`)
    try {
      await runTransaction(voteRef, (current) => (current || 0) + 1)
      if (!isAdmin) {
        setHasVoted(true)
        localStorage.setItem("hasVoted", "true")
      }
    } catch (err) {
      console.error("Vote gagal:", err)
    }
  }

  const total = votes.furina + votes.multifungsi
  const percent = {
    furina: total ? (votes.furina / total) * 100 : 0,
    multifungsi: total ? (votes.multifungsi / total) * 100 : 0,
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold">🗳️ Voting Bot Favoritmu</h1>

      {!hasVoted && !isAdmin ? (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <button onClick={() => handleVote("furina")} className="bg-indigo-600 p-4 rounded-xl text-white font-semibold">BOT FURINA</button>
          <button onClick={() => handleVote("multifungsi")} className="bg-purple-600 p-4 rounded-xl text-white font-semibold">BOT MULTIFUNGSI</button>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <p>✅ {isAdmin ? "Admin mode aktif" : "Terima kasih telah voting!"}</p>
          <div>
            <p className="mb-1">BOT FURINA: {percent.furina.toFixed(1)}%</p>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${percent.furina}%` }} />
            </div>
          </div>
          <div>
            <p className="mt-2 mb-1">BOT MULTIFUNGSI: {percent.multifungsi.toFixed(1)}%</p>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div className="bg-purple-500 h-4 rounded-full" style={{ width: `${percent.multifungsi}%` }} />
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center mt-4">Total suara: {total}</p>
        </div>
      )}

      {isAdmin && (
        <div className="mt-6 text-center">
          <h2 className="font-bold mb-2">🎛️ Panel Admin</h2>
          <button onClick={() => handleVote("furina")} className="bg-green-600 px-4 py-2 rounded-xl text-white m-1">+1 FURINA</button>
          <button onClick={() => handleVote("multifungsi")} className="bg-yellow-600 px-4 py-2 rounded-xl text-white m-1">+1 MULTIFUNGSI</button>
        </div>
      )}
    </main>
  )
}
