# CHANGELOG – modificări pentru developeri

Acest fișier listează, pentru fiecare livrare, **ce s-a schimbat în paginile existente** și **ce s-a adăugat**, ca să poată fi preluat în versiunea ASP.NET fără a compara manual fișierele HTML.

Convenții:
- căile sunt cele din exportul HTML (repo `sonic-portal`);
- **NOU** = fișier/element nou, **MODIFICAT** = schimbare într-o pagină existentă, **ELIMINAT** = element scos;
- design language-ul nu se schimbă: elementele noi folosesc doar Bootstrap 5.3 + clasele din `css/style.css`.

Documentația generală (inventarul paginilor, componente, ghid de conversie) este în `readme.md`.

---

## 2026-11-18 – Raport Citiri regândit, ajustări rapoarte

### Pagini MODIFICATE

#### `page/citiri/index.html` (Raport Citiri) – **pagină regândită**
Conținutul și funcțiile existente se păstrează (regiuni + raport regiune, locuri de măsurare + „Vezi citiri”, locuri de consum + „Vezi citiri”), dar sunt reorganizate:
- **NOU** card de filtre:
  - selectare regiune (butoane „pill” `name="regionFilter"`: „Toate”, câte unul pe regiune, „Fără regiune”, cu numărul de locuri de măsurare); rândul se ascunde automat dacă contul nu are regiuni;
  - căutare instant după adresă, cod sau regiune (`#searchLocMasurare`);
  - filtru pe utilitate (`#utilityFilter`).
- **MODIFICAT** fosta coloană „Regiuni Curente” (carduri cu „Vezi Citiri”) este înlocuită de selectorul de regiune; raportul regiunii se deschide din butonul **„Vezi citiri regiune”** (`#btnRegionReport` → `zona.html`), afișat în antetul listei când este selectată o regiune.
- **MODIFICAT** „Locuri de Măsurare Curente” devine lista „Locuri de măsurare” (`col-lg-7`): câte un rând `.loc-row` cu adresa, badge-ul utilității, cod și regiune, „Vezi citiri” și „Locuri de consum”. Număr de rezultate în antet, stare goală cu „Resetează filtrele”. Atributele `data-region`, `data-utility`, `data-search`, `data-apt-list` – vezi `readme.md`, secțiunea 6.
- **MODIFICAT** „Locuri de Consum” devine panoul din dreapta (`col-lg-5`, fix la scroll pe desktop): adresa selectată + număr de apartamente, căutare apartament (`#searchApartament`), lista apartamentelor; stare inițială cu mesaj. Rândul selectat din listă e evidențiat (`.selected`).
- **MODIFICAT** listele de apartamente sunt `<ul class="list-group list-group-flush loc-consum-lista" id="apt-{id}" data-address="…">`, câte una pe loc de măsurare.
- **MODIFICAT** JS: funcția `showApartamente()` este înlocuită de un script care leagă filtrele și butoanele „Locuri de consum” (fără `onclick` în HTML).
- Date demonstrative: 2 regiuni, 7 locuri de măsurare (inclusiv unul fără regiune).

#### `page/citiri/bransament.html` și `page/citiri/energie-termica.html`
- **MODIFICAT** titlul secțiunii „CONTOARE PASANTE” din cardul „Sumar” are acum același stil ca „RAPOARTE CITIRI”: `<h5 class="card-title mb-3">` (înainte `<h6 class="text-muted small">`).

#### `page/citiri/repartitoare.html`
- **MODIFICAT** culorile seriilor din grafic (încăperi) – nuanțe de mov cu contrast mare, ușor de distins și de persoanele cu deficiențe de vedere: Sufragerie `#3b0764`, Dormitor `#7c3aed`, Bucătărie `#c026d3`, Baie `#e9d5ff`; segmentele au contur alb de 1px (`borderColor: '#ffffff', borderWidth: 1`).

#### `page/citiri/repartitoare.html` și `page/citiri/repartitoare-bransament.html`
- **MODIFICAT** textul notei de sub titlu:
  > **Despre valorile afișate:** repartitoarele de costuri înregistrează unități brute necorectate. Unitățile repartitoarelor de costuri se corectează cu factorii prevăzuți în **Ordinul 7/2024**, iar valoarea finală, corectată cu factorul de evaluare global, se eliberează sub formă de **raport lunar**.

### CSS (`css/style.css`)
- **NOU** secțiunea „Raport Citiri (hub)”: `.loc-row` (rând listă, hover), `.loc-row.selected` (fundal `#ECF6FF` + bară stânga în culoarea primară), `.region-count` (contor în butoanele de regiune), `.loc-consum-panel` (sticky pe desktop), `.loc-consum-scroll` (listă apartamente cu scroll). Nicio regulă existentă nu a fost modificată.

