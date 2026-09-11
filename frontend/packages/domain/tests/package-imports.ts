import { buildElapsedViewModel } from '@retainpdf/domain'
import { normalizeJobPayload } from '@retainpdf/domain/job'
import type { JobPayload } from '@retainpdf/domain/job'
import { buildJobStatusViewModel } from '@retainpdf/domain/job-status'
import type { StageEvent } from '@retainpdf/domain/job-status'
import { assembleTranslatePayload } from '@retainpdf/domain/library'
import type { TranslateDocumentPayload } from '@retainpdf/domain/library'
import { describeToolEvent } from '@retainpdf/domain/ai'
import { makeId, toSessionSummary } from '@retainpdf/domain/session'
import type { SessionSummary } from '@retainpdf/domain/session'

const publicFunctions = [
  buildElapsedViewModel,
  normalizeJobPayload,
  buildJobStatusViewModel,
  assembleTranslatePayload,
  describeToolEvent,
  makeId,
  toSessionSummary,
] satisfies ReadonlyArray<(...args: never[]) => unknown>

type PublicTypes = [JobPayload, StageEvent, TranslateDocumentPayload, SessionSummary]

void publicFunctions
void (null as unknown as PublicTypes)
