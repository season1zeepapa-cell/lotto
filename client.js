// ============================================
// 로또 번호 생성기 - 클라이언트 스크립트
// ============================================

// 전역 변수: 사용자가 선택한 게임 개수를 저장하는 변수
// 처음에는 1개로 설정해요
let selectedGameCount = 1;

// ============================================
// 1단계: 로또 번호 생성 함수
// ============================================

/**
 * 로또 번호 한 세트(6개)를 생성하는 함수
 *
 * 작동 방식:
 * 1. 1부터 45까지의 숫자 중에서
 * 2. 중복 없이 6개를 랜덤하게 선택하고
 * 3. 작은 숫자부터 순서대로 정렬해요
 *
 * @returns {Array} 6개의 로또 번호가 담긴 배열 (예: [3, 12, 23, 31, 38, 42])
 */
function generateLottoNumbers() {
    // 빈 배열을 만들어요 - 여기에 번호들을 담을 거예요
    const numbers = [];

    // 6개의 번호를 뽑을 때까지 반복해요
    while (numbers.length < 6) {
        // 1부터 45 사이의 랜덤한 정수를 만들어요
        // Math.random()은 0~1 사이의 소수를 만들고
        // * 45를 하면 0~45 사이가 되고
        // + 1을 하면 1~46 사이가 되고
        // Math.floor()로 소수점을 버리면 1~45 정수가 돼요
        const randomNumber = Math.floor(Math.random() * 45) + 1;

        // 이미 뽑은 번호인지 확인해요
        // includes()는 배열에 특정 값이 있는지 true/false로 알려줘요
        if (!numbers.includes(randomNumber)) {
            // 새로운 번호면 배열에 추가해요
            numbers.push(randomNumber);
        }
        // 이미 있는 번호면 다시 반복해서 새 번호를 뽑아요
    }

    // 번호들을 작은 것부터 큰 순서로 정렬해요
    // sort()의 (a, b) => a - b 는 "숫자 오름차순 정렬"을 의미해요
    numbers.sort((a, b) => a - b);

    // 완성된 6개 번호를 반환해요
    return numbers;
}

// ============================================
// 2단계: 화면 요소를 찾아서 변수에 저장
// ============================================

// DOM이 완전히 로드된 후에 실행돼요
// 이렇게 하지 않으면 HTML 요소를 찾지 못할 수 있어요
document.addEventListener('DOMContentLoaded', function() {

    // HTML에서 필요한 요소들을 찾아요

    // 게임 개수 선택 버튼들 (1, 2, 3, 4, 5 버튼)
    // querySelectorAll은 해당하는 모든 요소를 찾아 배열처럼 반환해요
    const gameCountButtons = document.querySelectorAll('.game-count-btn');

    // "행운의 번호 생성하기" 버튼
    // querySelector는 해당하는 첫 번째 요소 하나만 찾아요
    const generateBtn = document.querySelector('#generateBtn');

    // 생성된 번호를 표시할 영역
    const resultsDiv = document.querySelector('#results');

    // ============================================
    // 3단계: 게임 개수 선택 버튼 이벤트 처리
    // ============================================

    /**
     * 각 게임 개수 버튼에 클릭 이벤트를 연결해요
     *
     * 실행 흐름:
     * 사용자가 버튼 클릭 → 해당 버튼만 강조 표시 → 선택된 개수 저장
     */
    gameCountButtons.forEach(function(button) {
        // 각 버튼마다 클릭했을 때 실행할 함수를 연결해요
        button.addEventListener('click', function() {

            // 먼저 모든 버튼의 강조 표시를 제거해요
            // (다른 버튼이 선택되어 있을 수 있으니까요)
            gameCountButtons.forEach(function(btn) {
                // 파란색 스타일을 제거하고
                btn.classList.remove('from-blue-600', 'to-blue-700');
                // 기본 파란색 스타일로 돌려놔요
                btn.classList.add('from-blue-500', 'to-blue-600');
            });

            // 클릭된 버튼만 진한 파란색으로 강조해요
            this.classList.remove('from-blue-500', 'to-blue-600');
            this.classList.add('from-blue-600', 'to-blue-700');

            // 버튼의 data-count 속성에서 개수 값을 가져와요
            // getAttribute는 HTML 속성 값을 읽어와요
            // Number()로 문자열을 숫자로 변환해요
            selectedGameCount = Number(this.getAttribute('data-count'));

            // 개발자 도구 콘솔에 선택된 개수를 출력해요 (디버깅용)
            console.log('선택된 게임 수:', selectedGameCount);
        });
    });

    // 첫 번째 버튼(1개)을 기본으로 선택된 상태로 만들어요
    if (gameCountButtons.length > 0) {
        gameCountButtons[0].classList.remove('from-blue-500', 'to-blue-600');
        gameCountButtons[0].classList.add('from-blue-600', 'to-blue-700');
    }

    // ============================================
    // 4단계: 번호 생성 버튼 이벤트 처리
    // ============================================

    /**
     * "행운의 번호 생성하기" 버튼 클릭 시 실행
     *
     * 실행 흐름:
     * 버튼 클릭 → 선택된 개수만큼 번호 생성 → 화면에 표시
     */
    generateBtn.addEventListener('click', function() {
        console.log('번호 생성 시작! 게임 수:', selectedGameCount);

        // 결과 영역을 비워요 (이전 결과를 지우기 위해)
        resultsDiv.innerHTML = '';

        // 선택된 게임 수만큼 번호를 생성해요
        for (let i = 0; i < selectedGameCount; i++) {
            // 로또 번호 한 세트를 생성해요
            const lottoNumbers = generateLottoNumbers();

            // 생성된 번호를 화면에 표시하는 함수를 호출해요
            // i + 1은 게임 번호 (1번째, 2번째...)를 의미해요
            displayLottoNumbers(lottoNumbers, i + 1);
        }
    });
});

