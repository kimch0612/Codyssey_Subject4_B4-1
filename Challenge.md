충족해야 할 요소, 설명할 수 있어야 하는 개념 정리 노트
---------

### css 스타일링 (레이아웃&반응형)
- 외부 스타일시트 (css/style.css)를 사용한다
```
css/stye.css 있음
```
- 네비게이션: Flexbox 사용 (로고 왼쪽, 메뉴 오른쪽)
```text
// index.html에 아래와 같아 구성되어 있음
<nav class="navbar" aria-label="주요 메뉴">
  <a class="logo" href="#hero" data-scroll-link>Changhwan Kim</a>
  ...
  <ul class="nav-menu" id="nav-menu">

// css에선 .navbar에 Flexbox가 적용되어 있음
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 데스크톱 모드일 때도 Flexbox가 적용됨
.nav-menu {
  display: flex;
  align-items: center;
}

- 로고가 왼쪽에 배치되는 근거는 HTML 순서 + .navbar의 Flexbox 설정 때문이다
  - HTML에서 로고는 .navbar 안의 첫 번째 자식 요소로 작성되어 있으며, css의 "display: flex;" 때문에 요소가 왼쪽에서부터 한 줄 방향으로 배치한다.
  - "justify-content: space-between;" 때문에 첫번째 요소는 왼쪽, 마지막 요소는 오른쪽에 배치한다
  - 테마 버튼이 오른쪽에 붙는 이유는, nav-actions 클래스 안에 들어있기 때문이다
```
- Projects 카드: Grid 사용 (auto-fit, minmax로 반응형)
```
// css에서 Grid가 사용되고 있음
.projects-grid {
  display: grid;
  gap: var(--space-2);
}

// 그리고 auto-fit과 minmax도 사용됨
.projects-grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
```

### 반응형 디자인
- 버튼, 카드에 hover 효과와 transition이 적용되어 있는가?
```
.button {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.skill-card,
.project-card {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.button:hover,
.skill-card:hover,
.project-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-primary);
}

.button:hover,
.skill-card:hover,
.project-card:hover {
  box-shadow: var(--shadow);
}
```
- 카드에 box-shadow가 적용되어 ㅣㅇㅆ는가?
```
:root {
  --shadow: 0 14px 30px rgba(23, 32, 42, 0.1);
}
```

### JavaScript rlch (DOM & 이벤트)
- Javascript 파일을 defer 속성으로 연결햇는가?
```HTML
<script src="js/script.js" defer></script>
```
- var 대신 const, let만 사용했는가?
```
dd
```
- HTML에 onclick 속성을 사용하지 않고 addEventListner로 이벤트를 연결했는가?
```js
themeButton.addEventListener("click", changeTheme);
menuButton.addEventListener("click", changeMenu);
contactForm.addEventListener("submit", submitForm);
// 위와 같은 방식으로만 사용함
```
- DOM 조작을..
  - querySelector, querySelectorAll로 요소를 선택했는가?
  - textContent, innerHTML로 내용을 변경했는가?
  - classListAdd, remove, toggle로 클래스를 조작했는가?
```js
const header = document.querySelector("#site-header");
const scrollLinks = document.querySelectorAll("[data-scroll-link]");
const revealSections = document.querySelectorAll(".reveal");

themeButton.textContent = state.theme === "dark" ? "L" : "D";
projectsGrid.innerHTML = "";
projectsStatus.innerHTML = `...`;
projectsGrid.innerHTML = state.projects.map(makeProjectCard).join("");

navMenu.classList.toggle("active", state.menuOpen);
field.classList.add("is-invalid");
field.classList.remove("is-invalid");
```
- 이벤트 처리를..
  - click, submit, scroll, input 이벤트를 다뤘는가?
  - event.preventDefault()로 기본 동작을 방지했는가?
```js
themeButton.addEventListener("click", changeTheme);
contactForm.addEventListener("input", changeField);
contactForm.addEventListener("submit", submitForm);
window.addEventListener("scroll", renderScrollUI);

event.preventDefault();
```

