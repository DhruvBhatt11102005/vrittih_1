document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                // Trigger initial scroll reveal after preloader is gone
                setTimeout(revealOnScroll, 100);
            }, 1500); // Give time for the progress bar animation
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top button visibility
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement && header) {
                // Adjust scroll position to account for fixed header
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else if (targetElement) {
                 targetElement.scrollIntoView({behavior: 'smooth'});
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- Active Nav Link Update on Scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn-primary)');

    if(header) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - header.offsetHeight - 100)) {
                    current = section.getAttribute('id') || '';
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (current && item.getAttribute('href').includes(current)) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- Counters Animation ---
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    let displayVal = Math.ceil(current);
                    counter.innerText = displayVal + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.querySelector('.stats-container');
    if (statsSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                startCounters();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // --- Particle Background Effect for Hero ---
    const createParticles = () => {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            // Styling
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = 'rgba(21, 85, 161, 0.2)';
            particle.style.borderRadius = '50%';
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Animation
            particle.animate([
                { transform: `translate(0, 0) scale(1)`, opacity: 0 },
                { opacity: 1, offset: 0.2 },
                { transform: `translate(${Math.random() * 100 - 50}px, -${Math.random() * 100 + 50}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                iterations: Infinity,
                easing: 'linear'
            });
            
            particlesContainer.appendChild(particle);
        }
    };
    
    createParticles();

    // --- Technology Slider ---
    const techSlider = document.getElementById('tech-slider');
    const techPrev = document.getElementById('tech-prev');
    const techNext = document.getElementById('tech-next');
    
    if (techSlider && techPrev && techNext) {
        let scrollAmount = 0;
        const cardWidth = techSlider.querySelector('.tech-card').offsetWidth + 32; // card + gap
        const maxScroll = techSlider.scrollWidth - techSlider.parentElement.offsetWidth;

        techNext.addEventListener('click', () => {
            if (scrollAmount < maxScroll) {
                scrollAmount += cardWidth;
                if (scrollAmount > maxScroll) scrollAmount = maxScroll;
                techSlider.style.transform = `translateX(-${scrollAmount}px)`;
            } else {
                // Loop back to start
                scrollAmount = 0;
                techSlider.style.transform = `translateX(0)`;
            }
        });

        techPrev.addEventListener('click', () => {
            if (scrollAmount > 0) {
                scrollAmount -= cardWidth;
                if (scrollAmount < 0) scrollAmount = 0;
                techSlider.style.transform = `translateX(-${scrollAmount}px)`;
            } else {
                // Loop to end
                scrollAmount = maxScroll;
                techSlider.style.transform = `translateX(-${scrollAmount}px)`;
            }
        });

        // Auto-slide every 3 seconds
        let autoSlide = setInterval(() => {
            techNext.click();
        }, 3000);

        // Pause auto-slide on hover
        techSlider.parentElement.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
        techSlider.parentElement.parentElement.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                techNext.click();
            }, 3000);
        });
    }
});
