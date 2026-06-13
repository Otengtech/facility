import React, { useState, useEffect, useRef } from 'react'

const AnimatedStats = () => {
  const [counts, setCounts] = useState({
    bookings: 0,
    uptime: 0,
    avgTime: 0,
    facilities: 0
  })
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef(null)

  const targetValues = {
    bookings: 12000,
    uptime: 98,
    avgTime: 2,
    facilities: 340
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          startCounting()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasAnimated])

  const startCounting = () => {
    const duration = 2000 // 2 seconds
    const interval = 20 // Update every 20ms
    const steps = duration / interval

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      
      setCounts({
        bookings: Math.floor(targetValues.bookings * progress),
        uptime: Math.min(Math.floor(targetValues.uptime * progress), targetValues.uptime),
        avgTime: Math.min(Math.floor(targetValues.avgTime * progress), targetValues.avgTime),
        facilities: Math.floor(targetValues.facilities * progress)
      })

      if (step >= steps) {
        setCounts({
          bookings: targetValues.bookings,
          uptime: targetValues.uptime,
          avgTime: targetValues.avgTime,
          facilities: targetValues.facilities
        })
        clearInterval(timer)
      }
    }, interval)
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k+'
    }
    return num + '+'
  }

  return (
    <section ref={sectionRef} className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {formatNumber(counts.bookings)}
            </div>
            <div className="text-xs md:text-sm text-blue-100 mt-1">Bookings Made</div>
          </div>
          <div className="text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {counts.uptime}%
            </div>
            <div className="text-xs md:text-sm text-blue-100 mt-1">Uptime SLA</div>
          </div>
          <div className="text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl md:text-4xl font-bold text-white">
              &lt; {counts.avgTime} min
            </div>
            <div className="text-xs md:text-sm text-blue-100 mt-1">Avg. Booking Time</div>
          </div>
          <div className="text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {counts.facilities}+
            </div>
            <div className="text-xs md:text-sm text-blue-100 mt-1">Facilities Managed</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnimatedStats