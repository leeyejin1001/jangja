/*
	장자기독학교 학교소개 페이지 라이트 모드 애니메이션 JavaScript
	Based on Juilliard Style Light Theme
*/

(function($) {
	
	// Intersection Observer를 사용한 스크롤 애니메이션
	function initSchoolIntroAnimations() {
		console.log('학교소개 애니메이션 초기화 시작');
		
		// Intersection Observer 지원 확인
		if (!window.IntersectionObserver) {
			// 지원하지 않는 브라우저에서는 즉시 애니메이션 클래스 추가
			console.log('IntersectionObserver 미지원 - 즉시 애니메이션 적용');
			$('.spotlight').each(function() {
				$(this).addClass('animate');
				$(this).closest('section').addClass('animate');
			});
			return;
		}

		// Observer 옵션 설정
		const observerOptions = {
			threshold: 0.15, // 15%가 보이면 애니메이션 시작
			rootMargin: '0px 0px -80px 0px' // 80px 여유를 두고 트리거
		};

		// 각 섹션별 Observer 생성
		const sectionObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					const $section = $(entry.target);
					const $spotlight = $section.find('.spotlight');
					
					console.log('섹션 애니메이션 트리거:', entry.target.id);
					
					// 섹션과 spotlight에 animate 클래스 추가
					$section.addClass('animate');
					$spotlight.addClass('animate');
					
					// 추가 지연을 위한 순차적 애니메이션
					setTimeout(function() {
						$spotlight.find('.image').addClass('animate');
					}, 100);
					
					setTimeout(function() {
						$spotlight.find('.content').addClass('animate');
					}, 300);
					
					// 한 번 애니메이션이 실행되면 관찰 중지 (성능 최적화)
					sectionObserver.unobserve(entry.target);
				}
			});
		}, observerOptions);

		// 모든 섹션 요소 관찰 시작
		const sections = [
			'#jangjahak',
			'#vision', 
			'#chairman',
			'#principal',
			'#elder',
			'#education-philosophy',
			'#milestone',
			'#staff'
		];
		
		sections.forEach(function(sectionId) {
			const section = document.querySelector(sectionId);
			if (section) {
				sectionObserver.observe(section);
				console.log('관찰 시작:', sectionId);
			}
		});
	}

	// 폴백: Intersection Observer 미지원 시 스크롤 이벤트 사용
	function initFallbackAnimation() {
		console.log('폴백 애니메이션 시작');
		const $window = $(window);
		const $sections = $('#jangjahak, #vision, #chairman, #principal, #elder, #education-philosophy, #milestone, #staff');

		function checkSections() {
			const windowTop = $window.scrollTop();
			const windowHeight = $window.height();

			$sections.each(function() {
				const $section = $(this);
				
				// 이미 애니메이션된 요소는 건너뛰기
				if ($section.hasClass('animate')) {
					return;
				}

				const elementTop = $section.offset().top;
				const elementBottom = elementTop + $section.outerHeight();

				// 요소가 뷰포트에 들어오는지 확인
				if (elementBottom > windowTop + 100 && elementTop < windowTop + windowHeight - 100) {
					const $spotlight = $section.find('.spotlight');
					
					$section.addClass('animate');
					$spotlight.addClass('animate');
					
					console.log('폴백 애니메이션 적용:', $section.attr('id'));
				}
			});
		}

		// 스크롤 이벤트에 디바운스 적용
		let scrollTimeout;
		$window.on('scroll', function() {
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			scrollTimeout = setTimeout(checkSections, 50);
		});

		// 초기 체크
		checkSections();
	}

	// 이미지 로드 완료 후 애니메이션 초기화 (수정된 버전)
	function waitForImages() {
		const $spotlightImages = $('.spotlight .image img');
		let loadedCount = 0;
		const totalImages = $spotlightImages.length;

		console.log('이미지 로딩 대기 중... 총 개수:', totalImages);

		if (totalImages === 0) {
			// 이미지가 없으면 즉시 초기화
			console.log('이미지가 없음 - 즉시 초기화');
			initSchoolIntroAnimations();
			return;
		}

		// 이미 로드된 이미지 확인
		$spotlightImages.each(function() {
			if (this.complete && this.naturalWidth > 0) {
				loadedCount++;
				$(this).addClass('loaded');
				$(this).css('opacity', '1');
			}
		});

		console.log('이미 로드된 이미지:', loadedCount);

		// 모든 이미지가 이미 로드되었으면 즉시 애니메이션 시작
		if (loadedCount >= totalImages) {
			console.log('모든 이미지 이미 로드됨 - 즉시 애니메이션 시작');
			initSchoolIntroAnimations();
			return;
		}

		// 나머지 이미지 로딩 대기
		$spotlightImages.each(function() {
			if (!this.complete || this.naturalWidth === 0) {
				const $img = $(this);
				
				$img.on('load error', function() {
					loadedCount++;
					$(this).addClass('loaded');
					$(this).css('opacity', '1');
					console.log('이미지 처리 완료:', loadedCount + '/' + totalImages);
					
					if (loadedCount >= totalImages) {
						console.log('모든 이미지 처리 완료 - 애니메이션 초기화');
						setTimeout(initSchoolIntroAnimations, 100);
					}
				});
			}
		});

		// 1초 후에도 로딩이 완료되지 않으면 강제 초기화 (빠른 실행)
		setTimeout(function() {
			if (loadedCount < totalImages) {
				console.log('타임아웃 - 강제 애니메이션 초기화');
				// 모든 이미지를 강제로 표시
				$spotlightImages.each(function() {
					$(this).addClass('loaded');
					$(this).css('opacity', '1');
				});
				initSchoolIntroAnimations();
			}
		}, 1000);
	}

	// 부드러운 스크롤 네비게이션
	function initSmoothScrolling() {
		$('a[href^="#"]').on('click', function(e) {
			const target = $(this.getAttribute('href'));
			if (target.length) {
				e.preventDefault();
				const headerHeight = $('#header').outerHeight() || 70;
				
				$('html, body').stop().animate({
					scrollTop: target.offset().top - headerHeight - 20
				}, 1000, 'easeInOutCubic');
				
				console.log('부드러운 스크롤:', this.getAttribute('href'));
			}
		});
	}

	// 이미지 레이지 로딩 및 에러 처리 (수정된 버전)
	// 이미지 레이지 로딩 및 에러 처리 (수정된 버전)
