# B4-1 학습 정리: 웹 기초 완성, 나만의 포트폴리오 구축

이 문서는 B4-1 과제를 공부하고 발표하기 위해 정리한 학습 노트입니다.

프론트엔드를 처음 공부하는 입장에서 중요한 목표는 화려한 UI를 만드는 것이 아닙니다. 이번 과제의 핵심은 브라우저 안에서 다음 흐름이 어떻게 이어지는지 이해하는 것입니다.

```text
사용자 이벤트 -> 상태 변경 -> DOM 업데이트 -> 화면 변화
```

백엔드에 익숙하다면 이렇게 생각하면 편합니다.

```text
백엔드 요청 처리 흐름:
Request -> Controller/Service -> 상태 또는 DB 변경 -> Response

프론트엔드 화면 처리 흐름:
Event -> JavaScript 함수 -> 상태 변경 -> DOM 렌더링
```

프론트엔드에서는 서버가 응답을 만들어 보내는 대신, 브라우저 안의 JavaScript가 현재 화면의 일부를 직접 바꿉니다.

## 1. 이번 과제에서 꼭 이해해야 할 큰 그림

이번 과제는 순수 HTML, CSS, JavaScript만 사용해서 포트폴리오 웹사이트를 만드는 과제입니다. React, Vue, jQuery, Bootstrap, Tailwind CSS 같은 도구는 사용하지 않습니다.

이유는 프레임워크가 해주는 일을 직접 경험하기 위해서입니다.

React를 배우면 `state`, `component`, `render`, `event handler` 같은 개념이 계속 나옵니다. 그런데 이 개념들은 완전히 새로운 것이 아니라, 이번 과제에서 직접 작성한 DOM 조작과 이벤트 처리 흐름을 더 편하게 추상화한 것입니다.

이번 프로젝트의 역할은 크게 세 파일로 나뉩니다.

```text
index.html      화면의 구조
css/style.css   화면의 모양과 반응형 레이아웃
js/script.js    사용자 이벤트, 상태 변경, API 호출, DOM 업데이트
```

백엔드 프로젝트에 비유하면 대략 이렇게 볼 수 있습니다.

```text
HTML        API 응답의 기본 스키마 또는 템플릿
CSS         화면에 적용되는 디자인 규칙
JavaScript  사용자 요청을 처리하는 로직
DOM         브라우저가 HTML을 해석해서 만든 메모리상의 화면 객체
```

중요한 점은 `index.html` 파일 그 자체와 브라우저 안의 DOM은 같지 않다는 것입니다. 브라우저는 HTML 파일을 읽어서 DOM 트리를 만들고, JavaScript는 이 DOM 트리를 수정합니다.

## 2. HTML: 화면의 의미 있는 구조 만들기

HTML은 화면에 무엇이 있는지를 표현합니다. 단순히 보이게 만드는 것이 아니라, 브라우저와 검색 엔진, 스크린 리더가 이해할 수 있는 의미 구조를 만드는 역할을 합니다.

이번 과제에서는 `div`만 쓰는 것이 아니라 시맨틱 태그를 사용해야 합니다.

주요 태그는 다음과 같습니다.

```html
<header>  페이지 상단 영역
<nav>     주요 이동 메뉴
<main>    페이지의 핵심 콘텐츠
<section> 의미 있는 콘텐츠 구역
<article> 독립적으로 이해 가능한 카드나 글
<footer>  페이지 하단 정보
```

현재 프로젝트에서는 다음처럼 구성되어 있습니다.

```text
header
  nav

main
  section#hero
  section#about
  section#skills
  section#projects
  section#contact

footer
```

이 구조를 설명할 때는 이렇게 말할 수 있습니다.

> 페이지 전체를 큰 의미 단위로 나누기 위해 header, main, section, footer를 사용했습니다. 반복되는 카드 단위는 article로 표현해서 각각 독립적인 콘텐츠임을 드러냈습니다.

## 3. 앵커 링크와 섹션 이동

네비게이션 메뉴는 각 섹션으로 이동하는 링크입니다.

```html
<a href="#about">About</a>
```

`href="#about"`은 같은 페이지 안에서 `id="about"`을 가진 요소로 이동하라는 뜻입니다.

```html
<section id="about">
```

백엔드 라우팅과 비교하면, 서버의 `/users` 같은 URL 경로가 아니라 현재 문서 안의 특정 위치로 이동하는 내부 링크입니다.

이번 프로젝트에서는 기본 앵커 이동을 그대로 쓰지 않고 JavaScript에서 `scrollIntoView()`를 사용해 부드러운 스크롤을 구현했습니다.

## 4. 이미지의 alt 속성

이미지에는 `alt` 속성이 필요합니다.

```html
<img src="images/profile.svg" alt="Changhwan Kim 포트폴리오 프로필 일러스트" />
```

`alt`는 이미지가 안 보일 때의 대체 텍스트이면서, 스크린 리더가 읽는 설명입니다.

