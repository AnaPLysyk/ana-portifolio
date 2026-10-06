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
    return this.mutate(input.expectedRevision, () => input.data)
  },

  mutate(
    expectedRevision: number,
    updater: (current: PortfolioDocument) => PortfolioDocument,
  ): PortfolioSnapshot {
    if (expectedRevision !== state.revision) {
      throw new RevisionConflictError(expectedRevision, state.revision)
    }

    const next = updater(clone(state.data))

    state = {
      revision: state.revision + 1,
      updatedAt: new Date().toISOString(),
      data: clone(next),
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
