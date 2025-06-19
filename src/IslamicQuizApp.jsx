import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Search,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
} from "lucide-react";

// Dynamic color themes that change over time
const themes = [
  {
    name: "Deep Ocean",
    bgClass: "from-blue-900 via-indigo-900 to-purple-900",
    cardClass: "from-blue-500/80 to-indigo-600/80",
  },
  {
    name: "Emerald Forest",
    bgClass: "from-emerald-900 via-green-900 to-teal-900",
    cardClass: "from-emerald-500/80 to-green-600/80",
  },
  {
    name: "Sunset Glow",
    bgClass: "from-orange-900 via-red-900 to-pink-900",
    cardClass: "from-orange-500/80 to-red-600/80",
  },
  {
    name: "Midnight",
    bgClass: "from-slate-900 via-gray-900 to-zinc-900",
    cardClass: "from-slate-500/80 to-gray-600/80",
  },
  {
    name: "Aurora",
    bgClass: "from-purple-900 via-violet-900 to-fuchsia-900",
    cardClass: "from-purple-500/80 to-violet-600/80",
  },
];

const IslamicQuizApp = () => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState("");
  const [currentTheme, setCurrentTheme] = useState(0);
  const [nextThemeIndex, setNextThemeIndex] = useState(1 % themes.length);
  const [isBackgroundTransitioning, setIsBackgroundTransitioning] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-change theme every 15 seconds with smooth transition
  const renderParticles = () => (
    <div className="absolute inset-0">
      <div className="absolute top-20 left-1/4 w-2 h-2 rounded-full bg-white/20 animate-pulse"></div>
      <div className="absolute top-32 right-1/3 w-3 h-3 rounded-full bg-white/15 animate-bounce"></div>
      <div className="absolute top-1/2 left-1/6 w-1 h-1 rounded-full bg-white/25 animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-white/20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/6 w-1 h-1 rounded-full bg-white/30 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-white/15 animate-bounce"></div>
    </div>
  );

  useEffect(() => {
    const themeInterval = setInterval(() => {
      setIsTransitioning(true); // For overlay, card effects

      setNextThemeIndex((currentTheme + 1) % themes.length);
      setIsBackgroundTransitioning(true); // Start background cross-fade

      const backgroundFadeDuration = 1000;
      const initialEffectDelay = 500;

      setTimeout(() => {
        // Mid-point: overlay is up, card might be transforming. Backgrounds are cross-fading.
        setTimeout(() => {
          // Background cross-fade should be complete.
          setCurrentTheme(prevCurrent => (prevCurrent + 1) % themes.length);
          setIsBackgroundTransitioning(false); // Backgrounds settled.

          // Optional: setNextThemeIndex for the next cycle explicitly if needed,
          // though it's set at interval start based on the new currentTheme.
          // setNextThemeIndex(( (currentTheme + 1) % themes.length )); // currentTheme is updated now

          setTimeout(() => {
            setIsTransitioning(false); // End overlay, card effects
          }, 100);

        }, backgroundFadeDuration);

      }, initialEffectDelay);

    }, 15000);
    return () => clearInterval(themeInterval);
  }, [themes.length, currentTheme]);

  // Sample Islamic quiz data
  const quizzes = [
    {
      id: 1,
      question: "How many pillars of Islam are there?",
      answers: ["Three", "Four", "Five", "Six", "Seven"],
      correctAnswer: "Five",
    },
    {
      id: 2,
      question: "What is the first pillar of Islam?",
      answers: [
        "Prayer (Salah)",
        "Fasting (Sawm)",
        "Pilgrimage (Hajj)",
        "Declaration of Faith (Shahada)",
        "Charity (Zakat)",
      ],
      correctAnswer: "Declaration of Faith (Shahada)",
    },
    {
      id: 3,
      question: "In which city was Prophet Muhammad (PBUH) born?",
      answers: ["Medina", "Mecca", "Jerusalem", "Damascus", "Cairo"],
      correctAnswer: "Mecca",
    },
    {
      id: 4,
      question: "What is the holy book of Islam?",
      answers: ["Torah", "Bible", "Quran", "Vedas", "Tripitaka"],
      correctAnswer: "Quran",
    },
    {
      id: 5,
      question: "How many times do Muslims pray daily?",
      answers: ["Three", "Four", "Five", "Six", "Seven"],
      correctAnswer: "Five",
    },
    {
      id: 6,
      question: "What is the Arabic term for charity in Islam?",
      answers: ["Salah", "Sawm", "Zakat", "Hajj", "Jihad"],
      correctAnswer: "Zakat",
    },
    {
      id: 7,
      question: "During which month do Muslims fast?",
      answers: ["Muharram", "Ramadan", "Shawwal", "Rajab", "Sha'ban"],
      correctAnswer: "Ramadan",
    },
    {
      id: 8,
      question: "What is the direction Muslims face when praying?",
      answers: ["North", "South", "East", "West", "Qibla"],
      correctAnswer: "Qibla",
    },
  ];

  // Create a list of all unique correct answers from all quizzes
  const allCorrectAnswers = useMemo(() => {
    const answers = quizzes.map((quiz) => quiz.correctAnswer);
    return Array.from(new Set(answers));
  }, [quizzes]);

  const handleShuffle = () => {
    setIsShuffling(true);
    setShowResult(false);
    setSelectedAnswer("");
    setSearchTerm("");

    let shuffleCount = 0;
    const maxShuffles = 12;

    const shuffleInterval = setInterval(() => {
      setFlipDirection(shuffleCount % 2 === 0 ? "flip-left" : "flip-right");
      setShuffleIndex(Math.floor(Math.random() * quizzes.length));
      shuffleCount++;

      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        setTimeout(() => {
          const randomQuiz =
            quizzes[Math.floor(Math.random() * quizzes.length)];
          setCurrentQuiz(randomQuiz);
          setIsShuffling(false);
          setFlipDirection("");
        }, 150);
      }
    }, 120);
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer("");
    }, 3000);
  };

  // Filter the list of all correct answers based on the search term
  const filteredAnswers = allCorrectAnswers.filter((answer) =>
    answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Start with first quiz
    setCurrentQuiz(quizzes[0]);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Div 1: Current Theme (Fades Out) */}
      <div
        key={`bg-current-${currentTheme}`}
        className={`absolute inset-0 bg-gradient-to-br ${themes[currentTheme].bgClass} transition-opacity duration-1000 ease-in-out ${
          isBackgroundTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {renderParticles()}
      </div>

      {/* Background Div 2: Next Theme (Fades In) */}
      <div
        key={`bg-next-${nextThemeIndex}`}
        className={`absolute inset-0 bg-gradient-to-br ${themes[nextThemeIndex].bgClass} transition-opacity duration-1000 ease-in-out ${
          isBackgroundTransitioning ? "opacity-100" : "opacity-0"
        }`}
      >
        {renderParticles()}
      </div>

      {/* Dark overlay during transition */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ease-in-out pointer-events-none ${
          isTransitioning ? "opacity-30" : "opacity-0"
        }`}
      ></div>

      {/* Theme indicator */}
      <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
        <span
          className={`text-white text-sm font-medium transition-opacity duration-300 ${
            isTransitioning ? "opacity-50" : "opacity-100"
          }`}
        >
          {themes[isTransitioning ? nextThemeIndex : currentTheme].name}
        </span>
      </div>

      {/* Main Quiz Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-1000 ${
            isTransitioning ? "opacity-80 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {/* Question Section */}
          <div
            className={`h-64 bg-gradient-to-r ${
              themes[isTransitioning ? nextThemeIndex : currentTheme].cardClass
            } p-6 flex flex-col items-center justify-center text-white relative transition-all duration-1000 ${
              isShuffling ? "animate-pulse" : ""
            }`}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={handleShuffle}
                disabled={isShuffling}
                className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 backdrop-blur-sm border border-white/30"
              >
                <Play
                  size={24}
                  className={`${isShuffling ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Star
                  className="text-yellow-300 mr-2 animate-pulse"
                  size={20}
                />
                <span className="text-sm font-medium">Islamic Quiz</span>
                <Star
                  className="text-yellow-300 ml-2 animate-pulse"
                  size={20}
                />
              </div>

              <h2 className="text-lg font-bold leading-tight">
                {isShuffling
                  ? quizzes[shuffleIndex]?.question
                  : currentQuiz?.question}
              </h2>
            </div>

            {isShuffling && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce backdrop-blur-sm"></div>
                  <div
                    className="w-3 h-3 bg-white/80 rounded-full animate-bounce backdrop-blur-sm"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-white/80 rounded-full animate-bounce backdrop-blur-sm"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Answer Section */}
          <div className="h-96 p-5">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                size={20}
              />
              <input
                type="text"
                placeholder="Search answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/15 backdrop-blur-md rounded-xl border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white/20 transition-all duration-300"
              />
            </div>

            {/* Answer List */}
            <div
              className="space-y-2.5 h-72 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {filteredAnswers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={isShuffling}
                  className={`w-full px-4 py-3.5 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    selectedAnswer === answer
                      ? isCorrect
                        ? "bg-green-500/80 text-white shadow-lg border-2 border-green-400"
                        : "bg-red-500/80 text-white shadow-lg border-2 border-red-400"
                      : "bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50"
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm leading-relaxed">
                      {answer}
                    </span>
                    {selectedAnswer === answer && (
                      <div className="ml-3 flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle size={18} className="text-white" />
                        ) : (
                          <XCircle size={18} className="text-white" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`bg-gradient-to-r ${
              isCorrect
                ? "from-green-500 to-emerald-600"
                : "from-red-500 to-rose-600"
            } p-8 rounded-3xl text-white text-center transform animate-pulse shadow-2xl`}
          >
            <div className="mb-4">
              {isCorrect ? (
                <div className="flex items-center justify-center">
                  <Sparkles size={32} className="mr-2 animate-spin" />
                  <CheckCircle size={48} />
                  <Sparkles size={32} className="ml-2 animate-spin" />
                </div>
              ) : (
                <XCircle size={48} className="mx-auto" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {isCorrect ? "Mabrook! 🎉" : "Try Again! 💪"}
            </h3>
            <p className="text-lg">
              {isCorrect
                ? "Correct Answer! Well done!"
                : `Correct answer: ${currentQuiz?.correctAnswer}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IslamicQuizApp;
