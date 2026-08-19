/**
 * SONIC GRID - Onboarding Wizard Tour (Desktop Only)
 */
document.addEventListener('DOMContentLoaded', function() {
    var startBtn = document.getElementById('start-tour-btn');
    if (!startBtn) return;

    // Check if overlay & tooltip exist in DOM, if not create them dynamically
    var overlay = document.getElementById('onboarding-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'onboarding-overlay';
        overlay.className = 'onboarding-overlay';
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
    }

    var tooltip = document.getElementById('onboarding-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'onboarding-tooltip';
        tooltip.className = 'onboarding-tooltip';
        tooltip.style.display = 'none';
        tooltip.setAttribute('role', 'dialog');
        tooltip.setAttribute('aria-modal', 'true');
        tooltip.setAttribute('aria-label', 'Ghid de utilizare');
        tooltip.innerHTML = '<div class="onboarding-tooltip-inner">' +
            '<div class="onboarding-tooltip-arrow"></div>' +
            '<div class="onboarding-header">' +
              '<div class="onboarding-step-badge"><span id="onboarding-step-current">1</span>/<span id="onboarding-step-total">9</span></div>' +
              '<button class="onboarding-close" id="onboarding-close" title="Inchide"><i class="bi bi-x-lg"></i></button>' +
            '</div>' +
            '<h5 class="onboarding-title" id="onboarding-title">Adresele Mele</h5>' +
            '<p class="onboarding-body" id="onboarding-body"></p>' +
            '<div class="onboarding-progress"><div class="onboarding-progress-bar" id="onboarding-progress-bar"></div></div>' +
            '<div class="onboarding-actions">' +
              '<button class="btn btn-sm btn-outline-secondary" id="onboarding-prev" style="display:none;"><i class="bi bi-arrow-left me-1"></i> Inapoi</button>' +
              '<button class="btn btn-sm btn-primary ms-auto" id="onboarding-next">Urmatorul <i class="bi bi-arrow-right ms-1"></i></button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(tooltip);
    }

    var arrowEl = tooltip.querySelector('.onboarding-tooltip-arrow');
    var titleEl = document.getElementById('onboarding-title');
    var bodyEl = document.getElementById('onboarding-body');
    var stepCur = document.getElementById('onboarding-step-current');
    var stepTot = document.getElementById('onboarding-step-total');
    var progressBar = document.getElementById('onboarding-progress-bar');
    var prevBtn = document.getElementById('onboarding-prev');
    var nextBtn = document.getElementById('onboarding-next');
    var closeBtn = document.getElementById('onboarding-close');

    var steps = [
        {
            selector: 'a[href*="page/adrese"]',
            title: 'Adresele Mele',
            body: 'Punctul de pornire al oricarui utilizator. Adauga <strong>locul de masurare (bransamentul)</strong> cu codul unic primit de la Decor Press. Vei obtine acces la toate apartamentele si echipamentele din acel bransament.'
        },
        {
            selector: 'a[href*="page/adrese"]',
            title: 'Locuri de Consum (Apartamente)',
            body: 'Din <strong>Adresele Mele</strong>, selecteaza un bransament si acceseaza <strong>Locuri de Consum</strong>. Genereaza coduri de invitatie pentru locatari, astfel incat fiecare locatar sa-si poata crea propriul cont.'
        },
        {
            selector: 'a[href*="page/regiuni"]',
            title: 'Regiuni / Zone',
            body: 'Grupeaza bransamentele pe regiuni si <strong>distribuie accesul echipei</strong> prin coduri de regiune. Drepturile pot fi retrase oricand. Ideal pentru firme de facility management cu mai multi angajati.'
        },
        {
            selector: 'a[href*="page/perioade-calcul"]',
            title: 'Perioade Citiri',
            body: 'Seteaza <strong>data de citire a furnizorului</strong> si valorile facturate lunar pentru fiecare bransament. Aceste date sunt necesare pentru a calcula bilantul neinchiderilor la apa.'
        },
        {
            selector: 'a[href*="page/setari-alerte"]',
            title: 'Setari Alerte',
            body: 'Configureaza notificarile: <strong>SMS instant</strong> pentru situatii critice (teava sparta, inghet) si <strong>email zilnic/lunar</strong> pentru anomalii de consum. Poti seta si alerte speciale pentru persoane vulnerabile.'
        },
        {
            selector: 'a[href*="page/citiri"]',
            title: 'Raport Citiri',
            body: 'Genereaza rapoarte detaliate de consum la nivel de <strong>regiune, bransament sau apartament</strong>. Vizualizeaza citiri zilnice, consumuri pe perioade sau valori la o data specifica.'
        },
        {
            selector: 'a[href*="page/bilant"]',
            title: 'Bilant Neinchideri Apa',
            body: 'Compara <strong>volumul facturat de furnizor</strong> cu suma contoarelor din bransament. O diferenta mare poate indica pierderi in instalatii comune sau alte probleme.'
        },
        {
            selector: 'a[href*="page/estimari"]',
            title: 'Estimari Consum',
            body: 'Vizualizeaza o <strong>estimare a consumului la finalul lunii</strong> pentru fiecare bransament, calculata pe baza mediei zilnice din luna curenta. Util pentru anticiparea costurilor.'
        },
        {
            selector: 'a[href*="page/alerte"]',
            title: 'Raport Alerte',
            body: 'Monitorizeaza <strong>alertele active si istoricul</strong> celor rezolvate. Cand contorul raporteaza OK, alerta se muta la rezolvate. &#127881; <strong>Esti gata sa utilizezi SONIC GRID!</strong>'
        }
    ];

    var currentStep = 0;
    var highlightedEl = null;

    if (stepTot) stepTot.textContent = steps.length;

    function removeHighlight(){
        if (highlightedEl) {
            highlightedEl.classList.remove('onboarding-highlight');
            highlightedEl = null;
        }
    }

    function positionTooltip(targetEl){
        var sidebarEl = document.querySelector('.sidebar');
        var sidebarRect = sidebarEl ? sidebarEl.getBoundingClientRect() : null;
        var targetRect = targetEl ? targetEl.getBoundingClientRect() : null;
        var margin = 20;

        if (targetRect && sidebarRect) {
            var targetCenterY = targetRect.top + (targetRect.height / 2);
            var tooltipHeight = tooltip.offsetHeight;

            // Position tooltip vertically aligned with target
            var idealTop = targetCenterY - (tooltipHeight / 2);
            var minTop = 75; // Below navbar
            var maxTop = window.innerHeight - tooltipHeight - 16;
            var finalTop = Math.max(minTop, Math.min(idealTop, maxTop));
            var finalLeft = sidebarRect.right + margin;

            tooltip.style.top = finalTop + 'px';
            tooltip.style.left = finalLeft + 'px';

            if (arrowEl) {
                // Place arrow precisely aligned with vertical center of target menu item
                var arrowTop = targetCenterY - finalTop - 10;
                arrowTop = Math.max(16, Math.min(arrowTop, tooltipHeight - 36));
                arrowEl.style.top = arrowTop + 'px';
                arrowEl.style.display = 'block';
            }
        } else {
            var left = (window.innerWidth - 350) / 2;
            var top = (window.innerHeight - tooltip.offsetHeight) / 2;
            tooltip.style.top = top + 'px';
            tooltip.style.left = left + 'px';
            if (arrowEl) arrowEl.style.display = 'none';
        }
    }

    function showStep(index){
        var step = steps[index];
        var targetEl = document.querySelector(step.selector);

        if (titleEl) titleEl.textContent = step.title;
        if (bodyEl) bodyEl.innerHTML = step.body;
        if (stepCur) stepCur.textContent = index + 1;
        if (progressBar) progressBar.style.width = ((index + 1) / steps.length * 100) + '%';
        if (prevBtn) prevBtn.style.display = index > 0 ? '' : 'none';

        if (nextBtn) {
            if (index === steps.length - 1) {
                nextBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Finalizeaza';
                nextBtn.classList.remove('btn-primary');
                nextBtn.classList.add('btn-success');
            } else {
                nextBtn.innerHTML = 'Urmatorul <i class="bi bi-arrow-right ms-1"></i>';
                nextBtn.classList.remove('btn-success');
                nextBtn.classList.add('btn-primary');
            }
        }

        removeHighlight();
        if (targetEl) {
            targetEl.classList.add('onboarding-highlight');
            highlightedEl = targetEl;
        }

        tooltip.style.display = '';
        tooltip.style.visibility = 'hidden';
        requestAnimationFrame(function(){
            positionTooltip(targetEl);
            tooltip.style.visibility = '';
        });
    }

    function startTour(){
        currentStep = 0;
        overlay.style.display = '';
        overlay.setAttribute('aria-hidden', 'false');
        showStep(currentStep);
    }

    function endTour(){
        overlay.style.display = 'none';
        tooltip.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        removeHighlight();
        currentStep = 0;
    }

    startBtn.addEventListener('click', startTour);
    if (closeBtn) closeBtn.addEventListener('click', endTour);
    overlay.addEventListener('click', endTour);

    if (nextBtn) {
        nextBtn.addEventListener('click', function(){
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            } else {
                endTour();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function(){
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    }

    document.addEventListener('keydown', function(e){
        if (!tooltip || tooltip.style.display === 'none') return;
        if (e.key === 'Escape') endTour();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    });

    window.addEventListener('resize', function(){
        if (tooltip && tooltip.style.display !== 'none') {
            positionTooltip(document.querySelector(steps[currentStep].selector));
        }
    });
});
