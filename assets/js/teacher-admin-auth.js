// teacher-admin-auth.js - 관리자 페이지 인증 체크
class AdminAuthChecker {
    constructor() {
        this.apiBase = window.location.origin + '/api';
        this.token = localStorage.getItem('teacher-token');
        this.user = JSON.parse(localStorage.getItem('teacher-user') || '{}');
        
        this.init();
    }

    async init() {
        // 페이지 로드 시 인증 상태 확인
        const isAuthenticated = await this.checkAuthentication();
        
        if (!isAuthenticated) {
            this.redirectToLogin();
            return;
        }

        // 인증 성공 시 사용자 정보 표시 및 이벤트 설정
        this.updateUserInterface();
        this.setupLogoutHandler();
    }

    // 인증 상태 확인
    async checkAuthentication() {
        if (!this.token) {
            console.log('토큰이 없습니다.');
            return false;
        }

        try {
            const response = await fetch(`${this.apiBase}/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('인증 성공:', result);
                return true;
            } else {
                console.log('토큰 검증 실패');
                this.clearAuthData();
                return false;
            }

        } catch (error) {
            console.error('인증 확인 중 오류:', error);
            this.clearAuthData();
            return false;
        }
    }

    // 사용자 인터페이스 업데이트
    updateUserInterface() {
        // 사용자 이름 표시
        const userNameEl = document.getElementById('userName');
        if (userNameEl && this.user.name) {
            userNameEl.textContent = this.user.name;
        }

        // 사용자 아바타 업데이트
        const userAvatarEl = document.getElementById('userAvatar');
        if (userAvatarEl && this.user.name) {
            userAvatarEl.textContent = this.user.name.charAt(0);
        }

        // 관리자/교사에 따른 UI 차이 적용
        if (this.user.role === 'admin') {
            document.body.classList.add('admin-user');
        }
    }

    // 로그아웃 처리
    setupLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await this.handleLogout();
            });
        }
    }

    // 로그아웃 실행
    async handleLogout() {
        try {
            // 서버에 로그아웃 요청 (선택사항)
            await fetch(`${this.apiBase}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('로그아웃 요청 실패:', error);
        } finally {
            // 로컬 인증 데이터 삭제
            this.clearAuthData();
            this.redirectToLogin();
        }
    }

    // 인증 데이터 삭제
    clearAuthData() {
        localStorage.removeItem('teacher-token');
        localStorage.removeItem('teacher-user');
        localStorage.removeItem('remember-login');
    }

    // 로그인 페이지로 리다이렉트
    redirectToLogin() {
        window.location.href = '/teacher-login';
    }

    // API 요청 헬퍼 (다른 기능에서 사용)
    async apiRequest(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                ...options.headers
            },
            ...options
        };

        const response = await fetch(`${this.apiBase}${endpoint}`, config);
        
        if (response.status === 401 || response.status === 403) {
            // 인증 실패 시 로그인 페이지로 리다이렉트
            this.clearAuthData();
            this.redirectToLogin();
            throw new Error('인증이 필요합니다.');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || '요청 실패');
        }

        return response.json();
    }
}

// 페이지 로드 시 인증 체크 실행
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuthChecker();
});

// 다른 스크립트에서 사용할 수 있도록 전역 함수 제공
window.getAuthenticatedApiRequest = () => {
    return window.adminAuth ? window.adminAuth.apiRequest.bind(window.adminAuth) : null;
};