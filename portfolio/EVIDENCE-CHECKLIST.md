# Evidence Checklist

Ce trebuie capturat pentru fiecare caz, înainte de a scrie documentul. Un study case
se scrie din dovezi existente, nu din memorie.

## Per caz — obligatoriu

- [ ] **Diagrama de arhitectură** desenată din sistemul real, nu idealizată
- [ ] **Lista componentelor** care rulează efectiv (output de `docker ps`, `kubectl get`,
      listă de servicii — capturat, nu reconstruit din minte)
- [ ] **Cel puțin 3 numere măsurate** cu data măsurării și metoda
- [ ] **Minimum 2 decizii tehnologice** cu alternativa reală evaluată
- [ ] **Minimum 1 decizie inversată** — ce ai încercat și ai abandonat, și de ce
- [ ] **O limitare cunoscută** a sistemului, declarată explicit

## Numere — cum se măsoară

| Metrică | Sursă acceptabilă | Sursă neacceptabilă |
|---|---|---|
| Volum date | count din DB, metrici de ingestion | „cred că vreo câteva milioane" |
| Latență | p50/p95 din monitoring sau benchmark repetabil | timp cronometrat o dată manual |
| Cost infra | factura cloud / VPS | estimare din pricing page |
| Cost/inference | tokeni × preț, pe o lună reală de trafic | calcul teoretic pe un prompt |
| Valoare business | ore măsurate înainte/după, sau cost evitat documentat | procent rotund fără bază |

Dacă o metrică nu poate fi produsă dintr-o sursă acceptabilă: sau se declară ca ordin
de mărime („~", cu metoda explicată), sau se scoate din document.

## Anonimizare

Înainte de publicare sau trimitere externă:

- [ ] Nume de clienți înlocuite cu descriptori („un retailer european, ~200 angajați")
- [ ] Fără screenshot-uri cu date reale de clienți
- [ ] Fără endpoint-uri interne, hostname-uri, IP-uri, nume de bucket
- [ ] Fără credențiale, chei, token-uri — nici expirate
- [ ] Fără schema completă dacă e proprietate a clientului; doar excerpte ilustrative
- [ ] Verificat ce permite contractul/NDA-ul înainte de a descrie sistemul public

Regulă practică: dacă documentul ar ajunge la clientul din caz, ar trebui să poată fi
citit fără nicio problemă. Dacă nu, mai anonimizează.

## Artefacte de suport (opționale, dar puternice)

- [ ] Export de dashboard cu metrici (anonimizat)
- [ ] Rezultate de benchmark cu metodologia atașată
- [ ] Raport de evaluare pentru layer-ul AI (test set + scoruri)
- [ ] Breakdown de cost pe componentă
- [ ] Fragment de cod reprezentativ — nu „hello world", ci partea grea

## Stare per caz

| Caz | Diagramă | Numere | Decizii | Anonimizat | Versiuni scrise |
|---|---|---|---|---|---|
| 01 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |
| 02 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |
| 03 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |
| 04 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |
| 05 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |
| 06 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |
| 07 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |
| 08 | ☐ | ☐ | ☐ | ☐ | ☐ 1p ☐ brief ☐ deep |

## Ordinea de lucru recomandată

1. Alege cazul pentru care ai **cele mai multe dovezi deja**, nu cel mai impresionant.
2. Completează checklist-ul de dovezi pentru el.
3. Scrie master-ul complet.
4. Derivă one-pager-ul și brief-ul. Deep dive-ul se scrie doar când ai un interviu.
5. Abia apoi treci la cazul următor.

Un caz complet valorează mai mult decât opt cazuri la 40%.