설명할 때는 이렇게 말하면 됩니다.

> 이미지는 단순 장식이 아니라 프로필 이미지를 전달하는 콘텐츠이므로 의미 있는 alt를 작성했습니다.

만약 완전한 장식 이미지라면 빈 alt를 쓰기도 합니다.

```html
<img src="decoration.svg" alt="" />
```

하지만 이번 과제에서는 프로필 이미지이므로 빈 값보다 의미 있는 설명이 적절합니다.

## 5. form과 label 연결

폼 입력 요소는 반드시 `label`과 연결하는 것이 좋습니다.

```html
<label for="email">이메일</label>
<input id="email" name="email" type="email" />
```

`label`의 `for` 값과 `input`의 `id` 값이 같아야 연결됩니다.

이 연결이 중요한 이유는 다음과 같습니다.

- 사용자가 label 텍스트를 클릭해도 input에 포커스가 갑니다.
- 스크린 리더가 input의 의미를 읽을 수 있습니다.
- JavaScript에서 `contactForm.elements.email`처럼 name 기준으로 접근하기 쉽습니다.

백엔드에서 폼 데이터를 받을 때 필드명이 중요한 것처럼, 프론트에서도 `id`, `name`, `label`의 연결이 중요합니다.

## 6. CSS: 화면을 어떻게 배치하고 꾸밀지 정하기

CSS는 HTML 구조를 어떻게 보여줄지 결정합니다.

처음 CSS를 볼 때는 다음 순서로 읽으면 좋습니다.

```text
1. 전역 변수와 기본 스타일
2. 큰 레이아웃
3. 컴포넌트 스타일
4. 상태 클래스
5. 반응형 미디어 쿼리
```

현재 프로젝트의 CSS도 이 흐름에 가깝게 구성되어 있습니다.

## 7. CSS 변수

CSS 변수는 반복해서 쓰는 값을 이름으로 저장하는 기능입니다.

```css
:root {
  --color-bg: #f7f8fb;
  --color-text: #17202a;
  --space-2: 1rem;
}
```

사용할 때는 `var()`를 씁니다.

```css
body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

백엔드의 설정값이나 상수와 비슷합니다.

```js
const PAGE_SIZE = 20;
```

색상, 간격, 그림자 값을 CSS 변수로 빼두면 나중에 전체 디자인을 한 곳에서 바꾸기 쉽습니다.

## 8. 다크 모드 CSS 구조

이번 프로젝트의 다크 모드는 CSS 변수 값을 바꾸는 방식입니다.

```css
:root {
  --color-bg: #f7f8fb;
  --color-text: #17202a;
}

[data-theme="dark"] {
  --color-bg: #111418;
  --color-text: #f4f7f8;
}
```

HTML이 이런 상태이면 라이트 모드입니다.

```html
<html data-theme="light">
```

이렇게 바뀌면 다크 모드입니다.

```html
<html data-theme="dark">
```

JavaScript는 버튼을 눌렀을 때 `data-theme` 값을 바꿉니다. 그러면 CSS 변수가 바뀌고, 변수에 의존하는 모든 스타일이 같이 바뀝니다.

설명할 때는 이렇게 말할 수 있습니다.

> 다크 모드는 각 요소의 색을 하나하나 바꾸는 방식이 아니라, 루트의 테마 속성을 바꾸고 CSS 변수 값이 자동으로 바뀌게 만들었습니다.

## 9. 박스 모델

CSS에서 모든 요소는 사각형 박스입니다.

기본 구성은 다음과 같습니다.

```text
content -> padding -> border -> margin
```

- content: 실제 글자나 이미지가 들어가는 영역
- padding: content와 border 사이의 안쪽 여백
- border: 테두리
- margin: 다른 요소와의 바깥 여백

현재 CSS에는 다음 설정이 있습니다.

```css
* {
  box-sizing: border-box;
}
```

이 설정을 하면 `width` 계산에 padding과 border가 포함됩니다. 초보 입장에서는 레이아웃 계산이 훨씬 직관적입니다.

## 10. Flexbox: 한 줄 방향 배치

Flexbox는 주로 한 방향 배치에 강합니다.

이번 과제에서는 네비게이션에 Flexbox를 사용합니다.

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

의미는 다음과 같습니다.

- `display: flex`: 자식 요소들을 가로 또는 세로 방향으로 배치
- `align-items: center`: 교차축 가운데 정렬
- `justify-content: space-between`: 양 끝에 벌려 배치

네비게이션처럼 "로고는 왼쪽, 메뉴는 오른쪽" 구조는 Flexbox가 잘 맞습니다.

설명할 때는 이렇게 말할 수 있습니다.

> 네비게이션은 한 줄 안에서 로고, 메뉴, 버튼을 정렬하는 구조라 Flexbox를 사용했습니다.

## 11. Grid: 여러 카드의 2차원 배치

Grid는 행과 열을 함께 다루는 배치에 강합니다.

이번 과제에서는 Projects 카드에 Grid를 사용합니다.

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-2);
}
```

