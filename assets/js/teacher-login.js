/**
 * 교사 로그인 시스템
 * 간단한 로컬스토리지 기반 인증
 */

class TeacherLogin {
    constructor() {
        this.teachers = [
            {
                username: 'teacher1',
                password: 'password123',
                name: '김선생',
                email: 'teacher1@jangjachristian.edu'
            },
            {
                username: 'admin',
                password: 'admin123',
                name: '관리자',
                email: 'admin@jangjachristian.edu'
            }
        ];
        
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.checkExistingAuth();
    }

    setupFormHandlers() {
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const forgotPassword = document.getElementById('forgotPassword');
        const themeToggle = document.querySelector('.theme-toggle');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm, loginBtn);
            });
        }

        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPasswordHelp();
            });
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    checkExistingAuth() {
        const existingUser = localStorage.getItem('teacher-admin-user');
        if (existingUser) {
            // 이미 로그인된 경우 관리자 페이지로 리다이렉트
            window.location.href = 'teacher-admin.html';
        }
    }

    async handleLogin(form, button) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');
        const remember = formData.get('remember');

        // 버튼 로딩 상태
        this.setButtonLoading(button, true);

        try {
            // 인증 검증
            const user = this.authenticateUser(username, password);
            
            if (user) {
                // 성공
                this.showMessage('로그인 성공!', 'success');
                
                // 사용자 정보 저장
                localStorage.setItem('teacher-admin-user', JSON.stringify({
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    loginTime: new Date().toISOString(),
                    remember: remember ? true : false
                }));

                // 잠시 후 관리자 페이지로 이동
                setTimeout(() => {
                    window.location.href = 'teacher-admin.html';
                }, 1000);

            } else {
                // 실패
                this.showMessage('아이디 또는 비밀번호가 올바르지 않습니다.', 'error');
            }

        } catch (error) {
            console.error('로그인 처리 실패:', error);
            this.showMessage('로그인 처리 중 오류가 발생했습니다.', 'error');
        }

        // 버튼 로딩 상태 해제
        setTimeout(() => {
            this.setButtonLoading(button, false);
        }, 1000);
    }

    authenticateUser(username, password) {
        return this.teachers.find(teacher => 
            teacher.username === username && teacher.password === password
        );
    }

    setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.loading-spinner');

        if (loading) {
            btnText.style.display = 'none';
            spinner.style.display = 'block';
            button.disabled = true;
        } else {
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            button.disabled = false;
        }
    }

    showMessage(message, type) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.className = `error-message ${type}`;
            errorMessage.style.display = 'block';

            // 5초 후 숨김
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }

    showPasswordHelp() {
        const helpText = `
테스트 계정 정보:

1. 교사 계정:
   - 아이디: teacher1
   - 비밀번호: password123

2. 관리자 계정:
   - 아이디: admin  
   - 비밀번호: admin123

실제 사용 시에는 관리자에게 문의해주세요.
        `.trim();

        alert(helpText);
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-toggle i');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeIcon = document.querySelector('.theme-toggle i');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
    }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const teacherLogin = new TeacherLogin();
    teacherLogin.loadSavedTheme();
});