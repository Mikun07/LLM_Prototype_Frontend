import type { PipelineInfo } from '../types'

export const pipelines: PipelineInfo[] = [
  {
    key: 'claudeAmbiguity',
    model: 'claude',
    smellType: 'ambiguity',
    label: 'Claude ambiguity',
  },
  {
    key: 'claudeInconsistency',
    model: 'claude',
    smellType: 'inconsistency',
    label: 'Claude inconsistency',
  },
  {
    key: 'chatgptAmbiguity',
    model: 'chatgpt',
    smellType: 'ambiguity',
    label: 'ChatGPT ambiguity',
  },
  {
    key: 'chatgptInconsistency',
    model: 'chatgpt',
    smellType: 'inconsistency',
    label: 'ChatGPT inconsistency',
  },
]