여기서 중요한 부분은 이 코드입니다.

```css
repeat(auto-fit, minmax(260px, 1fr))
```

의미는 다음과 같습니다.

- 각 카드는 최소 `260px`
- 공간이 남으면 `1fr` 비율로 늘어남
- 화면이 넓으면 여러 열
- 화면이 좁으면 자동으로 한 열

즉 카드 개수나 화면 크기에 따라 레이아웃이 자동으로 바뀝니다.

설명할 때는 이렇게 말할 수 있습니다.

> Projects는 카드 목록이라 여러 행과 열이 필요했습니다. 그래서 Grid를 사용했고, auto-fit과 minmax로 화면 너비에 따라 카드 열 수가 자동 조절되도록 했습니다.

## 12. 반응형 디자인과 모바일 퍼스트

반응형 디자인은 화면 크기에 따라 레이아웃이 바뀌는 방식입니다.

이번 과제의 브레이크포인트는 다음입니다.

```css
@media (min-width: 768px) {
  /* 태블릿 이상 */
}

@media (min-width: 1024px) {
  /* 데스크톱 이상 */
}
```

모바일 퍼스트란 기본 CSS를 모바일 기준으로 작성하고, 화면이 넓어질 때 스타일을 추가하는 방식입니다.

```text
기본 스타일: 모바일
768px 이상: 태블릿용 보정
1024px 이상: 데스크톱용 보정
```

이 방식이 좋은 이유는 모바일 화면이 가장 좁아서 제약이 크기 때문입니다. 좁은 화면에서 먼저 안정적으로 만든 뒤 넓은 화면으로 확장하는 편이 쉽습니다.

이번 프로젝트에서는 모바일에서 메뉴를 숨기고 햄버거 버튼을 보여줍니다.

```css
.nav-menu {
  display: none;
}

.hamburger {
  display: inline-grid;
}
```

768px 이상에서는 햄버거 버튼을 숨기고 메뉴를 보여줍니다.

```css
@media (min-width: 768px) {
  .hamburger {
    display: none;
  }

  .nav-menu {
    display: flex;
  }
}
```

## 13. transition, hover, box-shadow

과제에서는 버튼과 카드에 hover 효과와 transition을 적용해야 합니다.

```css
.button {
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.button:hover {
  transform: translateY(-3px);
}
```

`transition`은 값이 갑자기 바뀌지 않고 부드럽게 바뀌게 합니다.

`box-shadow`는 카드가 배경에서 살짝 떠 있는 것처럼 보이게 만듭니다.

```css
box-shadow: var(--shadow);
```

이런 시각 효과는 기능의 본질은 아니지만, 사용자가 버튼과 카드를 상호작용 가능한 요소로 인식하는 데 도움을 줍니다.

## 14. JavaScript: 화면에 동작을 붙이기

HTML과 CSS만 있으면 정적인 화면입니다. JavaScript는 사용자 행동에 반응해서 화면을 바꿉니다.

이번 과제에서 JavaScript가 하는 일은 다음과 같습니다.

- 다크 모드 상태 변경
- 모바일 메뉴 열기/닫기
- 네비게이션 부드러운 스크롤
- 스크롤 위치에 따른 헤더와 Top 버튼 변경
- GitHub API 호출
- Projects 섹션 로딩/성공/에러/빈 상태 렌더링
- Contact 폼 유효성 검사
- Intersection Observer 스크롤 애니메이션

## 15. defer로 JavaScript 연결하기

HTML에서 JavaScript는 이렇게 연결합니다.

```html
<script src="js/script.js" defer></script>
```

`defer`를 쓰면 HTML 파싱을 막지 않고 JavaScript 파일을 내려받습니다. 그리고 HTML 문서가 준비된 뒤 실행됩니다.

만약 `defer`가 없고 script가 head에서 바로 실행되면, 아직 DOM 요소가 만들어지기 전에 JavaScript가 `querySelector`를 실행할 수 있습니다. 그러면 요소를 찾지 못해서 `null`이 나올 수 있습니다.

설명할 때는 이렇게 말하면 됩니다.

> JavaScript가 DOM 요소를 안전하게 찾을 수 있도록 script에 defer를 사용했습니다.

## 16. DOM 선택: querySelector와 querySelectorAll

JavaScript에서 HTML 요소를 조작하려면 먼저 요소를 선택해야 합니다.

```js
const themeButton = document.querySelector("[data-theme-toggle]");
const scrollLinks = document.querySelectorAll("[data-scroll-link]");
```

- `querySelector`: 조건에 맞는 첫 번째 요소 하나
- `querySelectorAll`: 조건에 맞는 모든 요소 목록

CSS 선택자와 같은 문법을 사용합니다.

```js
document.querySelector("#site-header")
document.querySelector(".nav-menu")
document.querySelector("[data-theme-toggle]")
```

이번 프로젝트는 JS가 찾기 쉬운 요소에 `data-*` 속성을 사용합니다.

