import type {
  AboutContent,
  Appearance,
  AssistantConfig,
  CompetencyItem,
  EducationItem,
  EditorState,
  ExperienceItem,
  HeroContent,
  HighlightItem,
  PortfolioDocument,
  PortfolioSnapshot,
  Profile,
  Project,
} from '../domain/types.js'
import { portfolioRepository } from '../repositories/portfolio.repository.js'

export class ResourceNotFoundError extends Error {
  constructor(
    public readonly resource: string,
    public readonly id: string,
  ) {
    super(`${resource} not found: ${id}`)
  }
}

export class ResourceAlreadyExistsError extends Error {
  constructor(
    public readonly resource: string,
    public readonly id: string,
  ) {
    super(`${resource} already exists: ${id}`)
  }
}

export class InvalidOrderError extends Error {
  constructor(public readonly resource: string) {
    super(`Invalid order for ${resource}`)
  }
}

export class InvalidResourceIdError extends Error {
  constructor(
    public readonly resource: string,
    public readonly pathId: string,
    public readonly bodyId: string,
  ) {
    super(`Resource id mismatch for ${resource}`)
  }
}

const replaceField = <K extends keyof PortfolioDocument>(
  expectedRevision: number,
  key: K,
  value: PortfolioDocument[K],
): PortfolioSnapshot =>
  portfolioRepository.mutate(expectedRevision, (current) => ({
    ...current,
    [key]: structuredClone(value),
  }))

const uniqueIds = (ids: string[]) => new Set(ids).size === ids.length

const reorder = <T extends { id: string }>(
  items: T[],
  ids: string[],
  resource: string,
): T[] => {
  const currentIds = items.map((item) => item.id)

  if (
    !uniqueIds(ids) ||
    ids.length !== currentIds.length ||
    currentIds.some((id) => !ids.includes(id))
  ) {
    throw new InvalidOrderError(resource)
  }

  const byId = new Map(items.map((item) => [item.id, item]))
  return ids.map((id) => byId.get(id) as T)
}

export const portfolioService = {
  get(): PortfolioSnapshot {
    return portfolioRepository.get()
  },

  replace(expectedRevision: number, data: PortfolioDocument): PortfolioSnapshot {
    return portfolioRepository.save({ expectedRevision, data })
  },

  updateProfile(expectedRevision: number, data: Profile): PortfolioSnapshot {
    return replaceField(expectedRevision, 'profile', data)
  },

  updateHero(expectedRevision: number, data: HeroContent): PortfolioSnapshot {
    return replaceField(expectedRevision, 'hero', data)
  },

  updateAbout(expectedRevision: number, data: AboutContent): PortfolioSnapshot {
    return replaceField(expectedRevision, 'about', data)
  },

  updateCompetencies(
    expectedRevision: number,
    data: CompetencyItem[],
  ): PortfolioSnapshot {
    return replaceField(expectedRevision, 'competencies', data)
  },

  updateEducation(
    expectedRevision: number,
    data: EducationItem[],
  ): PortfolioSnapshot {
    return replaceField(expectedRevision, 'education', data)
  },

  updateHighlights(
    expectedRevision: number,
    data: HighlightItem[],
  ): PortfolioSnapshot {
    return replaceField(expectedRevision, 'highlights', data)
  },

  updateContentBlocks(
    expectedRevision: number,
    data: Record<string, string>,
  ): PortfolioSnapshot {
    return replaceField(expectedRevision, 'contentBlocks', data)
  },

  updateAppearance(
    expectedRevision: number,
    data: Appearance,
  ): PortfolioSnapshot {
    return replaceField(expectedRevision, 'appearance', data)
  },

  updateAssistant(
    expectedRevision: number,
    data: AssistantConfig,
  ): PortfolioSnapshot {
    return replaceField(expectedRevision, 'assistant', data)
  },

  updateEditor(expectedRevision: number, data: EditorState): PortfolioSnapshot {
    return replaceField(expectedRevision, 'editor', data)
  },

  createProject(expectedRevision: number, project: Project): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => {
      if (current.projects.some((item) => item.id === project.id)) {
        throw new ResourceAlreadyExistsError('project', project.id)
      }

      return {
        ...current,
        projects: [...current.projects, structuredClone(project)],
      }
    })
  },

  updateProject(
    expectedRevision: number,
    id: string,
    project: Project,
  ): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => {
      const index = current.projects.findIndex((item) => item.id === id)

      if (index < 0) throw new ResourceNotFoundError('project', id)
      if (project.id !== id) {
        throw new InvalidResourceIdError('project', id, project.id)
      }

      const projects = [...current.projects]
      projects[index] = structuredClone(project)
      return { ...current, projects }
    })
  },

  deleteProject(expectedRevision: number, id: string): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => {
      if (!current.projects.some((item) => item.id === id)) {
        throw new ResourceNotFoundError('project', id)
      }

      return {
        ...current,
        projects: current.projects.filter((item) => item.id !== id),
      }
    })
  },

  reorderProjects(expectedRevision: number, ids: string[]): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => ({
      ...current,
      projects: reorder(current.projects, ids, 'projects'),
    }))
  },

  createExperience(
    expectedRevision: number,
    item: ExperienceItem,
  ): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => {
      if (current.experience.some((entry) => entry.id === item.id)) {
        throw new ResourceAlreadyExistsError('experience', item.id)
      }

      return {
        ...current,
        experience: [...current.experience, structuredClone(item)],
      }
    })
  },

  updateExperience(
    expectedRevision: number,
    id: string,
    item: ExperienceItem,
  ): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => {
      const index = current.experience.findIndex((entry) => entry.id === id)

      if (index < 0) throw new ResourceNotFoundError('experience', id)
      if (item.id !== id) {
        throw new InvalidResourceIdError('experience', id, item.id)
      }

      const experience = [...current.experience]
      experience[index] = structuredClone(item)
      return { ...current, experience }
    })
  },

  deleteExperience(expectedRevision: number, id: string): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => {
      if (!current.experience.some((item) => item.id === id)) {
        throw new ResourceNotFoundError('experience', id)
      }

      return {
        ...current,
        experience: current.experience.filter((item) => item.id !== id),
      }
    })
  },

  reorderExperience(
    expectedRevision: number,
    ids: string[],
  ): PortfolioSnapshot {
    return portfolioRepository.mutate(expectedRevision, (current) => ({
      ...current,
      experience: reorder(current.experience, ids, 'experience'),
    }))
  },
}
