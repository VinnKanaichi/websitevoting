'use client'

import { useEffect, useState } from "react"
import { ref, onValue, runTransaction, get, set } from "firebase/database"
import { db } from "./firebase"

export default function VotingPage() {
  const [votes, setVotes] = useState({ furina: 0, multifungsi: 0 })
  const [hasVoted, setHasVoted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Cek admin dari URL
    const params = new URLSearchParams(window.location.search)
    if (params.get("admin") === "1") setIsAdmin(true)

    // Ambil data real-time dari Firebase
    const furinaRef = ref(db, "votes/furina")
    const multiRef = ref(db, "votes/multifungsi")

    const unsub1 = onValue(furinaRef, (snap) => {
      setVotes((prev) => ({ ...prev, furina: snap.val() || 0 }))
    })
    const unsub2 = onValue(multiRef, (snap) => {
      setVotes((prev) => ({ ...prev, multifungsi: snap.val() || 0 }))
    })

    // Cek apakah user sudah voting
    const voted = localStorage.getItem("hasVoted")
    if (voted === "true") setHasVoted(true)

    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const handleVote = async (type: "furina" | "multifungsi") => {
    if (hasVoted) return

    const voteRef = ref(db, `votes/${type}`)
    try {
      await runTransaction(voteRef, (current) => (current || 0) + 1)
      setHasVoted(true)
      localStorage.setItem("hasVoted", "true")
    } catch (error) {
      console.error("Vote gagal:", error)
      alert("Gagal vote. Coba lagi ya.")
    }
  }

  const fakeVote = async (type: "furina" | "multifungsi", amount: number) => {
    const voteRef = ref(db, `votes/${type}`)
    try {
      const snap = await get(voteRef)
      const current = snap.exists() ? snap.val() : 0
      await set(voteRef, current + amount)
      alert(`+${amount} suara untuk ${type}`)
    } catch (err) {
      console.error("Fake vote error:", err)
    }
  }

  const total = votes.furina + votes.multifungsi
  const percent = {
    furina: total ? (votes.furina / total) * 100 : 0,
    multifungsi: total ? (votes.multifungsi / total) * 100 : 0,
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-3xl font-bold text-center">🗳️ Voting Bot Favoritmu</h1>

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
        <div className="mt-6 space-y-2 w-full max-w-md">
          <p className="text-sm text-gray-400">Admin mode aktif: Fake vote diaktifkan</p>
          <button onClick={() => fakeVote("furina", 10)} className="bg-green-600 px-4 py-2 rounded text-white w-full">+10 suara ke Furina</button>
          <button onClick={() => fakeVote("multifungsi", 5)} className="bg-yellow-600 px-4 py-2 rounded text-white w-full">+5 suara ke Multifungsi</button>
        </div>
      )}
    </main>
  )
}
