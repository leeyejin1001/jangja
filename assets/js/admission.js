// ========== 문서 로드 완료 후 실행 ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeQnASystem();
    initializePageAnimations();
    initializeSmoothScroll();
    initializeResponsiveMenu();
    initializeFormInteractions();
    initializeAccessibility();
    initializeScrollEffects();
});

// ========== Q&A 시스템 초기화 ==========
function initializeQnASystem() {
    const qnaTabs = document.querySelectorAll('.qna-tab');
    const qnaContents = document.querySelectorAll('.qna-content');
    const qnaToggles = document.querySelectorAll('.qna-toggle');
    
    // 초기 상태 설정 - 첫 번째 탭과 콘텐츠 활성화
    if (qnaTabs.length > 0 && qnaContents.length > 0) {
        // 모든 콘텐츠 숨기기
        qnaContents.forEach(content => {
            content.style.display = 'none';
        });
        
        // 모든 탭 비활성화
        qnaTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 첫 번째 탭과 콘텐츠 활성화
        qnaTabs[0].classList.add('active');
        const firstCategory = qnaTabs[0].getAttribute('data-category');
        const firstContent = document.getElementById(`qna-${firstCategory}`);
        if (firstContent) {
            firstContent.style.display = 'block';
            firstContent.style.opacity = '1';
            firstContent.style.transform = 'translateY(0)';
        }
    }
    
    // Q&A 탭 전환 기능
    qnaTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모든 탭에서 active 클래스 제거
            qnaTabs.forEach(t => t.classList.remove('active'));
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active');
            
            // 모든 콘텐츠 숨김
            qnaContents.forEach(content => {
                content.style.display = 'none';
                content.style.opacity = '0';
                content.style.transform = 'translateY(10px)';
            });
            
            // 해당 콘텐츠 표시
            const targetCategory = this.getAttribute('data-category');
            const targetContent = document.getElementById(`qna-${targetCategory}`);
            if (targetContent) {
                targetContent.style.display = 'block';
                
                // 부드러운 표시 애니메이션
                setTimeout(() => {
                    targetContent.style.transition = 'all 0.3s ease';
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                }, 10);
            }
        });
    });
    
    // Q&A 아코디언 기능
    qnaToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const qnaItem = this.closest('.qna-item');
            const qnaAnswer = qnaItem.querySelector('.qna-answer');
            
            // 현재 아이템이 활성화되어 있는지 확인
            const isActive = qnaItem.classList.contains('active');
            
            // 같은 콘텐츠 영역 내의 모든 Q&A 아이템 닫기
            const currentContent = this.closest('.qna-content');
            currentContent.querySelectorAll('.qna-item').forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('.qna-answer');
                if (answer) {
                    answer.style.display = 'none';
                }
            });
            
            // 클릭한 아이템이 비활성화 상태였다면 열기
            if (!isActive) {
                qnaItem.classList.add('active');
                qnaAnswer.style.display = 'block';
                
                // 부드러운 열기 애니메이션
                qnaAnswer.style.opacity = '0';
                qnaAnswer.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    qnaAnswer.style.transition = 'all 0.3s ease';
                    qnaAnswer.style.opacity = '1';
                    qnaAnswer.style.transform = 'translateY(0)';
                }, 10);
                
                // 답변으로 부드럽게 스크롤
                setTimeout(() => {
                    qnaItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 100);
            }
        });
    });
    
    // 질문 영역 클릭시에도 토글 동작
    document.querySelectorAll('.qna-question').forEach(question => {
        question.addEventListener('click', function(e) {
            // 토글 버튼이 클릭된 경우는 제외
            if (e.target.closest('.qna-toggle')) return;
            
            const toggle = this.querySelector('.qna-toggle');
            if (toggle) {
                toggle.click();
            }
        });
    });
    
    // 키보드 접근성 지원
    qnaToggles.forEach(toggle => {
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    qnaTabs.forEach(tab => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ========== 페이지 애니메이션 초기화 ==========
function initializePageAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들 관찰
    document.querySelectorAll('.content-section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });

    // 헤더 요소들 애니메이션
    document.querySelectorAll('#main > header h2, #main > header p').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.8s ease ${0.2 + index * 0.2}s, transform 0.8s ease ${0.2 + index * 0.2}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });

    // Q&A 탭들 순차적 애니메이션
    document.querySelectorAll('.qna-tab').forEach((tab, index) => {
        tab.style.opacity = '0';
        tab.style.transform = 'translateX(-20px)';
        tab.style.transition = `opacity 0.4s ease ${0.5 + index * 0.1}s, transform 0.4s ease ${0.5 + index * 0.1}s`;
        
        setTimeout(() => {
            tab.style.opacity = '1';
            tab.style.transform = 'translateX(0)';
        }, 100);
    });
}

// ========== 부드러운 스크롤 기능 초기화 ==========
function initializeSmoothScroll() {
    // 서브 네비게이션 버튼들에 부드러운 스크롤 적용
    document.querySelectorAll('.scrolly').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const header = document.querySelector('#header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 서브 네비게이션 활성 상태 업데이트
                document.querySelectorAll('.scrolly').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// ========== 스크롤 효과 초기화 ==========
function initializeScrollEffects() {
    let lastScrollTop = 0;
    let ticking = false;

    const scrollHandler = function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('#header');
        
        if (!header) return;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    };

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(scrollHandler);
            ticking = true;
        }
    });
}

