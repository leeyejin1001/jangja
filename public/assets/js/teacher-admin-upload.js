// teacher-admin-upload.js
class TeacherAdminUpload {
    constructor() {
        this.apiBase = window.location.origin + '/api';
        this.token = localStorage.getItem('teacher-token');
        this.init();
    }

    init() {
        this.setupPhotoUpload();
        this.loadDashboardStats();
    }

    setupPhotoUpload() {
        const uploadForm = document.getElementById('photoUploadForm');
        const fileInput = document.getElementById('photoFiles');
        const fileUpload = document.getElementById('fileUpload');
        const filePreview = document.getElementById('filePreview');

        if (fileUpload && fileInput) {
            fileUpload.addEventListener('click', () => fileInput.click());
            
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
                        <img src="${e.target.result}" alt="미리보기 ${index + 1}" style="max-width: 150px; max-height: 150px; object-fit: cover; margin: 5px;" />
                        <p>${file.name}</p>
                    `;
                    previewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    async handlePhotoUpload(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';

            const formData = new FormData();
            const files = document.getElementById('photoFiles').files;
            const category = form.category.value;
            const title = form.title.value;
            const description = form.description.value;
            
            if (files.length === 0) {
                alert('업로드할 사진을 선택해주세요.');
                return;
            }
            
            if (!category || !title) {
                alert('카테고리와 제목을 입력해주세요.');
                return;
            }

            formData.append('category', category);
            formData.append('title', title);
            formData.append('description', description);
            
            Array.from(files).forEach(file => {
                formData.append('photos', file);
            });

            const response = await fetch(`${this.apiBase}/upload/photos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const result = await response.json();
            console.log('업로드 결과:', result);

            if (result.success) {
                alert('사진이 성공적으로 업로드되었습니다!');
                form.reset();
                document.getElementById('filePreview').innerHTML = '';
            } else {
                alert('업로드 실패: ' + (result.message || '알 수 없는 오류'));
            }

        } catch (error) {
            console.error('업로드 오류:', error);
            alert('업로드 중 오류가 발생했습니다.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    async loadDashboardStats() {
        // 통계 로드 기능 (나중에 구현)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.teacherAdminUpload = new TeacherAdminUpload();
});