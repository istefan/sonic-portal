# SONIC GRID – Portal clienți Decor Press (front-end)

Acest repository conține **front-end-ul static** (HTML, CSS, JS) al portalului de clienți **SONIC GRID** al firmei Decor Press.

| | |
|---|---|
| Aplicația finală (producție) | https://sonic.decorpress.ro/ |
| Repository HTML pentru developeri | https://github.com/istefan/sonic-portal |
| Tehnologie finală | ASP.NET (paginile HTML de aici se convertesc în view-uri ASP.NET) |

> **Design language-ul este stabilit și aprobat.** Nu se modifică culori, fonturi, spațieri, componente sau structura layout-ului. Orice pagină nouă sau modificare trebuie să reutilizeze componentele existente (vezi [Componente și clase CSS](#4-componente-și-clase-css)).

---

## Cuprins

1. [Flux de lucru](#1-flux-de-lucru)
2. [Structura fișierelor](#2-structura-fișierelor)
3. [Inventarul paginilor](#3-inventarul-paginilor)
4. [Componente și clase CSS](#4-componente-și-clase-css)
5. [Tipuri de echipamente](#5-tipuri-de-echipamente)
6. [Paginile de raport citiri](#6-paginile-de-raport-citiri)
7. [Ghid de conversie în ASP.NET](#7-ghid-de-conversie-în-aspnet)
8. [Probleme cunoscute](#8-probleme-cunoscute)
9. [Istoric modificări](#9-istoric-modificări)

---

## 1. Flux de lucru

```
 Dezvoltare locală (PHP, Laragon)   ──export.php──►   HTML static   ──git push──►   GitHub (sonic-portal)   ──►   ASP.NET
 header/sidebar/footer incluse                        linkuri relative                                         developerii convertesc
 o singură dată (fără cod repetat)                    *.php -> *.html                                          în Layout + View-uri
```

- **Local** se lucrează în PHP doar pentru a nu repeta header-ul, meniul lateral și footer-ul în fiecare pagină. PHP-ul **nu conține logică de business**: toate datele sunt demonstrative (statice în HTML sau generate în JavaScript).
- **Exportul** (`export.php`, rulat local la `http://localhost/sonic-dps/export.php`) generează folderul `sonic-portal/`:
  - include `header.php`, `sidebar.php`, `footer.php` în fiecare pagină;
  - transformă `<?php app_url('...'); ?>` în linkuri relative (`../../page/.../index.html`), `*.php` → `*.html`;
  - marchează linkul activ din meniu pe baza variabilei `$page`;
  - copiază `css/`, `js/`, `images/`, acest `README.md` (ca `readme.md`) și `CHANGELOG.md` (lista modificărilor pentru developeri).
- **Developerii** primesc doar conținutul folderului `sonic-portal/` (repo-ul GitHub) și îl convertesc în ASP.NET.

## 2. Structura fișierelor

```
index.html                    Panoul Meu (dashboard)
login.html, register.html,    Pagini de autentificare (layout propriu, fără sidebar; css/login.css)
lost-password.html
css/
  bootstrap.min.css           Bootstrap 5.3.7 (nu se modifică)
  style.css                   Stilurile portalului (design language-ul aprobat)
  login.css                   Stiluri pentru paginile de autentificare
js/
  bootstrap.bundle.min.js     Bootstrap 5.3.7 + Popper
  color-modes.js              Mod luminos/întunecat (Bootstrap)
  onboarding.js               Ghidul interactiv (butonul „Pornește Ghidul Interactiv” din dashboard)
  dashboard.js                (gol)
images/                       Logo-uri SVG
page/<secțiune>/index.html    Câte un folder pentru fiecare secțiune a portalului
page/citiri/*.html            Paginile de raport citiri (vezi secțiunea 6)
```

**Librării externe (CDN)** – încărcate în header/footer, trebuie păstrate la aceleași versiuni:

| Librărie | Versiune | Folosire |
|---|---|---|
| Bootstrap Icons | 1.10.5 | Toate iconițele (`bi bi-*`) |
| Inter (Google Fonts) | 400/600/700 | Fontul portalului |
| Chart.js | 4.3.2 | Graficele de consum |
| noUiSlider + wNumb | 15.7.1 / 1.2.0 | Sliderul de perioadă de sub grafice |
| flatpickr (+ localizare `ro`) | latest | Câmpurile de dată din cardurile de export |
| Tom Select | (în pagină) | Dropdown cu căutare în Alerte, Bilanț, Estimări |

## 3. Inventarul paginilor

Coloana **Meniu activ** este elementul din sidebar marcat ca activ (în PHP: variabila `$page`; în ASP.NET: vezi 7.2).

### Pagini principale

| Fișier HTML | Titlu (H1) | Meniu activ | Descriere |
|---|---|---|---|
| `index.html` | Bună, {nume utilizator} | Panoul Meu | Dashboard: hero animat + ghid interactiv, carduri sumar (locuri de măsurare, locuri de consum, echipamente, alerte), informații portal, loc de măsurare / loc de consum activ (cu tipurile de echipamente montate). |
| `login.html` | – | – | Autentificare (layout separat). |
| `register.html` | – | – | Creare cont pe baza codului de invitație. |
| `lost-password.html` | – | – | Recuperare parolă. |

### Secțiuni (`page/`)

| Fișier HTML | Titlu (H1) | Meniu activ | Descriere |
|---|---|---|---|
| `page/adrese/index.html` | Adrese | Adresele Mele | Locuri de măsurare (branșamente) și locuri de consum (apartamente) ale utilizatorului; setări generale de alertă; **utilitatea fiecărei adrese** (badge sub adresă); „Vezi Citiri” către raportul utilității. Aceeași adresă fizică apare o dată pentru fiecare utilitate. |
| `page/apartamente/index.html` | Apartamentele din locația: … | Adresele Mele | Tabelul apartamentelor unui branșament (utilitatea locației ca badge sub adresă): cod, nr. contoare, alerte individuale, raport citiri. Generare invitații PDF. |
| `page/regiuni/index.html` | Regiuni | Regiuni / Zone | Creare / adăugare regiuni (grupuri de branșamente), proprietar vs. membru, **editare regiune** (buton „Editează” + modal `#modalEditeazaRegiune`). |
| `page/regiuni/members.html` | Gestionare Acces Regiune | Regiuni / Zone | Membrii unei regiuni (doar pentru proprietar). |
| `page/perioade-calcul/index.html` | Perioade Citiri și Valori Facturate | Perioade Citiri | Setarea zilei de citire și a valorilor facturate lunar per branșament. |
| `page/setari-alerte/index.html` | Setări Alerte | Setări Alerte | Configurarea canalelor și tipurilor de alerte. |
| `page/info-center/index.html` | Cum functioneaza portalul? | Info Center | Ghid de utilizare, FAQ, tipuri de alerte. |
| `page/contact/index.html` | Contact | Contact | Formular de contact. |
| `page/citiri/index.html` | Raport Citiri | Raport Citiri | Hub rapoarte: regiuni, locuri de măsurare și locuri de consum curente, fiecare cu **utilitatea sub adresă** și link către raportul utilității. |
| `page/citiri/zona.html` | Raport citiri pentru: Zona A | Raport Citiri | Raport agregat apă pe regiune + lista locurilor de măsurare din regiune (utilitatea sub fiecare adresă). |
| `page/citiri/bransament.html` | Raport citiri pentru: {adresă} | Raport Citiri | Raport **apă** pe loc de măsurare (apă rece / apă caldă, m³), contoare pasante în sumar, 6 tipuri de export, lista locurilor de consum. Buton „Înapoi”. |
| `page/citiri/apartament.html` | Raport citiri pentru: {adresă}, Apartament N | Raport Citiri | Raport **apă** pe loc de consum + tabel contoare + buton „Consum orar”. Buton „Înapoi”. |
| `page/citiri/citiri-orare.html` | Citiri orare: {adresă} | Raport Citiri | Consum **orar** apă (doar pentru contoarele LoRa care transmit citiri orare). Fereastră glisantă de 24h peste ultimele 30 de zile. |
| `page/citiri/energie-termica.html` | Raport energie termică pentru: {adresă} | Raport Citiri | Raport zilnic **energie termică** (MWh) pe loc de măsurare, contoare pasante în sumar + lista locurilor de consum. Fără citiri orare. Buton „Înapoi”. |
| `page/citiri/energie-termica-apartament.html` | Raport energie termică pentru: {adresă}, Apartament N | Raport Citiri | Raport zilnic **energie termică** (MWh) pe loc de consum (contorul de la intrarea în apartament). Fără citiri orare. Buton „Înapoi”. |
| `page/citiri/repartitoare-bransament.html` | Raport repartitoare costuri pentru: {adresă} | Raport Citiri | Raport zilnic **repartitoare** pe loc de măsurare (total unități, adimensional), rapoarte lunare de repartizare, lista locurilor de consum. Fără citiri orare. Buton „Înapoi”. |
| `page/citiri/repartitoare.html` | Raport repartitoare costuri pentru: {adresă}, Apartament N | Raport Citiri | Raport zilnic **repartitoare** pe loc de consum (adimensional), pe încăperi + rapoarte lunare de repartizare. Fără citiri orare. Buton „Înapoi”. |
| `page/bilant/index.html` | Bilanț Neînchideri Apă | Bilanț Neînchideri Apă | Diferența dintre contorul de branșament și suma contoarelor individuale (doar apă). |
| `page/estimari/index.html` | Estimări Consum | Estimări Consum | Estimări de consum apă pe baza mediilor. |
| `page/alerte/index.html` | Raport Alerte | Raport Alerte | Alerte active și istoric, filtrare pe loc de măsurare, export. |
| `page/contul-meu/index.html` | Contul Meu | Contul Meu | Date profil și schimbare parolă. |
| `page/users/index.html` | Utilizatori | Utilizatori | Admin sistem: listă utilizatori. |
| `page/settings/index.html` | Setari | Setari Aplicatie | Admin sistem: setări aplicație. |
| `page/bloc-manager/index.html` | Export Bloc Manager | – | Export date pentru Bloc Manager. Momentan **nu are link în meniu**. |

### Navigarea între rapoarte

```
Raport Citiri (citiri/index)                 o adresă = o singură utilitate
 ├─ Regiune ───────────────────────────► zona.html (apă, agregat)
 ├─ Loc de măsurare  ─ apă ────────────► bransament.html
 │                   ─ energie termică ► energie-termica.html
 │                   ─ repartitoare ───► repartitoare-bransament.html
 └─ Loc de consum    ─ apă ────────────► apartament.html ──► citiri-orare.html (doar contoare cu citiri orare)
                     ─ energie termică ► energie-termica-apartament.html
                     ─ repartitoare ───► repartitoare.html

Pe toate rapoartele, butonul „Înapoi” din dreapta titlului revine la pagina precedentă.
```

## 4. Componente și clase CSS

Toate paginile interne au aceeași structură:

```html
<header class="navbar sticky-top bg-white ...">…</header>     <!-- header.php -->
<div class="container-fluid"><div class="row">
  <div class="sidebar …">…</div>                                <!-- sidebar.php -->
  <main class="main px-md-4"><div class="container-full-width"> <!-- sau container-custom-width (formulare/liste) -->
    <div class="d-flex justify-content-between … pt-3 pb-2 mb-3"><h1>Titlu</h1> [acțiuni]</div>
    … carduri Bootstrap (.card / .card-body / .card-header) …
  </div></main>
</div></div>
<script src="…bootstrap.bundle.min.js"></script> …              <!-- footer.php -->
```

| Clasă | Unde se folosește |
|---|---|
| `.container-full-width` / `.container-custom-width` | Lățimea conținutului: rapoarte vs. formulare/liste |
| `.add-address-card-bg` | Cardul gri „Adaugă …” |
| `.address-card-dashed` | Cardurile de adresă / regiune existente |
| `.format-btn-check` + `.format-btn-label` | Butoanele XLSX / PDF din cardul de export |
| `.report-btn-grid` (+ `.cols-2`) | Grila de butoane „Tip raport” din cardul RAPOARTE CITIRI |
| `.equip-badge` + `.equip-apa` / `.equip-termic` / `.equip-repartitor` | Badge utilitate, afișat sub adresă (vezi secțiunea 5) |
| `.equip-text-termic` / `.equip-text-repartitor` | Culoarea valorilor din cardul „Sumar” pe rapoartele de energie termică / repartitoare |
| `.equip-note` + `.equip-note-repartitor` | Nota despre Ordinul 7/2024 pe rapoartele de repartitoare |
| `.info-*`, `.faq-*`, `.timeline*` | Info Center |
| `.onboarding-*` | Ghidul interactiv |

Culoarea primară a portalului: `#154EC1` (`--primary-color`). Butoanele folosesc clasele Bootstrap standard (`btn-primary`, `btn-outline-primary`, `btn-outline-secondary`, `btn-sm`).

## 5. Tipuri de echipamente

Portalul afișează date de la trei tipuri de echipamente (utilități). **O adresă (loc de măsurare sau loc de consum) are o singură utilitate**, afișată ca badge sub adresă.

| Tip | Unitate | Citiri | Iconiță | Badge (clasă) | Culoare | Pagină raport |
|---|---|---|---|---|---|---|
| Contor apă (LoRa) | m³ (2 zecimale) | zilnice; **orare doar la unele contoare** | `bi-droplet` | `equip-badge equip-apa` | `#154EC1` | `bransament.html` (loc de măsurare), `apartament.html` (loc de consum), `zona.html`, `citiri-orare.html` |
| Contor energie termică | **MWh** (3 zecimale) | **doar zilnice** | `bi-fire` | `equip-badge equip-termic` | `#c2410c` / `#f97316` | `energie-termica.html` (loc de măsurare), `energie-termica-apartament.html` (loc de consum) |
| Repartitor costuri căldură | **adimensional** – fără unitate de măsură (numere întregi) | **doar zilnice** | `bi-thermometer-half` | `equip-badge equip-repartitor` | `#6d28d9` / `#7c3aed` | `repartitoare-bransament.html` (loc de măsurare), `repartitoare.html` (loc de consum) |

Markup-ul badge-ului (identic peste tot):

```html
<span class="equip-badge equip-apa" title="Contor de apă"><i class="bi bi-droplet"></i> Contor apă</span>
<span class="equip-badge equip-termic" title="Contor de energie termică"><i class="bi bi-fire"></i> Contor energie termică</span>
<span class="equip-badge equip-repartitor" title="Repartitor de costuri pentru căldură"><i class="bi bi-thermometer-half"></i> Repartitor costuri</span>
```

**Reguli de afișare**

1. **O adresă = o singură utilitate.** Dacă la aceeași adresă fizică există mai multe utilități, adresa apare în liste de mai multe ori (câte o intrare pe utilitate, fiecare cu codul ei de loc de măsurare / loc de consum).
2. Badge-ul utilității se afișează **sub adresă** (în carduri: titlul și badge-ul sunt grupate într-un `<div>`; în liste: numele pe un rând, badge-ul dedesubt).
3. Butonul „Vezi Citiri” este întotdeauna un **link direct** către raportul utilității adresei (fără dropdown).
4. Pe paginile de raport, utilitatea se vede în antetul cardului de grafic (badge) și în legenda graficului; în dreapta titlului există doar butonul **„Înapoi”**.
5. Toate cele trei utilități au rapoarte atât pe **loc de măsurare** (bloc), cât și pe **loc de consum** (apartament). Contoarele de energie termică se montează în bloc, de regulă la intrarea în apartament – același regim de distribuție ca la contoarele de apă. Repartitoarele se montează câte unul pe calorifer/încăpere.

**Repartitoare – text obligatoriu.** Paginile `repartitoare-bransament.html` și `repartitoare.html` trebuie să conțină nota (`.equip-note.equip-note-repartitor`) care precizează că unitățile repartitoarelor de costuri sunt adimensionale, se corelează cu factorii prevăzuți în **Ordinul 7/2024**, iar valoarea finală, corelată cu factorul de evaluare global, se eliberează sub formă de **raport lunar**. Valorile zilnice afișate sunt neponderate.

## 6. Paginile de raport citiri

Toate paginile de raport au aceeași anatomie (aceleași ID-uri, ușor de legat la date reale):

| Bloc | Elemente / ID-uri |
|---|---|
| Titlu + buton „Înapoi” | `<h1>` + link cu `onclick` care face `history.back()`; `href` duce la hub-ul Raport Citiri (folosit când pagina e deschisă direct, fără istoric) |
| Grafic + slider perioadă | `canvas#dailyConsumptionChart`, `div#date-slider` (noUiSlider, implicit: de la 1 ale lunii curente până azi) |
| Sumar perioadă selectată | span-uri cu valori actualizate la mutarea sliderului (vezi tabelul de mai jos) |
| Card export „RAPOARTE CITIRI” | radio `name="exportReportType"`, wrapper-e afișate în funcție de selecție, radio `name="exportFormat"` (`xlsx`/`pdf`), buton `#btnExportReport` |
| Tabel echipamente | serie, încăpere/amplasare, tip, ultima citire, status, ultima transmisie |

### Diferențe pe tip de echipament

| | Apă (`bransament`, `apartament`) | Energie termică (`energie-termica`, `energie-termica-apartament`) | Repartitoare (`repartitoare-bransament`, `repartitoare`) |
|---|---|---|---|
| Serii în grafic | 2: apă rece (albastru), apă caldă (roșu) | 1: energie termică (portocaliu) | loc de măsurare: 1 serie (total); loc de consum: câte una pe încăpere, **stacked** (nuanțe de mov) |
| Axa Y | `Consum (m³)` | `Consum (MWh)` | `Unități (adimensional)` |
| Sumar | `#totalConsumptionCold`, `#totalConsumptionHot`, `#averageConsumptionCold`, `#averageConsumptionHot` | `#totalConsumptionHeat`, `#averageConsumptionHeat`, `#indexStartHeat`, `#indexEndHeat` | `#totalUnits`, `#averageUnits`; pe loc de consum și `#unitsPerRoom` (generat din JS) |
| Tipuri export (`exportReportType`) | `date`, `period`, `arac_date`, `arac_period`, `zilnice`, `consumuri_zilnice` | `date`, `period`, `zilnice`, `consumuri_zilnice` | `date`, `period`, `zilnice`, `consumuri_zilnice` |
| Citiri orare | da (buton „Consum orar” pe `apartament`) | **nu** (mesaj informativ sub grafic) | **nu** (mesaj informativ sub grafic) |
| Extra | – | – | nota Ordinul 7/2024; card „Rapoarte lunare de repartizare” (luna, perioada, status `Emis`/`În curs`, descărcare PDF) |

### Contoare pasante (loc de măsurare – apă și energie termică)

Pe `bransament.html` (apă) și `energie-termica.html` (energie termică), cardul „Sumar pentru perioada selectată” are la final secțiunea **CONTOARE PASANTE** (`#pasantSection` / `#pasantSummary`). Pentru fiecare contor pasant al locului de măsurare se afișează: denumirea (ex. „Scara A - apă rece”), seria, consumul în perioada selectată (bold, culoarea utilității) și indexul la sfârșitul perioadei. Rândurile se generează din JS și se actualizează odată cu sliderul (`updatePasantSummary(startIdx, endIdx)`). Dacă locul de măsurare nu are contoare pasante (`pasantMeters` gol), secțiunea nu se afișează. Pe paginile de loc de consum și pe repartitoare secțiunea nu există.

Date de la server:

```js
// lista contoarelor pasante ale locului de măsurare
const pasantMeters = [{ serie: "P-AR-10211", nume: "Scara A - apă rece", cls: "text-primary" }, ...];
// pe fiecare zi din historicalData: consumul zilnic și indexul la final de zi, în ordinea din pasantMeters
{ date: "2026-11-17", apaRece: 3.12, apaCalda: 1.05, pasanti: [1.71, 0.58, ...], pasantIndex: [4054.58, 2455.83, ...] }
```

Clase de culoare: apă rece `text-primary`, apă caldă `text-danger`, energie termică `equip-text-termic`. Unități: m³ cu 2 zecimale, MWh cu 3 zecimale.

### Datele demonstrative

Datele din grafice sunt generate în JavaScript (`historicalData`, 365 de zile) **doar pentru demonstrație**. În ASP.NET ele se înlocuiesc cu date de la server, păstrând aceeași formă:

```js
// Apă
[{ date: "2026-11-17", apaRece: 3.12, apaCalda: 1.05 }, ...]                       // m³ / zi
// Energie termică
[{ date: "2026-11-17", energie: 0.782, indexStart: 1438.140, indexEnd: 1438.922 }, ...] // MWh
// Repartitoare – loc de măsurare (total zilnic, întreg, fără unitate)
[{ date: "2026-11-17", unitati: 112 }, ...]
// Repartitoare – loc de consum (câte o cheie pe încăpere/repartitor, valori întregi, fără unitate)
[{ date: "2026-11-17", sufragerie: 7, dormitor: 5, bucatarie: 3, baie: 2 }, ...]
```

Pentru repartitoare, lista încăperilor (`rooms`: cheie, etichetă, culoare) vine tot de la server – câte un element pentru fiecare repartitor montat în apartament.

## 7. Ghid de conversie în ASP.NET

Exemplele sunt pentru ASP.NET Core (Razor Pages / MVC); principiile sunt aceleași și pentru alte variante (ex. Web Forms cu Master Page).

### 7.1 Layout

- `header` + `sidebar` + `footer` (identice în toate paginile interne) → `Pages/Shared/_Layout.cshtml`. Conținutul dintre `<main …>` și `</main>` devine `@RenderBody()`.
- Scripturile specifice paginii (blocul `<script>` de la finalul fiecărei pagini) → `@section Scripts { … }`, randată în layout **după** librăriile din footer.
- `login`, `register`, `lost-password` au layout propriu (fără sidebar) → `_LayoutAuth.cshtml`.
- Paginile Alerte / Bilanț / Estimări încarcă Tom Select în pagină → `@section Styles`/`Scripts` sau direct în layout.

### 7.2 Meniul activ

În HTML, linkul activ are clasa `active` (pusă la export). În ASP.NET:

```cshtml
@* în pagină *@
@{ ViewData["ActivePage"] = "Citiri"; }
@* în _Layout / partial sidebar *@
<a class="nav-link d-flex align-items-center gap-2 @(ViewData["ActivePage"] as string == "Citiri" ? "active" : "")" asp-page="/Citiri/Index">…</a>
```

Valorile folosite: `Dashboard`, `Adrese`, `Regiuni`, `Perioade Citiri`, `Setari Alerte`, `Info Center`, `Contact`, `Citiri`, `Bilant`, `Estimari`, `Alerte`, `Contul Meu`, `Utilizatori`, `Setari` (vezi coloana „Meniu activ” din secțiunea 3; toate paginile `page/citiri/*` folosesc `Citiri`, `page/apartamente` folosește `Adrese`).

### 7.3 Linkuri și resurse

- Linkurile relative din export (`../../css/style.css`, `../../page/citiri/index.html`) → `~/css/style.css`, `asp-page="/Citiri/Index"` / `Url.Page(...)`.
- Ancora `page/adrese/index.html#loc-consum` → `asp-page="/Adrese/Index" asp-fragment="loc-consum"`.
- Nu se modifică `css/style.css` și `css/bootstrap.min.css` în timpul conversiei.

### 7.4 Componente recomandate ca partial views

| Partial | Sursa în HTML | Parametri |
|---|---|---|
| `_EquipmentBadge` | `<span class="equip-badge equip-…">` (sub adresă) | `EquipmentType` |
| `_ReadingsLink` | butonul „Vezi Citiri” | loc de măsurare / consum + utilitatea lui → pagina de raport |
| `_BackButton` | butonul „Înapoi” din dreapta titlului de raport | URL de rezervă (hub-ul Raport Citiri) |
| `_ExportReportCard` | cardul RAPOARTE CITIRI | lista tipurilor de raport permise |
| `_MonthlyAllocationReports` | cardul „Rapoarte lunare de repartizare” | lista lunilor + status |

Model sugerat pentru tipurile de echipamente (o singură sursă de adevăr pentru etichetă, iconiță, clasă CSS, unitate, pagină):

```csharp
public enum EquipmentType { Apa, EnergieTermica, RepartitorCosturi }

public static class EquipmentTypeInfo
{
    public static (string Label, string Icon, string Css, string TextCss, string? Unit, bool HasHourly, string ReportPage) Get(EquipmentType t) => t switch
    {
        EquipmentType.Apa               => ("Contor apă",             "bi-droplet",          "equip-apa",        "",                      "m³",  true,  "/Citiri/Bransament"),
        EquipmentType.EnergieTermica    => ("Contor energie termică", "bi-fire",             "equip-termic",     "equip-text-termic",     "MWh", false, "/Citiri/EnergieTermica"),
        EquipmentType.RepartitorCosturi => ("Repartitor costuri",     "bi-thermometer-half", "equip-repartitor", "equip-text-repartitor", null,  false, "/Citiri/RepartitoareBransament"),
        _ => throw new ArgumentOutOfRangeException(nameof(t))
    };
}
```

> `ReportPage` este raportul pentru loc de măsurare. Pentru loc de consum: apă → `apartament`, energie termică → `energie-termica-apartament`, repartitoare → `repartitoare`. „Consum orar” se afișează doar dacă **contorul** transmite citiri orare (nu toate contoarele LoRa o fac).

### 7.5 Date pentru grafice

- Se elimină generatorul demonstrativ din `initializeChartAndSlider()` (bucla `for (let i = 365; …)`) și se încarcă datele de la server (endpoint JSON sau serializare în pagină: `const historicalData = @Json.Serialize(Model.Readings);`). Câmpul `date` se transformă în `Date` înainte de folosire.
- Restul codului (Chart.js, noUiSlider, flatpickr, calculul sumarului) se păstrează neschimbat.
- Formatare: m³ cu 2 zecimale, MWh cu 3 zecimale, repartitoare ca numere întregi **fără unitate**; datele în format `ro-RO` (`dd.mm.yyyy`).

### 7.6 Formulare de export

Cardul RAPOARTE CITIRI este doar UI: la conversie se leagă butonul `#btnExportReport` de un endpoint care primește `exportReportType`, intervalul/datele din wrapper-ul vizibil și `exportFormat` (`xlsx` / `pdf`). Câmpurile de dată folosesc flatpickr cu `dateFormat: "Y-m-d"` (valoarea trimisă) și `altFormat: "d.m.Y"` (valoarea afișată).

### 7.7 Curățenie la conversie

- `bransament.html` și `apartament.html` conțin un bloc `<style>` inline pentru `.report-btn-grid`, identic cu cel din `css/style.css` – poate fi eliminat.
- Comentariile `<!-- MODIFICARE: … -->` sunt note de dezvoltare și pot fi șterse.

## 8. Probleme cunoscute

- Pe paginile de raport, tooltip-ul sliderului de perioadă poate depăși marginea din dreapta (scroll orizontal de ~30px) când mânerul este la capătul intervalului.
- `page/bloc-manager/` nu are link în meniu.
- Numele utilizatorului din dashboard („Bună, …”) este static.

## 9. Istoric modificări

Lista detaliată a modificărilor aduse paginilor existente și a paginilor / componentelor noi, destinată developerilor, este în **`CHANGELOG.md`** (inclus și în export).


---

_Export HTML generat automat la data de 2026-11-17 09:57:17._