// ========== 반응형 메뉴 초기화 ==========
function initializeResponsiveMenu() {
    const menuToggle = document.querySelector('.menuToggle');
    const menu = document.querySelector('#menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('is-menu-visible');
        });
        
        // 메뉴 외부 클릭시 메뉴 닫기
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                document.body.classList.remove('is-menu-visible');
            }
        });
        
        // ESC 키로 메뉴 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.body.classList.remove('is-menu-visible');
            }
        });
        
        // 메뉴 항목 클릭시 메뉴 닫기
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                document.body.classList.remove('is-menu-visible');
            });
        });
    }
}

// ========== 폼 상호작용 초기화 ==========
function initializeFormInteractions() {
    // 입력 필드 포커스 효과
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const parent = this.parentElement;
            if (parent) {
                parent.classList.add('focused');
            }
        });
        
        input.addEventListener('blur', function() {
            const parent = this.parentElement;
            if (parent) {
                parent.classList.remove('focused');
                if (this.value.trim() !== '') {
                    parent.classList.add('has-value');
                } else {
                    parent.classList.remove('has-value');
                }
            }
        });
        
        // 실시간 검증
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
}

// ========== 입력 검증 함수 ==========
function validateInput(input) {
    if (!input) return false;
    
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    // 필수 필드 검증
    if (required && !value) {
        input.classList.add('error');
        return false;
    }
    
    // 이메일 검증
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('error');
            return false;
        }
    }
    
    // 전화번호 검증
    if (input.name === 'phone' && value) {
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(value)) {
            input.classList.add('error');
            return false;
        }
    }
    
    input.classList.remove('error');
    return true;
}

// ========== 접근성 기능 초기화 ==========
function initializeAccessibility() {
    // 탭 키 네비게이션 개선
    const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // 포커스 시각적 표시 개선
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focused');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focused');
        });
        
        element.addEventListener('mousedown', function() {
            this.classList.remove('keyboard-focused');
        });
    });
    
    // 건너뛰기 링크 추가
    addSkipLinks();
    
    // ARIA 레이블 동적 업데이트
    updateAriaLabels();
}

// ========== 건너뛰기 링크 추가 ==========
function addSkipLinks() {
    if (document.querySelector('.skip-link')) return; // 이미 존재하면 중복 생성 방지
    
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = '메인 콘텐츠로 건너뛰기';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-red);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ========== ARIA 레이블 업데이트 ==========
function updateAriaLabels() {
    // Q&A 아코디언에 ARIA 속성 추가
    document.querySelectorAll('.qna-item').forEach((item, index) => {
        const question = item.querySelector('.qna-question');
        const answer = item.querySelector('.qna-answer');
        const toggle = item.querySelector('.qna-toggle');
        
        if (question && answer && toggle) {
            question.setAttribute('id', `qna-question-${index}`);
            answer.setAttribute('id', `qna-answer-${index}`);
            answer.setAttribute('aria-labelledby', `qna-question-${index}`);
            
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-controls', `qna-answer-${index}`);
        }
    });
    
    // 탭에 ARIA 속성 추가
    document.querySelectorAll('.qna-tab').forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        tab.setAttribute('id', `qna-tab-${index}`);
    });
    
    document.querySelectorAll('.qna-content').forEach((content, index) => {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-labelledby', `qna-tab-${index}`);
    });
}

// ========== 유틸리티 함수들 ==========

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 요소가 뷰포트에 있는지 확인
function isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========== 에러 처리 및 로깅 ==========
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection:', e.reason);
});

// ========== 성능 모니터링 ==========
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('페이지 로드 시간:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }, 0);
    });
}

// ========== 브라우저 호환성 검사 ==========
function checkBrowserSupport() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        smoothScroll: 'scrollBehavior' in document.documentElement.style,
        customProperties: window.CSS && CSS.supports('color', 'var(--test)')
    };
    
    if (!features.intersectionObserver) {
        console.warn('IntersectionObserver를 지원하지 않는 브라우저입니다.');
    }
    
    return features;
}

// 브라우저 지원 확인
checkBrowserSupport();

