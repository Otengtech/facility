import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HeroSectionGrid from '../components/home/HeroSectionGrid'
import AnimatedStatsBar from '../components/home/AnimatedStats'
import HowItWorks from '../components/home/HowItWorks'
import AvailableFacilities from '../components/home/AvailableFacilities'
import CTASection from '../components/home/CTASection'

const steps = [
  {
    number: '01',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Pick a facility',
    description: 'Browse available spaces filtered by capacity, equipment, and date.',
  },
  {
    number: '02',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Choose your slot',
    description: 'See real-time availability and lock in the exact time you need.',
  },
  {
    number: '03',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: 'Confirm & go',
    description: 'Instant confirmation via email. Your booking is live immediately.',
  },
  {
    number: '04',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Track & report',
    description: 'Review usage patterns and export data for billing or planning.',
  },
]

const footerLinks = {
  legal: [
    { name: 'Home', path: '/' },
    { name: 'Bookings', path: '/my-bookings' },
    { name: 'Facilities', path: '/facilities' }
  ]
}

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <HeroSectionGrid />

      {/* Stats Bar */}
      <AnimatedStatsBar />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Live Availability Preview */}
      {/* <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-3">
              Live Preview
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See real-time availability
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Watch how our system updates availability in real-time
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 md:p-8">
            <AvailabilityGrid />
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <AvailableFacilities />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 lg:px-8 pb-6">
        <div className="">

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              {footerLinks.legal.map((link, i) => (
                <Link key={i} to={link.path} className="hover:text-gray-900 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} FacilityBook. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}