"use strict";

// html css js에선 클래스를 적극적으로 활용하는 것 같다
// 그런데 그 클래스가 내가 평소에 알던 그 클래스와는 다른 것 같다

// 상수 영역
const GITHUB_USERNAME = "kimch0612"; // 내 깃허브 아이디
const THEME_KEY = "portfolio-theme"; // localStorage에 테마 값을 저장할 때 사용하는 key 값, value는 light 또는 dark
const SCROLL_TOP_POINT = 300; // 300px 이상 스크롤하면 맨 위로 이동 버튼을 보여주는 기준점
const HEADER_CHANGE_POINT = 60; // 60px 이상 스크롤하면 헤더 스타일을 바꾸는 기준점
const OBSERVER_THRESHOLD = 0.2; // 관찰 대상 요소가 화면에 약 20% 보였을 때 observer 콜백을 실행하는 기준값

/*
 * OBSERVER_THRESHOLD은 스크롤 등장 애니메이션의 시작 시점을 정하는 값이다.
 *
 * 0.2는 관찰 중인 .reveal 요소 자체가 화면에 약 20% 들어왔을 때
 * IntersectionObserver가 감지한다는 뜻이다.
 *
 * 감지되면 JS가 해당 요소에 is-visible 클래스를 추가하고,
 * CSS의 opacity/transform transition이 실행되면서 요소가 페이드인된다.
 *
 * 즉, 애니메이션의 속도와 움직임은 CSS가 담당하고,
 * OBSERVER_THRESHOLD는 애니메이션을 언제 시작할지 판단하는 기준만 담당한다.
 *
 * 흐름:
 * index.html의 section에 reveal 클래스가 있음
 * -> style.css의 .reveal이 요소를 투명하고 살짝 아래에 둠
 * -> IntersectionObserver가 .reveal 요소를 관찰함
 * -> 요소가 화면에 약 20% 보이면 is-visible 클래스 추가
 * -> .reveal.is-visible 스타일이 적용되어 사용자에게 자연스럽게 보임
 */

// HTML에서 필요한 DOM 요소를 선택해서 JS 변수에 저장하는 영역 (JS에서 컨트롤하기 위해 사용s), querySelector는 셀레니움의 find_element랑 비슷
const header = document.querySelector("#site-header"); // 스크롤 위치에 따라 헤더에 scrolled 클래스를 붙여 스타일을 바꿀 때 사용
const themeButton = document.querySelector("[data-theme-toggle]"); // 다크 모드/라이트 모드 전환 버튼, 클릭 시 changeTheme()과 연결
const menuButton = document.querySelector("[data-menu-toggle]"); // 모바일 햄버거 메뉴 버튼, 클릭 시 메뉴 열기/닫기 기능과 연결
const navMenu = document.querySelector("#nav-menu"); // 실제 네비게이션 메뉴 목록, 모바일에서 active 클래스로 보임/숨김 처리
const scrollLinks = document.querySelectorAll("[data-scroll-link]"); // 섹션 이동 링크들, 클릭 시 moveToSection()으로 부드러운 스크롤 실행
const scrollTopButton = document.querySelector("[data-scroll-top]"); // 맨 위로 이동하는 Top 버튼, 스크롤 위치에 따라 보이고 클릭 시 맨 위로 이동
const revealSections = document.querySelectorAll(".reveal"); // 스크롤 등장 애니메이션 대상 섹션들, IntersectionObserver가 관찰
const projectsStatus = document.querySelector("#projects-status"); // GitHub API 요청 상태 메시지 표시 영역, 로딩/에러/빈 상태/성공 메시지 출력
const projectsGrid = document.querySelector("#projects-grid"); // GitHub 저장소 카드들이 실제로 렌더링되는 프로젝트 목록 영역
const refreshButton = document.querySelector("[data-refresh-projects]"); // 프로젝트 목록을 다시 불러오는 Refresh 버튼, 클릭 시 loadProjects() 실행
const contactForm = document.querySelector("#contact-form"); // 문의 폼 전체 요소, input/submit 이벤트와 폼 검증 기능에 사용
const formSuccess = document.querySelector("#form-success"); // 폼 제출 성공 메시지를 표시하는 영역

