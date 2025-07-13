'use client'

import { useState, useEffect } from 'react'
import { db } from "@/app/firebase"
import { ref, onValue, runTransaction } from 'firebase/database'
import { useSearchParams } from 'next/navigation'

export default function VotingPage() {
  const [votes, setVotes] = useState({ furina: 0, multifungsi: 0 })
  const [hasVoted, setHasVoted] = useState(false)
  const searchParams = useSearchParams()
  const isAdmin = searchParams.get('admin') === '1'

  useEffect(() => {
    const votesRef = ref(db, 'votes')
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val()
      setVotes({
        furina: data?.furina || 0,
        multifungsi: data?.multifungsi || 0
      })
    })
    const voted = localStorage.getItem('hasVoted')
    if (voted === 'true') setHasVoted(true)
    return () => unsubscribe()
  }, [])

  const handleVote = async (type: 'furina' | 'multifungsi') => {
    if (hasVoted && !isAdmin) return
    const voteRef = ref(db, `votes/${type}`)
    await runTransaction(voteRef, (curr) => (curr || 0) + 1)
    if (!isAdmin) {
      setHasVoted(true)
      localStorage.setItem('hasVoted', 'true')
    }
  }

  const total = votes.furina + votes.multifungsi
  const percent = {
    furina: total ? (votes.furina / total) * 100 : 0,
    multifungsi: total ? (votes.multifungsi / total) * 100 : 0
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold">🗳️ Voting Bot Favoritmu</h1>

      {!hasVoted && !isAdmin && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <button onClick={() => handleVote('furina')} className="bg-indigo-600 p-4 rounded-xl text-white font-semibold">
            BOT YANG SEKARANG FURINA
          </button>
          <button onClick={() => handleVote('multifungsi')} className="bg-purple-600 p-4 rounded-xl text-white font-semibold">
            BOT MULTIFUNGSI
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <p className="text-green-500 font-semibold">Mode Admin Aktif ✅</p>
          <button onClick={() => handleVote('furina')} className="bg-blue-700 p-4 rounded-xl text-white font-semibold">
            Tambah Vote FURINA
          </button>
          <button onClick={() => handleVote('multifungsi')} className="bg-pink-700 p-4 rounded-xl text-white font-semibold">
            Tambah Vote MULTIFUNGSI
          </button>
        </div>
      )}

      {hasVoted && !isAdmin && (
        <div className="w-full max-w-md space-y-4">
          <p>✅ Terima kasih telah voting!</p>
        </div>
      )}

      <div className="w-full max-w-md mt-6 space-y-4">
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
    </main>
  )
            }
