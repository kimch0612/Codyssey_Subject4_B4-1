"use strict";

const GITHUB_USERNAME = "kimch0612";
const THEME_KEY = "portfolio-theme";
const SCROLL_TOP_POINT = 300;
const HEADER_CHANGE_POINT = 60;
const OBSERVER_THRESHOLD = 0.2;

const header = document.querySelector("#site-header");
const themeButton = document.querySelector("[data-theme-toggle]");
const menuButton = document.querySelector("[data-menu-toggle]");
const navMenu = document.querySelector("#nav-menu");
const scrollLinks = document.querySelectorAll("[data-scroll-link]");
const scrollTopButton = document.querySelector("[data-scroll-top]");
const revealSections = document.querySelectorAll(".reveal");
const projectsStatus = document.querySelector("#projects-status");
const projectsGrid = document.querySelector("#projects-grid");
const refreshButton = document.querySelector("[data-refresh-projects]");
const contactForm = document.querySelector("#contact-form");
const formSuccess = document.querySelector("#form-success");

const state = {
  theme: localStorage.getItem(THEME_KEY) || "light",
  menuOpen: false,
  projectStatus: "idle",
  projects: [],
  projectError: "",
  formErrors: {
    name: "",
    email: "",
    message: "",
  },
};

const escapeHTML = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatDate = (dateText) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateText));

function renderTheme() {
  document.documentElement.dataset.theme = state.theme;
  themeButton.textContent = state.theme === "dark" ? "L" : "D";
  themeButton.setAttribute(
    "aria-label",
    state.theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
}

function changeTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, state.theme);
  renderTheme();
}

function renderMenu() {
  navMenu.classList.toggle("active", state.menuOpen);
  menuButton.classList.toggle("active", state.menuOpen);
  document.body.classList.toggle("nav-open", state.menuOpen);
  menuButton.setAttribute("aria-expanded", String(state.menuOpen));
  menuButton.setAttribute("aria-label", state.menuOpen ? "메뉴 닫기" : "메뉴 열기");
}

function changeMenu() {
  state.menuOpen = !state.menuOpen;
  renderMenu();
}

function moveToSection(event) {
  const targetId = event.currentTarget.getAttribute("href");
  const targetSection = document.querySelector(targetId);

  if (!targetSection) {
    return;
  }

  event.preventDefault();
  targetSection.scrollIntoView({ behavior: "smooth", block: "start" });

  state.menuOpen = false;
  renderMenu();
}

function renderScrollUI() {
  header.classList.toggle("scrolled", window.scrollY >= HEADER_CHANGE_POINT);
  scrollTopButton.classList.toggle("visible", window.scrollY >= SCROLL_TOP_POINT);
}

function makeProjectCard(repo) {
  const {
    name,
    description,
    html_url: htmlUrl,
    homepage,
    language,
    stargazers_count: stars,
    forks_count: forks,
    updated_at: updatedAt,
  } = repo;

  const liveLink = homepage
    ? `<a href="${escapeHTML(homepage)}" target="_blank" rel="noreferrer">Live</a>`
    : "";

  return `
    <article class="project-card">
      <div>
        <h3>${escapeHTML(name)}</h3>
        <p class="project-description">
          ${escapeHTML(description || "저장소 설명이 아직 작성되지 않았습니다.")}
        </p>
      </div>
      <ul class="project-meta">
        <li>${escapeHTML(language || "기타")}</li>
        <li>Stars ${Number(stars)}</li>
        <li>Forks ${Number(forks)}</li>
      </ul>
      <p class="project-updated">최근 업데이트: ${escapeHTML(formatDate(updatedAt))}</p>
      <div class="project-links">
        <a href="${escapeHTML(htmlUrl)}" target="_blank" rel="noreferrer">GitHub</a>
        ${liveLink}
      </div>
    </article>
  `;
}