---

## 2026-11-17 – Utilități multiple: apă, energie termică, repartitoare costuri

### Concept nou: o adresă = o singură utilitate

Portalul afișează acum trei tipuri de utilități / echipamente:

| Utilitate | Unitate | Citiri orare | Badge |
|---|---|---|---|
| Contor apă | m³ | doar la unele contoare | `<span class="equip-badge equip-apa"><i class="bi bi-droplet"></i> Contor apă</span>` |
| Contor energie termică | MWh | nu | `<span class="equip-badge equip-termic"><i class="bi bi-fire"></i> Contor energie termică</span>` |
| Repartitor costuri căldură | adimensional (fără unitate) | nu | `<span class="equip-badge equip-repartitor"><i class="bi bi-thermometer-half"></i> Repartitor costuri</span>` |

**Regula:** fiecare loc de măsurare / loc de consum are **o singură utilitate**. Dacă la aceeași adresă fizică există mai multe utilități, adresa apare **de mai multe ori** în liste (câte o intrare pe utilitate, fiecare cu codul ei). Utilitatea se afișează ca badge **sub adresă**. Butonul „Vezi Citiri” duce direct la raportul utilității respective (nu există dropdown-uri sau selecție de utilitate).

Rapoarte pe utilitate:

| Utilitate | Loc de măsurare (adresă / bloc) | Loc de consum (apartament) |
|---|---|---|
| Apă | `page/citiri/bransament.html` | `page/citiri/apartament.html` (+ `citiri-orare.html`) |
| Energie termică | `page/citiri/energie-termica.html` | `page/citiri/energie-termica-apartament.html` |
| Repartitoare | `page/citiri/repartitoare-bransament.html` | `page/citiri/repartitoare.html` |

### Pagini NOI

#### `page/citiri/energie-termica.html` – raport contor energie termică (loc de măsurare)
Contoarele de energie termică se montează în bloc, de regulă la intrarea în apartament, cu același regim de distribuție ca la contoarele de apă: au loc de măsurare (bloc) și locuri de consum (apartamente).

- Structura identică cu `bransament.html`: titlu + buton „Înapoi”, grafic zilnic + slider de perioadă, card „Sumar”, card „RAPOARTE CITIRI”, tabel echipamente.
- Grafic: o singură serie „Consum energie termică (MWh)”, culoare `rgba(249, 115, 22, 0.7)`, axa Y „Consum (MWh)”. Badge-ul utilității în antetul graficului.
- Sumar: `#totalConsumptionHeat`, `#averageConsumptionHeat` (MWh / zi), `#indexStartHeat`, `#indexEndHeat` (index contor la începutul / sfârșitul perioadei). Valori cu 3 zecimale.
- Sumar – secțiunea **CONTOARE PASANTE** (`#pasantSection`, `#pasantSummary`): pentru fiecare contor pasant – denumire, serie, consum în perioada selectată (MWh) și index la sfârșitul perioadei; se actualizează cu sliderul; ascunsă dacă locul de măsurare nu are contoare pasante. Detalii și formatul datelor: `readme.md`, secțiunea 6.
- Export: 4 tipuri (`date`, `period`, `zilnice`, `consumuri_zilnice`) – fără variantele AR/AC. Grilă `.report-btn-grid.cols-2`.
- Mesaj sub grafic: nu există citiri orare.
- Tabel: Serie Contor, Amplasare, Tip, Ultima Citire (MWh), Status, Ultima Transmisie.
- Card „Locuri de consum în …” (ca pe `bransament.html`): apartamentele, fiecare cu badge-ul utilității și „Vezi citiri” → `energie-termica-apartament.html`.
- Date demonstrative: `{ date, energie, indexStart, indexEnd }` / zi.

#### `page/citiri/energie-termica-apartament.html` – raport contor energie termică (loc de consum)
- Identic cu `energie-termica.html` (aceleași ID-uri, export cu 4 tipuri, buton „Înapoi”), la nivel de apartament: titlu „Raport energie termică pentru: {adresă}, Apartament N”, valori la scară de apartament, tabel cu contorul de la intrarea în apartament.
- Fără card „Locuri de consum”.
- Date demonstrative: `{ date, energie, indexStart, indexEnd }` / zi.

