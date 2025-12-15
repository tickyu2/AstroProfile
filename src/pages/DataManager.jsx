/**
 * DataManager.jsx - Dashboard 1: Data Manager
 * "Excel for Souls" - Manage all people in the GENESIS database
 *
 * Part of the GENESIS Cathedral - Room 3
 * Phase 1B: Advanced Filtering System
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { usePeople } from '../hooks/usePeople';
import DataTable from '../components/dataManager/DataTable';
import FilterPanel from '../components/dataManager/FilterPanel';
import DeleteConfirmDialog from '../components/dataManager/DeleteConfirmDialog';
import EditPersonModal from '../components/dataManager/EditPersonModal';
import ImportModal from '../components/dataManager/ImportModal';

// Default filter state
const DEFAULT_FILTERS = {
  relationship: [],
  priority: [],
  chineseAnimal: [],
  westernSign: [],
  mbti: [],
  tags: [],
  gender: []
};

// localStorage key for filter persistence
const FILTERS_STORAGE_KEY = 'dataManagerFilters';
const FILTERS_COLLAPSED_KEY = 'dataManagerFiltersCollapsed';

export default function DataManager() {
  const { currentUser, logout } = useAuth();
  const { deleteProfile } = useProfiles();
  const { people, isLoading, error } = usePeople();
  const navigate = useNavigate();

  // Modal states
  const [deletingPerson, setDeletingPerson] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter state - restore from localStorage on mount
  // Merge with DEFAULT_FILTERS to ensure new filter keys exist
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all keys exist (handles new filter additions)
        return { ...DEFAULT_FILTERS, ...parsed };
      }
      return DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  // Filter panel collapsed state
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem(FILTERS_COLLAPSED_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Persist filters to localStorage
  useEffect(() => {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem(FILTERS_COLLAPSED_KEY, JSON.stringify(isFiltersCollapsed));
  }, [isFiltersCollapsed]);

  // Apply filters function
  const applyFilters = (peopleList) => {
    return peopleList.filter(person => {
      // Check if any filters are active
      const hasActiveFilters =
        filters.relationship.length > 0 ||
        filters.priority.length > 0 ||
        filters.chineseAnimal.length > 0 ||
        filters.westernSign.length > 0 ||
        filters.mbti.length > 0 ||
        filters.tags.length > 0 ||
        filters.gender.length > 0;

      if (!hasActiveFilters) return true;

      // Check each filter category (AND logic between categories)
      const matchesRelationship =
        filters.relationship.length === 0 ||
        filters.relationship.includes(person.relationship?.toLowerCase());

      const matchesPriority =
        filters.priority.length === 0 ||
        filters.priority.includes(person.priority ?? 0);

      const matchesAnimal =
        filters.chineseAnimal.length === 0 ||
        filters.chineseAnimal.includes(person.chineseAnimal);

      const matchesSign =
        filters.westernSign.length === 0 ||
        filters.westernSign.includes(person.westernSign);

      const matchesMbti =
        filters.mbti.length === 0 ||
        filters.mbti.includes(person.mbtiType);

      // Tags filter - OR logic (person has ANY of the selected tags)
      const matchesTags =
        filters.tags.length === 0 ||
        person.tags?.some(tag => filters.tags.includes(tag));

      // Gender filter
      const matchesGender =
        filters.gender.length === 0 ||
        filters.gender.includes(person.gender?.toLowerCase());

      // Return true only if ALL active filters match (AND logic between categories)
      return matchesRelationship &&
        matchesPriority &&
        matchesAnimal &&
        matchesSign &&
        matchesMbti &&
        matchesTags &&
        matchesGender;
    });
  };

  // Filter people by search query AND multi-column filters
  const filteredPeople = useMemo(() => {
    // First apply multi-column filters
    let result = applyFilters(people);

    // Then apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(person =>
        person.fullName?.toLowerCase().includes(query) ||
        person.nickname?.toLowerCase().includes(query) ||
        person.chineseAnimal?.toLowerCase().includes(query) ||
        person.westernSign?.toLowerCase().includes(query) ||
        person.mbtiType?.toLowerCase().includes(query) ||
        person.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [people, searchQuery, filters]);

  // Handle filter change
  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [category]: newValues
      };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
  };

  const handleEditSuccess = () => {
    // Data will auto-refresh via useProfiles() real-time listener
    setEditingPerson(null);
  };

  const handleDelete = (person) => {
    setDeletingPerson(person);
  };

  const handleConfirmDelete = async () => {
    if (deletingPerson) {
      try {
        await deleteProfile(deletingPerson.id);
        setDeletingPerson(null);
      } catch (err) {
        console.error('Failed to delete person:', err);
        alert('Failed to delete. Please try again.');
      }
    }
  };

  const handleAddPerson = () => {
    navigate('/create-profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-2xl">✨</span>
                <span className="text-white font-bold text-xl">AstroProfile</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/data-manager"
                  className="px-3 py-2 text-teal-400 border-b-2 border-teal-400 text-sm font-medium"
                >
                  Data Manager
                </Link>
                <Link
                  to="/compatibility"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Compatibility
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm hidden sm:block">
                {currentUser?.displayName || currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Data Manager
            </h1>
            <p className="text-gray-400">
              Managing {people.length} {people.length === 1 ? 'person' : 'people'} in your soul database
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <span>📥</span>
              Import Dataset
            </button>
            <button
              onClick={handleAddPerson}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Person
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, animal, sign, MBTI, tags..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          filteredCount={filteredPeople.length}
          totalCount={people.length}
          isCollapsed={isFiltersCollapsed}
          onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300">
            <p>Error loading data: {error.message}</p>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          people={filteredPeople}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewProfile={(person) => {
            if (person.profileId) {
              navigate(`/results/${person.profileId}`);
            }
          }}
        />

        {/* Empty State */}
        {people.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-white mb-2">No people yet!</h3>
            <p className="text-gray-400 mb-6">
              Start building your soul database by adding your first person.
            </p>
            <button
              onClick={handleAddPerson}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg shadow-teal-500/25"
            >
              + Add Your First Person
            </button>
          </div>
        )}

        {/* No results after filtering */}
        {people.length > 0 && filteredPeople.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filters to see more results.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearAllFilters();
              }}
              className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={!!deletingPerson}
        onClose={() => setDeletingPerson(null)}
        onConfirm={handleConfirmDelete}
        personName={deletingPerson?.fullName}
      />

      {/* Edit Person Modal */}
      <EditPersonModal
        isOpen={!!editingPerson}
        onClose={() => setEditingPerson(null)}
        person={editingPerson}
        onSuccess={handleEditSuccess}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={(results) => {
          console.log('Import complete:', results);
          // Data will auto-refresh via useProfiles() real-time listener
        }}
      />
    </div>
  );
}