const state = { // 현재 화면 정보를 저장하는 객체임
  theme: localStorage.getItem(THEME_KEY) || "light", // 로컬 스토리지에서 THEME_KEY를 가져오는데, 없으면 기본값으로 라이트 모드
  menuOpen: false, // 메뉴가 열렸는가 닫혔는가
  projectStatus: "idle", // 깃허브에서 레포 리스트를 불러오는 중인가? idle/loading/success/error/empty
  projects: [], // 깃허브 레포 데이터 (카드 목록)
  projectError: "", // 에러 메시지
  formErrors: { // 입력 폼의 에러 메시지 (비어있으면 오류 없음)
    name: "",
    email: "",
    message: "",
  },
};
// 사용자 행동 또는 API 결과 -> state 값 변경 -> render 함수 실행 -> DOM 변경 -> 화면 변화
// e.g. 버튼 클릭 -> state.theme 변경 -> renderTheme() -> html의 data-theme 변경 -> 화면 색상 변경

const escapeHTML = (value) => // 외부에서 받은 데이터를 그대로 innerHTML에 넣으면 보안 취약점이 발생할 수 있으니 관련 요소를 치환하자
  String(value ?? "") // 값이 null이나 undefined이면 빈 문자열로 바꾼다
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
    // SQL Injection 공격과 비슷한 원리인 듯?

const formatDate = (dateText) => // GitHub API에서 받은 날짜 문자열을 사람이 읽기 좋은 형식으로 바꾸자
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", // 숫자로 출력
    month: "short",  // 짧은 형식으로 출력 (근데 한국어는 크게 차이가 없다)
    day: "numeric",  // 숫자로 출력
  }).format(new Date(dateText));
  // "2026-06-30T12:34:56Z" -> 2026년 6월 30일