function initImageHandling() {
    $('.spotlight .image img').each(function() {
        const $img = $(this);
        
        // 이미지가 이미 로드된 경우 즉시 표시
        if (this.complete && this.naturalWidth > 0) {
            $img.addClass('loaded');
            $img.css('opacity', '1');
            $img.parent('.image').addClass('loaded'); // 부모 요소에도 로드 완료 표시
            console.log('이미지 이미 로드됨:', this.src);
        }
        
        // 이미지 로딩 에러 처리
        $img.on('error', function() {
            console.warn('이미지 로드 실패:', this.src);
            $(this).addClass('loaded'); // 에러여도 표시
            $(this).css('opacity', '1');
            $(this).parent('.image').addClass('loaded');
        });
        
        // 이미지 로드 완료 시 표시
        $img.on('load', function() {
            $(this).addClass('loaded');
            $(this).css('opacity', '1');
            $(this).parent('.image').addClass('loaded');
            console.log('이미지 로드 완료:', this.src);
        });
    });
    
    // 모든 이미지에 loaded 클래스를 즉시 추가 (로딩 표시 방지)
    setTimeout(function() {
        $('.spotlight .image img').addClass('loaded');
        $('.spotlight .image img').css('opacity', '1');
        $('.spotlight .image').addClass('loaded');
    }, 100);
}

	// 접근성 개선
	function initAccessibility() {
		// 키보드 네비게이션 지원
		$('.spotlight').attr('tabindex', '0');
		
		// 포커스 시 스크롤 위치 조정
		$('.spotlight').on('focus', function() {
			const headerHeight = $('#header').outerHeight() || 70;
			const elementTop = $(this).offset().top - headerHeight - 20;
			
			if ($(window).scrollTop() > elementTop || $(window).scrollTop() + $(window).height() < elementTop + $(this).outerHeight()) {
				$('html, body').animate({
					scrollTop: elementTop
				}, 500);
			}
		});
	}

	// 성능 최적화를 위한 디바운스 함수
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

	// 윈도우 리사이즈 핸들러
	function initResizeHandler() {
		const debouncedResize = debounce(function() {
			console.log('윈도우 리사이즈 감지');
			// 필요한 경우 레이아웃 재계산
		}, 250);

		$(window).on('resize', debouncedResize);
	}

	// 페이지 가시성 API 활용
	function initVisibilityHandler() {
		if (document.hidden !== undefined) {
			document.addEventListener('visibilitychange', function() {
				if (!document.hidden) {
					console.log('페이지 다시 보임 - 애니메이션 상태 확인');
					// 페이지가 다시 보일 때 필요한 처리
				}
			});
		}
	}

	// 메인 초기화 함수
	function initSchoolIntroPage() {
		console.log('학교소개 페이지 초기화 시작');
		
		// 기본 기능들 초기화
		initImageHandling();
		initSmoothScrolling();
		initAccessibility();
		initResizeHandler();
		initVisibilityHandler();
		
		// 이미지 로딩 후 애니메이션 시작
		waitForImages();
	}

	// DOM 준비 완료 시 초기화
	$(document).ready(function() {
		console.log('DOM 준비 완료 - 학교소개 페이지 초기화');
		initSchoolIntroPage();
	});

	// 윈도우 로드 완료 시 백업 초기화
	$(window).on('load', function() {
		console.log('윈도우 로드 완료');
		
		// 애니메이션이 아직 초기화되지 않았다면 실행
		setTimeout(function() {
			if ($('.spotlight.animate').length === 0) {
				console.log('백업 애니메이션 초기화 실행');
				initSchoolIntroAnimations();
			}
		}, 500);
	});

	// 에러 처리
	window.addEventListener('error', function(e) {
		console.warn('JavaScript 에러 발생:', e.error);
		// 에러가 발생해도 기본 기능은 동작하도록 처리
		console.warn('JavaScript 오류로 인해 기본 애니메이션을 적용합니다.');
		$('.spotlight').addClass('animate');
	});

})(jQuery);

// CSS 클래스 동적 추가 (JavaScript로)
$(document).ready(function() {
	if ($('#school-intro-dynamic-styles').length === 0) {
		var dynamicStyles = `
			<style id="school-intro-dynamic-styles">
				/* 이미지 로드 상태 */
				.spotlight .image img {
					opacity: 0;
					transition: opacity 0.6s ease;
				}
				
				.spotlight .image img.loaded {
					opacity: 1;
				}
				
				/* 부드러운 스크롤 */
				html {
					scroll-behavior: smooth;
				}
				
				/* 포커스 표시 - 라이트 모드 */
				.spotlight:focus {
					outline: 2px solid var(--primary-red);
					outline-offset: 4px;
					border-radius: 8px;
				}
				
				/* 로딩 상태 표시 */
					/* 로딩 상태 표시 - 기본적으로 숨김 */
					.spotlight .image::after {
						content: '';
						position: absolute;
						top: 50%;
						left: 50%;
						width: 40px;
						height: 40px;
						margin: -20px 0 0 -20px;
						border: 3px solid var(--border-color);
						border-top: 3px solid var(--primary-red);
						border-radius: 50%;
						animation: spin 1s linear infinite;
						opacity: 0;
						transition: opacity 0.3s ease;
						display: none;
					}

					/* 로딩 표시 완전히 비활성화 */
					.spotlight .image.loading::after {
						display: none;
						opacity: 0;
					}
				
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				
				/* 텍스트 선택 색상 */
				.spotlight .content h2::selection,
				.spotlight .content h3::selection,
				.spotlight .content p::selection {
					background: var(--primary-red);
					color: white;
				}
				
				/* 부드러운 그림자 효과 */
				.history-item,
				.staff-item,
				.vision-item {
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
				}
				
				.history-item:hover,
				.staff-item:hover,
				.vision-item:hover {
					box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
				}
				
				/* 접근성 개선 */
				@media (prefers-reduced-motion: reduce) {
					.spotlight .image img,
					.history-item,
					.staff-item,
					.vision-item,
					html {
						transition: none !important;
						animation: none !important;
						scroll-behavior: auto !important;
					}
				}
				
				/* 고대비 모드 지원 */
				@media (prefers-contrast: high) {
					.spotlight .content h2 {
						color: #000000 !important;
					}
					
					.spotlight .content p {
						color: #333333 !important;
					}
					
					.history-item,
					.staff-item,
					.vision-item {
						border: 1px solid #000000 !important;
						background: #ffffff !important;
					}
				}
			</style>
		`;
		
		$('head').append(dynamicStyles);
		console.log('학교소개 페이지 동적 스타일 추가 완료');
	}
});