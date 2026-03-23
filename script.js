// Mock Data for Jobs
const initialJobs = [
  {
    id: 'j1',
    title: 'Frontend Developer',
    company: 'TechNova',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Developer proficient in modern web technologies to build exceptional user interfaces. You will be working closely with our design team to translate mockups into fully functional components.'
  },
  {
    id: 'j2',
    title: 'Backend Engineer',
    company: 'CloudSync',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our core infrastructure team to build scalable and robust microservices using Node.js and Go. Experience with AWS and Kubernetes is highly preferred.'
  },
  {
    id: 'j3',
    title: 'UI/UX Designer',
    company: 'CreativePulse',
    location: 'San Francisco, CA',
    type: 'Contract',
    description: 'We need a creative UI/UX designer to revamp our flagship product. You should have a strong portfolio demonstrating your user-centered design approach.'
  },
  {
    id: 'j4',
    title: 'Data Analyst',
    company: 'DataFlow Systems',
    location: 'Remote',
    type: 'Full-time',
    description: 'Seeking a data analyst to interpret data, analyze results using statistical techniques and provide ongoing reports.'
  }
];

// Mock Data for Internships
const initialInternships = [
  {
    id: 'i1',
    title: 'Software Engineering Intern',
    company: 'AppWorks',
    location: 'Austin, TX',
    type: 'Internship',
    description: 'Join us for a 12-week summer internship where you will work on real production code and be mentored by senior engineers.'
  },
  {
    id: 'i2',
    title: 'Marketing Intern',
    company: 'BrandBoost',
    location: 'Remote',
    type: 'Internship',
    description: 'Learn the ropes of digital marketing, content creation, and social media management in a fast-paced environment.'
  },
  {
    id: 'i3',
    title: 'Product Management Intern',
    company: 'InnovateCorp',
    location: 'Seattle, WA',
    type: 'Internship',
    description: 'Work closely with our product team to gather requirements, analyze market trends, and help shape our product roadmap.'
  }
];

// Combine data for details lookup or local storage mapping
const getData = (key, defaultData) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

const jobs = getData('js_jobs', initialJobs);
const internships = getData('js_internships', initialInternships);

// Store all listings in one map for details page
const allListings = [...jobs, ...internships];

/**
 * Render cards to a container
 */
function renderCards(data, containerId, isLimited = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="empty-state">Loading...</div>';

  setTimeout(() => {
    container.innerHTML = '';
    const displayData = isLimited ? data.slice(0, 3) : data;

    if (displayData.length === 0) {
      container.innerHTML = '<div class="empty-state">No results found matching your criteria.</div>';
      return;
    }

    displayData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card fade-in';
      
      // Icons based on type (simple SVGs as text)
      const locationIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      const briefcaseIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;

      const userPostedHtml = item.id.startsWith('usr_') ? `<span class="card-badge" style="background:var(--success); color:white; margin-right: 0.5rem;">User Posted</span>` : '';

      card.innerHTML = `
        <div class="card-header">
          <div>
            <h3 class="card-title">${item.title}</h3>
            <div class="card-company">${item.company}</div>
          </div>
          <div style="display: flex; align-items: center;">
            ${userPostedHtml}
            <span class="card-badge">${item.type}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>${locationIcon} ${item.location}</span>
            <span>${briefcaseIcon} ${item.type}</span>
          </div>
          <p class="card-desc">${item.description}</p>
        </div>
        <a href="details.html?id=${item.id}" class="btn btn-outline" style="width: 100%;">View Details</a>
      `;
      container.appendChild(card);
    });
  }, 300);
}

/**
 * Setup Filtering Logic for Jobs/Internships pages
 */
function setupFiltering(data, containerId) {
  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');
  
  if (!searchInput || !typeFilter) return;

  const filterData = () => {
    const query = searchInput.value.toLowerCase();
    const type = typeFilter.value;

    const filtered = data.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(query) || 
                          item.company.toLowerCase().includes(query) ||
                          item.location.toLowerCase().includes(query);
      const matchType = type === '' || item.type === type;
      return matchSearch && matchType;
    });

    renderCards(filtered, containerId);
  };

  searchInput.addEventListener('input', filterData);
  typeFilter.addEventListener('change', filterData);
}

/**
 * Generic search from Home Page
 */
