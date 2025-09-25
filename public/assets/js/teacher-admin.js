// teacher-admin.js 파일에 추가할 탭 네비게이션 코드
class TabNavigation {
    constructor() {
        this.setupTabNavigation();
    }

    setupTabNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentTabs = document.querySelectorAll('.content-tab');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabId = item.dataset.tab;
                console.log('탭 클릭:', tabId);
                
                // 모든 네비게이션 아이템에서 active 클래스 제거
                navItems.forEach(nav => nav.classList.remove('active'));
                // 클릭한 아이템에 active 클래스 추가
                item.classList.add('active');
                
                // 모든 콘텐츠 탭 숨기기
                contentTabs.forEach(tab => tab.classList.remove('active'));
                
                // 선택한 탭 보이기
                const targetTab = document.getElementById(`${tabId}-content`);
                if (targetTab) {
                    targetTab.classList.add('active');
                    console.log('탭 전환 완료:', tabId);
                } else {
                    console.error('타겟 탭을 찾을 수 없습니다:', `${tabId}-content`);
                }
            });
        });
    }
}

// DOM 로드 시 탭 네비게이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.tabNavigation = new TabNavigation();
});