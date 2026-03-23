const jobsData = [
  { id: 'j1', title: 'Frontend Developer', company: 'BrightTech', location: 'New York', type: 'Full-time', description: 'Build responsive UI for web products.', requirements: ['HTML/CSS/JS', 'Git basics', 'Team collaboration'] },
  { id: 'j2', title: 'UI Designer', company: 'PixelWave', location: 'San Francisco', type: 'Remote', description: 'Design clean user interfaces and flows.', requirements: ['Figma', 'Wireframing', 'Design systems'] },
  { id: 'j3', title: 'Junior Web Developer', company: 'CloudBase', location: 'Austin', type: 'Full-time', description: 'Support product team with frontend tasks.', requirements: ['JavaScript', 'Debugging', 'API basics'] },
  { id: 'j4', title: 'React Developer', company: 'NovaStack', location: 'Remote', type: 'Remote', description: 'Maintain dashboards and user portals.', requirements: ['Modern JS', 'Component thinking', 'REST APIs'] }
];

const internshipsData = [
  { id: 'i1', title: 'Frontend Intern', company: 'StartHub', location: 'Boston', type: 'On-site', description: 'Assist in building landing pages.', requirements: ['HTML/CSS', 'Eagerness to learn', 'Communication'] },
  { id: 'i2', title: 'Product Design Intern', company: 'VisionApps', location: 'Chicago', type: 'Remote', description: 'Help design app screens and prototypes.', requirements: ['Figma basics', 'UX mindset', 'Creativity'] },
  { id: 'i3', title: 'QA Intern', company: 'CodeLeaf', location: 'Seattle', type: 'On-site', description: 'Test features and report bugs clearly.', requirements: ['Detail oriented', 'Test cases', 'Teamwork'] }
];

const postedJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
const allJobs = [...postedJobs, ...jobsData];
const page = document.body.dataset.page;

function card(item, isIntern = false) {
  return `
    <article class="card">
      <h3>${item.title}</h3>
      <p class="meta">${item.company} • ${item.location}</p>
      <p class="meta">${item.type}</p>
      <a href="details.html?id=${item.id}&kind=${isIntern ? 'intern' : 'job'}"><button>View Details</button></a>
    </article>
  `;
}

function renderList(items, target, isIntern = false) {
  target.innerHTML = items.length ? items.map(i => card(i, isIntern)).join('') : '<p class="no-results">No results found.</p>';
}

function filterItems(items, keyword, type) {
  return items.filter(i =>
    i.title.toLowerCase().includes(keyword.toLowerCase()) &&
    (type === 'all' || i.type === type)
  );
}

if (page === 'home') {
  renderList(allJobs.slice(0, 3), document.getElementById('featuredJobs'));
  renderList(internshipsData.slice(0, 3), document.getElementById('featuredInternships'), true);
}

if (page === 'jobs') {
  const list = document.getElementById('jobsList');
  const search = document.getElementById('jobsSearch');
  const filter = document.getElementById('jobsFilter');

  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';

  function update() {
    renderList(filterItems(allJobs, search.value, filter.value), list);
  }

  search.addEventListener('input', update);
  filter.addEventListener('change', update);
  update();
}

if (page === 'internships') {
  const list = document.getElementById('internList');
  const search = document.getElementById('internSearch');
  const filter = document.getElementById('internFilter');

  function update() {
    renderList(filterItems(internshipsData, search.value, filter.value), list, true);
  }

  search.addEventListener('input', update);
  filter.addEventListener('change', update);
  update();
}

if (page === 'details') {
  const params = new URLSearchParams(location.search);
  const kind = params.get('kind');
  const id = params.get('id');
  const data = kind === 'intern' ? internshipsData : allJobs;
  const item = data.find(x => x.id === id);
  const root = document.getElementById('detailsCard');

  if (!item) {
    root.innerHTML = '<p class="no-results">Listing not found.</p>';
  } else {
    root.innerHTML = `
      <h1>${item.title}</h1>
      <p class="meta">${item.company} • ${item.location} • ${item.type}</p>
      <p>${item.description}</p>
      <h3>Requirements</h3>
      <ul>${item.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
      <button id="applyBtn">Apply Now</button>
    `;
    document.getElementById('applyBtn').addEventListener('click', () => alert('Application submitted (demo only).'));
  }
}

if (page === 'post') {
  document.getElementById('postForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    postedJobs.unshift({
      id: 'p' + Date.now(),
      title: fd.get('title'),
      company: fd.get('company'),
      location: fd.get('location'),
      type: fd.get('type'),
      description: fd.get('description'),
      requirements: ['Good communication', 'Problem solving']
    });
    localStorage.setItem('postedJobs', JSON.stringify(postedJobs));
    alert('Job posted successfully (demo only)');
    e.target.reset();
  });
}

if (page === 'contact') {
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    alert('Message sent successfully (demo only)');
    e.target.reset();
  });
}
