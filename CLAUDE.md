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
   - `displayLottoNumbers()`: 슬롯머신 스타일 애니메이션으로 번호 표시
   - `updateBallColor()`: 번호에 따른 색상 자동 업데이트 헬퍼 함수
   - DOM 이벤트 처리 (버튼 클릭, UI 업데이트)

3. **screenshot.js** - Playwright 자동화 스크립트
   - 로컬 서버(port 3001)에서 앱 실행 가정
   - UI 상태별 스크린샷 자동 촬영
   - `.agent-screenshots/` 디렉토리에 저장

### 슬롯머신 애니메이션 시스템
카지노 스타일의 번호 생성 애니메이션:
- **동시 시작**: 6개 공이 모두 동시에 나타남
- **빠른 회전**: `setInterval`로 50ms마다 1-45 랜덤 숫자 표시
- **실시간 색상**: 숫자 변경 시 `updateBallColor()` 호출하여 색상 동기화
- **순차 정지**: 0.5초 간격으로 하나씩 멈춤 (1초, 1.5초, 2초, 2.5초, 3초, 3.5초)
- **강조 효과**: 멈출 때 scale(1.2) → scale(1) 확대 애니메이션
- **타이머 관리**: `clearInterval`로 메모리 누수 방지

### 로또 번호 색상 규칙
번호 범위에 따라 다른 색상 적용:
- 1-10: 노란색 (`bg-yellow-400`)
- 11-20: 파란색 (`bg-blue-500`)
- 21-30: 빨간색 (`bg-red-500`)
- 31-40: 회색 (`bg-gray-600`)
- 41-45: 초록색 (`bg-green-500`)

색상 업데이트는 `updateBallColor(ball, number)` 함수가 담당하며, `classList.remove()`로 기존 색상 제거 후 `classList.add()`로 새 색상 적용

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
- 애니메이션 수정 시 주의사항:
  - `setInterval`로 시작한 타이머는 반드시 `clearInterval`로 정리
  - 회전 속도: 50ms 권장 (너무 빠르면 광과민성 발작 위험)
  - 정지 간격: 500ms 권장 (카지노 느낌 유지)
  - 여러 게임 생성 시 각 게임의 타이머가 독립적으로 작동하도록 구현됨

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

### 슬롯머신 애니메이션 패턴
```javascript
// 각 공마다 독립적인 회전 타이머 생성
numbers.forEach(function(finalNumber, index) {
    const numberBall = document.createElement('span');
    numbersContainer.appendChild(numberBall);

    // 50ms마다 랜덤 숫자로 회전
    const spinInterval = setInterval(function() {
        currentNumber = Math.floor(Math.random() * 45) + 1;
        numberBall.textContent = currentNumber;
        updateBallColor(numberBall, currentNumber);
    }, 50);

    // 순차적으로 멈춤 (1초 + index * 0.5초)
    const stopDelay = 1000 + (index * 500);
    setTimeout(function() {
        clearInterval(spinInterval);
        numberBall.textContent = finalNumber;
        updateBallColor(numberBall, finalNumber);
        // 확대 효과
        numberBall.style.transform = 'scale(1.2)';
        setTimeout(() => numberBall.style.transform = 'scale(1)', 200);
    }, stopDelay);
});
```

## Git 워크플로우

커밋 메시지는 한글로 작성하며, 기존 커밋 히스토리 참고:
- "로또 번호 생성기 초기 화면 구현"
- "로또 번호 생성기 기능 구현 완료"
- "Vercel 배포 설정 추가 및 프로덕션 배포 완료"
- "로또 번호 순차 생성 애니메이션 효과 추가"
- "슬롯머신 스타일 애니메이션으로 변경"

## 성능 고려사항

### 애니메이션 성능
- 최대 5게임 × 6번호 = 30개 `setInterval` 동시 실행
- 각 공은 최대 3.5초 동안 회전 (70회 DOM 업데이트)
- 50ms 간격은 초당 20회로 광과민성 발작 안전 범위
- 현대 브라우저에서 충분히 처리 가능한 수준

### 메모리 관리
- 새 게임 생성 시 `resultsDiv.innerHTML = ''`로 이전 DOM 완전 제거
- `clearInterval`로 타이머 정리 필수
- 타이머가 남아있으면 보이지 않는 DOM 업데이트 계속 발생 (메모리 누수)
