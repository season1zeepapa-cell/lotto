# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

로또 번호 생성기 웹 애플리케이션 - 순수 클라이언트 사이드 정적 웹사이트로 구현되어 있습니다.

**기술 스택:**
- Vanilla JavaScript (ES6+)
- HTML5
- Tailwind CSS (CDN 방식)
- Playwright (자동화 테스트 및 스크린샷용)

**배포 환경:**
- Vercel 정적 호스팅

## 아키텍처

### 핵심 구조
이 프로젝트는 **단일 페이지 애플리케이션(SPA)** 구조입니다:

1. **index.html** - 앱의 전체 UI 구조
   - Tailwind CSS CDN으로 스타일링
   - 게임 개수 선택 버튼 (1-5개)
   - 번호 생성 버튼
   - 결과 표시 영역

2. **client.js** - 모든 로직 처리
   - `generateLottoNumbers()`: 1-45 중 중복 없이 6개 랜덤 번호 생성
   - `displayLottoNumbers()`: 생성된 번호를 색상별로 화면에 표시
   - DOM 이벤트 처리 (버튼 클릭, UI 업데이트)

3. **screenshot.js** - Playwright 자동화 스크립트
   - 로컬 서버(port 3001)에서 앱 실행 가정
   - UI 상태별 스크린샷 자동 촬영
   - `.agent-screenshots/` 디렉토리에 저장

### 로또 번호 색상 규칙
번호 범위에 따라 다른 색상 적용:
- 1-10: 노란색 (`bg-yellow-400`)
- 11-20: 파란색 (`bg-blue-500`)
- 21-30: 빨간색 (`bg-red-500`)
- 31-40: 회색 (`bg-gray-600`)
- 41-45: 초록색 (`bg-green-500`)

## 개발 명령어

### 로컬 개발
정적 HTML 파일이므로 웹 서버가 필요합니다:

```bash
# Python 내장 서버 사용 (포트 8000)
python3 -m http.server

# Node.js http-server 사용
npx http-server -p 3001
```

### 스크린샷 촬영
```bash
# 먼저 로컬 서버를 포트 3001에서 실행한 후
node screenshot.js
```

### Vercel 배포
```bash
# Vercel CLI로 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 코드 수정 시 주의사항

### JavaScript 코드
- `client.js`는 **초보자를 위한 상세한 한글 주석**이 특징입니다
- 주석 스타일 유지: 각 함수/로직마다 "왜 이렇게 하는가" 설명 포함
- `generateLottoNumbers()` 함수는 중복 검사를 `includes()` 메서드로 수행

### HTML/CSS
- Tailwind CSS를 CDN으로 사용 - `tailwind.config.js` 없음
- 모든 스타일은 인라인 Tailwind 클래스로 처리
- 주석은 각 클래스의 역할을 상세히 한글로 설명

### 배포 설정
- `vercel.json`은 정적 파일 배포 최적화 설정
- `index.html`과 `client.js`를 `@vercel/static` 빌더로 처리

## 파일 구조

```
/
├── index.html          # 메인 HTML (UI 구조)
├── client.js           # 클라이언트 로직 (상세 주석)
├── screenshot.js       # Playwright 자동화 스크립트
├── vercel.json         # Vercel 배포 설정
├── package.json        # Playwright 의존성만 포함
├── .agent-screenshots/ # 스크린샷 저장 디렉토리
└── AGENT_WORK_LOG.md   # 에이전트 작업 이력
```

## 주요 개발 패턴

### 이벤트 처리 패턴
- `DOMContentLoaded` 이벤트로 DOM 로드 완료 후 실행
- `forEach`로 여러 버튼에 동일 이벤트 리스너 등록
- CSS 클래스 토글로 선택 상태 시각화

### 번호 생성 알고리즘
```javascript
// 중복 없는 랜덤 번호 생성
while (numbers.length < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
    }
}
numbers.sort((a, b) => a - b);
```

## Git 워크플로우

커밋 메시지는 한글로 작성하며, 기존 커밋 히스토리 참고:
- "로또 번호 생성기 초기 화면 구현"
- "로또 번호 생성기 기능 구현 완료"
- "Vercel 배포 설정 추가 및 프로덕션 배포 완료"
