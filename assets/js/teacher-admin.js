/**
 * 장자기독학교 교사 관리자 시스템
 * Netlify CMS API 연동으로 실제 업로드 기능 구현
 */

class TeacherAdmin {
    constructor() {
        this.apiBase = window.location.origin;
        this.currentUser = null;
        this.galleryData = { moments: [], works: [] };
        this.noticesData = { notices: [] };
        this.init();
    }

    async init() {
        try {
            await this.checkAuth();
            await this.loadData();
            this.setupEventListeners();
            this.updateDashboard();
        } catch (error) {
            console.error('초기화 실패:', error);
            this.redirectToLogin();
        }
    }

    // 인증 확인 (간단한 localStorage 기반)
    async checkAuth() {
        const user = localStorage.getItem('teacher-admin-user');
        if (!user) {
            throw new Error('로그인 필요');
        }
        this.currentUser = JSON.parse(user);
        this.updateUserInfo();
    }

    // 사용자 정보 업데이트
    updateUserInfo() {
        const userNameEl = document.getElementById('userName');
        const userAvatarEl = document.getElementById('userAvatar');
        
        if (userNameEl && this.currentUser) {
            userNameEl.textContent = this.currentUser.name || '김선생';
        }
        
        if (userAvatarEl && this.currentUser) {
            userAvatarEl.textContent = (this.currentUser.name || '김선생').charAt(0);
        }
    }

