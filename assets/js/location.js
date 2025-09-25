/**
 * 장자기독학교 오시는길 페이지 JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 학교 위치 정보 ==========
    const schoolLocation = {
        lat: 36.3504119,
        lng: 127.2982817,
        address: '대전광역시 유성구 계백로 913',
        detailAddress: '대전광역시 유성구 원내동 31번지',
        name: '장자기독학교 (한밭제일교회부설)'
    };
    
    // ========== 네이버 지도 초기화 ==========
    let naverMap = null;
    let marker = null;
    
    function initNaverMap() {
        // 네이버 지도 API가 로드되었는지 확인
        if (typeof naver === 'undefined' || !naver.maps) {
            console.log('네이버 지도 API를 사용할 수 없습니다. 대체 지도를 표시합니다.');
            showFallbackMap();
            return;
        }
        
        try {
            const mapOptions = {
                center: new naver.maps.LatLng(schoolLocation.lat, schoolLocation.lng),
                zoom: 16,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: naver.maps.MapTypeControlStyle.BUTTON,
                    position: naver.maps.Position.TOP_RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: naver.maps.ZoomControlStyle.LARGE,
                    position: naver.maps.Position.TOP_LEFT
                }
            };
            
            naverMap = new naver.maps.Map('naverMap', mapOptions);
            
            // 마커 추가
            marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(schoolLocation.lat, schoolLocation.lng),
                map: naverMap,
                title: schoolLocation.name
            });
            
            // 정보창 추가
            const infoWindow = new naver.maps.InfoWindow({
                content: `
                    <div style="padding: 10px; font-family: 'Noto Sans KR', sans-serif;">
                        <h4 style="margin: 0 0 5px 0; color: #333;">${schoolLocation.name}</h4>
                        <p style="margin: 0; color: #666; font-size: 12px;">${schoolLocation.address}</p>
                    </div>
                `
            });
            
            // 마커 클릭 시 정보창 표시
            naver.maps.Event.addListener(marker, 'click', function() {
                if (infoWindow.getMap()) {
                    infoWindow.close();
                } else {
                    infoWindow.open(naverMap, marker);
                }
            });
            
            console.log('네이버 지도가 성공적으로 로드되었습니다.');
            
        } catch (error) {
            console.error('네이버 지도 로드 중 오류:', error);
            showFallbackMap();
        }
    }
    
    // ========== 대체 지도 표시 ==========
    function showFallbackMap() {
        const mapContainer = document.getElementById('naverMap');
        if (!mapContainer) return;
        
        mapContainer.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: var(--dark-surface);
                color: var(--text-secondary);
                border-radius: 8px;
                padding: 2rem;
                text-align: center;
            ">
                <div style="font-size: 3em; margin-bottom: 1rem; color: var(--primary-red);">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h4 style="color: var(--text-primary); margin-bottom: 1rem;">위치 정보</h4>
                <p style="margin-bottom: 0.5rem;">${schoolLocation.address}</p>
                <p style="margin-bottom: 1.5rem; font-size: 0.9em;">${schoolLocation.detailAddress}</p>
                <a href="https://map.naver.com/v5/search/${encodeURIComponent(schoolLocation.address)}" 
                   target="_blank" 
                   style="
                       background: var(--gradient-primary);
                       color: white;
                       padding: 0.8rem 2rem;
                       border-radius: 8px;
                       text-decoration: none;
                       font-weight: 600;
                       transition: transform 0.3s ease;
                   "
                   onmouseover="this.style.transform='translateY(-2px)'"
                   onmouseout="this.style.transform='translateY(0)'"
                >네이버 지도에서 보기</a>
            </div>
        `;
    }
    
    // ========== 지도 컨트롤 기능 ==========
    const resetMapBtn = document.getElementById('reset-map-btn');
    const naverMapBtn = document.getElementById('naver-map-btn');
    const copyAddressBtn = document.getElementById('copy-address-btn');
    
    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', function() {
            if (naverMap) {
                naverMap.setCenter(new naver.maps.LatLng(schoolLocation.lat, schoolLocation.lng));
                naverMap.setZoom(16);
                showNotification('지도가 초기화되었습니다.', 'info');
            }
        });
    }
    
    if (naverMapBtn) {
        naverMapBtn.addEventListener('click', function() {
            const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(schoolLocation.address)}`;
            window.open(naverMapUrl, '_blank');
        });
    }
    
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(schoolLocation.address);
                showNotification('주소가 클립보드에 복사되었습니다.', 'success');
            } catch (error) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = schoolLocation.address;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('주소가 복사되었습니다.', 'success');
            }
        });
    }
    
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
    
    // ESC 키로 메뉴 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('is-menu-visible')) {
            body.classList.remove('is-menu-visible');
        }
    });
    
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
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
    
    // ========== 유틸리티 함수 ==========
    function getDirectionsUrl(destination) {
        const encoded = encodeURIComponent(destination);
        return `https://map.naver.com/v5/directions/${encoded}`;
    }
    
    function getSearchUrl(query) {
        const encoded = encodeURIComponent(query);
        return `https://map.naver.com/v5/search/${encoded}`;
    }
    
    // ========== 키보드 네비게이션 접근성 ==========
    document.addEventListener('keydown', function(e) {
        // Tab 키로 네비게이션 향상
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('button')) {
                focusedElement.style.outline = '2px solid #1e40af';
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
    
    // ========== 지도 초기화 및 디버깅 ==========
    // 페이지 로드 후 지도 초기화
    setTimeout(() => {
        initNaverMap();
    }, 500);
    
    console.log('장자기독학교 오시는길 페이지가 로드되었습니다.');
    console.log('학교 위치:', schoolLocation);
    
});