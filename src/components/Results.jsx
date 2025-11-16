export default function Results({ data, calculations }) {
    const { age, chinese, western, dayOfWeek, yinYang, numerology } = calculations

    // Format birth date
    const birthDate = new Date(data.birthDate)
    const birthDateFormatted = birthDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    // Format birth time if provided
    const birthTimeFormatted = data.birthTime
        ? new Date(`2000-01-01T${data.birthTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
        : 'Not provided'

    // Personality descriptions
    const chineseDescriptions = {
        'Rabbit': 'Gentle, compassionate, and diplomatic. Rabbits are artistic souls who value peace and harmony. They avoid conflict and seek comfortable, stable environments.',
        'Ox': 'Dependable, strong, and determined. Oxen are methodical workers who value tradition and honesty. They achieve success through perseverance.',
        'Tiger': 'Brave, competitive, and confident. Tigers are natural leaders who love adventure and taking risks. They inspire others with their courage.',
        'Dragon': 'Charismatic, energetic, and ambitious. Dragons are visionaries who dream big and expect excellence. They are natural born leaders.',
        'Snake': 'Wise, intuitive, and mysterious. Snakes are deep thinkers who trust their instincts. They are elegant and prefer quality over quantity.',
        'Horse': 'Energetic, independent, and enthusiastic. Horses love freedom and social interaction. They are optimistic and love new experiences.',
        'Goat': 'Creative, gentle, and sympathetic. Goats are artistic and compassionate, preferring peace and beauty in their surroundings.',
        'Monkey': 'Clever, curious, and playful. Monkeys are quick-witted problem solvers who love mental challenges and social interaction.',
        'Rooster': 'Observant, hardworking, and confident. Roosters are perfectionists who are honest and straightforward in their communication.',
        'Dog': 'Loyal, honest, and responsible. Dogs are devoted friends who value justice and fairness. They are trustworthy and protective.',
        'Pig': 'Generous, compassionate, and diligent. Pigs are kind-hearted and enjoy life pleasures. They are honest and hardworking.',
        'Rat': 'Quick-witted, resourceful, and versatile. Rats are intelligent and adaptable, always finding opportunities for success.'
    }

    const elementEnhancements = {
        'Water': 'adds emotional depth, intuition, and adaptability. Water brings wisdom, flexibility, and the ability to flow with life changes. This creates a more sensitive and empathetic nature.',
        'Wood': 'brings growth, creativity, and generosity. Wood enhances expansive thinking, ethical behavior, and community spirit. This creates a more idealistic and socially conscious nature.',
        'Fire': 'intensifies passion, leadership, and dynamism. Fire brings enthusiasm, courage, and the drive to inspire others. This creates a more charismatic and action-oriented nature.',
        'Earth': 'provides stability, practicality, and nurturing qualities. Earth enhances reliability, patience, and the ability to build lasting foundations. This creates a more grounded and responsible nature.',
        'Metal': 'strengthens determination, discipline, and integrity. Metal brings structure, focus, and high standards. This creates a more principled and ambitious nature.'
    }

    const westernDescriptions = {
        'Aries': 'Bold pioneers who lead with courage and enthusiasm. Aries are natural trailblazers who thrive on challenges and new beginnings.',
        'Taurus': 'Reliable builders who value stability, beauty, and sensory pleasures. Taurus individuals are patient, practical, and appreciate life finer things.',
        'Gemini': 'Curious communicators who thrive on mental stimulation and variety. Geminis are adaptable, witty, and love connecting with others.',
        'Cancer': 'Nurturing protectors who lead with emotion and intuition. Cancers create safe spaces and value deep emotional connections.',
        'Leo': 'Charismatic leaders who shine with confidence and creativity. Leos are generous, dramatic, and inspire others with their warmth.',
        'Virgo': 'Detail-oriented perfectionists who serve others through practical help. Virgos are analytical, health-conscious, and continuously improving.',
        'Libra': 'Diplomatic peacemakers who seek balance, beauty, and harmony. Libras are charming, fair-minded, and excel in partnerships.',
        'Scorpio': 'Intense transformers who dive deep into life mysteries. Scorpios are passionate, resourceful, and fiercely loyal.',
        'Sagittarius': 'Adventurous philosophers who seek truth and freedom. Sagittarians are optimistic, honest, and love exploring new horizons.',
        'Capricorn': 'Ambitious achievers who build lasting success through discipline. Capricorns are responsible, strategic, and highly determined.',
        'Aquarius': 'Visionary innovators who champion progress and individuality. Aquarians are humanitarian, original, and intellectually independent.',
        'Pisces': 'Compassionate dreamers who connect to the spiritual and artistic realms. Pisces are empathetic, intuitive, and deeply creative.'
    }

    const elementAspects = {
        'Earth': 'The Earth element grounds this sign in reality, enhancing practicality, reliability, and material focus. Earth signs build tangible results, value security, and work steadily toward their goals. They are sensual, patient, and excel at manifesting their visions into physical form.',
        'Water': 'The Water element deepens emotional intelligence, intuition, and empathy. Water signs navigate through feelings, forming deep bonds and understanding unspoken truths. They are nurturing, psychic, and flow adaptably through life changes.',
        'Fire': 'The Fire element ignites passion, courage, and spontaneity. Fire signs are action-oriented, inspiring others with their enthusiasm and confidence. They are creative, optimistic, and thrive on challenges and adventure.',
        'Air': 'The Air element stimulates intellect, communication, and social connection. Air signs think objectively, exchange ideas freely, and see multiple perspectives. They are curious, logical, and excel at networking and conceptual thinking.'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 py-12">
            <div className="max-w-7xl mx-auto">

                {/* Warm Welcome Message */}
                <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl p-8 mb-12 border-2 border-amber-500/30 shadow-2xl hover:border-amber-400/70 hover:shadow-amber-500/30 hover:scale-[1.01] transition-all duration-300 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                        ✨ Your Cosmic Blueprint ✨
                    </h1>
                    <div className="text-center text-gray-100 text-lg md:text-xl leading-relaxed">
                        <p className="mb-2">
                            <span className="text-2xl font-semibold text-amber-400">Wow, {data.firstName} {data.lastName}.</span> Nice meeting you!
                        </p>
                        <p>
                            I see that you were born on <span className="font-semibold text-white">{birthDateFormatted}</span>,
                            that amazing day was a <span className="font-semibold text-amber-400">{dayOfWeek.day}</span>.
                        </p>
                        <p className="mt-2">
                            As of today, you are <span className="font-bold text-amber-400 text-2xl">{age.years} years</span>,
                            <span className="font-semibold text-white"> {age.months} months</span>, and
                            <span className="font-semibold text-white"> {age.days} days</span> old.
                        </p>
                    </div>
                </div>

                {/* ROW 1: Birth Info + Chinese Zodiac */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                    {/* Birth Information (3 cols) */}
                    <div className="lg:col-span-3 bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 border-2 border-amber-500/30 shadow-xl hover:border-amber-400/70 hover:shadow-amber-500/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-slide-in-left">
                        <h2 className="text-lg font-bold text-amber-400 mb-6 text-center">
                            📋 YOUR BIRTH INFORMATION
                        </h2>
                        <div className="space-y-3 text-center text-sm">
                            <div>
                                <div className="text-amber-300 text-xs font-semibold mb-1">FULL NAME</div>
                                <div className="text-gray-100 font-semibold">{data.firstName} {data.lastName}</div>
                            </div>
                            <div>
                                <div className="text-amber-300 text-xs font-semibold mb-1">BIRTH DATE AND TIME</div>
                                <div className="text-gray-100">{birthDateFormatted} at {birthTimeFormatted}</div>
                            </div>
                            <div>
                                <div className="text-amber-300 text-xs font-semibold mb-1">BIRTH PLACE</div>
                                <div className="text-gray-100">{data.birthCity}, {data.birthCountry}</div>
                            </div>
                            {data.mbti && (
                                <div className="pt-3 border-t border-amber-500/30">
                                    <div className="text-amber-300 text-xs font-semibold mb-1">MBTI</div>
                                    <div className="text-gray-100 font-semibold">{data.mbti}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chinese Zodiac (9 cols) */}
                    <div className="lg:col-span-9 bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 border-2 border-amber-500/30 shadow-xl hover:border-amber-400/70 hover:shadow-amber-500/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-slide-in-right">
                        <h2 className="text-xl font-bold text-amber-400 mb-4 text-center flex items-center justify-center gap-2">
                            <span>🐉</span> CHINESE ZODIAC
                        </h2>
                        <div className="text-center mb-4">
                            <p className="text-gray-100 text-lg mb-4">
                                You are a <span className="font-bold text-cyan-400">{chinese.element} {chinese.animal}</span>, born in the year of the {chinese.animal} with {chinese.element} Element.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
                            <div className="text-amber-300 text-sm font-semibold mb-3 text-center">
                                {chinese.element.toUpperCase()} {chinese.animal.toUpperCase()} PERSONALITY TRAITS
                            </div>
                            <p className="text-gray-200 text-sm leading-relaxed text-center">
                                {chineseDescriptions[chinese.animal]} {chinese.element} {elementEnhancements[chinese.element]}
                            </p>
                        </div>
                    </div>

                </div>

                {/* ROW 2: Born On + Western Zodiac */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                    {/* Born On (3 cols) */}
                    <div className="lg:col-span-3 bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 border-2 border-amber-500/30 shadow-xl hover:border-amber-400/70 hover:shadow-amber-500/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-slide-in-left animation-delay-100">
                        <h2 className="text-lg font-bold text-amber-400 mb-4 text-center">
                            🌟 BORN ON
                        </h2>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-3">
                                {dayOfWeek.day}
                            </div>
                            <div className="text-gray-200 text-sm mb-2">
                                Ruled by <span className="font-semibold text-amber-400">{dayOfWeek.planet}</span>
                            </div>
                            <div className="text-gray-300 text-xs italic mb-4">
                                {dayOfWeek.traits}
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
                            <div className="text-amber-300 text-xs font-semibold mb-2 text-center">
                                PLANETARY INFLUENCE
                            </div>
                            <p className="text-gray-200 text-xs leading-relaxed text-center">
                                {dayOfWeek.planet === 'Sun' && 'The Sun brings vitality, confidence, and leadership. Those born on Sunday naturally shine and inspire others.'}
                                {dayOfWeek.planet === 'Moon' && 'The Moon brings sensitivity, intuition, and nurturing energy. Those born on Monday are deeply empathetic and emotionally intelligent.'}
                                {dayOfWeek.planet === 'Mars' && 'Mars brings courage, passion, and drive. Those born on Tuesday are natural warriors who take action and face challenges head-on.'}
                                {dayOfWeek.planet === 'Mercury' && 'Mercury brings communication, intelligence, and adaptability. Those born on Wednesday are quick thinkers and excellent communicators.'}
                                {dayOfWeek.planet === 'Jupiter' && 'Jupiter brings optimism, expansion, and wisdom. Those born on Thursday are naturally lucky and see the bigger picture.'}
                                {dayOfWeek.planet === 'Venus' && 'Venus brings love, beauty, and harmony. Those born on Friday appreciate aesthetics and excel in relationships.'}
                                {dayOfWeek.planet === 'Saturn' && 'Saturn brings discipline, responsibility, and structure. Those born on Saturday are hardworking and build lasting foundations.'}
                            </p>
                        </div>
                    </div>

                    {/* Western Zodiac (9 cols) */}
                    <div className="lg:col-span-9 bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 border-2 border-amber-500/30 shadow-xl hover:border-amber-400/70 hover:shadow-amber-500/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-slide-in-right animation-delay-100">
                        <h2 className="text-xl font-bold text-amber-400 mb-4 text-center flex items-center justify-center gap-2">
                            <span>♉</span> WESTERN ZODIAC
                        </h2>
                        <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-white mb-2">
                                {western.sign}
                            </div>
                            <div className="text-gray-200 text-lg mb-1">
                                An <span className="font-semibold text-amber-400">{western.element}</span> sign
                            </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 space-y-3">
                            <div>
                                <div className="text-amber-300 text-sm font-semibold mb-2 text-center">
                                    {western.sign.toUpperCase()} PERSONALITY TRAITS
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed text-center">
                                    {westernDescriptions[western.sign]}
                                </p>
                            </div>
                            <div>
                                <div className="text-amber-300 text-sm font-semibold mb-2 text-center">
                                    {western.element.toUpperCase()} ELEMENT ASPECT
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed text-center">
                                    {elementAspects[western.element]}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ROW 3: Numerology + Yin/Yang */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Numerology Profile */}
                    <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl p-8 border-2 border-amber-500/30 shadow-xl hover:border-amber-400/70 hover:shadow-amber-500/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-slide-in-left animation-delay-200">
                        <h2 className="text-2xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
                            <span>🔢</span> Numerology Profile
                        </h2>
                        <p className="text-gray-300 text-sm mb-6 text-center">
                            The mathematical blueprint of your life path and purpose
                        </p>

                        <div className="space-y-4">

                            {/* Life Path */}
                            <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-purple-500/30 hover:border-purple-400/60 hover:shadow-purple-500/30 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                                        {numerology.lifePath.number}
                                    </div>
                                    <div>
                                        <div className="text-purple-300 text-xs font-semibold tracking-wider">LIFE PATH</div>
                                        <div className="text-white font-bold">Your Life Purpose</div>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {numerology.lifePath.meaning}
                                </p>
                            </div>

                            {/* Expression */}
                            <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-pink-500/30 hover:border-pink-400/60 hover:shadow-pink-500/30 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                                        {numerology.expression.number}
                                    </div>
                                    <div>
                                        <div className="text-pink-300 text-xs font-semibold tracking-wider">EXPRESSION</div>
                                        <div className="text-white font-bold">Your Natural Talents</div>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {numerology.expression.meaning}
                                </p>
                            </div>

                            {/* Soul Urge */}
                            <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-500/30 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                                        {numerology.soulUrge.number}
                                    </div>
                                    <div>
                                        <div className="text-cyan-300 text-xs font-semibold tracking-wider">SOUL URGE</div>
                                        <div className="text-white font-bold">Your Inner Desires</div>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {numerology.soulUrge.meaning}
                                </p>
                            </div>

                            {/* Personal Year */}
                            <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-amber-500/30 hover:border-amber-400/60 hover:shadow-amber-500/30 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                                        {numerology.personalYear.number}
                                    </div>
                                    <div>
                                        <div className="text-amber-300 text-xs font-semibold tracking-wider">PERSONAL YEAR {numerology.personalYear.year}</div>
                                        <div className="text-white font-bold">Your Current Cycle</div>
                                    </div>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {numerology.personalYear.meaning}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Yin/Yang Balance */}
                    <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl p-8 border-2 border-amber-500/30 shadow-xl hover:border-amber-400/70 hover:shadow-amber-500/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-slide-in-right animation-delay-200">
                        <h2 className="text-2xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
                            <span>☯️</span> Yin/Yang Energy Balance
                        </h2>
                        <p className="text-gray-300 text-sm mb-6 text-center">
                            Your energetic signature based on Chinese Animal, Element, and Western Zodiac
                        </p>

                        {/* Progress Bar */}
                        <div className="relative h-16 bg-slate-900/50 rounded-full overflow-hidden mb-6 border-2 border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 flex items-center justify-start pl-6 transition-all duration-1000"
                                style={{ width: `${yinYang.yinPercentage}%` }}
                            >
                                {yinYang.yinPercentage > 15 && (
                                    <span className="text-white font-bold text-xl drop-shadow-lg">
                                        {yinYang.yinPercentage}% Yin
                                    </span>
                                )}
                            </div>
                            <div
                                className="absolute right-0 top-0 h-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-300 flex items-center justify-end pr-6 transition-all duration-1000"
                                style={{ width: `${yinYang.yangPercentage}%` }}
                            >
                                {yinYang.yangPercentage > 15 && (
                                    <span className="text-white font-bold text-xl drop-shadow-lg">
                                        {yinYang.yangPercentage}% Yang
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Yin/Yang Meaning */}
                        <div className="space-y-4 mb-6">
                            <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-500/30 hover:shadow-lg transition-all duration-300">
                                <div className="text-cyan-300 font-bold mb-2 text-center">🌙 YIN ENERGY ({yinYang.yinPercentage}%)</div>
                                <p className="text-gray-200 text-sm text-center">
                                    Receptive, introspective, intuitive. Yin is the quiet strength of water—flowing, adapting, nurturing.
                                    It represents the inner world, emotional depth, and the wisdom of listening.
                                </p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-4 border-2 border-orange-500/30 hover:border-orange-400/60 hover:shadow-orange-500/30 hover:shadow-lg transition-all duration-300">
                                <div className="text-orange-300 font-bold mb-2 text-center">☀️ YANG ENERGY ({yinYang.yangPercentage}%)</div>
                                <p className="text-gray-200 text-sm text-center">
                                    Active, expressive, dynamic. Yang is the bright power of fire—initiating, leading, creating.
                                    It represents the outer world, action-taking, and the courage to assert yourself.
                                </p>
                            </div>
                        </div>

                        {/* Calculation Breakdown */}
                        <details className="cursor-pointer group">
                            <summary className="text-gray-200 hover:text-amber-400 font-semibold flex items-center justify-center gap-2 transition-colors duration-300 list-none">
                                <span>📊</span> Show Detailed Calculation
                            </summary>
                            <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-amber-500/20">
                                <div className="text-amber-400 font-bold mb-3 text-center">How We Calculate Your Balance:</div>
                                <div className="space-y-2">
                                    {yinYang.factors.map((factor, idx) => {
                                        const isYin = factor.includes('Yin')
                                        const isYang = factor.includes('Yang')
                                        const isNeutral = factor.includes('Neutral')

                                        return (
                                            <div key={idx} className="flex items-start gap-2">
                                                <div className={`text-lg ${isYin ? 'text-cyan-300' : isYang ? 'text-orange-300' : 'text-purple-300'}`}>
                                                    {isYin ? '🌙' : isYang ? '☀️' : '⚖️'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-semibold text-sm ${isYin ? 'text-cyan-300' : isYang ? 'text-orange-300' : 'text-purple-300'}`}>
                                                        {factor.split(':')[0]}
                                                    </div>
                                                    <div className="text-gray-300 text-xs">
                                                        {factor.split(':')[1]}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-amber-500/30">
                                    <div className="text-white font-semibold text-sm mb-1 text-center">Final Ratio:</div>
                                    <div className="text-gray-200 text-xs text-center">
                                        Total Yin Score: <span className="text-cyan-300 font-bold">{yinYang.yinCount}</span> |
                                        Total Yang Score: <span className="text-orange-300 font-bold"> {yinYang.yangCount}</span>
                                    </div>
                                    <div className="text-gray-200 text-xs text-center mt-1">
                                        Percentage: <span className="text-cyan-300 font-bold">{yinYang.yinPercentage}% Yin</span> /
                                        <span className="text-orange-300 font-bold"> {yinYang.yangPercentage}% Yang</span>
                                    </div>
                                </div>
                            </div>
                        </details>
                    </div>

                </div>

                {/* Coming Soon */}
                <div className="mt-12 text-center bg-slate-800/40 rounded-xl p-8 border-2 border-amber-500/30 hover:border-amber-400/70 hover:shadow-amber-500/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-fade-in animation-delay-300">
                    <p className="text-gray-100 text-2xl font-semibold mb-2">
                        🔮 AI Personality Analysis Coming Next...
                    </p>
                    <p className="text-gray-300">
                        9-panel dashboard • Deep Dive features • Soulmate matching • And more!
                    </p>
                </div>

            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
        </div>
    )
}