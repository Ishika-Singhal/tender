import React from 'react'

const About = () => {
  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: '👨‍💼',
      description: 'Visionary leader with 15+ years in business development'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      image: '👩‍💻',
      description: 'Technology expert specializing in marketplace platforms'
    },
    {
      name: 'Mike Davis',
      role: 'Head of Operations',
      image: '👨‍🔧',
      description: 'Operations specialist ensuring smooth platform functionality'
    }
  ]

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in complete transparency in all tender processes and communications.',
      icon: '🔍'
    },
    {
      title: 'Trust',
      description: 'Building lasting relationships through reliability and consistent performance.',
      icon: '🤝'
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology.',
      icon: '💡'
    },
    {
      title: 'Excellence',
      description: 'Striving for excellence in every aspect of our service delivery.',
      icon: '⭐'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            About Tender Infinity
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            We are revolutionizing the way businesses connect through our innovative 
            tender marketplace platform, making procurement transparent, efficient, 
            and accessible to all.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                To create the world's most trusted and efficient tender marketplace where 
                businesses of all sizes can find the perfect partners for their projects. 
                We bridge the gap between buyers seeking quality services and sellers 
                offering exceptional solutions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Through our platform, we democratize access to business opportunities, 
                promote fair competition, and foster innovation across industries.
              </p>
            </div>
            <div className="bg-gradient-to-br from-light-primary to-blue-700 dark:from-dark-primary dark:to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Platform Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <span>Smart matching algorithm</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔒</span>
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <span>Advanced analytics & reporting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌍</span>
                  <span>Global marketplace reach</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              These principles guide everything we do and shape our platform's culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The passionate individuals behind Tender Infinity's success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {member.name}
                </h3>
                <p className="text-light-primary dark:text-dark-primary font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Our Impact in Numbers
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                  10,000+
                </div>
                <div className="text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                  5,000+
                </div>
                <div className="text-gray-600 dark:text-gray-400">Tenders Posted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                  2,500+
                </div>
                <div className="text-gray-600 dark:text-gray-400">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                  98%
                </div>
                <div className="text-gray-600 dark:text-gray-400">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-light-primary to-blue-700 dark:from-dark-primary dark:to-blue-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start your journey with Tender Infinity today and discover endless opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="btn bg-white text-light-primary hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Get Started
              </a>
              <a 
                href="/contact" 
                className="btn border-2 border-white text-white hover:bg-white hover:text-light-primary px-8 py-3 text-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
