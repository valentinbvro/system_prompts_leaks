# Portfolio — Evidence Packages

Scopul acestui director: transformarea infrastructurii deja construite în **evidence
packages** pentru recrutori și hiring manageri, nu în proiecte demonstrative create
special pentru portofoliu.

```
Education      → Knowledge
Infrastructure → Engineering ability
Study cases    → Evidence
Certifications → External validation
Business cases → Commercial understanding
```

Pentru poziții Principal / Architect, evidence-ul trebuie să acopere simultan:
**Architecture + Delivery + Business + Governance + Leadership**.

## Regula numerelor

Orice cifră dintr-un study case (volum, latență, cost/inference, TCO, uptime) trebuie
să fie **măsurată, nu estimată**. Marcajele `[[...]]` din fișiere sunt locuri unde
datele reale lipsesc încă. Un study case cu un singur număr inventat își pierde toată
greutatea la primul interviu tehnic — vezi `EVIDENCE-CHECKLIST.md` pentru ce trebuie
capturat și cum.

Dacă un număr nu poate fi măsurat, are două variante legitime:
- ordin de mărime declarat ca atare („~10^8 rânduri/lună, măsurat pe 3 luni")
- eliminat din document

## Structura unui master case study

Toate cele 10 secțiuni, în aceeași ordine, în fiecare caz:

1. **Business problem** — ce problemă, pentru cine
2. **Constraints** — volum, cost, securitate, scalabilitate, timp, multi-tenancy
3. **Architecture** — frontend → APIs → orchestration → AI → databases → infrastructure
4. **Technology decisions** — de ce ClickHouse și nu Postgres, de ce Qdrant, n8n, local vs cloud LLM, Redis
5. **Implementation** — ce s-a construit concret
6. **AI layer** — RAG, agents, MCP/tools, orchestration, LLM routing, automation
7. **Data layer** — ingestion, cleaning, enrichment, storage, querying
8. **Security & governance** — GDPR, access control, logging, human oversight, AI governance
9. **Performance & economics** — volume, latency, cost/inference, infra cost, scalability
10. **Outcome** — ce poate face sistemul acum, ce valoare produce

## Trei versiuni din fiecare master case

| Versiune | Lungime | Audiență | Fișier |
|---|---|---|---|
| Recruiter one-pager | 1 pagină | screening, primul contact | `templates/01-recruiter-onepager.md` |
| Hiring manager brief | 5–8 pagini | evaluare tehnică, shortlist | `templates/02-hiring-manager-brief.md` |
| Technical deep dive | 15–25 pagini | interviu de arhitectură, panel | `templates/03-technical-deep-dive.md` |

Master-ul (`templates/00-master-case-study.md`) e sursa unică de adevăr. Cele trei
versiuni sunt **derivate**, nu documente independente — când se schimbă o cifră în
master, se propagă în toate trei.

## Portofoliul de cazuri

Ținta: **8–12 flagship cases**, dintre care 5–6 foarte puternice. Nu 50 de cazuri mici.

| # | Study case | Ce demonstrează | Roluri țintă |
|---|---|---|---|
| 01 | [Enterprise Data & AI Intelligence Platform](cases/01-enterprise-ai-platform.md) | arhitectură end-to-end | AI Solutions Architect |
| 02 | [Agentic AI for Enterprise Decision Intelligence](cases/02-agentic-ai-system.md) | agents, RAG, orchestration | Agentic AI Architect / FDE |
| 03 | [Large-Scale Data Platform](cases/03-large-scale-data-platform.md) | ingestion, ClickHouse, APIs | Data & AI Architect |
| 04 | [AI Automation Platform](cases/04-automation-platform.md) | workflows, n8n, APIs | AI Automation Architect |
| 05 | [Multi-Tenant AI Platform Architecture](cases/05-multi-tenant-architecture.md) | SaaS / platform engineering | Enterprise Architect |
| 06 | [AI Governance Framework](cases/06-ai-governance-framework.md) | controls, risk, compliance | AI Governance Consultant |
| 07 | [Business AI Transformation](cases/07-business-ai-transformation.md) | ROI + architecture + roadmap | Principal AI Consultant |
| 08 | [AI Product & Platform Strategy](cases/08-ai-product-platform.md) | product + technical strategy | AI Product / Transformation Lead |

Nu toate cazurile demonstrează același lucru — asta e și ideea. La o aplicare nu se
trimit 30 de proiecte, ci **3–4 study case-uri** care acoperă exact cerințele rolului.

## Selecție per rol

Vezi `ROLE-MAPPING.md` pentru combinațiile recomandate per tip de poziție.

## Convenții

- Limba documentelor de caz: **engleză** (audiența e internațională).
- Limba ghidurilor din acest director: română.
- Diagramele: Mermaid inline (se randează în GitHub), exporturi în `assets/`.
- Fără nume de clienți sub NDA — vezi secțiunea de anonimizare din `EVIDENCE-CHECKLIST.md`.
