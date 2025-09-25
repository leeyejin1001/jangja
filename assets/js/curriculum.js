/* ========== 중고등교육과정 페이지 JavaScript - 고급 애니메이션 ========== */

$(document).ready(function() {
    
    // ========== 부드러운 스크롤 네비게이션 (수정됨) ==========
    $('.curriculum-nav a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var targetId = $(this).attr('href');
        var target = $(targetId);
        
        if (target.length) {
            // 모든 네비게이션 버튼에서 active 클래스 제거
            $('.curriculum-nav .button').removeClass('active');
            // 클릭된 버튼에 active 클래스 추가
            $(this).addClass('active');
            
            // 부드러운 스크롤 실행
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 120
            }, 1000, 'easeInOutQuart');
        }
    });
    
    // ========== Intersection Observer를 활용한 고급 스크롤 애니메이션 ==========
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };
    
    // 슬라이드 애니메이션 Observer
    const slideObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const slideContent = entry.target;
                
                // 지연 효과를 위한 타이머
                setTimeout(() => {
                    slideContent.classList.add('slide-in');
                }, 100);
                
                // 한 번 애니메이션이 실행되면 관찰 중지
                slideObserver.unobserve(slideContent);
            }
        });
    }, observerOptions);
    
    // 프로그램 카드 애니메이션 Observer
    const programObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                const program = entry.target;
                
                // 순차적 애니메이션을 위한 지연
                setTimeout(() => {
                    program.classList.add('animate-in');
                }, index * 200);
                
                programObserver.unobserve(program);
            }
        });
    }, observerOptions);
    
    // ========== 요소들을 Observer에 등록 ==========
    $('.slide-content').each(function() {
        slideObserver.observe(this);
    });
    
    $('.special-program').each(function() {
        programObserver.observe(this);
    });
    
    // ========== 스크롤 기반 네비게이션 활성화 (수정됨) ==========
    let isScrolling = false;
    let scrollTimeout;
    
    $(window).on('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateActiveNavigation();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    function updateActiveNavigation() {
        const scrollPos = $(window).scrollTop() + 200;
        let activeSet = false;
        
        // 각 섹션을 확인하여 현재 보이는 섹션 찾기
        $('#jangja-education, #special-education, #subject-education, #extracurricular').each(function() {
            const $section = $(this);
            const sectionTop = $section.offset().top;
            const sectionBottom = sectionTop + $section.outerHeight();
            
            if (scrollPos >= sectionTop - 50 && scrollPos < sectionBottom && !activeSet) {
                $('.curriculum-nav .button').removeClass('active');
                $('a[href="#' + $section.attr('id') + '"]').addClass('active');
                activeSet = true;
            }
        });
    }
    
    // ========== 이미지 로드 에러 처리 및 Lazy Loading ==========
    $('img').each(function() {
        const $img = $(this);
        const src = $img.attr('src');
        
        // 이미지 로드 에러 시 플레이스홀더로 대체
        $img.on('error', function() {
            console.log('이미지 로드 실패:', src);
            const placeholderUrl = `https://via.placeholder.com/800x400/1a1a1a/dc2626?text=${encodeURIComponent('장자기독학교')}`;
            $(this).attr('src', placeholderUrl);
        });
        
        // 이미지 로드 완료 시 페이드인 효과
        $img.on('load', function() {
            $(this).addClass('loaded');
        });
    });
    
    // ========== 프로그램 카드 호버 효과 강화 ==========
    $('.program-card').hover(
        function() {
            $(this).find('.program-icon').addClass('hover-effect');
            $(this).find('.program-details li').each(function(index) {
                setTimeout(() => {
                    $(this).addClass('highlight');
                }, index * 50);
            });
        },
        function() {
            $(this).find('.program-icon').removeClass('hover-effect');
            $(this).find('.program-details li').removeClass('highlight');
        }
    );
    
    // ========== 동적 그라데이션 효과 ==========
    function createDynamicGradient() {
        const cards = $('.subject-card, .activity-card');
        
        cards.each(function() {
            const $card = $(this);
            let isHovered = false;
            
            $card.mousemove(function(e) {
                if (!isHovered) return;
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = -(x - centerX) / 10;
                
                $card.css({
                    'transform': `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`,
                    'transition': 'none'
                });
            });
            
            $card.mouseenter(function() {
                isHovered = true;
            });
            
            $card.mouseleave(function() {
                isHovered = false;
                $card.css({
                    'transform': 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
                    'transition': 'all 0.4s ease'
                });
            });
        });
    }
    
    // ========== 스크롤 진행률 표시기 ==========
    function createScrollProgress() {
        const progressBar = $('<div class="scroll-progress"></div>');
        progressBar.css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '0%',
            'height': '3px',
            'background': 'linear-gradient(90deg, #dc2626, #1e40af)',
            'z-index': '10001',
            'transition': 'width 0.1s ease'
        });
        
        $('body').append(progressBar);
        
        $(window).scroll(function() {
            const scrollTop = $(window).scrollTop();
            const docHeight = $(document).height() - $(window).height();
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.css('width', scrollPercent + '%');
        });
    }
    
    // ========== 페이지 로드 애니메이션 ==========
    function initPageAnimation() {
        // 헤더 애니메이션
        $('#main header').addClass('animate-in');
        
        // 네비게이션 버튼들 순차 애니메이션
        $('.curriculum-nav .button').each(function(index) {
            const $button = $(this);
            setTimeout(() => {
                $button.addClass('animate-in');
            }, 500 + (index * 100));
        });
        
        // 첫 번째 섹션이 뷰포트에 있으면 즉시 애니메이션
        setTimeout(() => {
            const firstSlide = $('.slide-content').first()[0];
            if (firstSlide && isElementInViewport(firstSlide)) {
                $(firstSlide).addClass('slide-in');
            }
        }, 800);
        
        // 초기 네비게이션 상태 설정
        setTimeout(updateActiveNavigation, 1000);
    }
    
    // ========== 유틸리티 함수들 ==========
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // ========== 디바운스 함수 ==========
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
    
    // ========== 리사이즈 이벤트 최적화 ==========
    const optimizedResize = debounce(function() {
        // 리사이즈 시 스크롤 위치 재계산
        updateActiveNavigation();
        
        // 모바일에서 카드 효과 비활성화
        if ($(window).width() <= 768) {
            $('.program-card, .subject-card, .activity-card').off('mousemove mouseenter mouseleave');
        } else {
            createDynamicGradient();
        }
    }, 250);
    
    $(window).resize(optimizedResize);
    
    // ========== 터치 디바이스 최적화 ==========
    if ('ontouchstart' in window) {
        // 터치 디바이스에서 호버 효과를 탭으로 대체
        $('.program-card').on('touchstart', function(e) {
            e.preventDefault();
            $(this).toggleClass('touch-active');
        });
        
        // 터치 외부 영역 탭으로 활성화 해제
        $(document).on('touchstart', function(e) {
            if (!$(e.target).closest('.program-card').length) {
                $('.program-card').removeClass('touch-active');
            }
        });
    }
    
    // ========== 키보드 네비게이션 지원 ==========
    $(document).keydown(function(e) {
        const activeButton = $('.curriculum-nav .button.active');
        let nextButton;
        
        switch(e.keyCode) {
            case 37: // 왼쪽 화살표
                nextButton = activeButton.parent().prev().find('.button');
                break;
            case 39: // 오른쪽 화살표
                nextButton = activeButton.parent().next().find('.button');
                break;
            case 36: // Home
                nextButton = $('.curriculum-nav .button').first();
                break;
            case 35: // End
                nextButton = $('.curriculum-nav .button').last();
                break;
        }
        
        if (nextButton && nextButton.length) {
            e.preventDefault();
            nextButton.click();
        }
    });
    
    // ========== 접근성 개선 ==========
    function enhanceAccessibility() {
        // 포커스 가능한 요소들에 키보드 네비게이션 추가
        $('.curriculum-nav .button').attr('tabindex', '0');
        
        // 스크린 리더를 위한 설명 추가
        $('.slide-content img').each(function() {
            if (!$(this).attr('alt')) {
                $(this).attr('alt', '장자기독학교 교육과정 이미지');
            }
        });
        
        // 포커스 표시 개선
        $('.curriculum-nav .button').focus(function() {
            $(this).addClass('keyboard-focus');
        }).blur(function() {
            $(this).removeClass('keyboard-focus');
        });
    }
    
    // ========== 초기화 실행 ==========
    setTimeout(() => {
        initPageAnimation();
        createDynamicGradient();
        createScrollProgress();
        enhanceAccessibility();
    }, 100);
    
    // ========== 커스텀 easing 함수 등록 ==========
    $.extend($.easing, {
        easeInOutQuart: function (x) {
            return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
        }
    });
    
    console.log('중고등교육과정 페이지 JavaScript 초기화 완료');
});

// ========== 페이지 언로드 시 정리 ==========
$(window).on('beforeunload', function() {
    // 이벤트 리스너 정리
    $('.curriculum-nav a').off('click');
    $(window).off('scroll.curriculum resize.curriculum');
});