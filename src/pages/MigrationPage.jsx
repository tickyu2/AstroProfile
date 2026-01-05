// ═══════════════════════════════════════════════════════
// MIGRATION PAGE - FIXED FOR SECURITY RULES
// ═══════════════════════════════════════════════════════
// Save as: src/pages/MigrationPage.jsx (replace existing)

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'
import { calculateFourPillars } from '../utils/baziCalculator'

export default function MigrationPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [migrating, setMigrating] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  
  const addLog = (message) => {
    setLogs(prev => [...prev, message])
    console.log(message)
  }
  
  const migrateProfiles = async () => {
    setMigrating(true)
    setLogs([])
    addLog('🔧 Starting migration...')
    
    try {
      // Query only THIS user's profiles (respects security rules)
      const profilesRef = collection(db, 'profiles')
      const q = query(profilesRef, where('userId', '==', currentUser.uid))
      const snapshot = await getDocs(q)
      
      addLog(`📋 Found ${snapshot.docs.length} profiles for your account`)
      
      let fixed = 0
      let alreadyGood = 0
      let failed = 0
      
      for (const docSnap of snapshot.docs) {
        const profile = { id: docSnap.id, ...docSnap.data() }
        
        // Check if fourPillars exists
        if (profile.calculations?.fourPillars) {
          addLog(`✅ ${profile.displayName} - Already has fourPillars`)
          alreadyGood++
          continue
        }
        
        // Check if we can calculate
        if (!profile.birthDate || !profile.birthTime) {
          addLog(`⚠️ ${profile.displayName} - Missing birth time (cannot calculate)`)
          failed++
          continue
        }
        
        try {
          addLog(`🔧 ${profile.displayName} - Calculating fourPillars...`)
          
          const birthDate = new Date(profile.birthDate)
          const fourPillars = calculateFourPillars(
            birthDate,
            profile.birthTime,
            profile.location?.lat || 0,
            profile.location?.lng || 0
          )
          
          const profileRef = doc(db, 'profiles', profile.id)
          await updateDoc(profileRef, {
            'calculations.fourPillars': fourPillars,
            'calculations.version': '2.0.0',
            updatedAt: new Date()
          })
          
          addLog(`✅ ${profile.displayName} - FIXED!`)
          fixed++
          
        } catch (error) {
          addLog(`❌ ${profile.displayName} - Error: ${error.message}`)
          console.error('Error details:', error)
          failed++
        }
      }
      
      setResult({ fixed, alreadyGood, failed })
      addLog('\n🎉 MIGRATION COMPLETE!')
      
    } catch (error) {
      addLog(`❌ Migration failed: ${error.message}`)
      console.error('Full error:', error)
    } finally {
      setMigrating(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔧 Data Migration Tool
          </h1>
          <p className="text-white/70">
            This will recalculate BaZi (Four Pillars) data for all your profiles that are missing it.
          </p>
        </div>
        
        {/* Warning */}
        <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl p-6 mb-8">
          <h2 className="text-yellow-300 font-bold text-xl mb-2">⚠️ Important</h2>
          <ul className="text-white/70 space-y-2 text-sm">
            <li>• This will update YOUR profiles that are missing fourPillars data</li>
            <li>• Profiles that already have fourPillars will not be changed</li>
            <li>• This is safe to run multiple times</li>
            <li>• Takes about 5-10 seconds per profile</li>
          </ul>
        </div>
        
        {/* Action Button */}
        {!result && (
          <button
            onClick={migrateProfiles}
            disabled={migrating}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {migrating ? '🔧 Migrating... Please wait...' : '🔧 Start Migration'}
          </button>
        )}
        
        {/* Logs */}
        {logs.length > 0 && (
          <div className="mt-8 bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">📋 Migration Log:</h3>
            <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="text-white/70">{log}</div>
              ))}
            </div>
          </div>
        )}
        
        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4">
            <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-6">
              <h2 className="text-green-300 font-bold text-2xl mb-4">✅ Migration Complete!</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-300">{result.fixed}</div>
                  <div className="text-white/70 text-sm">Fixed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-300">{result.alreadyGood}</div>
                  <div className="text-white/70 text-sm">Already Good</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-300">{result.failed}</div>
                  <div className="text-white/70 text-sm">Failed</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
