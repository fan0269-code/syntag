# ADR-027: Evidence status and content nature

> Status: Accepted compatibility boundary
> Date: 2026-07-17

Syrtag separates evidence status, content nature, and review decision. Legacy records remain published, but their old labels do not imply claim-level academic verification.

| Legacy value | Compatibility meaning | Public implication |
| --- | --- | --- |
| `L1_verified` | `legacy_source_metadata` | A source is listed; without a locator, reviewer, real review date, and approval it is not `source_verified`. |
| `L2_editorial` | `editorial_synthesis` | Editorial interpretation, not factual verification. |
| `L3_pending` | Requires manual classification | A human must distinguish `insufficient_evidence` from `research_guidance`. |

`research_guidance` is a content nature, not evidence failure. Only `approved` + `source_verified` + `source_backed_fact` may display “Source verified”. Until claim-level review is complete, pages display “Sources listed · claim-level review pending”, “Editorial synthesis”, “Research guidance”, or “Insufficient evidence / under review” as applicable.

The existing Prisma `Verification` model remains unchanged. A separate claim-evidence table is deferred until the two D3 audit pilots establish a real query and review workflow.
