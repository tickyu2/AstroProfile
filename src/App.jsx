import { useState } from 'react'
import InputForm from './components/InputForm'
import Results from './components/Results.jsx'
import {
  calculateAge,
  getChineseZodiac,
  getWesternZodiac,
  getDayOfWeek,
  calculateYinYang,
  calculateNumerology
} from './utils/calculations'

function App() {
  const [profileData, setProfileData] = useState(null)
  const [calculations, setCalculations] = useState(null)

  const handleFormSubmit = (data) => {
    // Run all calculations
    const age = calculateAge(data.birthDate)
    const chinese = getChineseZodiac(data.birthDate)
    const western = getWesternZodiac(data.birthDate)
    const dayOfWeek = getDayOfWeek(data.birthDate)
    const yinYang = calculateYinYang(chinese, western)
    const numerology = calculateNumerology(data.firstName, data.lastName, data.birthDate)

    const allCalculations = {
      age,
      chinese,
      western,
      dayOfWeek,
      yinYang,
      numerology
    }

    setProfileData(data)
    setCalculations(allCalculations)

    console.log('Calculations:', allCalculations)
  }

  if (calculations) {
    return <Results data={profileData} calculations={calculations} />
  }

  return <InputForm onSubmit={handleFormSubmit} />
}

export default App