function renderTheme() { // state.theme에 저장된 테마 값을 실제 ui에 반영하는 함수
  document.documentElement.dataset.theme = state.theme; // <html> 태그의 data-theme 값을 state.theme으로 바꿔서 테마 적용
  themeButton.textContent = state.theme === "dark" ? "L" : "D"; // 모드 버튼에 출력할 글자를 선택하는 것 (테마의 값이 다크면 엘을, 아니면 디를 출력)
  themeButton.setAttribute(
    "aria-label",
    state.theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
}
// document -> 포트폴리오 전체 페이지
// documentElement -> 최상위 html 즉, <html> 태그
// dataset -> <html> 태그에 있는 data-* 속성들을 다루는 객체
// theme (document.documentElement.dataset.theme로 접근하는 것과 <html data-theme="light">로 접근하는 것은 같다. 이유는 잘 모르겠다..)
// -> HTML의 data-* 속성은 JS에서 dataset으로 접근할 수 있다. (<html data-theme="light"> -> document.documentElement.dataset.theme)

function changeTheme() { // 테마를 바꾸자
  state.theme = state.theme === "dark" ? "light" : "dark"; // 현재 테마의 값이 다크인가? 맞다면 라이트로 바꾸고 아니면 다크로 바꾸자
  localStorage.setItem(THEME_KEY, state.theme); // 그 값을 로컬 스토리지에 저장하자
  renderTheme(); // 진짜로 적용하자
}

function renderMenu() { // 모바일용 메뉴 렌더링 함수
  navMenu.classList.toggle("active", state.menuOpen); // state.menuOpen이 true라면 네비게이션 메뉴에 active 클래스를 붙이고, false이면 제거
  menuButton.classList.toggle("active", state.menuOpen); // 이건 메뉴가 열렸을 때 햄버거 메뉴 모양을 X 모양처럼 바꾸는데 사용함
  document.body.classList.toggle("nav-open", state.menuOpen);
  // 메뉴를 열었을 때 <body>에 nav-open를 붙임 -> 메뉴가 열린 동안 배경 스크롤이 안 되게 막기
  menuButton.setAttribute("aria-expanded", String(state.menuOpen));
  // 햄버거 메뉴의 aria-expanded 값을 menuOpen 값으로 설정 -> true(열림)/false(닫힘)
  menuButton.setAttribute("aria-label", state.menuOpen ? "메뉴 닫기" : "메뉴 열기");
  // 이건 접근성에서 볼 수 있는 스크린 리더가 참조하는 값임. 일단 내 포폴 사이트에선 과하지만, 언젠간 쓰지 않을까.
}

function changeMenu() {
  state.menuOpen = !state.menuOpen; // 메뉴 열림 여부를 뒤집어서 저장하자 (바꾸자)
  renderMenu(); // 실제로 적용하자
}

function moveToSection(event) { // 네비게이션 링크를 클릭했을 때 부드럽게 이동(스크롤) 해주는 함수
  const targetId = event.currentTarget.getAttribute("href"); // 클릭한 링크의 href 값을 가져오자
  const targetSection = document.querySelector(targetId); // href로 가져온 값이 들어있는 요소를 찾자
  // <a href="#about" data-scroll-link>About</a> -> <section id="about"> 

  if (!targetSection) { // 해당하는 요소가 없다면 종료
    return;
  }

  event.preventDefault(); // 브라우저의 기본 앵커 이동을 막자 (이걸 안 막으면 뚝 이동해버린다)
  targetSection.scrollIntoView({ behavior: "smooth", block: "start" }); // 부드럽게 스크롤을 하면서 이동하자
  // 스무스는 스무스하게 이동하라, 스타트는 해당 요소의 시작부분이 화면 맨 위에 오게

  state.menuOpen = false; // 모바일 메뉴가 열려있다면 닫자
  renderMenu(); // 닫은걸 적용하자
}

function renderScrollUI() { // 현재 스크롤 위치에 따라 헤더 스타일과 Top 버튼 표시 여부를 갱신하는 함수
  header.classList.toggle("scrolled", window.scrollY >= HEADER_CHANGE_POINT); // 60픽셀보다 크거나 같으면 헤더에 scrolled 클래스 붙이기 / 아니면 떼기
  scrollTopButton.classList.toggle("visible", window.scrollY >= SCROLL_TOP_POINT); // 300픽셀보다 더 크거나 같게 내려온 경우 위로 올라가기 버튼 출력
}

function makeProjectCard(repo) { // 깃허브 api로 받은 레포 데이터 하나를 카드 형식으로 변환하는 함수
/*   
{
  name: "Codyssey_Subject4_B4-1",
  description: "포트폴리오 프로젝트",
  html_url: "https://github.com/kimch0612/...",
  homepage: "https://kimch0612.github.io/...",
  language: "JavaScript",
  stargazers_count: 3,
  forks_count: 1,
  updated_at: "2026-06-30T12:34:56Z"
}
*/
  const { // 구조분해 할당 (매번 repo.name 이런 식으로 쓰기 불편하니 필요한 값만 꺼내는 것)
    name,
    description,
    html_url: htmlUrl, // html_url 필드를 htmlUrl로 꺼내온다
    homepage,
    language,
    stargazers_count: stars,
    forks_count: forks,
    updated_at: updatedAt,
  } = repo;

  const liveLink = homepage // 홈페이지 값이 있으면 라이브 링크를 만들고, 없다면 빈 문자열로 저장
    ? `<a href="${escapeHTML(homepage)}" target="_blank" rel="noreferrer">Live</a>`
    : "";

  return `
    <article class="project-card"> // 프로젝트 카드 하나를 article 태그로 만든다 (article이어야 할 이유는 뭘까? 다른건 뭐가 있을까?)
      <div>
        <h3>${escapeHTML(name)}</h3> // 저장소 이름을 제목으로 출력
        <p class="project-description">
          ${escapeHTML(description || "저장소 설명이 아직 작성되지 않았습니다.")} // 저장소 설명을 출력하는데, 만약 민 값이라면 기본 문자열 출력
        </p>
      </div>
      <ul class="project-meta">
        <li>${escapeHTML(language || "기타")}</li> // 해당 레포의 언어 출력
        <li>Stars ${Number(stars)}</li> // 숫자로 출력하는데, Number는 캐스팅 함수인 듯 (문자열인데 숫자로 캐스팅이 필요한 이유는 뭘까) -> 숫자로 오지만 혹시 모르니 캐스팅을 한번 더 하는 방어코드
        <li>Forks ${Number(forks)}</li>
      </ul>
      <p class="project-updated">최근 업데이트: ${escapeHTML(formatDate(updatedAt))}</p> // 마지막 커밋일자 출력
      <div class="project-links">
        <a href="${escapeHTML(htmlUrl)}" target="_blank" rel="noreferrer">GitHub</a> // 아까 위에서 만든 라이브 링크 출력 (_blank는 새 페이지에서 열기, noreferrer는 새 탭으로 이동할 때 현재 페이지의 정보를 줄여줌[왜 필요한지 모르겠다])
        ${liveLink}
      </div>
    </article>
  `;
}
// article을 쓴 이유는 저장소 카드 하나가 독립적으로 이해 가능한 콘텐츠 단위이기 때문이다
// GitHub 저장소 하나는 제목, 설명, 언어, 링크를 가진 독립된 항목이라 article이 잘 맞다

function renderProjects() { // 깃허브 프로젝트 영역을 다시 렌더링하는 함수 (새로고침 용인듯)
  projectsGrid.innerHTML = ""; // 기존 카드 리스트 초기화

  if (state.projectStatus === "loading") { // 현재 깃허브에서 레포를 불러오고 있는 중이라면
    projectsStatus.innerHTML = `
      <div class="status-box">
        <span class="spinner" aria-hidden="true"></span>
        <p>프로젝트를 불러오는 중입니다...</p> // 이거 띄우기
      </div>
    `;
    return;
  }

  if (state.projectStatus === "error") { // 오류났으면
    projectsStatus.innerHTML = `
      <div class="status-box">
        <p>${escapeHTML(state.projectError)}</p> // 오류 내용 출력하고
        <button class="button button-ghost" type="button" data-retry-projects>다시 시도</button> // 다시 시도 버튼 노출
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
    projectsGrid.innerHTML = state.projects.map(makeProjectCard).join(""); // 저장소 배열의 각 개체를 makeProjectCard를 돌려서 가공하고 이어붙인다
  }
}

async function loadProjects() {
  state.projectStatus = "loading"; // 현재 상태를 로딩중으로 바꾸자
  state.projects = [];
  state.projectError = "";
  renderProjects(); // 기존 값이 있었다면 초기화하고 다시 렌더링을 하자

  // 비동기 처리 공부 노트
  // fetch는 비동기라 await을 안 쓴다고 해서 브라우저의 반응이 멈추고 그러진 않는다
  // 대신 await를 쓰면 이 함수 내에서만, 응답이 올 때까지 멈춰있겠다는 뜻

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`); // Github API를 통해 내 레포를 불러오는데, 비동기로 요청한다

    if (!response.ok) {
      state.projectError =
        response.status === 403
          ? "GitHub API 호출 제한에 도달했습니다. 잠시 후 다시 시도해 주세요." // Github API에서 403 오류는 Quota 도달이므로 이걸 출력해주고
          : "프로젝트를 불러올 수 없습니다."; // 다른거라면 제너럴하게 처리하자
      throw new Error(state.projectError);
    }

    // await을 안 쓰면 해당 변수에 Promise라는 값이 들어감 (나중에 값을 주겠다는 뜻)
    // const repos = response.json(); 인 경우 repos = Promise가 됨
    // 그래서 sortedRepos처럼 json 데이터를 기대하는 다음 함수들이 깨질 수 있음
    // 즉, await을 쓴다는 건 "response.json()이 반환한 Promise가 끝날 때까지 이 async 함수 안에서만 기다렸다가 완료된 실제 JSON 데이터를 repos에 넣어라" 라는게 됨

    const repos = await response.json(); // 레포 데이터를 비동기로 json 파싱하고
    const sortedRepos = [...repos].sort( // repos 배열을 복사하는데, 정렬해서 복사함
      (firstRepo, secondRepo) => new Date(secondRepo.updated_at) - new Date(firstRepo.updated_at), // updated_at이 더 최신인 저장소가 앞으로 오게 됨
    );

    state.projects = sortedRepos; // 레포 데이터 배열을 갱신하고
    state.projectStatus = sortedRepos.length === 0 ? "empty" : "success"; // 레포 데이터 길이가 0이면 비어있는거, 아니면 들어있다고 판단하고 성공으로 판단
  } catch (error) { // try/except에서 except에 해당하는 영역
    state.projectStatus = "error"; // 프로젝트 현황을 에러로 설정하고
    state.projectError = state.projectError || error.message || "프로젝트를 불러올 수 없습니다."; // 띄우자
  }

  renderProjects(); // 현제 메모리의 값으로 렌더링을 다시 하자
}

