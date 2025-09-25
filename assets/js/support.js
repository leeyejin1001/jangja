/**
 * 장자기독학교 후원안내 페이지 JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 게시판 데이터 관리 ==========
    let boardPosts = [];
    let currentPage = 1;
    const postsPerPage = 10;
    
    // ========== 모달 요소들 ==========
    const writeBtn = document.getElementById('write-btn');
    const writeModal = document.getElementById('write-modal');
    const modalClose = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancel-btn');
    const writeForm = document.getElementById('write-form');
    
    // ========== 게시판 기능 ==========
    function renderBoardTable() {
        const tbody = document.getElementById('board-tbody');
        const postCount = document.querySelector('.post-count strong');
        
        if (!tbody || !postCount) return;
        
        postCount.textContent = boardPosts.length;
        
        if (boardPosts.length === 0) {
            tbody.innerHTML = `
                <tr class="no-posts">
                    <td colspan="5" class="text-center">
                        <div class="no-posts-message">
                            <p>아직 등록된 후원내역이 없습니다.</p>
                            <p>첫 번째 후원내역을 작성해보세요!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const currentPosts = boardPosts.slice(startIndex, endIndex);
        
        tbody.innerHTML = currentPosts.map((post, index) => `
            <tr class="post-row" data-id="${post.id}">
                <td class="col-number">${boardPosts.length - startIndex - index}</td>
                <td class="col-title">
                    <a href="#" class="post-link" data-id="${post.id}">${post.title}</a>
                </td>
                <td class="col-author">${post.author}</td>
                <td class="col-date">${post.date}</td>
                <td class="col-views">${post.views}</td>
            </tr>
        `).join('');
        
        // 게시글 제목 클릭 이벤트
        document.querySelectorAll('.post-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const postId = this.getAttribute('data-id');
                viewPost(postId);
            });
        });
    }
    
    function addPost(postData) {
        const newPost = {
            id: Date.now(),
            title: postData.title,
            author: postData.author,
            content: postData.content,
            date: new Date().toLocaleDateString('ko-KR'),
            views: 0
        };
        
        boardPosts.unshift(newPost);
        renderBoardTable();
        updatePagination();
        showNotification('후원내역이 성공적으로 등록되었습니다.', 'success');
    }
    
    function viewPost(postId) {
        const post = boardPosts.find(p => p.id == postId);
        if (post) {
            post.views++;
            // 여기서 게시글 상세보기 모달이나 페이지로 이동
            console.log('게시글 보기:', post);
            showNotification('게시글을 조회했습니다.', 'info');
            renderBoardTable();
        }
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(boardPosts.length / postsPerPage);
        const paginationList = document.querySelector('.pagination-list');
        
        if (!paginationList) return;
        
        // 페이지네이션 업데이트 로직
        // 현재는 기본 구조만 유지
    }
    
    // ========== 모달 기능 ==========
    function openModal() {
        if (writeModal) {
            writeModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            // 첫 번째 입력 필드에 포커스
            const firstInput = writeModal.querySelector('input[type="text"]');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }
    
    function closeModal() {
        if (writeModal) {
            writeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (writeForm) {
                writeForm.reset();
            }
        }
    }
    
    // ========== 이벤트 리스너 ==========
    if (writeBtn) {
        writeBtn.addEventListener('click', openModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (writeModal) {
        writeModal.addEventListener('click', function(e) {
            if (e.target === writeModal) {
                closeModal();
            }
        });
    }
    
    if (writeForm) {
        writeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const postData = {
                title: formData.get('title').trim(),
                author: formData.get('author').trim(),
                content: formData.get('content').trim()
            };
            
            // 입력 검증
            if (!postData.title || !postData.author || !postData.content) {
                showNotification('모든 필수 항목을 입력해주세요.', 'error');
                return;
            }
            
            addPost(postData);
            closeModal();
        });
    }
    
    // ========== 서브 네비게이션 활성화 ==========
    const subNavButtons = document.querySelectorAll('.sub-nav .button');
    
    subNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 모든 버튼에서 active 클래스 제거
            subNavButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭한 버튼에 active 클래스 추가
            this.classList.add('active');
        });
    });
    
    // ========== 스무스 스크롤 ==========
    document.querySelectorAll('.scrolly').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========== 메뉴 토글 기능 ==========
    const menuToggle = document.querySelector('.menuToggle');
    const menu = document.getElementById('menu');
    const body = document.body;
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            body.classList.toggle('is-menu-visible');
        });
    }
    
    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (body.classList.contains('is-menu-visible') && menu) {
            if (!menu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
                body.classList.remove('is-menu-visible');
            }
        }
    });
    
    // ESC 키로 모달 및 메뉴 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (writeModal && writeModal.style.display === 'flex') {
                closeModal();
            } else if (body.classList.contains('is-menu-visible')) {
                body.classList.remove('is-menu-visible');
            }
        }
    });
    
    // ========== 초기화 ==========
    renderBoardTable();
    updatePagination();
    
    // ========== 스크롤 시 헤더 스타일 변경 ==========
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ========== 페이지 로드 애니메이션 ==========
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
        section.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
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
    
    // ========== 후원 관련 유틸리티 함수 (추후 사용) ==========
    function formatCurrency(amount) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePhone(phone) {
        const phoneRegex = /^(\d{2,3}-?\d{3,4}-?\d{4})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    function validateForm(form) {
        if (!form) return false;
        
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#dc2626';
                isValid = false;
            } else {
                input.style.borderColor = '#404040';
            }
        });
        
        return isValid;
    }
    
    // ========== 알림 시스템 ==========
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const borderColor = type === 'success' ? '#1e40af' : 
                           type === 'error' ? '#dc2626' : '#404040';
        const bgColor = type === 'success' ? 'rgba(30, 64, 175, 0.1)' : 
                       type === 'error' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(42, 42, 42, 1)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: #ffffff;
            padding: 1rem 2rem;
            border-radius: 8px;
            border: 1px solid ${borderColor};
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-family: 'Noto Sans KR', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // 애니메이션으로 표시
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // ========== 키보드 네비게이션 접근성 ==========
    document.addEventListener('keydown', function(e) {
        // Tab 키로 네비게이션 향상
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('button')) {
                focusedElement.style.outline = '2px solid var(--primary-blue)';
                focusedElement.style.outlineOffset = '2px';
            }
        }
        
        // Enter 키로 버튼 활성화
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('button')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });
    
    // 포커스 해제 시 아웃라인 제거
    document.addEventListener('focusout', function(e) {
        if (e.target.classList.contains('button')) {
            e.target.style.outline = 'none';
        }
    });
    
    // ========== 페이지 진입 애니메이션 ==========
    setTimeout(() => {
        document.body.classList.remove('is-preload');
    }, 100);
    
    // ========== 디버깅 및 콘솔 로그 ==========
    console.log('장자기독학교 후원안내 페이지가 로드되었습니다.');
    console.log('서브 네비게이션 버튼:', subNavButtons.length + '개');
    console.log('콘텐츠 섹션 로드 완료');
    
    // ========== 후원 폼 처리 (추후 확장용) ==========
    function handleSupportForm(formData) {
        // 후원 신청 폼 처리 로직이 여기에 추가될 예정
        console.log('후원 신청 처리:', formData);
        showNotification('후원 신청이 접수되었습니다.', 'success');
    }
    
    function handleSupportInquiry(inquiryData) {
        // 후원 문의 처리 로직이 여기에 추가될 예정
        console.log('후원 문의 처리:', inquiryData);
        showNotification('문의가 접수되었습니다.', 'success');
    }
    
    // ========== 페이지 상태 관리 ==========
    const pageState = {
        currentSection: 'support-guide',
        isLoading: false,
        animationsEnabled: true
    };
    
    // 페이지 상태 변경 함수
    function updatePageState(newState) {
        Object.assign(pageState, newState);
        console.log('페이지 상태 업데이트:', pageState);
    }
    
    // ========== 접근성 향상 ==========
    // 포커스 트랩 (모달 등에서 사용)
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // ========== 성능 최적화 ==========
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
    
    // ========== 초기화 완료 ==========
    updatePageState({ isLoading: false });
    console.log('후원안내 페이지 초기화 완료');
    
});