### 인터랙션 구현
- 햄버거 메뉴 토글
  - 모바일에서 햄버거 버튼 클릭 시 메뉴가 나타난다.
  - 다시 클릭하면 메뉴가 사라진다.
  - classList.toggle('active') 활용
```js
menuButton.addEventListener("click", changeMenu);

navMenu.classList.toggle("active", state.menuOpen);
menuButton.classList.toggle("active", state.menuOpen);

.nav-menu.active {
  display: grid;
}
```
- 부드러운 스크롤
  - 네비게이션 메뉴 클릭 시 해당 섹션으로 부드럽게 이동한다.
```js
scrollLinks.forEach((link) => link.addEventListener("click", moveToSection));

event.preventDefault();
targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
```
- 스크롤 탑 버튼
  - 스크롤 300px 이상에서 버튼이 나타난다. (기준값은 자유 변경 가능하나 README에 명시)
  - 클릭 시 페이지 맨 위로 이동한다.
```js
const SCROLL_TOP_POINT = 300;
scrollTopButton.classList.toggle("visible", window.scrollY >= SCROLL_TOP_POINT);
.scroll-top.visible {
  opacity: 1;
  pointer-events: auto;
}
scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
```
- 네비게이션 스타일 변경
  - 스크롤 60px 이상에서 네비게이션 배경색이 변경된다. (기준값은 자유 변경 가능하나 README에 명시)
```js
const HEADER_CHANGE_POINT = 60;
header.classList.toggle("scrolled", window.scrollY >= HEADER_CHANGE_POINT);
.site-header.scrolled {
  background: var(--color-card);
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow);
}
```
- 다크 모드
  - 토글 버튼 클릭 시 테마가 전환된다.
  - 설정이 로컬스토리지에 저장되어 새로고침 후에도 유지된다.
```js
themeButton.addEventListener("click", changeTheme);

state.theme = state.theme === "dark" ? "light" : "dark";
localStorage.setItem(THEME_KEY, state.theme);
renderTheme();

theme: localStorage.getItem(THEME_KEY) || "light",
```
- 스크롤 애니메이션
  - Intersection Observer 임계값(threshold)은 0.2 이상을 권장한다. (자유 변경 가능하나 README에 명시)
```js
const OBSERVER_THRESHOLD = 0.2;
const observer = new IntersectionObserver(..., { threshold: OBSERVER_THRESHOLD });
revealSections.forEach((section) => observer.observe(section));

.reveal {
  opacity: 0;
  transform: translateY(28px);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 폼 UX
- Contact 섹션에 문의 폼이 존재한다. (이름, 이메일, 메시지)
```js
<form class="contact-form" id="contact-form" novalidate>
<input id="name" name="name" type="text" ... />
<input id="email" name="email" type="email" ... />
<textarea id="message" name="message" ...></textarea>
```
- 필수값 검증이 존재한다. (빈 필드 제출 불가)
```js
const trimmedValue = value.trim();

if (!trimmedValue) {
  return "필수 입력 항목입니다.";
}
```
- 이메일 형식 검증이 존재한다.
```js
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailPattern.test(trimmedValue) ? "" : "올바른 이메일 형식을 입력해 주세요.";
```
- 에러 메시지가 입력 필드 근처에 표시된다.
```js
<input id="email" name="email" ... />
<p class="error-message" id="email-error" data-error-for="email" aria-live="polite"></p>

const errorText = document.querySelector(`[data-error-for="${name}"]`);
errorText.textContent = message;
```
- 제출 시 event.preventDefault()로 기본 동작을 방지하고, 성공 메시지를 표시한다.
```js
contactForm.addEventListener("submit", submitForm);
event.preventDefault();
formSuccess.textContent = "문의 내용이 정상적으로 확인되었습니다.";
<p class="form-success" id="form-success" role="status" aria-live="polite"></p>
```

### ES6+ 문법 & 배열 메서드
- 화살표 함수를 적절히 활용한다.
```js
const escapeHTML = (value) => ...
const formatDate = (dateText) => ...