function validateField(name, value) { // 폼 데이터가 유효한지 검사하자 (name에 들어올 데이터는 이메일, 이름, 내용 | value는 사용자가 실제 입력한 값)
  const trimmedValue = value.trim(); // 앞뒤 공백을 제거함

  if (!trimmedValue) { // 비어있다면
    return "필수 입력 항목입니다."; // 빈건 제출할 수 없다고 안내하자
  }

  if (name === "email") { // 이메일의 경우
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/*  공백이나 @가 아닌 글자들이 앞에 있고
    중간에 @가 하나 있고
    그 뒤에 공백이나 @가 아닌 글자들이 있고
    중간에 . 이 있고
    마지막에도 공백이나 @가 아닌 글자들이 있어야 한다 */
    return emailPattern.test(trimmedValue) ? "" : "올바른 이메일 형식을 입력해 주세요."; // 정규식 검사 결과 문제가 없다면 빈 문자열을 반환하고, 아닌 경우 안내메시지 반환
    // 정규식.test(검사할문자열) -> true or false 반환
  }

  return "";
}

function renderFieldError(name) { // name 필드 하나의 에러 상태를 화면에 반영하는 함수
  const field = contactForm.elements[name]; // 폼 안에서 name에 해당하는 입력 요소를 찾자
  const errorText = document.querySelector(`[data-error-for="${name}"]`); // 해당 필드의 에러 메시지를 표시할 <p> 요소를 찾자
  // e.g. "document.querySelector('[data-error-for="email"]');" -> <p class="error-message" data-error-for="email"></p>
  const message = state.formErrors[name]; // 상태 객체에서 해당 필드의 에러 메시지를 가져오자

  errorText.textContent = message; // 에러 메시지 영역에 실제 문구를 넣자
  // e.g. <p class="error-message" data-error-for="email">필수 입력 항목인디</p>

  if (message) { // message가 유효하면 (값이 있으면?)
    field.classList.add("is-invalid"); // 클래스 리스트에 is-invalid 클래스를 추가하고 (테두리를 빨간색으로 바꾸는 클래스)
    field.setAttribute("aria-invalid", "true"); // 해당 입력값이 유효하지 않다는 정보를 HTML 속성으로 표시하자 (스크린 리더와 같은 보조 기술이 이해할 수 있게 만듦)
  } else {
    field.classList.remove("is-invalid");
    field.setAttribute("aria-invalid", "false");
  }
}