#### `page/citiri/repartitoare-bransament.html` – raport repartitoare (loc de măsurare)
- Notă obligatorie (`.equip-note.equip-note-repartitor`) sub titlu: unitățile sunt adimensionale, se corelează cu factorii din **Ordinul 7/2024**, iar valoarea finală, corelată cu factorul de evaluare global, se eliberează ca **raport lunar**.
- Grafic: o serie „Unități repartitoare (total)” (mov `rgba(124, 58, 237, 0.75)`), axa Y „Unități (adimensional)”.
- Sumar: `#totalUnits`, `#averageUnits` (fără unitate), nr. locuri de consum cu repartitoare, nr. repartitoare montate.
- Export: 4 tipuri, ca la energie termică.
- Card „Rapoarte lunare de repartizare”: tabel Luna / Perioada / Status (`Emis` = `badge bg-success`, `În curs` = `badge bg-secondary`) / Acțiuni (descărcare PDF; dezactivat cât timp luna e în curs).
- Lista „Locuri de consum” → `repartitoare.html`.
- Date demonstrative: `{ date, unitati }` / zi (numere întregi).

#### `page/citiri/repartitoare.html` – raport repartitoare (loc de consum)
- Aceeași notă despre Ordinul 7/2024.
- Grafic **stacked**, câte o serie pe încăpere / repartitor (nuanțe de mov); lista încăperilor vine de la server.
- Sumar: `#totalUnits`, `#averageUnits`, `#unitsPerRoom` (totaluri pe încăperi, generate din JS).
- Card „Rapoarte lunare de repartizare” (ca mai sus) și tabel cu repartitoarele montate (Serie, Încăpere, Tip, Ultima Citire – fără unitate, Status, Ultima Transmisie).
- Date demonstrative: `{ date, sufragerie, dormitor, bucatarie, baie }` / zi.

### Pagini MODIFICATE

#### `page/citiri/index.html` (Raport Citiri – hub)
- **MODIFICAT** coloana „Locuri de Măsurare Curente”: fiecare card are badge-ul utilității sub adresă. Exemplu: „Str. Unirii, Nr. 10” apare de 3 ori (apă → `bransament.html`, energie termică → `energie-termica.html`, repartitoare → `repartitoare-bransament.html`) + „Bdul. Libertății, Bl. D5” (apă).
- **NOU** cardul de energie termică are, ca cel de apă, butonul „Locuri de Consum”.
- **MODIFICAT** coloana „Locuri de Consum”: fiecare apartament are badge-ul utilității sub nume; „Vezi Citiri” duce la `apartament.html` (apă), `energie-termica-apartament.html` (energie termică) sau `repartitoare.html` (repartitoare). Listele: `#bransament1-apartamente` (apă), `#bransament2-apartamente` (energie termică), `#bransament3-apartamente` (repartitoare), `#bransament4-apartamente` (apă).
- **MODIFICAT** lista de apartamente este acum HTML static (10 intrări). Înainte era generată cu o buclă PHP și în export apărea un singur element gol „Ap. ”.
- **ELIMINAT** un tag `</i>` orfan din titlul „Regiuni Curente”.

#### `page/citiri/bransament.html` și `page/citiri/apartament.html` (rapoarte apă)
- **NOU** buton „Înapoi” în dreapta titlului (vezi „Componente noi”).
- **NOU** badge „Contor apă” în antetul cardului de grafic (pe `apartament.html`, lângă butonul „Consum orar”).
- **MODIFICAT** `bransament.html` – lista „Locuri de consum”: badge „Contor apă” lângă fiecare apartament.
- **NOU** `bransament.html` – cardul „Sumar pentru perioada selectată” are la final secțiunea **CONTOARE PASANTE** (`#pasantSection`, `#pasantSummary`): pentru fiecare contor pasant (ex. „Scara A - apă rece”, „Scara A - apă caldă”) – denumire, serie, consum în perioada selectată (m³) și index la sfârșitul perioadei. Se actualizează cu sliderul (`updatePasantSummary`); se ascunde dacă locul de măsurare nu are contoare pasante. Pe `apartament.html` nu există.
- Restul paginilor (grafic, valorile existente din sumar, export cu 6 tipuri, tabel) – **neschimbat**.

#### `page/citiri/zona.html`
- **MODIFICAT** lista „Locuri de măsurare în Zona A”: badge-ul utilității sub fiecare adresă; „Str. Libertății, Nr. 20, Bl. D5” apare de două ori (apă → `bransament.html`, energie termică → `energie-termica.html`).

