import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      title: 'Post Tenders',
      description: 'Buyers can easily post their project requirements and get competitive bids from qualified sellers.',
      icon: '📝'
    },
    {
      title: 'Browse Opportunities',
      description: 'Sellers can discover relevant tender opportunities that match their expertise and capabilities.',
      icon: '🔍'
    },
    {
      title: 'Secure Bidding',
      description: 'Our platform ensures secure and transparent bidding process with proper documentation.',
      icon: '🔒'
    },
    {
      title: 'Easy Management',
      description: 'Comprehensive dashboard to manage all your tenders, bids, and communications in one place.',
      icon: '📊'
    }
  ]

  const stats = [
    { label: 'Active Tenders', value: '500+' },
    { label: 'Registered Users', value: '10K+' },
    { label: 'Successful Projects', value: '2K+' },
    { label: 'Categories', value: '50+' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-light-primary to-blue-700 dark:from-dark-primary dark:to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">Tender Infinity</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your premier destination for connecting buyers and sellers in a transparent, 
              efficient tender marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="/browse" className="btn bg-white text-light-primary hover:bg-gray-100 px-8 py-3 text-lg">
                    Browse Tenders
                  </Link>
                  <Link to="/register" className="btn bg-yellow-500 text-white hover:bg-yellow-600 px-8 py-3 text-lg">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to={user.role === 'buyer' ? '/buyer/dashboard' : user.role === 'seller' ? '/seller/dashboard' : '/admin/dashboard'}
                    className="btn bg-white text-light-primary hover:bg-gray-100 px-8 py-3 text-lg"
                  >
                    Go to Dashboard
                  </Link>
                  {user.role === 'buyer' && (
                    <Link to="/buyer/post-tender" className="btn bg-yellow-500 text-white hover:bg-yellow-600 px-8 py-3 text-lg">
                      Post a Tender
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link to="/seller/browse" className="btn bg-yellow-500 text-white hover:bg-yellow-600 px-8 py-3 text-lg">
                      Find Opportunities
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose Tender Infinity?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform offers comprehensive tools and features to make your tendering 
              experience smooth, transparent, and successful.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Buyers */}
            <div>
              <h3 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-6">
                For Buyers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-primary dark:bg-dark-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Register & Create Profile</h4>
                    <p className="text-gray-600 dark:text-gray-400">Sign up as a buyer and complete your profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-primary dark:bg-dark-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Post Your Tender</h4>
                    <p className="text-gray-600 dark:text-gray-400">Create detailed tender with requirements and budget</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-primary dark:bg-dark-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Receive & Evaluate Bids</h4>
                    <p className="text-gray-600 dark:text-gray-400">Review proposals from qualified sellers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-primary dark:bg-dark-primary text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Award Project</h4>
                    <p className="text-gray-600 dark:text-gray-400">Select the best bid and start your project</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="text-2xl font-bold text-light-success dark:text-dark-success mb-6">
                For Sellers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-success dark:bg-dark-success text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Join as a Seller</h4>
                    <p className="text-gray-600 dark:text-gray-400">Register and showcase your expertise</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-success dark:bg-dark-success text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Browse Tenders</h4>
                    <p className="text-gray-600 dark:text-gray-400">Find relevant opportunities that match your skills</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-success dark:bg-dark-success text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Submit Proposals</h4>
                    <p className="text-gray-600 dark:text-gray-400">Create compelling bids with detailed proposals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-light-success dark:bg-dark-success text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Win Projects</h4>
                    <p className="text-gray-600 dark:text-gray-400">Get awarded and deliver exceptional results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-light-primary dark:bg-dark-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of buyers and sellers who trust Tender Infinity for their business needs.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn bg-white text-light-primary hover:bg-gray-100 px-8 py-3 text-lg">
                Register Now
              </Link>
              <Link to="/browse" className="btn border-2 border-white text-white hover:bg-white hover:text-light-primary px-8 py-3 text-lg">
                Browse Tenders
              </Link>
            </div>
          ) : (
            <Link 
              to={user.role === 'buyer' ? '/buyer/post-tender' : '/seller/browse'}
              className="btn bg-white text-light-primary hover:bg-gray-100 px-8 py-3 text-lg"
            >
              {user.role === 'buyer' ? 'Post Your First Tender' : 'Find Your Next Opportunity'}
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