// contactForm.addEventListener("input", changeField); 이 방식으로 연결되어 있음
function changeField(event) { // input 이벤트가 발생할 때마다 호출
  const { name, value } = event.target; // event.target은 실제로 입력이 발생한 요소 (emamil이라면 "<input id="email" name="email" type="email" ...>")
/*   
    const name = event.target.name;
    const value = event.target.value; 

  event = {
  type: "input",
  target: {
    name: "email",
    value: "test@example.com",
    // 실제로는 훨씬 많은 속성이 있음
  }
} 
*/
  if (!(name in state.formErrors)) { // 방어코드인가? email, name, message 외의 것이 들어왔는지 검사하는?? -> ㅇㅇ
    return;
  }

  state.formErrors[name] = validateField(name, value); // 폼 데이터가 유효한지 검사하자
  formSuccess.textContent = ""; // 기존의 성공 메시지(문의 내용이 정상적으로 확인되었습니다.)를 정리하기 위함
  renderFieldError(name); // 폼 오류를 렌더링하자
}

function checkForm() { // 폼 제출 시 전체 입력 필드를 한 번에 검사하고, 폼 전체가 유효한지 true/false로 반환하는 함수
  Object.keys(state.formErrors).forEach((name) => { // state.formErrors 객체의 key 목록을 배열로 꺼내서 배열의 각 값을 하나씩 돌면서 실행하는 반복문
    state.formErrors[name] = validateField(name, contactForm.elements[name].value); // 입력값이 유효한ㄱㅏ
    renderFieldError(name); // 확인 결과를 렌더링하자
  });

  return Object.values(state.formErrors).every((message) => message === ""); // 모든 에러 메시지가 빈 문자열인지 확인해서 true/false를 반환
  // 오브젝트의 값만 추출하고, 배열의 모든 값이 조건을 만족하나 확인하는데, 조건은 메시지가 ""인가? 이다
  // =는 대입 연산자, ==는 비교 연산자인데 느슨함 (타입이 다르면 자동으로 캐스팅), ===는 강력한 비교 연산자로 타입과 값 모두 같아야 true임
}