// ============================================
// 5단계: 번호를 화면에 표시하는 함수
// ============================================

/**
 * 생성된 로또 번호를 예쁘게 화면에 표시하는 함수
 *
 * @param {Array} numbers - 6개의 로또 번호 배열
 * @param {Number} gameNumber - 게임 번호 (몇 번째 게임인지)
 */
function displayLottoNumbers(numbers, gameNumber) {
    // 결과를 표시할 영역을 찾아요
    const resultsDiv = document.querySelector('#results');

    // 하나의 게임 결과를 담을 div를 만들어요
    const gameDiv = document.createElement('div');

    // 이 div에 스타일 클래스를 추가해요
    // bg-gradient-to-r: 왼쪽에서 오른쪽으로 그라디언트
    // from-indigo-50 to-purple-50: 연한 남보라색 배경
    // p-6: 안쪽 여백 6단위
    // rounded-xl: 모서리를 둥글게
    // shadow-md: 중간 크기 그림자
    gameDiv.className = 'bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md';

    // 게임 번호 제목을 만들어요 (예: "🎯 1번째 게임")
    const gameTitle = document.createElement('div');
    gameTitle.className = 'text-lg font-semibold text-gray-700 mb-3';
    gameTitle.textContent = `🎯 ${gameNumber}번째 게임`;

    // 번호들을 담을 컨테이너를 만들어요
    const numbersContainer = document.createElement('div');
    // flex: 가로로 나열
    // flex-wrap: 공간이 부족하면 다음 줄로 넘어감
    // gap-3: 요소들 사이 간격 3단위
    // justify-center: 가운데 정렬
    numbersContainer.className = 'flex flex-wrap gap-3 justify-center';

    // 6개의 번호를 하나씩 순차적으로 나타나게 해요 (다이나믹 효과!)
    // forEach의 두 번째 매개변수 index를 사용해서 각 번호마다 다른 지연 시간을 줘요
    numbers.forEach(function(number, index) {
        // setTimeout: 일정 시간 후에 함수를 실행하는 타이머예요
        // index * 300 = 첫 번째(0ms), 두 번째(300ms), 세 번째(600ms)... 순서로 실행돼요
        setTimeout(function() {
            // 번호를 표시할 span 요소를 만들어요
            const numberBall = document.createElement('span');

            // 번호 크기에 따라 다른 색상을 적용해요 (로또 번호 색상 규칙)
            let colorClass = '';
            if (number <= 10) {
                // 1~10: 노란색
                colorClass = 'bg-yellow-400';
            } else if (number <= 20) {
                // 11~20: 파란색
                colorClass = 'bg-blue-500';
            } else if (number <= 30) {
                // 21~30: 빨간색
                colorClass = 'bg-red-500';
            } else if (number <= 40) {
                // 31~40: 회색
                colorClass = 'bg-gray-600';
            } else {
                // 41~45: 초록색
                colorClass = 'bg-green-500';
            }

            // 공 모양 스타일을 적용해요
            // w-14 h-14: 너비와 높이를 14단위로 (정사각형)
            // rounded-full: 완전히 둥글게 (원형)
            // flex items-center justify-center: 안의 숫자를 가운데 정렬
            // text-white: 흰색 글자
            // text-xl: 큰 글자
            // font-bold: 굵은 글자
            // shadow-lg: 큰 그림자 (입체감)
            numberBall.className = `w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ${colorClass}`;

            // 번호를 텍스트로 넣어요
            numberBall.textContent = number;

            // 애니메이션을 위한 초기 상태 설정
            // opacity: 투명도 (0 = 완전히 투명, 1 = 완전히 불투명)
            // transform: 모양 변형 (scale(0.5) = 원래 크기의 50%)
            // transition: 변화가 일어날 때 부드럽게 전환되도록 설정 (0.5초 동안)
            numberBall.style.opacity = '0';
            numberBall.style.transform = 'scale(0.5)';
            numberBall.style.transition = 'all 0.5s ease-out';

            // 번호 공을 컨테이너에 추가해요 (아직은 투명하고 작은 상태)
            numbersContainer.appendChild(numberBall);

            // requestAnimationFrame: 브라우저가 화면을 다시 그릴 준비가 되면 실행해요
            // DOM에 추가한 직후 바로 스타일을 바꾸면 브라우저가 애니메이션을 건너뛸 수 있어서
            // 다음 프레임에서 스타일을 변경해야 부드러운 애니메이션이 나와요
            requestAnimationFrame(function() {
                // 최종 상태로 변경: 완전히 보이고(opacity: 1) 원래 크기로(scale: 1)
                // transition 속성 덕분에 이 변화가 0.5초에 걸쳐 부드럽게 일어나요
                numberBall.style.opacity = '1';
                numberBall.style.transform = 'scale(1)';
            });
        }, index * 300); // 300ms = 0.3초 간격으로 각 번호가 나타나요
    });

    // 게임 div에 제목과 번호들을 추가해요
    gameDiv.appendChild(gameTitle);
    gameDiv.appendChild(numbersContainer);

    // 완성된 게임 div를 결과 영역에 추가해요
    resultsDiv.appendChild(gameDiv);
}
