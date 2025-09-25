// gallery.js
class GalleryManager {
    constructor() {
        this.apiBase = window.location.origin + '/api';
        this.currentCategory = 'moments';
        this.galleryData = { moments: [], works: [] };
        this.init();
    }

    async init() {
        console.log('갤러리 매니저 초기화 시작');
        try {
            await this.loadGalleryData();
            this.setupTabNavigation();
            this.displayPhotos('moments');
        } catch (error) {
            console.error('갤러리 초기화 실패:', error);
        }
    }

    async loadGalleryData() {
        try {
            console.log('갤러리 데이터 로드 시작');
            const response = await fetch(`${this.apiBase}/gallery`);
            if (response.ok) {
                this.galleryData = await response.json();
                console.log('갤러리 데이터 로드 성공:', this.galleryData);
            } else {
                console.error('갤러리 데이터 로드 실패:', response.status);
            }
        } catch (error) {
            console.error('갤러리 데이터 로드 오류:', error);
        }
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const category = button.dataset.category;
                console.log('탭 클릭:', category);
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.displayPhotos(category);
            });
        });
    }

    displayPhotos(category) {
        console.log(`${category} 카테고리 사진 표시 시작`);
        const photoGrid = document.getElementById('photo-grid');
        if (!photoGrid) {
            console.error('photo-grid 요소를 찾을 수 없습니다');
            return;
        }

        const photos = this.galleryData[category] || [];
        console.log(`${category} 사진 개수:`, photos.length);

        if (photos.length === 0) {
            photoGrid.innerHTML = `
                <div class="col-12">
                    <p style="text-align: center; padding: 2em; color: #666;">
                        ${category === 'moments' ? '우리들의 모습' : '우리들의 작품'}이 아직 없습니다.
                    </p>
                </div>
            `;
            return;
        }

        let html = '';
        photos.forEach((photo) => {
            console.log('사진 표시:', photo.title, photo.image);
            html += `
                <div class="col-4 col-6-medium col-12-small">
                    <div class="gallery-item" style="margin-bottom: 2rem;">
                        <img src="${photo.image}" alt="${photo.title}" 
                             style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" 
                             onerror="console.error('이미지 로드 실패:', this.src)" />
                        <div style="padding: 1rem; text-align: center;">
                            <h4>${photo.title}</h4>
                            <p>${photo.description}</p>
                            <small>${photo.date}</small>
                        </div>
                    </div>
                </div>
            `;
        });

        photoGrid.innerHTML = html;
        console.log('갤러리 HTML 업데이트 완료');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료, 갤러리 컨테이너 확인');
    if (document.getElementById('gallery-container')) {
        console.log('갤러리 매니저 생성');
        window.galleryManager = new GalleryManager();
    } else {
        console.log('갤러리 컨테이너가 없습니다');
    }
});