function submitForm(event) {
  event.preventDefault(); // 브라우저의 기본 form 제출 동작을 막자 (그냥 두면 다른 페이지로 이동하거나 페이지가 새로고침될 가능성이 있음)

  if (!checkForm()) { // 체크폼을 통과하지 못했다면
    formSuccess.textContent = ""; // 성공 메시지를 날리고
    return; // 돌아가
  }

  formSuccess.textContent = "문의 내용이 정상적으로 확인되었습니다."; // 위 조건을 통과했으면 성공했다고 띄우고
  contactForm.reset(); // 폼에 입력된 값을 리셋하자

  Object.keys(state.formErrors).forEach((name) => { // 오브젝트의 키값을 전부 돌면서
    state.formErrors[name] = ""; // 오류 메시지를 초기화하고
    renderFieldError(name); // 렌더링해서 적용하자
  });
}

function shouldRevealSection(entry) { // 모바일 ui에서 프로젝트 카드가 안 나타나던 문제를 해결하기 위해 추가한 함수
  const canReachThreshold = entry.target.offsetHeight * OBSERVER_THRESHOLD <= window.innerHeight;
  // 현재 관찰 중인 실제 요소의 전체 높이와 OBSERVER_THRESHOLD를 곱한 값이 현재 브라우저의 화면 높이보다 작거나 같은가?
  // 이 요소의 20% 높이가 현재 화면 높이보다 작거나 같은가?

  return entry.isIntersecting && (!canReachThreshold || entry.intersectionRatio >= OBSERVER_THRESHOLD);
  // entry.isIntersecting: 요소가 현재 화면과 조금이라도 겹치고 있는지 확인
  // !canReachThreshold: threshold 조건을 달성할 수 없는 긴 요소인지 확인
  // 20% 조건을 달성하기 어려우므로, 화면에 들어오기만 하면 is-visible 허용
}

