import { useEffect, useState } from 'react'
import { useContentStore } from '../stores/contentStore'
import api from '../services/api'

interface Language {
  code: string
  name: string
  native_name: string
  flag: string
  is_active: boolean
}

interface TranslationStatus {
  code: string
  name: string
  native_name: string
  flag: string
  has_translation: boolean
  reviewed: boolean
  translated_at: string | null
}

export default function TranslationsPage() {
  const { modules, fetchModules } = useContentStore()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [languages, setLanguages] = useState<Language[]>([])
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatingLang, setTranslatingLang] = useState<string | null>(null)

  useEffect(() => {
    fetchModules()
    fetchLanguages()
  }, [fetchModules])

  useEffect(() => {
    if (selectedModule) {
      fetchTranslationStatus(selectedModule)
    }
  }, [selectedModule])

  const fetchLanguages = async () => {
    try {
      const response = await api.get('/translations/languages')
      setLanguages(response.data)
    } catch (error) {
      console.error('Failed to fetch languages:', error)
    }
  }

  const fetchTranslationStatus = async (moduleId: string) => {
    try {
      const response = await api.get(`/translations/status/module/${moduleId}`)
      setTranslationStatus(response.data)
    } catch (error) {
      console.error('Failed to fetch translation status:', error)
    }
  }

  const handleTranslate = async (langCode: string) => {
    if (!selectedModule) return

    setIsTranslating(true)
    setTranslatingLang(langCode)

    try {
      await api.post(`/translations/bulk/module/${selectedModule}`, {
        targetLanguage: langCode
      })
      await fetchTranslationStatus(selectedModule)
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setIsTranslating(false)
      setTranslatingLang(null)
    }
  }

  const handleReview = async (langCode: string) => {
    if (!selectedModule) return

    try {
      await api.put(`/translations/review/module/${selectedModule}`, {
        languageCode: langCode
      })
      await fetchTranslationStatus(selectedModule)
    } catch (error) {
      console.error('Review failed:', error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Translations</h1>

      {/* Module Selector */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Select Module to Translate</label>
        <select
          value={selectedModule || ''}
          onChange={(e) => setSelectedModule(e.target.value || null)}
          className="w-full max-w-md px-3 py-2 border rounded-lg"
        >
          <option value="">Select a module...</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.icon && `${module.icon} `}{module.title}
            </option>
          ))}
        </select>
      </div>

      {/* Translation Status */}
      {selectedModule && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Translation Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {translationStatus.map((lang) => (
              <div
                key={lang.code}
                className={`p-4 border rounded-lg ${
                  lang.has_translation
                    ? lang.reviewed
                      ? 'border-green-300 bg-green-50'
                      : 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="font-medium">{lang.native_name}</div>
                    <div className="text-sm text-gray-500">{lang.name}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {lang.has_translation ? (
                      <span className={lang.reviewed ? 'text-green-600' : 'text-yellow-600'}>
                        {lang.reviewed ? 'Reviewed' : 'Translated'}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not translated</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {lang.has_translation && !lang.reviewed && (
                      <button
                        onClick={() => handleReview(lang.code)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded"
                      >
                        Mark Reviewed
                      </button>
                    )}
                    <button
                      onClick={() => handleTranslate(lang.code)}
                      disabled={isTranslating}
                      className={`px-3 py-1 text-sm rounded ${
                        isTranslating && translatingLang === lang.code
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {isTranslating && translatingLang === lang.code
                        ? 'Translating...'
                        : lang.has_translation
                        ? 'Re-translate'
                        : 'Translate'
                      }
                    </button>
                  </div>
                </div>

                {lang.translated_at && (
                  <div className="text-xs text-gray-400 mt-2">
                    Last translated: {new Date(lang.translated_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-3">Bulk Actions</h3>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  for (const lang of translationStatus.filter(l => !l.has_translation)) {
                    await handleTranslate(lang.code)
                  }
                }}
                disabled={isTranslating}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50"
              >
                Translate All Missing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Languages Overview */}
      {!selectedModule && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Supported Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {languages.filter(l => l.is_active).map((lang) => (
              <div key={lang.code} className="flex items-center gap-2 p-3 border rounded-lg">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div className="font-medium text-sm">{lang.native_name}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
