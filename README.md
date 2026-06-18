# 웹 기초 완성, 나만의 포트폴리오 구축

순수 HTML, CSS, JavaScript만으로 구현한 반응형 포트폴리오 웹사이트입니다. DOM 이벤트, 상태 변경, 화면 렌더링 흐름을 직접 다루고 GitHub API를 연동해 공개 저장소를 동적으로 표시합니다.

## 배포 URL

- GitHub Pages: https://kimch0612.github.io/Codyssey_Subject4_B4-1/
- Repository: https://github.com/kimch0612/Codyssey_Subject4_B4-1

## 사용 기술

- HTML5 시맨틱 마크업
- CSS3 변수, Flexbox, Grid, 반응형 디자인
- JavaScript ES6+
- GitHub REST API
- localStorage
- Intersection Observer

## 주요 기능

- 모바일, 태블릿, 데스크톱 반응형 레이아웃
- 모바일 햄버거 메뉴
- 네비게이션 앵커 기반 부드러운 스크롤
- 스크롤 위치에 따른 헤더 스타일 변경
- 스크롤 탑 버튼
- 다크 모드 토글 및 localStorage 저장
- Intersection Observer 기반 스크롤 애니메이션
- GitHub API 저장소 목록 동적 렌더링
- Projects 섹션의 로딩, 성공, 에러, 빈 상태 UI
- Contact 폼 필수값 및 이메일 형식 검증

## 구현 기준값

- 스크롤 탑 버튼 표시 기준: `300px`
- 네비게이션 배경 변경 기준: `60px`
- Intersection Observer threshold: `0.2`
- GitHub API 엔드포인트: `https://api.github.com/users/kimch0612/repos`

## 프로젝트 구조

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── profile.svg
│   ├── screenshot-desktop.png
│   ├── screenshot-mobile.png
│   └── screenshot-dark.png
└── README.md
```

## 스크린샷

### 데스크톱

![데스크톱 화면](images/screenshot-desktop.png)

### 모바일

![모바일 화면](images/screenshot-mobile.png)

### 다크 모드

![다크 모드 화면](images/screenshot-dark.png)
