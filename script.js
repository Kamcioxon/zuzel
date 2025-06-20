document.addEventListener('DOMContentLoaded', function() {
    const dropdownButtons = document.querySelectorAll('.przycisk-rozwin');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const parentLi = button.closest('.rozwin');

            if (parentLi.classList.contains('rozwin')) {
                if (parentLi.classList.contains('otwarte')) {
                    parentLi.classList.remove('otwarte');
                } else {
                    const openDropdowns = document.querySelectorAll('.menu-nawigacyjne .rozwin.otwarte');
                    openDropdowns.forEach(openDropdown => {
                        if (openDropdown !== parentLi) {
                            openDropdown.classList.remove('otwarte');
                        }
                    });
                    parentLi.classList.add('otwarte');
                }
            }
        });
    });

    const subDropdownButtons = document.querySelectorAll('.przycisk-rozwin-podmenu');
    subDropdownButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const parentSubmenuLi = button.closest('.rozwin-podmenu');

            if (parentSubmenuLi.classList.contains('otwarte')) {
                parentSubmenuLi.classList.remove('otwarte');
            } else {
                const openSubDropdowns = parentSubmenuLi.parentElement.querySelectorAll('.rozwin-podmenu.otwarte');
                openSubDropdowns.forEach(openSubDropdown => {
                    if (openSubDropdown !== parentSubmenuLi) {
                        openSubDropdown.classList.remove('otwarte');
                    }
                });
                parentSubmenuLi.classList.add('otwarte');
            }
        });
    });

    // NOWA FUNKCJONALNOŚĆ: Obsługa menu hamburger
    const hamburgerButton = document.querySelector('.hamburger');
    const nawigacjaGlowna = document.getElementById('nawigacja-glowna');
    const menuNawigacyjne = nawigacjaGlowna.querySelector('.menu-nawigacyjne');

    if (hamburgerButton && menuNawigacyjne) {
        hamburgerButton.addEventListener('click', function() {
            hamburgerButton.classList.toggle('aktywne');
            menuNawigacyjne.classList.toggle('aktywne');
            // Zamykamy otwarte podmenu, gdy główne menu jest zwijane
            if (!menuNawigacyjne.classList.contains('aktywne')) {
                const openDropdowns = menuNawigacyjne.querySelectorAll('.rozwin.otwarte, .rozwin-podmenu.otwarte');
                openDropdowns.forEach(openDropdown => {
                    openDropdown.classList.remove('otwarte');
                });
            }
        });

        // Zamknięcie menu po kliknięciu linku w menu mobilnym
        const navLinks = menuNawigacyjne.querySelectorAll('a:not(.przycisk-rozwin):not(.przycisk-rozwin-podmenu)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) { // Zamykaj tylko na tabletach i mniejszych
                    hamburgerButton.classList.remove('aktywne');
                    menuNawigacyjne.classList.remove('aktywne');
                    const openDropdowns = menuNawigacyjne.querySelectorAll('.rozwin.otwarte, .rozwin-podmenu.otwarte');
                    openDropdowns.forEach(openDropdown => {
                        openDropdown.classList.remove('otwarte');
                    });
                }
            });
        });

        // Zamknięcie menu po kliknięciu poza nim
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 992 && !nawigacjaGlowna.contains(event.target) && !hamburgerButton.contains(event.target)) {
                if (menuNawigacyjne.classList.contains('aktywne')) {
                    hamburgerButton.classList.remove('aktywne');
                    menuNawigacyjne.classList.remove('aktywne');
                    const openDropdowns = menuNawigacyjne.querySelectorAll('.rozwin.otwarte, .rozwin-podmenu.otwarte');
                    openDropdowns.forEach(openDropdown => {
                        openDropdown.classList.remove('otwarte');
                    });
                }
            }
        });

        // Zamknięcie menu po zmianie rozmiaru okna, jeśli jest otwarte (np. przejście z mobilnego na desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && menuNawigacyjne.classList.contains('aktywne')) {
                hamburgerButton.classList.remove('aktywne');
                menuNawigacyjne.classList.remove('aktywne');
                const openDropdowns = menuNawigacyjne.querySelectorAll('.rozwin.otwarte, .rozwin-podmenu.otwarte');
                openDropdowns.forEach(openDropdown => {
                    openDropdown.classList.remove('otwarte');
                });
            }
        });
    }

    const sectionsToAnimate = document.querySelectorAll('.sekcja-tresci, .sekcja-polecane-artykuly, .sekcja-podglad-galerii');

    sectionsToAnimate.forEach(section => {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (entry.target.querySelector('h2')) {
                        entry.target.querySelector('h2').classList.add('active');
                    }
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sectionObserver.observe(section);

        const childElementsToAnimate = section.querySelectorAll('.karta-artykulu, .element-wiadomosci, .siatka-galerii img, .kolumna-kontaktowa');

        childElementsToAnimate.forEach((element, index) => {
            let delay = index * 0.15;

            if (element.classList.contains('karta-artykulu')) {
                delay = index * 0.2;
            } else if (element.classList.contains('element-wiadomosci')) {
                delay = index * 0.25;
            } else if (element.tagName === 'IMG' && element.closest('.siatka-galerii')) {
                delay = index * 0.1;
            } else if (element.classList.contains('kolumna-kontaktowa')) {
                delay = index * 0.3;
            }

            element.style.animationDelay = `${delay}s`;

            const childObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        childObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            childObserver.observe(element);
        });
    });

    const progressBar = document.createElement('div');
    progressBar.classList.add('pasek-postepu');
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPosition = document.documentElement.scrollTop;
        const progress = (scrollPosition / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});