function setupHomeSearch() {
  const form = document.getElementById('homeSearchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('homeSearchInput').value.trim();
    if (!query) {
      alert("Please enter a search term");
      return;
    }
    // Redirect to jobs page with query params
    window.location.href = `jobs.html?search=${encodeURIComponent(query)}`;
  });
}

/**
 * Handle Job Details Page
 */
function loadDetails() {
  const detailsContainer = document.getElementById('detailsContainer');
  if (!detailsContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const item = allListings.find(l => l.id === id);

  if (!item) {
    detailsContainer.innerHTML = '<div class="empty-state">Listing not found. Return to <a href="index.html" style="color:var(--primary-light)">Home</a></div>';
    return;
  }

  detailsContainer.innerHTML = `
    <div style="background: white; padding: 3rem; border-radius: var(--radius); box-shadow: var(--shadow-md);" class="fade-in">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
        <div>
          <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--secondary)">${item.title}</h1>
          <h3 style="color: var(--text-muted); font-size: 1.25rem;">${item.company}</h3>
        </div>
        <span class="card-badge" style="font-size: 1rem; padding: 0.5rem 1rem;">${item.type}</span>
      </div>
      
      <div style="display: flex; gap: 2rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-main);">
          <strong>Location:</strong> ${item.location}
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-main);">
          <strong>Job ID:</strong> ${item.id.toUpperCase()}
        </div>
      </div>

      <div style="margin-bottom: 3rem;">
        <h3 style="margin-bottom: 1rem;">Job Description</h3>
        <p style="white-space: pre-line; line-height: 1.8; color: var(--text-main); font-size: 1.1rem;">
          ${item.description}
          
          <strong>Requirements:</strong>
          - Strong communication skills
          - Team player
          - Passion for excellence
        </p>
      </div>

      <button class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2.5rem;" onclick="handleApply()">Apply Now</button>
    </div>
  `;
}

window.handleApply = function() {
  let count = parseInt(localStorage.getItem('js_apply_count') || '0');
  count++;
  localStorage.setItem('js_apply_count', count);
  alert(`Application submitted! Total applications: ${count}`);
}

/**
 * Setup Post Job Form Setup
 */
function setupPostForm() {
  const form = document.getElementById('postJobForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newJob = {
      id: 'usr_' + Date.now().toString().slice(-4),
      title: document.getElementById('title').value,
      company: document.getElementById('company').value,
      location: document.getElementById('location').value,
      type: document.getElementById('type').value,
      description: document.getElementById('description').value
    };

    // Save to local storage
    const currentJobs = JSON.parse(localStorage.getItem('js_jobs')) || [];
    currentJobs.unshift(newJob);
    localStorage.setItem('js_jobs', JSON.stringify(currentJobs));

    const alertBox = document.getElementById('formAlert');
    alertBox.classList.add('success');
    form.reset();
    
    setTimeout(() => {
      window.location.href = 'jobs.html';
    }, 1500);
  });
}

/**
 * Setup Contact Form
 */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('formAlert');
    alertBox.classList.add('success');
    form.reset();
    
    setTimeout(() => {
      alertBox.classList.remove('success');
    }, 3000);
  });
}

/**
 * Page Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // Highlight active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if(link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Init Home Page
  if (document.getElementById('featuredJobs')) {
    renderCards(jobs, 'featuredJobs', true);
    renderCards(internships, 'featuredInternships', true);
    setupHomeSearch();
  }

  // Init Jobs Page
  if (document.getElementById('jobsList')) {
    // Pre-fill search if coming from home page
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      document.getElementById('searchInput').value = searchQuery;
    }
    
    renderCards(jobs, 'jobsList');
    setupFiltering(jobs, 'jobsList');

    // Trigger initial filter if search was pre-filled
    if (searchQuery) {
      const e = new Event('input');
      document.getElementById('searchInput').dispatchEvent(e);
    }
  }

  // Init Internships Page
  if (document.getElementById('internshipsList')) {
    renderCards(internships, 'internshipsList');
    setupFiltering(internships, 'internshipsList');
  }

  // Init Details Page
  if (document.getElementById('detailsContainer')) {
    loadDetails();
  }

  // Init Form Pages
  setupPostForm();
  setupContactForm();
});
