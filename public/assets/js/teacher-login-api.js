// teacher-login-api.js - 실제 서버 API와 연동되는 로그인
class TeacherLoginAPI {
    constructor() {
        this.apiBase = window.location.origin + '/api';
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.checkExistingAuth();
    }

    setupFormHandlers() {
        const loginForm = document.getElementById('loginForm');
        const forgotPassword = document.getElementById('forgotPassword');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }

        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPasswordHelp();
            });
        }
    }

    // 이미 로그인되어 있는지 확인
    async checkExistingAuth() {
        const token = localStorage.getItem('teacher-token');
        
        if (token) {
            try {
                const response = await fetch(`${this.apiBase}/verify-token`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    // 유효한 토큰이면 관리자 페이지로 리다이렉트
                    window.location.href = '/teacher-admin';
                    return;
                }
            } catch (error) {
                console.error('토큰 검증 실패:', error);
            }
            
            // 유효하지 않은 토큰 제거
            localStorage.removeItem('teacher-token');
            localStorage.removeItem('teacher-user');
        }
    }

    // 실제 서버 API로 로그인 처리
    async handleLogin(form) {
        const loginBtn = document.getElementById('loginBtn');
        const formData = new FormData(form);
        
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        // 입력값 검증
        if (!loginData.username || !loginData.password) {
            this.showMessage('아이디와 비밀번호를 입력해주세요.', 'error');
            return;
        }

        // 버튼 로딩 상태 시작
        this.setButtonLoading(loginBtn, true);

        try {
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (result.success) {
                // 로그인 성공
                this.showMessage('로그인 성공!', 'success');
                
                // 토큰과 사용자 정보 저장
                localStorage.setItem('teacher-token', result.token);
                localStorage.setItem('teacher-user', JSON.stringify(result.user));
                
                // 로그인 상태 유지 체크박스 확인
                const rememberMe = formData.get('remember');
                if (rememberMe) {
                    localStorage.setItem('remember-login', 'true');
                }

                // 1초 후 관리자 페이지로 이동
                setTimeout(() => {
                    window.location.href = '/teacher-admin';
                }, 1000);

            } else {
                // 로그인 실패
                this.showMessage(result.message || '로그인에 실패했습니다.', 'error');
            }

        } catch (error) {
            console.error('로그인 요청 실패:', error);
            this.showMessage('서버와의 연결에 문제가 발생했습니다.', 'error');
        } finally {
            // 버튼 로딩 상태 해제
            setTimeout(() => {
                this.setButtonLoading(loginBtn, false);
            }, 1000);
        }
    }

    // 버튼 로딩 상태 관리
    setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.loading-spinner');

        if (loading) {
            if (btnText) btnText.style.display = 'none';
            if (spinner) spinner.style.display = 'block';
            button.disabled = true;
        } else {
            if (btnText) btnText.style.display = 'block';
            if (spinner) spinner.style.display = 'none';
            button.disabled = false;
        }
    }

    // 메시지 표시
    showMessage(message, type) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.className = `error-message ${type} show`;

            // 5초 후 숨김
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        } else {
            // fallback: alert 사용
            alert(message);
        }
    }

    // 비밀번호 도움말
    showPasswordHelp() {
        const helpText = `
테스트 계정 정보:

1. 교사 계정:
   - 아이디: teacher1
   - 비밀번호: password123

2. 관리자 계정:
   - 아이디: admin  
   - 비밀번호: admin123

실제 운영 시에는 관리자에게 별도로 계정을 요청해주세요.
        `.trim();

        alert(helpText);
    }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.teacherLoginAPI = new TeacherLoginAPI();
});