// ========== 페이지 애니메이션 초기화 ==========
function initializePageAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들 관찰
    document.querySelectorAll('.content-section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });

    // 헤더 요소들 애니메이션
    document.querySelectorAll('#main > header h2, #main > header p').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.8s ease ${0.2 + index * 0.2}s, transform 0.8s ease ${0.2 + index * 0.2}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });

    // Q&A 탭들 순차적 애니메이션
    document.querySelectorAll('.qna-tab').forEach((tab, index) => {
        tab.style.opacity = '0';
        tab.style.transform = 'translateX(-20px)';
        tab.style.transition = `opacity 0.4s ease ${0.5 + index * 0.1}s, transform 0.4s ease ${0.5 + index * 0.1}s`;
        
        setTimeout(() => {
            tab.style.opacity = '1';
            tab.style.transform = 'translateX(0)';
        }, 100);
    });
}

// ========== 부드러운 스크롤 기능 초기화 ==========
function initializeSmoothScroll() {
    // 서브 네비게이션 버튼들에 부드러운 스크롤 적용
    document.querySelectorAll('.scrolly').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 서브 네비게이션 활성 상태 업데이트
                document.querySelectorAll('.scrolly').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// ========== 스크롤 효과 초기화 ==========
function initializeScrollEffects() {
    let lastScrollTop = 0;

    const scrollHandler = debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('#header');
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 스크롤 방향 감지
        if (scrollTop > lastScrollTop) {
            // 아래로 스크롤
            header.style.transform = 'translateY(-100%)';
        } else {
            // 위로 스크롤
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 16);

    window.addEventListener('scroll', scrollHandler);
}

// ========== 반응형 메뉴 초기화 ==========
function initializeResponsiveMenu() {
    const menuToggle = document.querySelector('.menuToggle');
    const menu = document.querySelector('#menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('is-menu-visible');
        });
        
        // 메뉴 외부 클릭시 메뉴 닫기
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                document.body.classList.remove('is-menu-visible');
            }
        });
        
        // ESC 키로 메뉴 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.body.classList.remove('is-menu-visible');
            }
        });
        
        // 메뉴 항목 클릭시 메뉴 닫기
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                document.body.classList.remove('is-menu-visible');
            });
        });
    }
}

// ========== 폼 상호작용 초기화 ==========
function initializeFormInteractions() {
    // 입력 필드 포커스 효과
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim() !== '') {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
        
        // 실시간 검증
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
}

// ========== 입력 검증 함수 ==========
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    // 필수 필드 검증
    if (required && !value) {
        input.classList.add('error');
        return false;
    }
    
    // 이메일 검증
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('error');
            return false;
        }
    }
    
    // 전화번호 검증
    if (input.name === 'phone' && value) {
        const phoneRegex = /^[0-9-+\s()]+$/;
        if (!phoneRegex.test(value)) {
            input.classList.add('error');
            return false;
        }
    }
    
    input.classList.remove('error');
    return true;
}

// ========== 접근성 기능 초기화 ==========
function initializeAccessibility() {
    // 탭 키 네비게이션 개선
    const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // 포커스 시각적 표시 개선
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focused');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focused');
        });
        
        element.addEventListener('mousedown', function() {
            this.classList.remove('keyboard-focused');
        });
    });
    
    // 건너뛰기 링크 추가
    addSkipLinks();
    
    // ARIA 레이블 동적 업데이트
    updateAriaLabels();
}

// ========== 건너뛰기 링크 추가 ==========
function addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = '메인 콘텐츠로 건너뛰기';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-red);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ========== ARIA 레이블 업데이트 ==========
function updateAriaLabels() {
    // Q&A 아코디언에 ARIA 속성 추가
    document.querySelectorAll('.qna-item').forEach((item, index) => {
        const question = item.querySelector('.qna-question');
        const answer = item.querySelector('.qna-answer');
        const toggle = item.querySelector('.qna-toggle');
        
        question.setAttribute('id', `qna-question-${index}`);
        answer.setAttribute('id', `qna-answer-${index}`);
        answer.setAttribute('aria-labelledby', `qna-question-${index}`);
        
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', `qna-answer-${index}`);
    });
    
    // 탭에 ARIA 속성 추가
    document.querySelectorAll('.qna-tab').forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        tab.setAttribute('id', `qna-tab-${index}`);
    });
    
    document.querySelectorAll('.qna-content').forEach((content, index) => {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-labelledby', `qna-tab-${index}`);
    });
}

// ========== 유틸리티 함수들 ==========

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 요소가 뷰포트에 있는지 확인
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 부드러운 스크롤 함수
function smoothScrollTo(target, duration = 1000) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;
    
    const headerHeight = document.querySelector('#header').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ========== 에러 처리 및 로깅 ==========
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection:', e.reason);
});

// ========== 성능 모니터링 ==========
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('페이지 로드 시간:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// ========== 브라우저 호환성 검사 ==========
function checkBrowserSupport() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        smoothScroll: 'scrollBehavior' in document.documentElement.style,
        customProperties: CSS.supports('color', 'var(--test)')
    };
    
    if (!features.intersectionObserver) {
        console.warn('IntersectionObserver를 지원하지 않는 브라우저입니다.');
    }
    
    return features;
}

// 브라우저 지원 확인
checkBrowserSupport();