function startScrollAnimation() { // 스크롤 애니메이션 시작 함수
    // IntersectionObserver는 특정 요소가 화면에 들어왔는지, 얼마나 보이는지 감지하는 브라우저 기능
  if (!("IntersectionObserver" in window)) { // 브라우저가 IntersectionObserver 기능을 지원하는가?
    revealSections.forEach((section) => section.classList.add("is-visible"));
    // 브라우저가 IntersectionObserver를 지원하지 않으면, 애니메이션 감지를 할 수 없으니까 모든 .reveal 요소를 그냥 보이게 한다
    return;
  }

  const observer = new IntersectionObserver( // 새 IntersectionObserver 객체를 만들자
    (entries) => {  // observer가 실행할 콜백 함수 (entries는 관찰 중인 모든 요소의 상태 정보 배열)
 /*        
[
  { target: aboutSection, isIntersecting: true, ... },
  { target: skillsSection, isIntersecting: false, ... }
] 
  */
      entries.forEach((entry) => { 
        if (entry.isIntersecting) { // 현재 객체가 화면과 교차 중인가? (ture면 화면에 들어와 있고, false면 화면 밖에 있거나 조건에 부합하지 않은 것)
          entry.target.classList.add("is-visible"); // 화면에 들어온 요소에 is-visible 클래스를 붙이고
          observer.unobserve(entry.target); // 관찰을 끈다
        }
      });
    },
    { threshold: OBSERVER_THRESHOLD }, // 대상 요소가 viewport와 약 20% 겹쳤는가?
  );

  revealSections.forEach((section) => observer.observe(section)); // .reveal 요소들을 하나씩 observer에게 관찰 대상으로 등록하는 코드 (근데 이게 왜 맨 밑에 있어야 하는지를 잘 모르겠음. 맨 위에 올라와 있어야 최초 실행 시 누락되는 케이스가 없는거 아닌가?)
/* 1. startScrollAnimation() 실행
2. IntersectionObserver 지원 여부 확인
3. observer 객체 생성
4. revealSections.forEach(...) 실행
5. 모든 .reveal 섹션을 observer 관찰 대상으로 등록
6. 함수 종료
7. 나중에 사용자가 스크롤함
8. 어떤 섹션이 화면에 들어옴
9. 그때 콜백 함수 실행
10. is-visible 추가
11. observer.unobserve(entry.target)로 그 섹션만 관찰 해제 */
// 즉, "revealSections.forEach((section) => observer.observe(section));" 함수가 매번 실행되는게 아니라 최초로 함수가 실행될 때 한 번 수행되고, 이후에는 observer 콜백 함수가 스크롤이 될 때마다 observe하는 것
}

function bindEvents() { // 특정 이벤트를 어떤 함수와 연결할건지 정의
  themeButton.addEventListener("click", changeTheme); // 다크모드 버튼에 클릭 이벤트를 연결
  menuButton.addEventListener("click", changeMenu); // 햄버거 메뉴에 클릭 이벤트 연결
  scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })); // 탑버튼에 클릭 이벤트를 연결 (부드럽게 페이지 최상단으로)
  refreshButton.addEventListener("click", loadProjects); // 프로젝트 섹션의 새로고침 버튼에 클릭 이벤트 연결
  contactForm.addEventListener("input", changeField); // 폼에 입력 이벤트 연결
  contactForm.addEventListener("submit", submitForm); // 폼에 제출 이벤트 연결
  window.addEventListener("scroll", renderScrollUI); // 브라우저 창 전체에 스크롤 이벤트 연결
  scrollLinks.forEach((link) => link.addEventListener("click", moveToSection)); // data-scroll-link가 붙은 모든 앵커 링크에 click 이벤트 추가
}

function init() { // script.js가 로드될 때 한꺼번에 기능을 초기화하는 함수
  renderTheme();
  renderMenu();
  renderScrollUI();
  startScrollAnimation();
  bindEvents();
  loadProjects();
}

init();