```html
<button data-theme-toggle>
```

`class`는 스타일에도 쓰이기 때문에, JavaScript용 식별자는 `data-*`로 분리하면 읽기 쉽습니다.

## 17. 이벤트 연결: addEventListener

과제에서는 HTML에 `onclick`을 쓰지 말고 `addEventListener`를 사용해야 합니다.

좋지 않은 방식:

```html
<button onclick="changeTheme()">Toggle</button>
```

권장 방식:

```js
themeButton.addEventListener("click", changeTheme);
```

이 방식이 좋은 이유는 HTML은 구조, JavaScript는 동작으로 역할이 분리되기 때문입니다.

이번 프로젝트의 이벤트 연결은 `bindEvents()` 함수에 모여 있습니다.

```js
function bindEvents() {
  themeButton.addEventListener("click", changeTheme);
  menuButton.addEventListener("click", changeMenu);
  contactForm.addEventListener("input", changeField);
  contactForm.addEventListener("submit", submitForm);
  window.addEventListener("scroll", renderScrollUI);
}
```

설명할 때는 이렇게 말할 수 있습니다.

> 이벤트 연결을 bindEvents 함수에 모아 두어서 어떤 사용자 행동을 처리하는지 한눈에 볼 수 있게 했습니다.

## 18. 상태란 무엇인가

프론트엔드에서 상태는 "현재 화면을 결정하는 값"입니다.

현재 프로젝트의 상태 객체는 다음과 같은 정보를 가집니다.

```js
const state = {
  theme: "light",
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

각 값은 화면에 영향을 줍니다.

```text
theme          light/dark에 따라 색상 변경
menuOpen       모바일 메뉴 표시 여부
projectStatus  Projects 섹션의 로딩/성공/에러/빈 상태
projects       GitHub 저장소 카드 목록
projectError   에러 메시지
formErrors     입력 필드 근처의 에러 메시지
```

백엔드의 DB 상태와는 다릅니다. 프론트엔드 상태는 보통 브라우저 메모리에 있는 현재 화면용 데이터입니다.

## 19. 렌더링이란 무엇인가

렌더링은 상태를 화면에 반영하는 일입니다.

예를 들어 다크 모드 상태가 바뀌면 화면도 바뀌어야 합니다.

```js
function renderTheme() {
  document.documentElement.dataset.theme = state.theme;
  themeButton.textContent = state.theme === "dark" ? "L" : "D";
}
```

여기서 흐름은 다음과 같습니다.

```text
사용자가 다크 모드 버튼 클릭
-> changeTheme 실행
-> state.theme 변경
-> renderTheme 실행
-> html data-theme 변경
-> CSS 변수 변경
-> 화면 색상 변경
```

이게 이번 과제의 핵심입니다.

## 20. classList로 클래스 조작하기

CSS 클래스는 화면 상태를 표현하는 데 자주 사용됩니다.

```js
navMenu.classList.toggle("active", state.menuOpen);
```

`state.menuOpen`이 `true`이면 `active` 클래스가 붙고, `false`이면 제거됩니다.

CSS는 `active` 클래스가 있을 때 메뉴를 보여줍니다.

```css
.nav-menu {
  display: none;
}

.nav-menu.active {
  display: grid;
}
```

이 흐름도 상태 기반 렌더링입니다.

```text
menuOpen 상태 변경 -> active 클래스 변경 -> CSS display 변경 -> 메뉴 열림/닫힘
```

## 21. textContent와 innerHTML

DOM 내용을 바꿀 때 자주 쓰는 속성입니다.

```js
element.textContent = "문자열";
```

`textContent`는 텍스트만 넣을 때 사용합니다. HTML 태그를 해석하지 않습니다.

```js
projectsGrid.innerHTML = state.projects.map(makeProjectCard).join("");
```

`innerHTML`은 문자열 안의 HTML 태그를 실제 DOM으로 해석합니다. 이번 프로젝트에서는 GitHub 저장소 카드 목록을 동적으로 만들 때 사용합니다.

주의할 점이 있습니다. 외부 API에서 받은 문자열을 그대로 `innerHTML`에 넣으면 XSS 위험이 있습니다. 그래서 프로젝트에서는 `escapeHTML()`로 문자열을 이스케이프합니다.

```js
const escapeHTML = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
```

백엔드에서 사용자 입력을 그대로 HTML에 넣으면 위험한 것과 같은 문제입니다.

## 22. 다크 모드와 localStorage

다크 모드 설정은 새로고침 후에도 유지되어야 합니다.

브라우저에는 간단한 key-value 저장소인 `localStorage`가 있습니다.

```js
localStorage.setItem(THEME_KEY, state.theme);
localStorage.getItem(THEME_KEY);
```

흐름은 다음과 같습니다.

```text
페이지 처음 로드
-> localStorage에서 저장된 theme 읽기
-> state.theme 초기화
-> renderTheme으로 화면 반영

