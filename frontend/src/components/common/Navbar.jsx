import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth()
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <span className="font-bold text-xl text-gray-900">fastbook</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            to="/facilities"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                        >
                            <i className="fas fa-search mr-2 text-gray-400"></i> Browse
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/my-bookings"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                                >
                                    <i className="fas fa-calendar-alt mr-2 text-gray-400"></i> My Bookings
                                </Link>

                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                                    >
                                        <i className="fas fa-chart-line mr-2 text-gray-400"></i> Admin
                                    </Link>
                                )}

                                {/* User Dropdown - Click-based */}
                                <div className="relative ml-2" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-50"
                                    >
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <i className="fas fa-user text-gray-600 text-sm"></i>
                                        </div>
                                        <span className="text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                                        <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 w-64 mt-2 bg-white rounded-xl border border-gray-100 py-2 z-50 animate-fade-in-up shadow-lg">
                                            {/* User Info Section */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-user text-gray-600 text-sm"></i>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* User Details */}
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-500">Account type</span>
                                                    <span className="capitalize font-medium text-gray-900">
                                                        {user?.userType === 'internal' ? '🎓 Internal' : '🏢 External'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs mt-1.5">
                                                    <span className="text-gray-500">Role</span>
                                                    <span className="capitalize font-medium text-gray-900">
                                                        {user?.role === 'admin' ? '👑 Administrator' : '👤 User'}
                                                    </span>
                                                </div>
                                                {user?.studentStaffId && (
                                                    <div className="flex items-center justify-between text-xs mt-1.5">
                                                        <span className="text-gray-500">ID</span>
                                                        <span className="font-mono text-xs text-gray-900">{user?.studentStaffId}</span>
                                                    </div>
                                                )}
                                                {user?.department && (
                                                    <div className="flex items-center justify-between text-xs mt-1.5">
                                                        <span className="text-gray-500">Department</span>
                                                        <span className="text-gray-900 truncate max-w-[120px]">{user?.department}</span>
                                                    </div>
                                                )}
                                                {user?.organization && (
                                                    <div className="flex items-center justify-between text-xs mt-1.5">
                                                        <span className="text-gray-500">Organization</span>
                                                        <span className="text-gray-900 truncate max-w-[120px]">{user?.organization}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="py-1">
                                                <Link
                                                    to="/my-bookings"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <i className="fas fa-calendar-alt w-5 text-gray-400"></i>
                                                    <span>My Bookings</span>
                                                </Link>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <i className="fas fa-user-circle w-5 text-gray-400"></i>
                                                    <span>Profile Settings</span>
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <i className="fas fa-chart-line w-5 text-gray-400"></i>
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-gray-100 my-1"></div>

                                            {/* Logout Button */}
                                            <div className="px-2">
                                                <button
                                                    onClick={() => {
                                                        setIsDropdownOpen(false)
                                                        handleLogout()
                                                    }}
                                                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <i className="fas fa-sign-out-alt w-5"></i>
                                                    <span>Sign out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 ml-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-50"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm"
                                >
                                    Get started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <Link
                            to="/facilities"
                            className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <i className="fas fa-search w-5 text-gray-400"></i>
                            <span className="ml-3">Browse Facilities</span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/my-bookings"
                                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-gray-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <i className="fas fa-calendar-alt w-5 text-gray-400"></i>
                                    <span className="ml-3">My Bookings</span>
                                </Link>

                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-gray-50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <i className="fas fa-chart-line w-5 text-gray-400"></i>
                                        <span className="ml-3">Admin Dashboard</span>
                                    </Link>
                                )}

                                <div className="border-t border-gray-100 my-2 pt-2">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                                        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="flex items-center w-full text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                                    >
                                        <i className="fas fa-sign-out-alt w-5"></i>
                                        <span className="ml-3">Sign out</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                                <Link
                                    to="/login"
                                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-gray-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <i className="fas fa-sign-in-alt w-5 text-gray-400"></i>
                                    <span className="ml-3">Sign in</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center bg-gray-900 text-white px-3 py-2 rounded-lg text-base font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <i className="fas fa-user-plus w-5"></i>
                                    <span className="ml-3">Get started</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar