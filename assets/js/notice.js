/* ========== 알림판 JavaScript 기능 ========== */

$(document).ready(function() {
    
    // ========== 탭 네비게이션 기능 ==========
    $('.notice-tab').click(function(e) {
        e.preventDefault();
        
        // 외부 링크는 제외
        if ($(this).hasClass('bible-external')) {
            return true;
        }
        
        // 모든 탭과 섹션 비활성화
        $('.notice-tab').removeClass('active');
        $('.section-tab').removeClass('active');
        
        // 클릭된 탭 활성화
        $(this).addClass('active');
        
        // 해당 섹션 활성화 (페이드 효과와 함께)
        var tabId = $(this).data('tab');
        var $targetSection = $('#' + tabId);
        
        $targetSection.addClass('active');
        
        // 섹션 애니메이션
        setTimeout(() => {
            $targetSection.find('.notice-board').addClass('fade-in');
        }, 100);
        
        // 스크롤을 해당 섹션으로 부드럽게 이동
        $('html, body').animate({
            scrollTop: $targetSection.offset().top - 120
        }, 800, 'easeInOutCubic');
    });
    
    // ========== 게시판 검색 기능 ==========
    $('.board-search input').on('input', function() {
        var searchText = $(this).val().toLowerCase().trim();
        var $board = $(this).closest('.notice-board');
        var $items = $board.find('.notice-item');
        var visibleCount = 0;
        
        $items.each(function() {
            var title = $(this).find('.notice-title').text().toLowerCase();
            var $item = $(this);
            
            if (title.includes(searchText) || searchText === '') {
                $item.show().addClass('search-match');
                visibleCount++;
                
                // 검색 결과 하이라이트
                if (searchText !== '') {
                    var highlightedText = $(this).find('.notice-title').text()
                        .replace(new RegExp(searchText, 'gi'), '<mark>$&</mark>');
                    $(this).find('.notice-title').html(highlightedText);
                }
            } else {
                $item.hide().removeClass('search-match');
            }
        });
        
        // 검색 결과 없음 메시지
        var $noResults = $board.find('.no-results');
        if (visibleCount === 0 && searchText !== '') {
            if ($noResults.length === 0) {
                $board.find('.board-list').append(
                    '<div class="no-results" style="text-align: center; padding: 2rem; color: #888;">검색 결과가 없습니다.</div>'
                );
            }
        } else {
            $noResults.remove();
        }
    });
    
    // 검색 버튼 클릭
    $('.search-btn').click(function(e) {
        e.preventDefault();
        var $input = $(this).siblings('input');
        var searchText = $input.val();
        
        if (searchText.trim() === '') {
            $input.focus();
            return;
        }
        
        // 검색 애니메이션 효과
        $(this).addClass('searching');
        setTimeout(() => {
            $(this).removeClass('searching');
        }, 1000);
    });
    
    // ========== 게시판 아이템 클릭 효과 ==========
    $('.notice-item').click(function(e) {
        e.preventDefault();
        
        // 클릭 애니메이션
        $(this).addClass('clicked');
        setTimeout(() => {
            $(this).removeClass('clicked');
        }, 300);
        
        // 게시글 상세보기 모달 (추후 구현)
        var postId = $(this).data('id');
        var title = $(this).find('.notice-title').text();
        
        console.log('게시글 클릭:', postId, title);
        // showPostDetail(postId); // 추후 구현
    });
    
    // ========== 글쓰기 버튼 기능 ==========
    $('.write-btn').click(function(e) {
        e.preventDefault();
        
        // 글쓰기 모달 열기 (추후 구현)
        console.log('글쓰기 버튼 클릭');
        alert('글쓰기 기능은 곧 구현될 예정입니다.');
    });
    
    // ========== 상담 폼 제출 ==========
    $('#counselForm').on('submit', function(e) {
        e.preventDefault();
        
        var formData = {
            name: $(this).find('input[name="name"]').val(),
            category: $(this).find('select[name="category"]').val(),
            message: $(this).find('textarea[name="message"]').val()
        };
        
        // 폼 유효성 검사
        if (!formData.name || !formData.category || !formData.message) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        // 제출 애니메이션
        var $submitBtn = $(this).find('input[type="submit"]');
        $submitBtn.val('전송 중...').prop('disabled', true);
        
        // 실제로는 서버로 데이터 전송
        setTimeout(() => {
            alert('상담 신청이 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
            this.reset();
            $submitBtn.val('상담 신청').prop('disabled', false);
            
            // 최근 상담 목록에 추가
            addRecentCounsel(formData);
        }, 1500);
    });
    
    // ========== 최근 상담 목록에 추가 ==========
    function addRecentCounsel(data) {
        var $recentBoard = $('.notice-board').filter(':contains("최근 상담")');
        var $boardList = $recentBoard.find('.board-list');
        
        var newCounselItem = `
            <div class="notice-item counsel-item new-item" data-id="new">
                <div class="counsel-info">
                    <span class="notice-title">${data.category} 상담</span>
                    <span class="counsel-status pending">답변대기</span>
                </div>
                <span class="notice-date">방금 전</span>
            </div>
        `;
        
        $boardList.prepend(newCounselItem);
        
        // 새 항목 애니메이션
        setTimeout(() => {
            $boardList.find('.new-item').addClass('fade-in');
        }, 100);
        
        // 5개 초과시 마지막 항목 제거
        if ($boardList.find('.notice-item').length > 5) {
            $boardList.find('.notice-item:last').fadeOut(300, function() {
                $(this).remove();
            });
        }
    }
    
    // ========== 키보드 네비게이션 ==========
    $(document).keydown(function(e) {
        // ESC 키로 검색 초기화
        if (e.keyCode === 27) {
            $('.board-search input').val('').trigger('input');
        }
        
        // 엔터 키로 검색
        if (e.keyCode === 13 && $('.board-search input').is(':focus')) {
            e.preventDefault();
            $('.board-search input').siblings('.search-btn').click();
        }
        
        // 탭 키 네비게이션 (Ctrl + 1,2,3,4)
        if (e.ctrlKey) {
            var tabIndex = null;
            switch(e.keyCode) {
                case 49: tabIndex = 0; break; // Ctrl + 1
                case 50: tabIndex = 1; break; // Ctrl + 2  
                case 51: tabIndex = 2; break; // Ctrl + 3
                case 52: // Ctrl + 4 (성경쓰기 - 새창)
                    window.open('https://bible-writing-site.com', '_blank');
                    return;
            }
            
            if (tabIndex !== null) {
                e.preventDefault();
                $('.notice-tab').eq(tabIndex).click();
            }
        }
    });
    
    // ========== 실시간 시계 (게시글 시간 업데이트) ==========
    function updateRelativeTime() {
        $('.notice-date').each(function() {
            var dateText = $(this).text();
            
            // "방금 전" -> "1분전" -> "2분전" 등으로 업데이트
            if (dateText === '방금 전') {
                setTimeout(() => {
                    $(this).text('1분전');
                }, 60000);
            }
        });
    }
    
    // ========== 게시판 정렬 기능 ==========
    function sortBoard(criteria) {
        $('.board-list').each(function() {
            var $items = $(this).find('.notice-item').detach();
            
            $items.sort(function(a, b) {
                if (criteria === 'date') {
                    return $(b).find('.notice-date').text().localeCompare($(a).find('.notice-date').text());
                } else if (criteria === 'title') {
                    return $(a).find('.notice-title').text().localeCompare($(b).find('.notice-title').text());
                }
            });
            
            $(this).append($items);
        });
    }
    
    // ========== 무한 스크롤 (추후 구현용) ==========
    function checkInfiniteScroll() {
        var $window = $(window);
        var scrollTop = $window.scrollTop();
        var windowHeight = $window.height();
        var documentHeight = $(document).height();
        
        // 페이지 하단 근처에 도달하면 추가 콘텐츠 로드
        if (scrollTop + windowHeight > documentHeight - 100) {
            loadMoreContent();
        }
    }
    
    function loadMoreContent() {
        // 추후 구현: 서버에서 추가 게시글 로드
        console.log('추가 콘텐츠 로드 요청');
    }
    
    // ========== 초기화 ==========
    function initNoticePage() {
        // 첫 번째 탭 활성화
        $('.notice-tab.active').trigger('click');
        
        // 실시간 시계 시작
        updateRelativeTime();
        setInterval(updateRelativeTime, 60000);
        
        // 무한 스크롤 이벤트 (비활성화 상태)
        // $(window).scroll(debounce(checkInfiniteScroll, 100));
        
        console.log('알림판 페이지 초기화 완료');
    }
    
    // ========== 유틸리티 함수 ==========
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
    
    // 커스텀 easing 함수
    $.extend($.easing, {
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    });
    
    // 페이지 초기화 실행
    setTimeout(initNoticePage, 100);
});

// ========== 전역 함수들 (다른 스크립트에서 호출 가능) ==========
window.NoticePage = {
    // 특정 탭으로 이동
    goToTab: function(tabName) {
        $('.notice-tab[data-tab="' + tabName + '"]').click();
    },
    
    // 검색 실행
    search: function(query) {
        $('.board-search input').val(query).trigger('input');
    },
    
    // 새 공지사항 추가
    addNotice: function(notice) {
        var newItem = `
            <div class="notice-item new-item" data-id="${notice.id}">
                ${notice.important ? '<span class="notice-badge important">중요</span>' : ''}
                <span class="notice-title">${notice.title}</span>
                <span class="notice-date">${notice.date}</span>
            </div>
        `;
        
        $('#announcements .board-list').prepend(newItem);
        
        setTimeout(() => {
            $('.new-item').addClass('fade-in').removeClass('new-item');
        }, 100);
    }
};

// ========== 페이지 언로드 시 정리 ==========
$(window).on('beforeunload', function() {
    // 이벤트 리스너 정리
    $('.notice-tab, .notice-item, .search-btn, .write-btn').off();
    $('#counselForm').off();
    $(document).off('keydown');
    
    // 인터벌 정리
    if (window.timeUpdateInterval) {
        clearInterval(window.timeUpdateInterval);
    }
    
    console.log('알림판 페이지 정리 완료');
});