import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const steps = [
  {
    number: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Pick a facility',
    description: 'Browse available spaces filtered by capacity, equipment, and date.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-100',
  },
  {
    number: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Choose your slot',
    description: 'See real-time availability and lock in the exact time you need.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-100',
  },
  {
    number: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: 'Confirm & go',
    description: 'Instant confirmation via email. Your booking is live immediately.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-100',
  },
  {
    number: '04',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Track & report',
    description: 'Review usage patterns and export data for billing or planning.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-100',
  },
]

const HowItWorks = () => {
  const { isAuthenticated } = useAuth()
  const [visibleSteps, setVisibleSteps] = useState([])
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef(null)
  const stepRefs = useRef([])

  useEffect(() => {
    // Set up refs array
    stepRefs.current = stepRefs.current.slice(0, steps.length)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            const index = parseInt(entry.target.getAttribute('data-index'))
            if (!isNaN(index)) {
              setVisibleSteps(prev => {
                const newVisible = [...new Set([...prev, index])]
                if (newVisible.length === steps.length) {
                  setHasAnimated(true)
                }
                return newVisible
              })
            }
          }
        })
      },
      { threshold: 0.3, rootMargin: '0px' }
    )

    // Observe each step card
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
      observer.disconnect()
    }
  }, [hasAnimated])

  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Simple Process
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            From search to confirmation
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Book any facility in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          
          <div className="grid lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={el => stepRefs.current[i] = el}
                data-index={i}
                className={`transition-all duration-700 ease-out ${
                  visibleSteps.includes(i)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="relative group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className={`w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}>
                      <span className={`text-lg font-bold text-gray-200`}>{step.number}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`bg-white rounded-2xl border ${step.borderColor} p-6 h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 cursor-pointer`}>
                    {/* Icon */}
                    <div className={`w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-800 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Decorative Line */}
                    <div className={`mt-4 w-12 h-1 bg-gray-900 rounded-full group-hover:w-full transition-all duration-500`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-700 ${
          visibleSteps.length === steps.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Link
            to={isAuthenticated ? "/facilities" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {isAuthenticated ? "Start Booking Now" : "Get Started Now"}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks