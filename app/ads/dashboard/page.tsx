'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdsDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('ads_session')
    if (session !== 'authenticated') {
      router.push('/ads')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('ads_session')
    router.push('/ads')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="text-white">Vérification...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Panneau ADS - HACKBOOT
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-lg border border-red-500/50 transition-all"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Vues totales</h3>
            <p className="text-3xl font-bold text-white">12,847</p>
            <p className="text-sm text-green-400 mt-2">+12% ce mois</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Clics</h3>
            <p className="text-3xl font-bold text-white">3,421</p>
            <p className="text-sm text-green-400 mt-2">+8% ce mois</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Conversions</h3>
            <p className="text-3xl font-bold text-white">847</p>
            <p className="text-sm text-green-400 mt-2">+15% ce mois</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Campagnes actives
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Campagne Overwatch</h3>
                  <p className="text-sm text-gray-400">Banner principal</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-400">1,234 vues</p>
                  <p className="text-sm text-gray-400">CTR: 2.8%</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Campagne Warzone</h3>
                  <p className="text-sm text-gray-400">Sidebar</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-400">987 vues</p>
                  <p className="text-sm text-gray-400">CTR: 3.2%</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">Campagne Valorant</h3>
                  <p className="text-sm text-gray-400">Footer</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-400">756 vues</p>
                  <p className="text-sm text-gray-400">CTR: 2.1%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
