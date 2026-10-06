import { portfolioSeed } from '../data/portfolio.seed.js'
import type {
  PortfolioDocument,
  PortfolioSnapshot,
  SavePortfolioRequest,
} from '../domain/types.js'

const clone = <T>(value: T): T => structuredClone(value)

let state: PortfolioSnapshot = {
  revision: 1,
  updatedAt: new Date().toISOString(),
  data: clone(portfolioSeed),
}

export class RevisionConflictError extends Error {
  constructor(
    public readonly expectedRevision: number,
    public readonly currentRevision: number,
  ) {
    super('Portfolio revision conflict')
  }
}

export const portfolioRepository = {
  get(): PortfolioSnapshot {
    return clone(state)
  },

  save(input: SavePortfolioRequest): PortfolioSnapshot {
    if (input.expectedRevision !== state.revision) {
      throw new RevisionConflictError(input.expectedRevision, state.revision)
    }

    state = {
      revision: state.revision + 1,
      updatedAt: new Date().toISOString(),
      data: clone(input.data),
    }

    return clone(state)
  },

  reset(document: PortfolioDocument = portfolioSeed): PortfolioSnapshot {
    state = {
      revision: 1,
      updatedAt: new Date().toISOString(),
      data: clone(document),
    }

    return clone(state)
  },
}
