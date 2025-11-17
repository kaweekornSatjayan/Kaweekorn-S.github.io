/* ========================================
   MAIN JAVASCRIPT
   Portfolio functionality and interactions
   ======================================== */

// ========================================
// 1. NAVBAR LOADING & INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", function() {
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) throw new Error('Failed to load navbar');
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            highlightActiveNavLink();
            adjustForFixedNavbar();
            window.addEventListener('resize', adjustForFixedNavbar);
        })
        .catch(error => console.error('Error loading navbar:', error));
});

// Highlight active navigation link based on current page
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Adjust body padding to prevent content from hiding behind fixed navbar
function adjustForFixedNavbar() {
    const nav = document.querySelector('.navbar.fixed-top');
    if (!nav) return;
    const navHeight = nav.getBoundingClientRect().height;
    document.body.style.paddingTop = navHeight + 'px';
}
// ========================================
// 2. PROJECT CARDS LOADING
// ========================================
function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    fetch('json/edu.JSON')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load projects JSON');
            return response.json();
        })
        .then(projects => {
            let html = '';
            projects.forEach((project, index) => {
                const textPreview = project.text ? project.text.substring(0, 80) + '...' : '';
                html += `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100">
                            <img src="${project.image_url}" class="card-img-top" alt="${project.title}">
                            <div class="card-body">
                                <h5 class="card-title">${project.title}</h5>
                                ${textPreview ? `<p class="card-text">${textPreview}</p>` : ''}
                                <button class="btn btn-primary project-modal-btn" 
                                        data-project-title="${project.title}" 
                                        data-project-subtitle="${project.subtitle || ''}" 
                                        data-project-text="${project.text || ''}" 
                                        data-project-image="${project.image_url}">
                                    See more
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = `<div class="row">${html}</div>`;
            
            document.querySelectorAll('.project-modal-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    showProjectModal({
                        title: this.dataset.projectTitle,
                        subtitle: this.dataset.projectSubtitle,
                        text: this.dataset.projectText,
                        image: this.dataset.projectImage
                    });
                });
            });
        })
        .catch(error => console.error('Error loading projects:', error));
}

// ========================================
// 3. PROJECT MODAL
// ========================================
function showProjectModal(project) {
    const modal = document.getElementById('projectModal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    const titleEl = document.getElementById('projectModalLabel');
    const subtitleEl = document.getElementById('projectModalSubtitle');
    const imageEl = document.getElementById('projectModalImage');
    const textEl = document.getElementById('projectModalText');
    
    if (!titleEl || !imageEl || !textEl) {
        console.error('Modal elements missing');
        return;
    }
    
    titleEl.textContent = project.title;
    
    if (subtitleEl && project.subtitle) {
        subtitleEl.textContent = project.subtitle;
        subtitleEl.style.display = 'block';
    } else if (subtitleEl) {
        subtitleEl.style.display = 'none';
    }
    
    imageEl.src = project.image;
    textEl.textContent = project.text;
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Initialize project loading
document.addEventListener('DOMContentLoaded', loadProjects);

// ========================================
// 4. SCROLL FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Back to top button
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // Mobile card toggle (show more/less)
    const showMoreBtn = document.getElementById('showMoreCards');
    const projectsContainer = document.getElementById('projects-container');
    
    if (showMoreBtn && projectsContainer) {
        showMoreBtn.addEventListener('click', function() {
            if (projectsContainer.classList.contains('show-all')) {
                projectsContainer.classList.remove('show-all');
                showMoreBtn.textContent = 'See More';
                // Scroll to experience section
                const experienceSection = document.getElementById('experience');
                if (experienceSection) {
                    const navHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 0;
                    window.scrollTo({ 
                        top: experienceSection.offsetTop - navHeight - 20, 
                        behavior: 'smooth' 
                    });
                }
            } else {
                projectsContainer.classList.add('show-all');
                showMoreBtn.textContent = 'See Less';
            }
        });
    }
});