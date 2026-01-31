import { create } from 'zustand'
import api from '../services/api'

interface Module {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  color: string
  status: 'draft' | 'published' | 'archived'
  sort_order: number
  section_count: number
  sections?: Section[]
}

interface Section {
  id: string
  module_id: string
  slug: string
  title: string
  description: string
  icon: string
  status: 'draft' | 'published' | 'archived'
  sort_order: number
  subsection_count: number
  subsections?: Subsection[]
}

interface Subsection {
  id: string
  section_id: string
  slug: string
  title: string
  content: string
  content_type: 'markdown' | 'video' | 'quiz' | 'exercise'
  video_url: string
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  sort_order: number
}

interface ContentState {
  modules: Module[]
  currentModule: Module | null
  currentSection: Section | null
  currentSubsection: Subsection | null
  isLoading: boolean
  error: string | null

  // Modules
  fetchModules: () => Promise<void>
  fetchModule: (id: string) => Promise<void>
  createModule: (data: Partial<Module>) => Promise<Module>
  updateModule: (id: string, data: Partial<Module>) => Promise<void>
  deleteModule: (id: string) => Promise<void>
  reorderModules: (moduleIds: string[]) => Promise<void>

  // Sections
  fetchSection: (id: string) => Promise<void>
  createSection: (data: Partial<Section>) => Promise<Section>
  updateSection: (id: string, data: Partial<Section>) => Promise<void>
  deleteSection: (id: string) => Promise<void>
  reorderSections: (moduleId: string, sectionIds: string[]) => Promise<void>

  // Subsections
  fetchSubsection: (id: string) => Promise<void>
  createSubsection: (data: Partial<Subsection>) => Promise<Subsection>
  updateSubsection: (id: string, data: Partial<Subsection>) => Promise<void>
  deleteSubsection: (id: string) => Promise<void>
  reorderSubsections: (sectionId: string, subsectionIds: string[]) => Promise<void>
}

export const useContentStore = create<ContentState>((set, get) => ({
  modules: [],
  currentModule: null,
  currentSection: null,
  currentSubsection: null,
  isLoading: false,
  error: null,

  // Modules
  fetchModules: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/modules')
      set({ modules: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchModule: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(`/modules/${id}`)
      set({ currentModule: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  createModule: async (data: Partial<Module>) => {
    const response = await api.post('/modules', data)
    await get().fetchModules()
    return response.data
  },

  updateModule: async (id: string, data: Partial<Module>) => {
    await api.put(`/modules/${id}`, data)
    await get().fetchModules()
    if (get().currentModule?.id === id) {
      await get().fetchModule(id)
    }
  },

  deleteModule: async (id: string) => {
    await api.delete(`/modules/${id}`)
    await get().fetchModules()
  },

  reorderModules: async (moduleIds: string[]) => {
    await api.put('/modules/reorder', { moduleIds })
    await get().fetchModules()
  },

  // Sections
  fetchSection: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(`/sections/${id}`)
      set({ currentSection: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  createSection: async (data: Partial<Section>) => {
    const response = await api.post('/sections', data)
    if (get().currentModule) {
      await get().fetchModule(get().currentModule!.id)
    }
    return response.data
  },

  updateSection: async (id: string, data: Partial<Section>) => {
    await api.put(`/sections/${id}`, data)
    if (get().currentSection?.id === id) {
      await get().fetchSection(id)
    }
  },

  deleteSection: async (id: string) => {
    await api.delete(`/sections/${id}`)
    if (get().currentModule) {
      await get().fetchModule(get().currentModule!.id)
    }
  },

  reorderSections: async (moduleId: string, sectionIds: string[]) => {
    await api.put(`/sections/reorder/${moduleId}`, { sectionIds })
    await get().fetchModule(moduleId)
  },

  // Subsections
  fetchSubsection: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(`/subsections/${id}`)
      set({ currentSubsection: response.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  createSubsection: async (data: Partial<Subsection>) => {
    const response = await api.post('/subsections', data)
    if (get().currentSection) {
      await get().fetchSection(get().currentSection!.id)
    }
    return response.data
  },

  updateSubsection: async (id: string, data: Partial<Subsection>) => {
    await api.put(`/subsections/${id}`, data)
    if (get().currentSubsection?.id === id) {
      await get().fetchSubsection(id)
    }
  },

  deleteSubsection: async (id: string) => {
    await api.delete(`/subsections/${id}`)
    if (get().currentSection) {
      await get().fetchSection(get().currentSection!.id)
    }
  },

  reorderSubsections: async (sectionId: string, subsectionIds: string[]) => {
    await api.put(`/subsections/reorder/${sectionId}`, { subsectionIds })
    await get().fetchSection(sectionId)
  }
}))