function renderProjects() {
  projectsGrid.innerHTML = "";

  if (state.projectStatus === "loading") {
    projectsStatus.innerHTML = `
      <div class="status-box">
        <span class="spinner" aria-hidden="true"></span>
        <p>프로젝트를 불러오는 중입니다...</p>
      </div>
    `;
    return;
  }

  if (state.projectStatus === "error") {
    projectsStatus.innerHTML = `
      <div class="status-box">
        <p>${escapeHTML(state.projectError)}</p>
        <button class="button button-ghost" type="button" data-retry-projects>다시 시도</button>
      </div>
    `;
    document.querySelector("[data-retry-projects]").addEventListener("click", loadProjects);
    return;
  }

  if (state.projectStatus === "empty") {
    projectsStatus.innerHTML = `
      <div class="status-box">
        <p>표시할 프로젝트가 없습니다.</p>
      </div>
    `;
    return;
  }

  if (state.projectStatus === "success") {
    projectsStatus.textContent = `${state.projects.length}개의 공개 저장소를 불러왔습니다.`;
    projectsGrid.innerHTML = state.projects.map(makeProjectCard).join("");
  }
}

async function loadProjects() {
  state.projectStatus = "loading";
  state.projects = [];
  state.projectError = "";
  renderProjects();

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

    if (!response.ok) {
      state.projectError =
        response.status === 403
          ? "GitHub API 호출 제한에 도달했습니다. 잠시 후 다시 시도해 주세요."
          : "프로젝트를 불러올 수 없습니다.";
      throw new Error(state.projectError);
    }

    const repos = await response.json();
    const sortedRepos = [...repos].sort(
      (firstRepo, secondRepo) => new Date(secondRepo.updated_at) - new Date(firstRepo.updated_at),
    );

    state.projects = sortedRepos;
    state.projectStatus = sortedRepos.length === 0 ? "empty" : "success";
  } catch (error) {
    state.projectStatus = "error";
    state.projectError = state.projectError || error.message || "프로젝트를 불러올 수 없습니다.";
  }

  renderProjects();
}

function validateField(name, value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "필수 입력 항목입니다.";
  }

  if (name === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(trimmedValue) ? "" : "올바른 이메일 형식을 입력해 주세요.";
  }

  return "";
}

function renderFieldError(name) {
  const field = contactForm.elements[name];
  const errorText = document.querySelector(`[data-error-for="${name}"]`);
  const message = state.formErrors[name];

  errorText.textContent = message;

  if (message) {
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
  } else {
    field.classList.remove("is-invalid");
    field.setAttribute("aria-invalid", "false");
  }
}

function changeField(event) {
  const { name, value } = event.target;

  if (!(name in state.formErrors)) {
    return;
  }

  state.formErrors[name] = validateField(name, value);
  formSuccess.textContent = "";
  renderFieldError(name);
}

function checkForm() {
  Object.keys(state.formErrors).forEach((name) => {
    state.formErrors[name] = validateField(name, contactForm.elements[name].value);
    renderFieldError(name);
  });

  return Object.values(state.formErrors).every((message) => message === "");
}

function submitForm(event) {
  event.preventDefault();

  if (!checkForm()) {
    formSuccess.textContent = "";
    return;
  }

  formSuccess.textContent = "문의 내용이 정상적으로 확인되었습니다.";
  contactForm.reset();

  Object.keys(state.formErrors).forEach((name) => {
    state.formErrors[name] = "";
    renderFieldError(name);
  });
}

function shouldRevealSection(entry) {
  const canReachThreshold = entry.target.offsetHeight * OBSERVER_THRESHOLD <= window.innerHeight;

  return entry.isIntersecting && (!canReachThreshold || entry.intersectionRatio >= OBSERVER_THRESHOLD);
}

function startScrollAnimation() {
  if (!("IntersectionObserver" in window)) {
    revealSections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (shouldRevealSection(entry)) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    // 0은 긴 모바일 섹션이 화면에 들어오는 순간도 감지하기 위한 보조 threshold다.
    { threshold: [0, OBSERVER_THRESHOLD] },
  );

  revealSections.forEach((section) => observer.observe(section));
}

function bindEvents() {
  themeButton.addEventListener("click", changeTheme);
  menuButton.addEventListener("click", changeMenu);
  scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  refreshButton.addEventListener("click", loadProjects);
  contactForm.addEventListener("input", changeField);
  contactForm.addEventListener("submit", submitForm);
  window.addEventListener("scroll", renderScrollUI);
  scrollLinks.forEach((link) => link.addEventListener("click", moveToSection));
}

function init() {
  renderTheme();
  renderMenu();
  renderScrollUI();
  startScrollAnimation();
  bindEvents();
  loadProjects();
}

init();
