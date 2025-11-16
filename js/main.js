// นี่คือโค้ดทั้งหมดในไฟล์ js/main.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. โค้ดดึง Navbar ---
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load navbar');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            highlightActiveNavLink();
            // adjust body top padding so content is not hidden behind the fixed navbar
            adjustForFixedNavbar();
            // also adjust on window resize in case navbar height changes
            window.addEventListener('resize', adjustForFixedNavbar);
        })
        .catch(error => console.error('Error loading navbar:', error));

    // --- 2. (เผื่ออนาคต) โค้ดดึง Footer ---
    // fetch("footer.html")
    //     .then(response => response.text())
    //     .then(data => {
    //         document.getElementById("footer-placeholder").innerHTML = data;
    //     });
});

// ฟังก์ชันเพื่อไฮไลท์ลิงก์ navbar ที่เป็นหน้าปัจจุบัน
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // ตรวจสอบว่า href ตรงกับหน้าปัจจุบัน
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ปรับ padding-top ของ body ให้พอเหนือ navbar ที่ fixed-top
function adjustForFixedNavbar(){
    const nav = document.querySelector('.navbar.fixed-top');
    if (!nav) return;
    // อ่านความสูงปัจจุบันของ navbar (รวม border)
    const navHeight = nav.getBoundingClientRect().height;
    // ใส่ padding-top ให้ body เท่ากับ navbar height
    document.body.style.paddingTop = navHeight + 'px';
}
// Load projects from JSON and render cards if a container `#projects-container` exists.
function loadProjects(){
    const container = document.getElementById('projects-container');
    if (!container) return; // nothing to render to

    fetch('json/edu.JSON')
        .then(r => {
            if (!r.ok) throw new Error('Failed to load projects JSON');
            return r.json();
        })
        .then(projects => {
            // create cards
            let html = '';
            projects.forEach((project, index) => {
                // Create a short preview of the text (first 80 characters)
                const textPreview = project.text ? project.text.substring(0, 80) + '...' : '';
                html += `
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card h-100">
                            <img src="${project.image_url}" class="card-img-top" alt="${project.title}">
                            <div class="card-body">
                                <h5 class="card-title">${project.title}</h5>
                                ${textPreview ? `<p class="card-text">${textPreview}</p>` : ''}
                                <button class="btn btn-primary project-modal-btn" data-project-index="${index}" data-project-title="${project.title}" data-project-subtitle="${project.subtitle || ''}" data-project-text="${project.text || ''}" data-project-image="${project.image_url}">See more</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            // wrap in a row if desired
            container.innerHTML = `<div class="row">${html}</div>`;
            
            // Add click handlers to all project modal buttons
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
        .catch(err => console.error('Error loading projects:', err));
}

// Show project details in a modal
function showProjectModal(project) {
    const modal = document.getElementById('projectModal');
    if (!modal) {
        console.error('Modal element #projectModal not found');
        return;
    }
    
    const titleEl = document.getElementById('projectModalLabel');
    const subtitleEl = document.getElementById('projectModalSubtitle');
    const imageEl = document.getElementById('projectModalImage');
    const textEl = document.getElementById('projectModalText');
    
    if (!titleEl || !imageEl || !textEl) {
        console.error('One or more modal elements missing');
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
    
    // Show modal using Bootstrap
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// call loadProjects in case a page has a projects container
document.addEventListener('DOMContentLoaded', loadProjects);