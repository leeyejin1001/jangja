/*
	장자기독학교 웹사이트 JavaScript
	Based on Spectral by HTML5 UP - Juilliard 스타일 개선 
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints (기존 유지)
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load (기존 유지)
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile detection (기존 유지)
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly (기존 유지)
		$('.scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

	// Menu (기존 유지)
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Header (기존 개선)
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

	// === 새로운 Juilliard 스타일 기능 추가 ===

	// 헤더 스크롤 효과 개선
		$window.on('scroll', function() {
			var scrollTop = $window.scrollTop();
			
			if (scrollTop > 100) {
				$header.addClass('scrolled');
			} else {
				$header.removeClass('scrolled');
			}
		});

	// 스크롤 진행도 표시 - curriculum.js와 동일한 방식
		function createScrollProgress() {
			// 기존 스크롤 진행도 바가 있으면 제거
			$('.scroll-progress').remove();
			
			var progressBar = $('<div class="scroll-progress"></div>');
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
			
			$body.append(progressBar);
			console.log('스크롤 진행도 바 생성 완료');
			
			$window.scroll(function() {
				var scrollTop = $window.scrollTop();
				var docHeight = $(document).height() - $window.height();
				var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
				
				progressBar.css('width', scrollPercent + '%');
			});
		}

		// 페이지 로드 시 스크롤 진행도 초기화
		$(document).ready(function() {
			setTimeout(function() {
				createScrollProgress();
			}, 100);
		});
		
		// 페이지 로드 완료 후에도 다시 초기화 (안전장치)
		$window.on('load', function() {
			setTimeout(function() {
				createScrollProgress();
			}, 200);
		});

	// 카드 호버 효과
		$('.features li, .service-card').hover(
			function() {
				$(this).addClass('hovered');
			},
			function() {
				$(this).removeClass('hovered');
			}
		);

	// 부드러운 애니메이션 효과
		$window.on('load', function() {
			// 순차적 카드 애니메이션
			$('.features li').each(function(index) {
				var $this = $(this);
				setTimeout(function() {
					$this.addClass('fade-in-up');
				}, index * 100);
			});

			// 아이콘 애니메이션
			$('.icons.major li').each(function(index) {
				var $this = $(this);
				setTimeout(function() {
					$this.addClass('animate-icon');
				}, (index + 1) * 200);
			});
		});

	// 버튼 클릭 효과 - 개선된 리플 효과
		$('.button').on('click', function(e) {
			var $button = $(this);
			var $ripple = $('<span class="ripple"></span>');
			
			// 기존 리플 제거
			$button.find('.ripple').remove();
			
			var offset = $button.offset();
			var size = Math.max($button.outerWidth(), $button.outerHeight()) * 2;
			var x = e.pageX - offset.left - size / 2;
			var y = e.pageY - offset.top - size / 2;
			
			$ripple.css({
				width: size,
				height: size,
				left: x,
				top: y
			});
			
			$button.css('position', 'relative').append($ripple);
			
			setTimeout(function() {
				$ripple.remove();
			}, 800);
		});

	// 이미지 레이지 로딩 (기본적인 구현)
		$('img[data-src]').each(function() {
			var $img = $(this);
			var src = $img.data('src');
			
			$img.attr('src', src).removeClass('lazy').addClass('loaded');
		});

	// 폼 유효성 검사 개선
		$('form').on('submit', function(e) {
			var $form = $(this);
			var isValid = true;
			
			// 필수 필드 체크
			$form.find('[required]').each(function() {
				var $field = $(this);
				if (!$field.val().trim()) {
					$field.addClass('error');
					isValid = false;
				} else {
					$field.removeClass('error');
				}
			});

			// 이메일 형식 체크
			$form.find('input[type="email"]').each(function() {
				var $email = $(this);
				var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				
				if ($email.val() && !emailPattern.test($email.val())) {
					$email.addClass('error');
					isValid = false;
				} else {
					$email.removeClass('error');
				}
			});

			if (!isValid) {
				e.preventDefault();
				// 첫 번째 에러 필드로 스크롤
				var $firstError = $form.find('.error').first();
				if ($firstError.length) {
					$('html, body').animate({
						scrollTop: $firstError.offset().top - 100
					}, 500);
				}
			}
		});

	// 접근성 개선 - 키보드 네비게이션
		$('a, button, input, textarea, select').on('focus', function() {
			$(this).addClass('keyboard-focus');
		}).on('blur', function() {
			$(this).removeClass('keyboard-focus');
		});

	// 브라우저 지원 확인
		function checkBrowserSupport() {
			// CSS Grid 지원 확인
			if (!window.CSS || !CSS.supports('display', 'grid')) {
				$body.addClass('no-grid-support');
			}

			// 터치 지원 확인
			if ('ontouchstart' in window) {
				$body.addClass('touch-enabled');
			}

			// 모션 선호도 확인
			if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				$body.addClass('prefers-reduced-motion');
			}
		}

		checkBrowserSupport();

	// 성능 최적화 - 디바운스 함수
		function debounce(func, wait) {
			var timeout;
			return function executedFunction() {
				var context = this;
				var args = arguments;
				var later = function() {
					timeout = null;
					func.apply(context, args);
				};
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
			};
		}

	// 최적화된 스크롤 핸들러
		var optimizedScrollHandler = debounce(function() {
			// 추가 스크롤 관련 처리가 필요한 경우 여기에 추가
			// 섹션별 활성화 상태 관리 등
			updateActiveSection();
		}, 10);

		$window.on('scroll', optimizedScrollHandler);

	// 섹션별 활성화 상태 관리
		function updateActiveSection() {
			var scrollTop = $window.scrollTop();
			var windowHeight = $window.height();
			
			$('section[id]').each(function() {
				var $section = $(this);
				var sectionTop = $section.offset().top - 200;
				var sectionBottom = sectionTop + $section.outerHeight();
				
				if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
					var sectionId = $section.attr('id');
					$('.curriculum-nav .button').removeClass('active');
					$('.curriculum-nav .button[href="#' + sectionId + '"]').addClass('active');
				}
			});
		}

	// 에러 처리
		window.addEventListener('error', function(e) {
			console.warn('JavaScript Error:', e.error);
			// 에러가 발생해도 기본 기능은 동작하도록 처리
		});

	// 부드러운 페이지 전환 효과
		$('a[href^="#"]').on('click', function(e) {
			var target = $(this.getAttribute('href'));
			if (target.length) {
				e.preventDefault();
				$('html, body').stop().animate({
					scrollTop: target.offset().top - $header.outerHeight()
				}, 1000, 'easeInOutExpo');
			}
		});

})(jQuery);

// CSS 스타일 추가 (JavaScript로 동적 추가) - 라이트 테마 최적화
$(document).ready(function() {
	if ($('#jangja-dynamic-styles').length === 0) {
		var dynamicStyles = `
			<style id="jangja-dynamic-styles">
				/* 스크롤 진행도 바 - curriculum.js 방식으로 단순화 */
				.scroll-progress {
					position: fixed;
					top: 0;
					left: 0;
					height: 3px;
					background: linear-gradient(90deg, #dc2626, #1e40af);
					z-index: 10001;
					transition: width 0.1s ease;
				}

				/* 동적 애니메이션 클래스 */
				.fade-in-up {
					opacity: 1 !important;
					transform: translateY(0) !important;
					transition: all 0.6s ease;
				}

				.features li {
					opacity: 0;
					transform: translateY(30px);
					transition: all 0.6s ease;
				}

				.animate-icon {
					animation: bounceIn 0.8s ease;
				}

				@keyframes bounceIn {
					0% {
						opacity: 0;
						transform: scale(0.3) rotate(-45deg);
					}
					50% {
						opacity: 1;
						transform: scale(1.05) rotate(-45deg);
					}
					70% {
						transform: scale(0.9) rotate(-45deg);
					}
					100% {
						opacity: 1;
						transform: scale(1) rotate(-45deg);
					}
				}

				/* 리플 효과 - 라이트 테마 최적화 */
				.ripple {
					position: absolute;
					border-radius: 50%;
					background: rgba(220, 38, 38, 0.2);
					transform: scale(0);
					animation: ripple 0.8s ease-out;
					pointer-events: none;
				}

				@keyframes ripple {
					to {
						transform: scale(4);
						opacity: 0;
					}
				}

				/* 키보드 포커스 - 라이트 테마 */
				.keyboard-focus {
					outline: 2px solid #dc2626 !important;
					outline-offset: 2px !important;
					box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1) !important;
				}

				/* 호버 효과 개선 */
				.hovered {
					transform: translateY(-8px);
					transition: transform 0.3s ease;
				}

				/* 에러 상태 - 라이트 테마 */
				.error {
					border-color: #ef4444 !important;
					box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
					background-color: rgba(239, 68, 68, 0.05) !important;
				}

				/* 터치 디바이스 최적화 */
				.touch-enabled .button,
				.touch-enabled .features li {
					cursor: pointer;
				}

				.touch-enabled .button:active {
					transform: scale(0.98);
				}

				/* 그리드 미지원 브라우저 대응 */
				.no-grid-support .features {
					display: block !important;
				}

				.no-grid-support .features li {
					width: 100% !important;
					margin-bottom: 2em !important;
				}

				/* 모션 민감성 사용자 대응 */
				.prefers-reduced-motion .features li,
				.prefers-reduced-motion .animate-icon,
				.prefers-reduced-motion .ripple,
				.prefers-reduced-motion .scroll-progress {
					animation: none !important;
					transition: none !important;
				}

				/* 반응형 개선 */
				@media screen and (max-width: 736px) {
					.scroll-progress-container {
						height: 3px;
					}
					
					.scroll-progress::after {
						animation: shimmer 1.5s infinite;
					}
				}

				@media screen and (max-width: 480px) {
					.scroll-progress-container {
						height: 2px;
					}
				}

				/* 고대비 모드 지원 */
				@media (prefers-contrast: high) {
					.scroll-progress {
						background: #000000;
					}
					
					.scroll-progress-container {
						background: #ffffff;
						border-bottom: 1px solid #000000;
					}
				}

				/* 다크 모드 선호 사용자 대응 (시스템 설정) */
				@media (prefers-color-scheme: dark) {
					.scroll-progress-container {
						background: rgba(0, 0, 0, 0.3);
					}
				}

				/* 헤더와 스크롤바 조화 */
				#header.scrolled {
					background: rgba(255, 255, 255, 0.98) !important;
					border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
				}

				/* 부드러운 페이지 전환 */
				html {
					scroll-behavior: smooth;
				}

				/* 스크롤바 커스터마이징 (웹킷 브라우저) */
				::-webkit-scrollbar {
					width: 8px;
				}

				::-webkit-scrollbar-track {
					background: #f1f5f9;
				}

				::-webkit-scrollbar-thumb {
					background: linear-gradient(135deg, #dc2626 0%, #1e40af 100%);
					border-radius: 4px;
				}

				::-webkit-scrollbar-thumb:hover {
					background: linear-gradient(135deg, #b91c1c 0%, #1d4ed8 100%);
				}
			</style>
		`;
		
		$('head').append(dynamicStyles);
	}
});

/* 영성, 지성, 인성 이미지 애니메이션 JavaScript */

// Spotlight 애니메이션을 위한 JavaScript 함수들

(function($) {
	
	// Intersection Observer를 사용한 스크롤 애니메이션
	function initSpotlightAnimations() {
		// Intersection Observer 지원 확인
		if (!window.IntersectionObserver) {
			// 지원하지 않는 브라우저에서는 즉시 애니메이션 클래스 추가
			$('.spotlight').addClass('animate');
			return;
		}

		// Observer 옵션 설정
		const observerOptions = {
			threshold: 0.2, // 20%가 보이면 애니메이션 시작
			rootMargin: '0px 0px -50px 0px' // 50px 여유를 두고 트리거
		};

		// Observer 생성
		const spotlightObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					// 뷰포트에 들어오면 animate 클래스 추가
					$(entry.target).addClass('animate');
					
					// 한 번 애니메이션이 실행되면 관찰 중지 (성능 최적화)
					spotlightObserver.unobserve(entry.target);
				}
			});
		}, observerOptions);

		// 모든 spotlight 요소 관찰 시작
		$('.spotlight').each(function() {
			spotlightObserver.observe(this);
		});
	}

	// 폴백: Intersection Observer 미지원 시 스크롤 이벤트 사용
	function initFallbackAnimation() {
		const $window = $(window);
		const $spotlights = $('.spotlight');

		function checkSpotlights() {
			const windowTop = $window.scrollTop();
			const windowHeight = $window.height();

			$spotlights.each(function() {
				const $spotlight = $(this);
				
				// 이미 애니메이션된 요소는 건너뛰기
				if ($spotlight.hasClass('animate')) {
					return;
				}

				const elementTop = $spotlight.offset().top;
				const elementBottom = elementTop + $spotlight.outerHeight();

				// 요소가 뷰포트에 들어오는지 확인
				if (elementBottom > windowTop && elementTop < windowTop + windowHeight) {
					$spotlight.addClass('animate');
				}
			});
		}

		// 스크롤 이벤트에 디바운스 적용
		let scrollTimeout;
		$window.on('scroll', function() {
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
			scrollTimeout = setTimeout(checkSpotlights, 50);
		});

		// 초기 체크
		checkSpotlights();
	}

	// 이미지 로드 완료 후 애니메이션 초기화
	function waitForImages() {
		const $spotlightImages = $('.spotlight .image img');
		let loadedCount = 0;
		const totalImages = $spotlightImages.length;

		if (totalImages === 0) {
			// 이미지가 없으면 즉시 초기화
			initSpotlightAnimations();
			return;
		}

		$spotlightImages.each(function() {
			const img = new Image();
			
			img.onload = img.onerror = function() {
				loadedCount++;
				if (loadedCount >= totalImages) {
					// 모든 이미지 로드 완료 후 애니메이션 초기화
					setTimeout(initSpotlightAnimations, 100);
				}
			};
			
			img.src = this.src;
		});

		// 5초 후에도 로딩이 완료되지 않으면 강제 초기화
		setTimeout(function() {
			if (loadedCount < totalImages) {
				initSpotlightAnimations();
			}
		}, 5000);
	}

	// 페이지 로드 시 초기화
	$(document).ready(function() {
		// CSS 스타일 동적 추가
		if ($('#spotlight-animation-styles').length === 0) {
			const animationStyles = `
				<style id="spotlight-animation-styles">
					.spotlight .image {
						opacity: 0;
						transform: translateX(-50px);
						transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
					}
					
					.spotlight:nth-child(even) .image {
						transform: translateX(50px);
					}
					
					.spotlight.animate .image {
						opacity: 1;
						transform: translateX(0);
					}
					
					.spotlight .content {
						opacity: 0;
						transform: translateY(30px);
						transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
					}
					
					.spotlight.animate .content {
						opacity: 1;
						transform: translateY(0);
					}
					
					.spotlight:nth-child(1).animate .image { transition-delay: 0.1s; }
					.spotlight:nth-child(1).animate .content { transition-delay: 0.3s; }
					.spotlight:nth-child(2).animate .image { transition-delay: 0.2s; }
					.spotlight:nth-child(2).animate .content { transition-delay: 0.4s; }
					.spotlight:nth-child(3).animate .image { transition-delay: 0.3s; }
					.spotlight:nth-child(3).animate .content { transition-delay: 0.5s; }
					
					.spotlight .image img {
						transition: transform 0.4s ease, filter 0.4s ease;
						filter: brightness(0.9);
					}
					
					.spotlight:hover .image img {
						transform: scale(1.05);
						filter: brightness(1);
					}
					
					@media screen and (max-width: 980px) {
						.spotlight .image,
						.spotlight:nth-child(even) .image {
							transform: translateY(30px);
						}
						
						.spotlight.animate .image {
							transform: translateY(0);
						}
					}
					
					@media (prefers-reduced-motion: reduce) {
						.spotlight .image,
						.spotlight .content,
						.spotlight .image img {
							transition: none !important;
							transform: none !important;
							animation: none !important;
							opacity: 1 !important;
						}
					}
				</style>
			`;
			
			$('head').append(animationStyles);
		}

		// 이미지 로딩 완료를 기다린 후 애니메이션 초기화
		waitForImages();
	});

	// 윈도우 로드 시에도 백업으로 초기화 (안전장치)
	$(window).on('load', function() {
		setTimeout(function() {
			if ($('.spotlight.animate').length === 0) {
				initSpotlightAnimations();
			}
		}, 500);
	});

})(jQuery);