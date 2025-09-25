/* 
========== 장자기독학교 학교생활 JavaScript - 읽기 전용 갤러리 ========== 
교사 업로드 기능 제거, 서버 데이터 로드만 지원
*/

$(document).ready(function() {
    
    // ========== 전역 변수 ==========
    let currentGalleryTab = 'moments';
    let galleryItems = [];
    let lightboxIndex = 0;
    let currentPage = 1;
    let hasMoreItems = true;
    
    // ========== 초기화 ==========
    initializeGallery();
    
    function initializeGallery() {
        // 기본 기능들
        initGalleryTabs();
        initImageModal();
        initLightbox();
        initScrollAnimations();
        
        // 서버 데이터 관련
        loadGalleryFromServer();
        initLoadMore();
        
        // UI 개선
        initImageLazyLoading();
        initKeyboardAccessibility();
    }
    
    // ========== 갤러리 탭 기능 ==========
    function initGalleryTabs() {
        $('.tab-btn').click(function(e) {
            e.preventDefault();
            
            var targetTab = $(this).data('tab');
            currentGalleryTab = targetTab;
            
            // 탭 상태 업데이트
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
            
            // 갤러리 콘텐츠 전환
            $('.gallery-content').removeClass('active').fadeOut(200, function() {
                if(targetTab === 'moments') {
                    $('#our-moments').addClass('active').fadeIn(400);
                } else if(targetTab === 'works') {
                    $('#our-works').addClass('active').fadeIn(400);
                }
                
                // 해당 탭의 갤러리 데이터 로드
                loadGalleryFromServer();
            });
        });
    }
    
    // ========== 서버에서 갤러리 데이터 로드 ==========
    function loadGalleryFromServer() {
        // 실제로는 서버 API를 호출
        // fetch(`/api/gallery/${currentGalleryTab}?page=${currentPage}`)
        
        // 현재는 모킹 데이터 사용
        const mockData = getMockGalleryData();
        
        galleryItems = mockData.filter(item => item.category === currentGalleryTab);
        renderGalleryItems(galleryItems);
    }
    
    function getMockGalleryData() {
        // 실제로는 서버에서 받아올 데이터
        return [
            {
                id: 1,
                title: '2024 체육대회',
                description: '모든 학생들이 함께한 즐거운 체육대회',
                category: 'moments',
                image: 'images/pic01.jpg',
                uploadDate: '2024-01-15',
                author: '김선생',
                views: 156,
                likes: 23
            },
            {
                id: 2,
                title: '창의 미술 작품',
                description: '6학년 학생들의 창의적인 미술 작품',
                category: 'works',
                image: 'images/pic02.jpg',
                uploadDate: '2024-01-14',
                author: '이선생',
                views: 89,
                likes: 15
            },
            {
                id: 3,
                title: '매주 수요 기도회',
                description: '학생들과 함께하는 은혜로운 기도 시간',
                category: 'moments',
                image: 'images/pic03.jpg',
                uploadDate: '2024-01-13',
                author: '박선생',
                views: 234,
                likes: 41
            },
            {
                id: 4,
                title: '서예 작품 전시',
                description: '한글날 기념 서예 작품 전시회',
                category: 'works',
                image: 'images/pic01.jpg',
                uploadDate: '2024-01-12',
                author: '최선생',
                views: 178,
                likes: 32
            },
            {
                id: 5,
                title: '과학 실험 시간',
                description: '재미있는 과학 실험으로 배우는 시간',
                category: 'moments',
                image: 'images/pic02.jpg',
                uploadDate: '2024-01-11',
                author: '김선생',
                views: 145,
                likes: 28
            },
            {
                id: 6,
                title: '창작 시 모음',
                description: '학생들이 직접 쓴 아름다운 시들',
                category: 'works',
                image: 'images/pic03.jpg',
                uploadDate: '2024-01-10',
                author: '정선생',
                views: 203,
                likes: 37
            }
        ];
    }
    
    function renderGalleryItems(items) {
        const activeGallery = currentGalleryTab === 'moments' ? 
            $('#moments-gallery') : $('#works-gallery');
        
        // 기존 내용 지우고 새로 렌더링
        activeGallery.empty();
        
        items.forEach((item, index) => {
            const galleryHtml = `
                <div class="col-4 col-6-medium col-12-small gallery-item-wrapper" data-index="${index}">
                    <span class="image fit gallery-image" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" loading="lazy" />
                        <div class="overlay">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <div class="image-meta">
                                <span class="author"><i class="fas fa-user"></i> ${item.author}</span>
                                <span class="date"><i class="fas fa-calendar"></i> ${item.uploadDate}</span>
                                <span class="stats">
                                    <i class="fas fa-eye"></i> ${item.views}
                                    <i class="fas fa-heart"></i> ${item.likes}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>
            `;
            
            activeGallery.append(galleryHtml);
        });
        
        // 이미지들에 이벤트 바인딩
        bindGalleryEvents();
        
        // 레이지 로딩 초기화
        initImageLazyLoading();
        
        // 더보기 버튼 표시 여부 결정
        updateLoadMoreButton();
    }
    
    // ========== 더보기 기능 ==========
    function initLoadMore() {
        $('#loadMoreBtn').click(function(e) {
            e.preventDefault();
            loadMoreItems();
        });
    }
    
    function loadMoreItems() {
        currentPage++;
        
        // 실제로는 서버에서 다음 페이지 데이터를 가져옴
        // fetch(`/api/gallery/${currentGalleryTab}?page=${currentPage}`)
        
        const $loadBtn = $('#loadMoreBtn');
        $loadBtn.text('로딩 중...').prop('disabled', true);
        
        setTimeout(() => {
            // 모킹: 더 이상 데이터가 없다고 가정
            if (currentPage >= 3) {
                hasMoreItems = false;
                $loadBtn.hide();
                
                // 마지막 메시지 표시
                $('.gallery-load-more').append('<p style="margin-top: 1rem; color: var(--text-secondary);">모든 사진을 불러왔습니다.</p>');
            } else {
                $loadBtn.text('더 많은 사진 보기').prop('disabled', false);
            }
        }, 1500);
    }
    
    function updateLoadMoreButton() {
        const $loadBtn = $('#loadMoreBtn');
        
        if (hasMoreItems && galleryItems.length > 0) {
            $loadBtn.show();
        } else {
            $loadBtn.hide();
        }
    }
    
    // ========== 갤러리 이벤트 바인딩 ==========
    function bindGalleryEvents() {
        // 호버 효과
        $('.gallery-image').hover(
            function() {
                $(this).find('.overlay').fadeIn(300);
            },
            function() {
                $(this).find('.overlay').fadeOut(300);
            }
        );
        
        // 클릭으로 라이트박스 열기
        $('.gallery-image').click(function() {
            const index = $(this).closest('.gallery-item-wrapper').data('index');
            openLightbox(index);
            
            // 조회수 증가 (서버에 전송)
            const itemId = $(this).data('id');
            incrementViewCount(itemId);
        });
    }
    
    function incrementViewCount(itemId) {
        // 실제로는 서버에 조회수 증가 요청
        // fetch(`/api/gallery/${itemId}/view`, { method: 'POST' })
        
        // 로컬 데이터 업데이트
        const item = galleryItems.find(item => item.id === itemId);
        if (item) {
            item.views++;
            
            // UI 업데이트
            $(`.gallery-image[data-id="${itemId}"] .stats .fa-eye`).next().text(item.views);
        }
    }
    
    // ========== 라이트박스 기능 ==========
    function initLightbox() {
        // 라이트박스 HTML 생성
        const lightboxHtml = `
            <div id="gallery-lightbox" class="lightbox-overlay">
                <div class="lightbox-container">
                    <button class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="lightbox-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="lightbox-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="lightbox-content">
                        <img src="" alt="" class="lightbox-image">
                        <div class="lightbox-info">
                            <h3 class="lightbox-title"></h3>
                            <p class="lightbox-description"></p>
                            <div class="lightbox-meta">
                                <span class="lightbox-author"></span>
                                <span class="lightbox-date"></span>
                                <span class="lightbox-stats"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(lightboxHtml);
        
        // 라이트박스 이벤트
        $('#gallery-lightbox .lightbox-close').click(closeLightbox);
        $('#gallery-lightbox .lightbox-prev').click(prevImage);
        $('#gallery-lightbox .lightbox-next').click(nextImage);
        $('#gallery-lightbox .lightbox-overlay').click(function(e) {
            if (e.target === this) closeLightbox();
        });
        
        // 키보드 네비게이션
        $(document).keydown(function(e) {
            if ($('#gallery-lightbox').hasClass('active')) {
                switch(e.keyCode) {
                    case 37: // 왼쪽 화살표
                        prevImage();
                        break;
                    case 39: // 오른쪽 화살표
                        nextImage();
                        break;
                    case 27: // ESC
                        closeLightbox();
                        break;
                }
            }
        });
    }
    
    function openLightbox(index) {
        lightboxIndex = index;
        updateLightboxContent();
        $('#gallery-lightbox').addClass('active');
        $('body').addClass('lightbox-open');
    }
    
    function closeLightbox() {
        $('#gallery-lightbox').removeClass('active');
        $('body').removeClass('lightbox-open');
    }
    
    function nextImage() {
        lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }
    
    function prevImage() {
        lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }
    
    function updateLightboxContent() {
        const item = galleryItems[lightboxIndex];
        if (!item) return;
        
        $('#gallery-lightbox .lightbox-image').attr('src', item.image).attr('alt', item.title);
        $('#gallery-lightbox .lightbox-title').text(item.title);
        $('#gallery-lightbox .lightbox-description').text(item.description);
        $('#gallery-lightbox .lightbox-author').html(`<i class="fas fa-user"></i> ${item.author}`);
        $('#gallery-lightbox .lightbox-date').html(`<i class="fas fa-calendar"></i> ${item.uploadDate}`);
        $('#gallery-lightbox .lightbox-stats').html(`<i class="fas fa-eye"></i> ${item.views} <i class="fas fa-heart"></i> ${item.likes}`);
    }
    
    // ========== 기존 모달 기능 (단순 버전) ==========
    function initImageModal() {
        // 간단한 모달 - 라이트박스가 있으므로 생략 가능
    }
    
    // ========== 이미지 레이지 로딩 ==========
    function initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                        }
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // ========== 스크롤 애니메이션 ==========
    function initScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // 관찰 대상 요소들
            document.querySelectorAll('.gallery .image, .schedule-card').forEach(function(el) {
                observer.observe(el);
            });
        }
    }
    
    // ========== 키보드 접근성 ==========
    function initKeyboardAccessibility() {
        $('.gallery .image').attr('tabindex', '0').on('keydown', function(e) {
            if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                e.preventDefault();
                $(this).click();
            }
        });
        
        $('.tab-btn').on('keydown', function(e) {
            const $tabs = $('.tab-btn');
            const currentIndex = $tabs.index(this);
            
            if (e.keyCode === 37) { // 왼쪽 화살표
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : $tabs.length - 1;
                $tabs.eq(prevIndex).focus().click();
            } else if (e.keyCode === 39) { // 오른쪽 화살표
                e.preventDefault();
                const nextIndex = currentIndex < $tabs.length - 1 ? currentIndex + 1 : 0;
                $tabs.eq(nextIndex).focus().click();
            }
        });
    }
    
    // ========== 반응형 레이아웃 ==========
    function adjustGalleryLayout() {
        const windowWidth = $(window).width();
        const galleryItems = $('.gallery .col-4, .gallery .col-6, .gallery .col-12');
        
        if (windowWidth <= 480) {
            galleryItems.removeClass('col-4 col-6').addClass('col-12');
        } else if (windowWidth <= 736) {
            galleryItems.removeClass('col-4 col-12').addClass('col-6');
        } else if (windowWidth <= 980) {
            galleryItems.removeClass('col-4 col-12').addClass('col-6');
        } else {
            galleryItems.removeClass('col-6 col-12').addClass('col-4');
        }
    }
    
    // ========== 윈도우 이벤트 ==========
    $(window).resize(function() {
        adjustGalleryLayout();
    });
    
    // 초기 레이아웃 조정
    adjustGalleryLayout();
    
    console.log('장자기독학교 갤러리 시스템 초기화 완료 (읽기 전용 모드)');
});