const username = "DevLeox";
const apiUrl = `https://api.github.com/users/${username}`;
const reposUrl = `https://api.github.com/users/${username}/repos`;

async function fetchProfileData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    document.getElementById('profile-picture').src = data.avatar_url;
    document.getElementById('name').textContent = data.name || username;
    document.getElementById('bio').textContent = data.bio || 'No bio available';
    document.getElementById('followers-count').textContent = data.followers;
    document.getElementById('following-count').textContent = data.following;
    document.getElementById('follow-button').onclick = () => {
        window.open(`https://github.com/${username}?tab=followers`, '_blank');
    };
}

async function fetchRepositories() {
    const response = await fetch(reposUrl);
    const repos = await response.json();
    const repoList = document.getElementById('repo-list');
    repos.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.className = 'repo fade-in';
        repoDiv.innerHTML = `
            <div class="status">${repo.private ? 'Private' : 'Public'}</div>
            <h4>${repo.name}</h4>
            <p>${repo.description || 'No description available'}</p>
            <button class="button-purple" onclick="window.open('${repo.html_url}', '_blank')">Open Repository</button>
            <button class="button-outline" onclick="toggleLanguages(this, '${repo.languages_url}')">Show Languages</button>
            <div class="language-bar" id="languages-${repo.name}"></div>
        `;
        repoList.appendChild(repoDiv);
    });
    revealOnScroll();
}

async function toggleLanguages(button, languagesUrl) {
    const languageBar = button.nextElementSibling;
    if (languageBar.style.display === "none" || !languageBar.style.display) {
        const response = await fetch(languagesUrl);
        const languages = await response.json();
        languageBar.innerHTML = '';
        const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
        for (const [language, count] of Object.entries(languages)) {
            const percentage = ((count / total) * 100).toFixed(2);
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.innerHTML = `<div style="width: ${percentage}%; background-color: #6a0dad;">${language} ${percentage}%</div>`;
            languageBar.appendChild(bar);
        }
        languageBar.style.display = "block";
        button.textContent = "Hide Languages";
    } else {
        languageBar.style.display = "none";
        button.textContent = "Show Languages";
    }
}

function revealOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    elements.forEach(el => observer.observe(el));
}

fetchProfileData();
fetchRepositories();
