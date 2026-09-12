# [[Case Title]] — Architecture Deep Dive

> **Audience:** architecture interview, technical panel, principal-level review.
> **Target length:** 15–25 pages.
> **Job to be done:** survive an hour of adversarial questioning about this system.
> Derived from `00-master-case-study.md` — this is the master, expanded, with the
> reasoning left in rather than compressed out.

---

## 0. How to read this document

[[One paragraph: what the system is, and which sections matter for which question.]]

## 1. Context and business problem
[[Full §1 from master, expanded: stakeholders, prior attempts, the commercial case.]]

## 2. Requirements and constraints
[[Full constraint table, plus the non-functional requirements written as testable
statements: "p95 under 400ms for queries over 90 days of data at 200 concurrent users".]]

## 3. Architecture
### 3.1 System context
### 3.2 Container / component view
### 3.3 Request path, traced
### 3.4 Ingestion path, traced
### 3.5 Deployment topology
### 3.6 Failure domains and blast radius
[[Diagrams at each level. This is the section the panel will spend the most time in —
be ready to draw it on a whiteboard without the document.]]

## 4. Technology decisions
[[One subsection per decision. For each: the requirement that forced it, the options,
the evaluation method (benchmark? spike? prior experience?), the choice, the cost
accepted, and the trigger that would make you revisit it.]]

### 4.1 [[Analytical store: ClickHouse over Postgres]]
**Requirement:** [[...]]
**Options evaluated:** [[...]]
**Method:** [[benchmark setup, dataset, what was measured]]
**Result:** [[numbers]]
**Decision and accepted cost:** [[...]]
**Revisit trigger:** [[...]]

### 4.2 [[...]]

## 5. Implementation
[[Service by service. Interfaces, data contracts, key algorithms, concurrency model,
idempotency, backpressure.]]

## 6. AI layer
### 6.1 Retrieval design and evaluation
### 6.2 Agent design: autonomy boundaries and tool permissions
### 6.3 Orchestration, retries, and cost bounding
### 6.4 Model routing policy
### 6.5 Evaluation harness and results
### 6.6 Failure modes: hallucination, tool misuse, runaway loops
[[Include actual eval numbers and the test set construction. An AI architecture without
an eval story does not survive a principal-level panel.]]

## 7. Data layer
### 7.1 Sources and ingestion
### 7.2 Schema design and partitioning rationale
### 7.3 Data quality: validation, quarantine, reconciliation
### 7.4 Query patterns and materialization strategy
### 7.5 Retention, tiering, and lineage

## 8. Security and governance
### 8.1 Threat model
### 8.2 Identity, authorization, tenant isolation
### 8.3 Data protection and GDPR
### 8.4 AI governance: oversight, logging, model change control, EU AI Act positioning
### 8.5 Audit and incident response

## 9. Performance and economics
### 9.1 Benchmark methodology
### 9.2 Measured results
### 9.3 Cost model and unit economics
### 9.4 Scaling analysis: what breaks first at 10x, 100x

## 10. Operations
[[Observability, SLOs, alerting, runbooks, deployment and rollback, on-call reality.]]

## 11. Outcome, retrospective and roadmap
### 11.1 Delivered capabilities and measured value
### 11.2 What I would do differently
### 11.3 Open problems and roadmap
[[§11.2 is the section that separates senior from principal. Be specific and unflinching.]]

---

## Appendix A — Anonymization notes
## Appendix B — Schema and interface excerpts
## Appendix C — Benchmark raw results
## Appendix D — Anticipated panel questions and answers
[[15–20 hard questions with your answers. Written before the interview, not after.]]