버튼 클릭
-> state.theme 변경
-> localStorage에 저장
-> renderTheme으로 화면 반영
```

`localStorage`는 서버 DB가 아닙니다. 사용자의 브라우저에 저장되는 값입니다.

## 23. 스크롤 이벤트

스크롤 이벤트는 사용자가 페이지를 위아래로 움직일 때 발생합니다.

```js
window.addEventListener("scroll", renderScrollUI);
```

현재 프로젝트에서는 스크롤 위치에 따라 두 가지를 바꿉니다.

```js
header.classList.toggle("scrolled", window.scrollY >= HEADER_CHANGE_POINT);
scrollTopButton.classList.toggle("visible", window.scrollY >= SCROLL_TOP_POINT);
```

기준값은 다음입니다.

```text
헤더 스타일 변경: 60px
스크롤 탑 버튼 표시: 300px
```

즉 사용자가 60px 이상 내리면 헤더 배경이 바뀌고, 300px 이상 내리면 Top 버튼이 나타납니다.

## 24. 부드러운 스크롤

네비게이션 링크를 클릭하면 해당 섹션으로 이동합니다.

```js
targetSection.scrollIntoView({
  behavior: "smooth",
  block: "start",
});
```

기본 앵커 이동은 즉시 이동하지만, `scrollIntoView`에 `behavior: "smooth"`를 주면 부드럽게 이동합니다.

`event.preventDefault()`는 브라우저의 기본 앵커 이동을 막기 위해 사용합니다.

```js
event.preventDefault();
```

흐름은 다음과 같습니다.

```text
메뉴 링크 클릭
-> 기본 이동 막기
-> href에서 target id 읽기
-> 해당 section 찾기
-> scrollIntoView로 부드럽게 이동
-> 모바일 메뉴 닫기
```

## 25. Intersection Observer와 스크롤 애니메이션

Intersection Observer는 어떤 요소가 화면에 들어왔는지 감지하는 브라우저 API입니다.

```js
const observer = new IntersectionObserver(callback, {
  threshold: 0.2,
});
```

`threshold: 0.2`는 요소의 20% 정도가 화면에 들어왔을 때 감지하겠다는 뜻입니다.

현재 프로젝트에서는 `.reveal` 클래스를 가진 섹션을 관찰합니다.

```js
revealSections.forEach((section) => observer.observe(section));
```

화면에 들어오면 `is-visible` 클래스를 붙입니다.

```js
entry.target.classList.add("is-visible");
```

CSS는 다음처럼 처리합니다.

```css
.reveal {
  opacity: 0;
  transform: translateY(28px);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

흐름은 다음과 같습니다.

```text
section이 화면에 들어옴
-> Intersection Observer 감지
-> is-visible 클래스 추가
-> CSS transition 실행
-> 섹션이 자연스럽게 나타남
```

## 26. GitHub API와 fetch

이번 과제에서는 GitHub API에서 저장소 목록을 가져옵니다.

```js
const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
```

`fetch`는 HTTP 요청을 보내는 브라우저 API입니다.

백엔드에서 외부 API를 호출하는 것과 비슷합니다.

```text
백엔드:
HTTP client -> 외부 API 호출 -> JSON 파싱 -> 응답 생성

프론트:
fetch -> GitHub API 호출 -> JSON 파싱 -> DOM 렌더링
```

## 27. async/await

API 호출은 시간이 걸립니다. 그래서 비동기 처리가 필요합니다.

```js
async function loadProjects() {
  const response = await fetch(url);
  const repos = await response.json();
}
```

`async` 함수 안에서 `await`를 쓰면 Promise가 끝날 때까지 기다린 뒤 다음 줄로 넘어갑니다.

중요한 점은 기다리는 동안 브라우저 전체가 멈추는 것이 아니라는 점입니다. JavaScript 이벤트 루프가 비동기 작업 완료를 기다리다가 완료되면 이어서 실행합니다.

## 28. API 상태 관리: loading, success, error, empty

외부 API를 쓸 때는 성공만 생각하면 안 됩니다.

이번 과제에서 처리해야 하는 상태는 네 가지입니다.

```text
loading  요청 중
success  성공해서 데이터 있음
error    요청 실패
empty    성공했지만 표시할 데이터 없음
```

현재 프로젝트는 `state.projectStatus`로 이 상태를 표현합니다.

```js
state.projectStatus = "loading";
state.projectStatus = "success";
state.projectStatus = "error";
state.projectStatus = "empty";
```

그리고 `renderProjects()`가 상태에 맞게 화면을 바꿉니다.

```text
loading -> 스피너와 "불러오는 중" 표시
success -> 프로젝트 카드 목록 표시
error   -> 에러 메시지와 다시 시도 버튼 표시
empty   -> "표시할 프로젝트가 없습니다" 표시
```

이 구조는 실무에서도 매우 중요합니다. API를 쓰는 화면은 항상 로딩, 에러, 빈 상태를 고려해야 합니다.

## 29. try/catch와 에러 처리

API 요청은 실패할 수 있습니다.

```js
try {
  const response = await fetch(url);
} catch (error) {
  state.projectStatus = "error";
}
```

또한 HTTP 응답이 왔다고 항상 성공은 아닙니다.

```js
if (!response.ok) {
  throw new Error("프로젝트를 불러올 수 없습니다.");
}
```

GitHub API는 인증 없이 호출하면 시간당 60회 제한이 있습니다. 제한에 걸리면 보통 `403` 응답이 올 수 있습니다.

프로젝트에서는 403일 때 별도 메시지를 보여줍니다.

```js
response.status === 403
  ? "GitHub API 호출 제한에 도달했습니다. 잠시 후 다시 시도해 주세요."
  : "프로젝트를 불러올 수 없습니다.";
```

## 30. map과 템플릿 리터럴

GitHub API에서 받은 저장소 배열을 카드 HTML로 바꾸기 위해 `map()`을 사용합니다.

```js
projectsGrid.innerHTML = state.projects.map(makeProjectCard).join("");
```

흐름은 다음과 같습니다.

```text
저장소 배열
-> map으로 각 저장소를 HTML 문자열 카드로 변환
-> join으로 하나의 문자열로 합침
-> innerHTML로 DOM에 삽입
```

템플릿 리터럴은 백틱을 사용하는 문자열입니다.

```js
return `
  <article class="project-card">
    <h3>${escapeHTML(name)}</h3>
  </article>
`;
```

`${}` 안에 변수를 넣을 수 있어서 HTML 문자열을 만들 때 편합니다.

## 31. 구조분해 할당

구조분해 할당은 객체에서 필요한 값을 꺼내는 문법입니다.

```js
const {
  name,
  description,
  html_url: htmlUrl,
  language,
} = repo;
```

`html_url: htmlUrl`은 API 응답의 `html_url` 값을 JavaScript 변수 `htmlUrl`로 이름을 바꿔서 받는 문법입니다.

이 문법을 쓰면 매번 `repo.name`, `repo.description`처럼 쓰지 않아도 됩니다.

## 32. forEach

`forEach()`는 배열을 순회하면서 작업을 실행합니다.

```js
scrollLinks.forEach((link) => link.addEventListener("click", moveToSection));
```

의미는 다음과 같습니다.

```text
모든 네비게이션 링크를 하나씩 돌면서
각 링크에 click 이벤트를 연결한다
```

폼 에러 초기화나 Intersection Observer 등록에도 사용됩니다.

## 33. Contact 폼 유효성 검사

폼 검증은 사용자가 입력한 값이 조건에 맞는지 확인하는 과정입니다.

이번 과제에서는 다음을 검증합니다.

```text
이름: 비어 있으면 안 됨
이메일: 비어 있으면 안 됨, 이메일 형식이어야 함
메시지: 비어 있으면 안 됨
```

필드 하나를 검사하는 함수는 `validateField()`입니다.

```js
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
```

이 함수는 에러가 있으면 메시지를 반환하고, 문제가 없으면 빈 문자열을 반환합니다.

## 34. input 이벤트와 submit 이벤트

폼에서는 두 이벤트가 중요합니다.

```js
contactForm.addEventListener("input", changeField);
contactForm.addEventListener("submit", submitForm);
```

`input` 이벤트는 사용자가 입력할 때마다 발생합니다. 그래서 입력 중에도 에러 메시지를 갱신할 수 있습니다.

`submit` 이벤트는 Send 버튼을 눌러 폼을 제출하려 할 때 발생합니다.

기본 form 제출은 페이지 이동이나 새로고침을 만들 수 있으므로 막습니다.

```js
event.preventDefault();
```

현재 프로젝트는 실제 이메일 전송을 하지 않습니다. 과제의 필수 요구사항은 브라우저에서 검증하고 성공 메시지를 표시하는 것입니다.

## 35. 상태 기반 폼 렌더링

폼 에러도 상태입니다.

```js
formErrors: {
  name: "",
  email: "",
  message: "",
}
```

입력값이 잘못되면 해당 필드의 에러 메시지가 바뀝니다.

```js
state.formErrors[name] = validateField(name, value);
renderFieldError(name);
```

그리고 `renderFieldError()`가 화면을 바꿉니다.

```js
errorText.textContent = message;
field.classList.add("is-invalid");
```

흐름은 다음과 같습니다.

```text
사용자가 email 입력
-> input 이벤트 발생
-> validateField 실행
-> state.formErrors.email 변경
-> renderFieldError 실행
-> 이메일 입력칸 근처 에러 메시지 표시/숨김
```

## 36. 이번 과제에서 설명할 수 있어야 하는 세 가지 상태 흐름

과제 요구사항의 핵심은 상태 흐름을 설명하는 것입니다.

### 흐름 1: 다크 모드

```text
다크 모드 버튼 클릭
-> changeTheme()
-> state.theme 변경
-> localStorage 저장
-> renderTheme()
-> html의 data-theme 변경
-> CSS 변수 변경
-> 전체 색상 변경
```

발표 문장:

> 다크 모드는 버튼 클릭 이벤트로 theme 상태를 바꾸고, renderTheme 함수에서 html의 data-theme 속성을 바꿔 CSS 변수가 전환되도록 구현했습니다. 또한 localStorage에 저장해서 새로고침 후에도 유지됩니다.

### 흐름 2: GitHub API

```text
페이지 로드
-> loadProjects()
-> projectStatus = loading
-> renderProjects()
-> 로딩 UI 표시
-> fetch로 GitHub API 요청
-> 성공하면 projects 배열 저장
-> projectStatus = success
-> renderProjects()
-> 카드 목록 표시
```

에러일 때:

```text
fetch 실패 또는 response.ok false
-> projectStatus = error
-> projectError 저장
-> renderProjects()
-> 에러 메시지와 다시 시도 버튼 표시
```

발표 문장:

> Projects 섹션은 API 요청 상태를 loading, success, error, empty로 나누고, 상태에 따라 renderProjects 함수가 다른 UI를 보여주도록 만들었습니다.

### 흐름 3: 폼 검증

```text
사용자 입력
-> input 이벤트
-> validateField()
-> formErrors 상태 변경
-> renderFieldError()
-> 필드 근처 에러 메시지 표시/숨김
```

제출할 때:

```text
Send 클릭
-> submit 이벤트
-> preventDefault()
-> 전체 필드 검사
-> 에러 있으면 메시지 표시
-> 에러 없으면 성공 메시지 표시
```

발표 문장:

> Contact 폼은 input 이벤트와 submit 이벤트를 나눠 처리했습니다. 입력 중에는 개별 필드 에러를 갱신하고, 제출 시에는 전체 필드를 검사한 뒤 성공 메시지를 보여줍니다.

## 37. 프론트엔드에서 헷갈리기 쉬운 포인트

### HTML 파일과 DOM은 다르다

HTML 파일은 초기 구조입니다. DOM은 브라우저가 HTML을 해석해서 만든 객체 트리입니다.

JavaScript가 바꾸는 것은 파일 자체가 아니라 브라우저 안의 DOM입니다.

### CSS는 위에서 아래로만 단순 적용되지 않는다

CSS는 다음 규칙들이 함께 작동합니다.

- 선택자 우선순위
- 나중에 선언된 규칙
- 상속
- 미디어 쿼리
- 상태 클래스

그래서 CSS를 디버깅할 때는 Chrome DevTools의 Styles 패널을 보는 것이 좋습니다.

### 이벤트는 함수 호출 예약에 가깝다

```js
button.addEventListener("click", changeTheme);
```

이 코드는 지금 당장 `changeTheme`을 실행하는 것이 아닙니다. 클릭이 발생하면 실행하라고 등록하는 것입니다.

잘못된 예:

```js
button.addEventListener("click", changeTheme());
```

이렇게 쓰면 클릭 전에 함수가 즉시 실행됩니다.

### API 성공만 생각하면 안 된다

프론트엔드 화면에서는 API 요청 중에도 사용자가 보고 있는 화면이 필요합니다.

그래서 항상 다음 상태를 생각해야 합니다.

```text
요청 전
요청 중
성공
실패
빈 데이터
```

### localStorage는 사용자별 브라우저 저장소다

`localStorage`는 서버 DB가 아닙니다. 같은 사이트라도 다른 브라우저나 다른 기기에서는 값이 공유되지 않습니다.

## 38. Chrome DevTools로 확인할 것

프론트엔드 공부를 할 때는 DevTools를 자주 써야 합니다.

### Elements 탭

확인할 것:

- HTML 구조가 어떻게 잡혔는지
- 클래스가 붙고 빠지는지
- `data-theme` 값이 바뀌는지
- `.active`, `.visible`, `.is-visible` 클래스가 붙는지

### Console 탭

확인할 것:

- JavaScript 에러가 있는지
- `console.log()`를 찍었을 때 값이 예상과 맞는지

### Network 탭

확인할 것:

- `index.html`, `style.css`, `script.js`가 200으로 내려오는지
- GitHub API 요청이 성공하는지
- API 응답 코드가 200인지 403인지

### Application 탭

확인할 것:

- localStorage에 `portfolio-theme` 값이 저장되는지
- 다크 모드 토글 후 값이 바뀌는지

## 39. 배포와 GitHub Pages

GitHub Pages는 정적 파일을 웹에 공개해주는 기능입니다.

이번 프로젝트는 빌드 도구가 없으므로 GitHub Pages 설정에서 다음을 사용합니다.

```text
Source: Deploy from a branch
Branch: master
Folder: / (root)
```

중요한 조건은 루트에 `index.html`이 있어야 한다는 것입니다.

```text
repository root
  index.html
  css/style.css
  js/script.js
  images/...
```

배포 URL은 다음 형태입니다.

```text
https://계정명.github.io/저장소명/
```

현재 프로젝트 기준:

```text
https://kimch0612.github.io/Codyssey_Subject4_B4-1/
```

Pages 설정 직후에는 404가 잠시 나올 수 있습니다. 배포 반영까지 시간이 걸릴 수 있고, 브라우저 캐시 때문에 이전 404가 남아 있을 수도 있습니다.

이럴 때는 다음을 시도합니다.

```text
Cmd + Shift + R
시크릿 창에서 접속
URL 뒤에 ?v=1 같은 쿼리 붙여서 접속
```

## 40. 과제 체크리스트와 학습 포인트 연결

### HTML

공부할 것:

- 시맨틱 태그
- section과 article의 차이
- nav 앵커 링크
- img alt
- form label 연결

설명 목표:

> 왜 div만 쓰지 않고 의미 있는 태그를 사용했는지 설명할 수 있어야 한다.

### CSS

공부할 것:

- CSS 변수
- box model
- Flexbox
- Grid
- 모바일 퍼스트
- media query
- hover/transition/box-shadow
- data-theme 기반 다크 모드

설명 목표:

> 네비게이션에는 Flexbox를, 카드 목록에는 Grid를 사용한 이유를 설명할 수 있어야 한다.

### JavaScript

공부할 것:

- defer
- querySelector/querySelectorAll
- addEventListener
- event.preventDefault
- classList
- textContent/innerHTML
- state object
- render function
- localStorage
- fetch
- async/await
- try/catch
- map/forEach
- 구조분해 할당
- 템플릿 리터럴

설명 목표:

> 사용자 이벤트가 어떻게 상태를 바꾸고, 그 상태가 어떻게 DOM 업데이트로 이어지는지 설명할 수 있어야 한다.

### API

공부할 것:

- HTTP 요청/응답
- JSON
- GitHub REST API
- 로딩/성공/에러/빈 상태
- 403 rate limit

설명 목표:

> fetch로 데이터를 가져오고, 요청 상태에 따라 다른 UI를 보여주는 방식을 설명할 수 있어야 한다.

## 41. 코드 읽는 추천 순서

처음부터 모든 코드를 한 번에 이해하려고 하면 어렵습니다. 다음 순서로 읽는 것을 추천합니다.

```text
1. index.html에서 큰 섹션 구조 확인
2. css/style.css에서 .navbar, .projects-grid, media query 확인
3. js/script.js에서 state 객체 확인
4. init() 확인
5. bindEvents() 확인
6. 다크 모드 흐름 추적
7. 메뉴 토글 흐름 추적
8. GitHub API 흐름 추적
9. 폼 검증 흐름 추적
```

JavaScript는 특히 `init()`에서 시작해서 거꾸로 따라가면 이해하기 쉽습니다.

```js
function init() {
  renderTheme();
  renderMenu();
  renderScrollUI();
  startScrollAnimation();
  bindEvents();
  loadProjects();
}
```

이 함수는 페이지가 처음 열렸을 때 필요한 초기 작업을 모아둔 진입점입니다.

## 42. 발표 또는 설명 연습 질문

아래 질문에 답할 수 있으면 과제 목표를 잘 이해한 것입니다.

1. 왜 `index.html`, `css/style.css`, `js/script.js`를 분리했는가?
2. `header`, `nav`, `main`, `section`, `article`, `footer`를 어디에 사용했는가?
3. Flexbox와 Grid는 각각 어디에 사용했고, 왜 그렇게 선택했는가?
4. 모바일에서는 왜 햄버거 메뉴가 필요한가?
5. 다크 모드 버튼을 클릭하면 코드상 어떤 함수들이 실행되는가?
6. `localStorage`는 왜 사용했는가?
7. `fetch`와 `async/await`는 왜 필요한가?
8. GitHub API가 실패하면 사용자는 어떤 화면을 보게 되는가?
9. 폼에서 `input` 이벤트와 `submit` 이벤트는 어떻게 다른가?
10. `event.preventDefault()`는 왜 사용했는가?
11. `innerHTML`을 사용할 때 왜 `escapeHTML()`이 필요한가?
12. Intersection Observer는 어떤 문제를 해결하는가?
13. GitHub Pages 배포에서 루트에 `index.html`이 중요한 이유는 무엇인가?

## 43. 한 문장으로 정리

이번 과제는 포트폴리오 사이트를 만드는 과제이지만, 진짜 학습 목표는 다음입니다.

> HTML로 의미 있는 구조를 만들고, CSS로 반응형 화면을 구성하고, JavaScript로 사용자 이벤트와 API 상태를 DOM 렌더링으로 연결하는 웹의 기본 흐름을 이해하는 것.

이 흐름을 이해하면 React를 배울 때도 훨씬 수월합니다. React의 상태와 렌더링 개념은 결국 이번 프로젝트에서 직접 구현한 `state -> render -> DOM 업데이트` 흐름을 더 체계적으로 만들어주는 도구이기 때문입니다.
