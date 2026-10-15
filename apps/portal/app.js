const grid = document.querySelector('#project-grid');
const count = document.querySelector('#collection-count');

function createCard(project, index) {
  const article = document.createElement('article');
  article.className = `project-card project-card-${index + 1}`;

  if (project.cover) {
    article.classList.add('has-cover');

    const cover = document.createElement('img');
    cover.className = 'card-cover';
    cover.src = project.cover;
    cover.alt = project.coverAlt || `${project.title} 预览图`;
    cover.decoding = 'async';
    article.append(cover);
  }

  const kicker = document.createElement('p');
  kicker.className = 'card-kicker';
  kicker.textContent = [String(index + 1).padStart(2, '0'), project.eyebrow].filter(Boolean).join(' · ');

  const title = document.createElement('h3');
  title.textContent = project.title;

  const description = document.createElement('p');
  description.className = 'card-description';
  description.textContent = project.description;

  const credit = document.createElement('p');
  credit.className = 'card-credit';
  credit.textContent = project.credit;

  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const meta = document.createElement('span');
  meta.textContent = project.meta || '';

  const link = document.createElement('a');
  link.href = `./${project.path}/`;
  link.textContent = project.action;
  link.setAttribute('aria-label', `${project.action}：${project.title}`);

  footer.append(meta, link);
  article.append(kicker, title, description, credit, footer);
  return article;
}

async function renderCollection() {
  try {
    const response = await fetch('./projects.json');
    if (!response.ok) throw new Error('Could not load collection');

    const projects = await response.json();
    projects.forEach((project, index) => grid.append(createCard(project, index)));
    count.textContent = `${String(projects.length).padStart(2, '0')} 个项目`;
  } catch {
    count.textContent = '目录暂不可用';
  }
}

renderCollection();
