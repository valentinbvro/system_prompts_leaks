# [[Case Title]] — Technical Brief

> **Audience:** hiring manager, engineering lead, shortlist stage.
> **Target length:** 5–8 pages.
> **Job to be done:** convince a technical reader that you made real decisions under
> real constraints, and that you can explain them.
> Derived from `00-master-case-study.md`.

---

## Summary

[[5–6 sentences. Problem, approach, outcome, your role. A reader who stops here should
still be able to describe the system to a colleague.]]

| | |
|---|---|
| Role | [[...]] |
| Period | [[...]] |
| Team | [[...]] |
| Status | [[in production since ...]] |

## 1. The problem and why it was hard

[[~½ page. Business problem plus the 3 constraints that actually shaped the design.
Drop the constraints that did not bind — listing ten constraints signals none mattered.]]

## 2. Architecture

[[Diagram, then ~1 page of prose. Walk one request end to end and one record end to end.
Name the component that is the bottleneck and say why it is the right bottleneck.]]

```mermaid
%% paste the master diagram here, simplified — a hiring manager reads it in 30 seconds
flowchart LR
    A[[Client]] --> B[[API]] --> C[[Orchestration]] --> D[[AI layer]] --> E[[Data layer]]
```

## 3. The decisions worth defending

[[~1½ pages. The 4–6 decisions from the master's §4 that a technical reader would
challenge. Each one: what was chosen, what the alternative was, what it cost.
Include at least one decision you would make differently today.]]

## 4. The AI layer

[[~1 page. Retrieval strategy, agent boundaries, model routing, and — non-negotiable —
how quality is evaluated. Include the failure modes you designed for.]]

## 5. Data and scale

[[~1 page. Ingestion through query. Real volumes, real latencies, with measurement
method noted inline.]]

## 6. Security, governance and operations

[[~½ page. Access control, tenant isolation, GDPR posture, human oversight points,
what is logged and audited, how the system is monitored and who gets paged.]]

## 7. Economics

[[~½ page. Infrastructure cost, cost per unit of work, what drove it down, and what
happens to the bill at 10x volume.]]

## 8. Outcome and what remains open

[[~½ page. Capabilities delivered, value measured, known limitations. Stating the
limitations is what makes the rest believable.]]

---
**Appendix:** [[schema excerpts, eval methodology, cost breakdown — whichever two are
strongest. Keep appendices short; a 20-page "brief" defeats its own purpose.]]