#### `page/adrese/index.html`
- **MODIFICAT** fiecare card de adresă: titlul și badge-ul utilității sunt grupate într-un `<div>` (badge sub adresă); badge-ul `CURENT` rămâne în dreapta.
- **NOU** locuri de măsurare suplimentare pentru aceeași adresă „Str. Libertății, Nr. 24, Bloc C2”: energie termică (`B12345679`) și repartitoare (`B12345680`); ambele au aceleași butoane („Regiune”, „Locuri Consum”, „Vezi Citiri”, „Setează curent”) și alerte ca locul de măsurare de apă.
- **NOU** locuri de consum suplimentare „Str. Libertății, Nr. 24, Bloc C2, Ap. 12”: energie termică (`A11223346`) → `energie-termica-apartament.html` și repartitoare (`A11223345`) → `repartitoare.html`.
- **MODIFICAT** „Vezi Citiri” duce la raportul utilității cardului.

#### `page/apartamente/index.html`
- **NOU** badge-ul utilității locului de măsurare sub adresa din antet. Tabelul este neschimbat (toate apartamentele unui loc de măsurare au aceeași utilitate).

#### `page/regiuni/index.html`
- **NOU** buton „Editează” (`btn btn-sm btn-outline-secondary`, iconiță `bi-pencil`) la fiecare regiune (proprietar și membru), cu atributele `data-region-name` / `data-region-code`.
- **NOU** modal `#modalEditeazaRegiune`: câmp „Nume Regiune” (`#editNumeRegiune`), „Cod Regiune” (`#editCodRegiune`, readonly), butoane Anulează / Salvează. Un script mic precompletează câmpurile la evenimentul `show.bs.modal`. Dreptul de editare pentru regiunile la care utilizatorul este doar membru se decide pe server.

#### `index.html` (Panoul Meu)
- **NOU** badge-ul utilității pe cardurile „LOC DE MĂSURARE ACTIV” și „LOC DE CONSUM ACTIV”.
- **CORECTAT** în exportul HTML, linkurile din dashboard („Mergeți la …”, „Modifică locația activă”, „Secțiunea Info Center”) ieșeau goale (`href=""`). Acum duc la paginile corecte, inclusiv ancora `page/adrese/index.html#loc-consum`.

#### `page/regiuni/members.html`
- **CORECTAT** exportul HTML începea cu cod PHP rămas în pagină. Conținutul vizual este neschimbat.

### Componente noi

**Badge utilitate** (`.equip-badge` + `.equip-apa` / `.equip-termic` / `.equip-repartitor`) – vezi tabelul de mai sus. Se pune imediat sub adresă.

**Buton „Înapoi”** (pe toate rapoartele: `bransament`, `apartament`, `energie-termica`, `energie-termica-apartament`, `repartitoare-bransament`, `repartitoare`):

```html
<a href="../../page/citiri/index.html" class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 text-nowrap flex-shrink-0"
   onclick="if (document.referrer && history.length > 1) { history.back(); return false; }">
    <i class="bi bi-arrow-left"></i> Înapoi
</a>
```

Revine la pagina precedentă; dacă pagina a fost deschisă direct (fără istoric), duce la hub-ul Raport Citiri. În ASP.NET se poate folosi același cod sau un URL de întoarcere (`returnUrl`) generat pe server.

**Notă informativă** (`.equip-note.equip-note-repartitor`) – pe paginile de repartitoare.

### CSS (`css/style.css`)

Secțiune nouă la final, „Tipuri de echipamente” (nicio regulă existentă nu a fost modificată):

| Clasă | Rol |
|---|---|
| `.equip-badge` | Badge rotunjit, mic (0.75rem, 600) |
| `.equip-apa`, `.equip-termic`, `.equip-repartitor` | Culorile badge-ului pe utilitate (albastru `#154EC1`, portocaliu `#c2410c`, mov `#6d28d9`) |
| `.equip-text-termic`, `.equip-text-repartitor` | Culoarea valorilor din cardul „Sumar” |
| `.equip-note`, `.equip-note-repartitor` | Nota informativă (fundal mov deschis, bordură stânga) |
| `.report-btn-grid`, `.report-btn-grid.cols-2` | Grila butoanelor „Tip raport”. Pe `bransament`/`apartament` există o copie identică inline în `<style>` care poate fi eliminată la conversie. |

### Ce trebuie făcut în ASP.NET

1. Modelul de date: fiecare loc de măsurare / loc de consum are un câmp **tip utilitate** (`Apa`, `EnergieTermica`, `RepartitorCosturi`). Badge-ul, linkul „Vezi Citiri” și pagina de raport se aleg după acest câmp (vezi `readme.md`, secțiunea 7.4).
2. Paginile noi de raport primesc date zilnice de la server în formatele de mai sus (generatoarele demonstrative din JS se elimină).
3. Raportul lunar de repartizare (PDF) este generat pe server; tabelul afișează lunile disponibile.
4. Modalul de editare a regiunii salvează numele regiunii.