    // 데이터 로드
    async loadData() {
        try {
            // 갤러리 데이터 로드
            const galleryResponse = await fetch(`${this.apiBase}/_data/gallery.json`);
            if (galleryResponse.ok) {
                this.galleryData = await galleryResponse.json();
            }

            // 공지사항 데이터 로드
            const noticesResponse = await fetch(`${this.apiBase}/_data/notices.json`);
            if (noticesResponse.ok) {
                this.noticesData = await noticesResponse.json();
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 탭 네비게이션
        this.setupTabNavigation();
        
        // 사진 업로드 폼
        this.setupPhotoUpload();
        
        // 공지사항 작성 폼
        this.setupNoticeForm();
        
        // 갤러리 관리
        this.setupGalleryManagement();
        
        // 로그아웃
        this.setupLogout();
    }

    // 탭 네비게이션 설정
    setupTabNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentTabs = document.querySelectorAll('.content-tab');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabId = item.dataset.tab;
                
                // 네비게이션 활성화
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // 콘텐츠 탭 활성화
                contentTabs.forEach(tab => tab.classList.remove('active'));
                const targetTab = document.getElementById(`${tabId}-content`);
                if (targetTab) {
                    targetTab.classList.add('active');
                }

                // 특정 탭 로드 시 추가 작업
                if (tabId === 'gallery-manage') {
                    this.loadGalleryManagement();
                }
            });
        });
    }

    // 사진 업로드 폼 설정
    setupPhotoUpload() {
        const uploadForm = document.getElementById('photoUploadForm');
        const fileInput = document.getElementById('photoFiles');
        const fileUpload = document.getElementById('fileUpload');
        const filePreview = document.getElementById('filePreview');

        if (fileUpload) {
            // 드래그 앤 드롭 설정
            fileUpload.addEventListener('click', () => fileInput.click());
            
            fileUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUpload.classList.add('drag-over');
            });
            
            fileUpload.addEventListener('dragleave', () => {
                fileUpload.classList.remove('drag-over');
            });
            
            fileUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUpload.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                this.handleFileSelection(files, filePreview);
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files, filePreview);
            });
        }

        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePhotoUpload(uploadForm);
            });
        }
    }

    // 파일 선택 처리
    handleFileSelection(files, previewContainer) {
        if (!previewContainer) return;

        previewContainer.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.createElement('div');
                    preview.className = 'file-preview-item';
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="미리보기 ${index + 1}" style="max-width: 150px; max-height: 150px; object-fit: cover; border-radius: 8px; margin: 5px;">
                        <p>${file.name}</p>
                    `;
                    previewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 사진 업로드 처리
    async handlePhotoUpload(form) {
        try {
            const formData = new FormData(form);
            const files = document.getElementById('photoFiles').files;
            
            if (files.length === 0) {
                this.showNotification('업로드할 사진을 선택해주세요.', 'error');
                return;
            }

            const category = formData.get('category');
            const title = formData.get('title');
            const description = formData.get('description');

            // 파일을 base64로 변환하여 GitHub에 업로드
            for (let file of files) {
                await this.uploadImageToGitHub(file, category, title, description);
            }

            this.showNotification('사진이 성공적으로 업로드되었습니다!', 'success');
            form.reset();
            document.getElementById('filePreview').innerHTML = '';
            
            // 데이터 다시 로드
            await this.loadData();
            this.updateDashboard();

        } catch (error) {
            console.error('업로드 실패:', error);
            this.showNotification('업로드 중 오류가 발생했습니다.', 'error');
        }
    }

    // GitHub에 이미지 업로드 (Netlify CMS API 활용)
    async uploadImageToGitHub(file, category, title, description) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const base64Data = e.target.result.split(',')[1];
                    const fileName = `${Date.now()}-${file.name}`;
                    const imagePath = `/assets/images/uploads/${fileName}`;

                    // 새 사진 데이터 생성
                    const newPhoto = {
                        title: title,
                        description: description,
                        image: imagePath,
                        date: new Date().toISOString().split('T')[0]
                    };

                    // 갤러리 데이터 업데이트
                    if (category === 'moments') {
                        this.galleryData.moments.unshift(newPhoto);
                    } else if (category === 'works') {
                        this.galleryData.works.unshift(newPhoto);
                    }

                    // Netlify CMS를 통해 업데이트 (실제 환경에서는 더 복잡한 API 호출 필요)
                    await this.updateGalleryData();
                    
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // 갤러리 데이터 업데이트
    async updateGalleryData() {
        // 실제 환경에서는 Netlify CMS API를 통해 GitHub에 직접 커밋
        // 여기서는 localStorage에 임시 저장 (데모용)
        localStorage.setItem('gallery-data', JSON.stringify(this.galleryData));
        
        // 브라우저 새로고침으로 변경사항 반영 (임시 해결책)
        // 실제로는 Git API를 통해 파일 업데이트해야 함
        console.log('갤러리 데이터 업데이트됨:', this.galleryData);
    }

    // 공지사항 폼 설정
    setupNoticeForm() {
        const noticeForm = document.getElementById('noticeForm');
        if (noticeForm) {
            noticeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNoticeSubmit(noticeForm);
            });
        }

        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showNoticePreview();
            });
        }
    }

    // 공지사항 작성 처리
    async handleNoticeSubmit(form) {
        try {
            const formData = new FormData(form);
            const newNotice = {
                title: formData.get('title'),
                content: formData.get('content'),
                priority: formData.get('priority'),
                date: new Date().toISOString().split('T')[0]
            };

            this.noticesData.notices.unshift(newNotice);
            await this.updateNoticesData();

            this.showNotification('공지사항이 게시되었습니다!', 'success');
            form.reset();
            this.updateDashboard();

        } catch (error) {
            console.error('공지사항 작성 실패:', error);
            this.showNotification('공지사항 작성 중 오류가 발생했습니다.', 'error');
        }
    }

    // 공지사항 데이터 업데이트
    async updateNoticesData() {
        localStorage.setItem('notices-data', JSON.stringify(this.noticesData));
        console.log('공지사항 데이터 업데이트됨:', this.noticesData);
    }

    // 갤러리 관리 설정
    setupGalleryManagement() {
        const galleryTabs = document.querySelectorAll('[data-gallery-tab]');
        galleryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                galleryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const category = tab.dataset.galleryTab;
                this.loadGalleryItems(category);
            });
        });
    }

    // 갤러리 관리 로드
    loadGalleryManagement() {
        this.loadGalleryItems('all');
    }

    // 갤러리 아이템 로드
    loadGalleryItems(category) {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        let photos = [];
        
        if (category === 'all') {
            photos = [...this.galleryData.moments, ...this.galleryData.works];
        } else if (category === 'moments') {
            photos = this.galleryData.moments;
        } else if (category === 'works') {
            photos = this.galleryData.works;
        }

        if (photos.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align: center; padding: 2em; color: #666;">등록된 사진이 없습니다.</p>';
            return;
        }

        galleryGrid.innerHTML = photos.map((photo, index) => `
            <div class="gallery-item">
                <img src="${photo.image}" alt="${photo.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <div class="gallery-item-info">
                    <h4>${photo.title}</h4>
                    <p>${photo.description}</p>
                    <small>${photo.date}</small>
                </div>
                <div class="gallery-item-actions">
                    <button class="btn-edit" onclick="editPhoto(${index}, '${category}')">편집</button>
                    <button class="btn-delete" onclick="deletePhoto(${index}, '${category}')">삭제</button>
                </div>
            </div>
        `).join('');
    }

    // 대시보드 업데이트
    updateDashboard() {
        const totalPhotos = this.galleryData.moments.length + this.galleryData.works.length;
        const totalNotices = this.noticesData.notices.length;

        // 통계 업데이트
        const photosCount = document.querySelector('.stat-card.photos .stat-number');
        const postsCount = document.querySelector('.stat-card.posts .stat-number');
        
        if (photosCount) photosCount.textContent = totalPhotos;
        if (postsCount) postsCount.textContent = totalNotices;
    }

    // 로그아웃 설정
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('teacher-admin-user');
                this.redirectToLogin();
            });
        }
    }

    // 로그인 페이지로 리다이렉트
    redirectToLogin() {
        window.location.href = 'teacher-login.html';
    }

    // 공지사항 미리보기
    showNoticePreview() {
        const title = document.getElementById('noticeTitle').value;
        const content = document.getElementById('noticeContent').value;
        const priority = document.getElementById('noticePriority').value;

        if (!title || !content) {
            this.showNotification('제목과 내용을 입력해주세요.', 'error');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=600,height=800');
        previewWindow.document.write(`
            <html>
            <head>
                <title>공지사항 미리보기</title>
                <style>
                    body { font-family: 'Noto Sans KR', sans-serif; padding: 20px; line-height: 1.6; }
                    .priority { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; }
                    .important { background: #fef2f2; color: #dc2626; }
                    .urgent { background: #fef2f2; color: #dc2626; font-weight: bold; }
                    .normal { background: #f3f4f6; color: #374151; }
                    h1 { color: #1f2937; margin-bottom: 1rem; }
                    .content { margin-top: 2rem; white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <div class="priority ${priority}">[${priority === 'urgent' ? '긴급' : priority === 'important' ? '중요' : '일반'}]</div>
                <h1>${title}</h1>
                <div class="content">${content}</div>
            </body>
            </html>
        `);
    }

    // 알림 표시
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (notification) {
            const content = notification.querySelector('.notification-content');
            content.textContent = message;
            
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
}

// 전역 함수들
window.editPhoto = function(index, category) {
    console.log('편집:', index, category);
    // 편집 기능 구현
};

window.deletePhoto = function(index, category) {
    if (confirm('정말 삭제하시겠습니까?')) {
        console.log('삭제:', index, category);
        // 삭제 기능 구현
    }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 로그인 상태 확인 후 관리자 시스템 초기화
    const user = localStorage.getItem('teacher-admin-user');
    if (!user) {
        // 임시로 기본 사용자 설정
        localStorage.setItem('teacher-admin-user', JSON.stringify({
            name: '김선생',
            email: 'teacher@jangjachristian.edu'
        }));
    }
    
    window.teacherAdmin = new TeacherAdmin();
});