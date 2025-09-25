// server.js - 장자기독학교 웹사이트 백엔드 서버
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'jangja-school-secret-key';

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images', 'uploads');
    
    // 업로드 디렉토리가 없으면 생성
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('업로드 디렉토리 생성 실패:', error);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일명 중복 방지를 위해 타임스탬프 추가
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
    files: 10 // 한 번에 최대 10개 파일
  },
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다. (jpg, png, gif, webp)'));
    }
  }
});

// 교사 계정 데이터 (실제로는 데이터베이스 사용)
const teachers = [
  {
    id: 1,
    username: 'teacher1',
    password: '$2b$10$rQZ8kHp0FJXmhQ8X5.5oH.1KqE5G2Y3vJ4xM8N6bR7wV9zC1aS2e', // 'password123'
    name: '김선생',
    email: 'teacher1@jangjachristian.edu',
    role: 'teacher'
  },
  {
    id: 2,
    username: 'admin',
    password: '$2b$10$sdf3sdfSDFS.5oH.1KqE5G2Y3vJ4xM8N6bR7wV9zC1aS2e', // 'admin123'
    name: '관리자',
    email: 'admin@jangjachristian.edu', 
    role: 'admin'
  }
];

// JWT 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '액세스 토큰이 필요합니다.' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: '토큰이 유효하지 않습니다.' 
      });
    }
    req.user = user;
    next();
  });
};

// 데이터 파일 경로
const DATA_DIR = path.join(__dirname, 'data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const NOTICES_FILE = path.join(DATA_DIR, 'notices.json');

// 데이터 디렉토리 초기화
async function initDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(path.join(__dirname, 'public/images/uploads'), { recursive: true });
    
    // 기본 갤러리 파일 생성
    try {
      await fs.access(GALLERY_FILE);
    } catch {
      const defaultGallery = {
        moments: [],
        works: [],
        events: [],
        facilities: []
      };
      await fs.writeFile(GALLERY_FILE, JSON.stringify(defaultGallery, null, 2));
      console.log('기본 갤러리 데이터 파일을 생성했습니다.');
    }
    
    // 기본 공지사항 파일 생성
    try {
      await fs.access(NOTICES_FILE);
    } catch {
      const defaultNotices = { notices: [] };
      await fs.writeFile(NOTICES_FILE, JSON.stringify(defaultNotices, null, 2));
    }
    
  } catch (error) {
    console.error('데이터 디렉토리 초기화 실패:', error);
  }
}

// API 라우트

// 교사 로그인
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 입력값 검증
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요.'
      });
    }

    // 사용자 찾기
    const teacher = teachers.find(t => t.username === username);
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 비밀번호 확인 (임시로 평문 비교)
    let isValidPassword = false;
    if (username === 'teacher1' && password === 'password123') {
      isValidPassword = true;
    } else if (username === 'admin' && password === 'admin123') {
      isValidPassword = true;
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        id: teacher.id,
        username: teacher.username,
        role: teacher.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 성공 응답
    res.json({
      success: true,
      message: '로그인 성공',
      token: token,
      user: {
        id: teacher.id,
        username: teacher.username,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role
      }
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 토큰 검증 API
app.get('/api/verify-token', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// 갤러리 데이터 조회 API
app.get('/api/gallery', async (req, res) => {
  try {
    const data = await fs.readFile(GALLERY_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('갤러리 데이터 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '갤러리 데이터를 불러올 수 없습니다.' 
    });
  }
});

// 사진 업로드 API
app.post('/api/upload/photos', authenticateToken, upload.array('photos', 10), async (req, res) => {
  try {
    console.log('사진 업로드 요청 받음');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const { category, title, description } = req.body;
    const files = req.files;
    
    // 입력값 검증
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '업로드할 파일이 없습니다.'
      });
    }
    
    if (!category || !title) {
      return res.status(400).json({
        success: false,
        message: '카테고리와 제목은 필수 입력사항입니다.'
      });
    }
    
    // 유효한 카테고리 확인
    const validCategories = ['moments', 'works', 'events', 'facilities'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: '올바르지 않은 카테고리입니다.'
      });
    }

    // 갤러리 데이터 읽기
    const galleryData = JSON.parse(await fs.readFile(GALLERY_FILE, 'utf8'));
    
    // 업로드된 파일들 정보 생성
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(), // 고유 ID
      title: title,
      description: description || '',
      image: `/images/uploads/${file.filename}`,
      originalName: file.originalname,
      fileSize: file.size,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: req.user.username,
      uploadedAt: new Date().toISOString()
    }));
    
    // 해당 카테고리에 사진 추가
    if (!galleryData[category]) {
      galleryData[category] = [];
    }
    galleryData[category].unshift(...newPhotos);
    
    // 파일 저장
    await fs.writeFile(GALLERY_FILE, JSON.stringify(galleryData, null, 2));
    
    console.log(`${files.length}개 사진이 ${category} 카테고리에 업로드됨`);
    
    res.json({
      success: true,
      message: `${files.length}개 사진이 성공적으로 업로드되었습니다.`,
      photos: newPhotos,
      category: category
    });
    
  } catch (error) {
    console.error('사진 업로드 오류:', error);
    
    // 업로드 실패 시 생성된 파일들 삭제
    if (req.files) {
      req.files.forEach(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (deleteError) {
          console.error('임시 파일 삭제 실패:', deleteError);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: '업로드 처리 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 갤러리 통계 API
app.get('/api/gallery/stats', authenticateToken, async (req, res) => {
  try {
    const galleryData = JSON.parse(await fs.readFile(GALLERY_FILE, 'utf8'));
    
    const stats = {
      total: 0,
      moments: galleryData.moments?.length || 0,
      works: galleryData.works?.length || 0,
      events: galleryData.events?.length || 0,
      facilities: galleryData.facilities?.length || 0
    };
    
    stats.total = stats.moments + stats.works + stats.events + stats.facilities;
    
    res.json({
      success: true,
      stats: stats
    });
    
  } catch (error) {
    console.error('갤러리 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '통계 데이터를 불러올 수 없습니다.'
    });
  }
});

// HTML 파일들 서빙
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/teacher-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher-login.html'));
});

app.get('/teacher-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher-admin.html'));
});

app.get('/school-life', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'school-life.html'));
});

// 404 에러 처리
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// 서버 시작
async function startServer() {
  await initDataDirectory();
  
  app.listen(PORT, () => {
    console.log(`장자기독학교 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log('로그인 테스트 계정:');
    console.log('- teacher1 / password123');
    console.log('- admin / admin123');
    console.log('사진 업로드 기능이 활성화되었습니다.');
  });
}

startServer().catch(console.error)