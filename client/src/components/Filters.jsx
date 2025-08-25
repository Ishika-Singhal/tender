import React, { useState } from 'react'

const Filters = ({ onFilter, loading = false }) => {
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    location: '',
    status: 'open'
  })

  const categories = [
    'IT & Software',
    'Construction',
    'Manufacturing',
    'Services',
    'Healthcare',
    'Education',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      q: '',
      category: '',
      minBudget: '',
      maxBudget: '',
      location: '',
      status: 'open'
    }
    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Search Keywords</label>
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Enter keywords..."
            className="input"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="input"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="awarded">Awarded</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Min Budget (₹)</label>
            <input
              type="number"
              name="minBudget"
              value={filters.minBudget}
              onChange={handleChange}
              placeholder="0"
              className="input"
              min="0"
            />
          </div>

          <div>
            <label className="label">Max Budget (₹)</label>
            <input
              type="number"
              name="maxBudget"
              value={filters.maxBudget}
              onChange={handleChange}
              placeholder="1000000"
              className="input"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="label">Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter location..."
            className="input"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 flex items-center justify-center"
          >
            {loading && <div className="spinner mr-2"></div>}
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default Filters
