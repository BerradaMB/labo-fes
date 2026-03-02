/**
 * Laboratoire Fès - Modern JavaScript (Vanilla ES6+)
 * No dependencies, accessibility-first approach
 * 
 * Features:
 * - Carousel with auto-advance
 * - Mobile menu toggle
 * - Smooth scroll behavior
 * - Sticky header with scroll shadow
 * - Keyboard navigation
 * - Performance optimized
 */

// ====== CAROUSEL MODULE ====== //
const Carousel = (() => {
  let slideIndex = 0;
  const slides = document.querySelectorAll('.mySlides');
  const dots = document.querySelectorAll('.dot');
  let autoPlayInterval;

  const init = () => {
    if (slides.length === 0) return;
    
    showSlide(1);
    autoPlay();

    // Click handlers for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(autoPlayInterval);
        showSlide(index + 1);
        autoPlay();
      });
      
      // Keyboard navigation
      dot.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clearInterval(autoPlayInterval);
          showSlide(index + 1);
          autoPlay();
        }
      });
    });
  };

  const showSlide = (n) => {
    if (slides.length === 0) return;
    
    slideIndex = n > slides.length ? 1 : n < 1 ? slides.length : n;
    
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.style.display = 'none';
    });
    
    // Remove active class from all dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    slides[slideIndex - 1].classList.add('active');
    slides[slideIndex - 1].style.display = 'flex';
    
    // Highlight current dot
    dots[slideIndex - 1].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(slideIndex + 1);
  };

  const autoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
  };

  return { init, showSlide };
})();

// Store in global for HTML onclick handlers
window.currentSlide = Carousel.showSlide;

// ====== NAVIGATION MENU MODULE ====== //
const NavigationMenu = (() => {
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const submenus = document.querySelectorAll('.sub-menu');

  const init = () => {
    if (!menuToggle) return;

    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Close menu when clicking on a link
    const links = document.querySelectorAll('.menu a');
    links.forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        closeMenu();
      }
    });

    // Keyboard support for submenus
    submenus.forEach(submenu => {
      const trigger = submenu.querySelector('a');
      if (trigger) {
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const submenuList = submenu.querySelector('.test');
            if (submenuList) {
              const firstLink = submenuList.querySelector('a');
              if (firstLink) firstLink.focus();
            }
          }
        });
      }
    });
  };

  const toggleMenu = () => {
    const isOpen = header.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    header.classList.add('open');
    if (nav) nav.style.display = 'block';
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    header.classList.remove('open');
    if (nav) nav.style.display = 'none';
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  return { init };
})();

// ====== HEADER SCROLL MODULE ====== //
const HeaderScroll = (() => {
  const header = document.querySelector('.header');
  let lastScrollY = 0;
  let scrollTimeout;

  const init = () => {
    if (!header) return;

    // Listen for scroll events with throttling
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  const handleScroll = () => {
    // Clear previous timeout
    clearTimeout(scrollTimeout);

    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      // Add shadow on scroll
      if (currentScrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    });
  };

  return { init };
})();

// ====== SMOOTH SCROLL BEHAVIOR ====== //
const SmoothScroll = (() => {
  const init = () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });
  };

  const handleAnchorClick = (e) => {
    const href = e.currentTarget.getAttribute('href');
    
    // Skip if it's just '#'
    if (href === '#') return;

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      e.preventDefault();

      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without jump
      history.pushState(null, null, href);
    }
  };

  return { init };
})();

// ====== INTERSECTION OBSERVER FOR ANIMATIONS ====== //
const AnimationOnScroll = (() => {
  const init = () => {
    // Create intersection observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Optional: unobserve to prevent re-triggering
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  };

  return { init };
})();

// ====== PERFORMANCE: LAZY LOAD IMAGES ====== //
const LazyLoadImages = (() => {
  const init = () => {
    // Use native lazy loading if available
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Intersection Observer for additional control
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  return { init };
})();

// ====== MAIN INITIALIZATION ====== //
const App = {
  init() {
    // Wait for DOM to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeModules());
    } else {
      this.initializeModules();
    }
  },

  initializeModules() {
    console.log('🚀 Laboratoire Fès - Initializing modern UI');
    
    Carousel.init();
    NavigationMenu.init();
    HeaderScroll.init();
    SmoothScroll.init();
    AnimationOnScroll.init();
    LazyLoadImages.init();

    console.log('✅ All modules initialized successfully');
  }
};

// Initialize app
App.init();

// ====== ACCESSIBILITY ENHANCEMENTS ====== //
// Keyboard support for buttons
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const header = document.querySelector('.header');
    if (header && header.classList.contains('open')) {
      const menuToggle = document.querySelector('.menu-toggle');
      if (menuToggle) menuToggle.click();
    }
  }
});

// Focus outline for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// ====== PERFORMANCE MONITORING ====== //
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⏱️ Page load time: ${pageLoadTime}ms`);
  });
}

// ====== SERVICE WORKER / PWA READY ====== //
// Placeholder for future PWA implementation
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js');
// }