Object.keys(state.formErrors).forEach((name) => { ... });
scrollTopButton.addEventListener("click", () => window.scrollTo(...));
```
- 템플릿 리터럴로 HTML을 동적으로 생성한다.
```js
return `
  <article class="project-card">
    <h3>${escapeHTML(name)}</h3>
    ...
  </article>
`;
```
- 구조분해 할당으로 객체/배열에서 값을 추출한다.
```js
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

const { name, value } = event.target;
```
- 배열 메서드를 활용한다.
  - map: GitHub 데이터를 HTML 카드로 변환
  - filter: 특정 조건의 프로젝트만 표시 (선택)
  - forEach: 배열 순회
```js
projectsGrid.innerHTML = state.projects.map(makeProjectCard).join("");
Object.keys(state.formErrors).forEach((name) => { ... });
revealSections.forEach((section) => observer.observe(section));
scrollLinks.forEach((link) => link.addEventListener("click", moveToSection));
```

### 비동기 처리 & API 연동
- fetch와 async/await로 GitHub API를 호출한다.
  - 엔드포인트: https://api.github.com/users/{본인아이디}/repos
```js
async function loadProjects() {}
const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);

```
- 다음 상태가 UI로 표현되어야 한다.
  - 로딩 상태: 데이터 요청 중 스피너 또는 "로딩 중..." 텍스트
  - 성공 상태: 카드 리스트 렌더링
  - 에러 상태: "프로젝트를 불러올 수 없습니다" 메시지 + 재시도 버튼
  - 빈 상태: "표시할 프로젝트가 없습니다" 메시지
```js
state.projectStatus = "loading";
renderProjects();
<span class="spinner" aria-hidden="true"></span>
<p>프로젝트를 불러오는 중입니다...</p>

state.projects = sortedRepos;
state.projectStatus = sortedRepos.length === 0 ? "empty" : "success";
projectsGrid.innerHTML = state.projects.map(makeProjectCard).join("");
<div class="projects-grid" id="projects-grid" aria-live="polite"></div>

state.projectStatus = "error";
state.projectError = state.projectError || error.message || "프로젝트를 불러올 수 없습니다.";
<p>${escapeHTML(state.projectError)}</p>
<button class="button button-ghost" type="button" data-retry-projects>다시 시도</button>
document.querySelector("[data-retry-projects]").addEventListener("click", loadProjects);

state.projectStatus = sortedRepos.length === 0 ? "empty" : "success";
<p>표시할 프로젝트가 없습니다.</p>
```
- try/catch로 에러를 처리한다.
```js
try {
  const response = await fetch(...);
  ...
} catch (error) {
  state.projectStatus = "error";
  state.projectError = ...
}
```

### 상태 관리 패턴
- "사용자 이벤트 → 상태 변경 → 화면 업데이트" 흐름이 명확해야 한다.
```js
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
```
- 다음 3가지 이상의 "상태 → 렌더링" 흐름이 존재해야 한다.
  - 예시 1: 다크 모드 토글 → 테마 상태 변경 → 전체 화면 스타일 변경
  - 예시 2: API 호출 → 로딩/성공/에러 상태 변경 → Projects 섹션 렌더링 변경
  - 예시 3: 폼 입력 → 유효성 상태 변경 → 에러 메시지 표시/숨김
  - 예시 4: 필터 버튼 클릭 → 필터 상태 변경 → 프로젝트 목록 변경 (선택)
```js
themeButton.addEventListener("click", changeTheme);
state.theme = state.theme === "dark" ? "light" : "dark";
localStorage.setItem(THEME_KEY, state.theme);
document.documentElement.dataset.theme = state.theme;
themeButton.textContent = state.theme === "dark" ? "L" : "D";

refreshButton.addEventListener("click", loadProjects);
loadProjects();
state.projectStatus = "loading";
state.projects = [];
state.projectError = "";
state.projects = sortedRepos;
state.projectStatus = sortedRepos.length === 0 ? "empty" : "success";
renderProjects();

contactForm.addEventListener("input", changeField);
state.formErrors[name] = validateField(name, value);
renderFieldError(name);
```