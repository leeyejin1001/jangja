// login-server.js - 로그인 기능만 구현한 간단한 서버
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'jangja-school-secret-key'; // 실제로는 환경변수로 관리

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // HTML 파일들이 있는 폴더

// 임시 교사 계정 데이터 (나중에 데이터베이스로 교체)
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

// 비밀번호 해시 생성 함수 (초기 설정용)
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

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

// 로그인 API
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

    // 비밀번호 확인 (실제 해시된 비밀번호와 비교)
    // 임시로 평문 비교 (나중에 bcrypt.compare 사용)
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

// 토큰 검증 API (로그인 상태 확인용)
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

// 로그아웃 API (클라이언트에서 토큰 삭제하면 됨)
app.post('/api/logout', (req, res) => {
  res.json({
    success: true,
    message: '로그아웃 되었습니다.'
  });
});

// 보호된 라우트 예시 (교사 관리 페이지)
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: '관리자 페이지에 접근했습니다.',
    user: req.user
  });
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

// 서버 시작
app.listen(PORT, () => {
  console.log(`장자기독학교 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log('로그인 테스트 계정:');
  console.log('- teacher1 / password123');
  console.log('- admin / admin123');
});

// 초기 설정: 해시된 비밀번호 생성 (한 번만 실행)
async function setupPasswords() {
  console.log('teacher1 해시:', await hashPassword('password123'));
  console.log('admin 해시:', await hashPassword('admin123'));
}
// setupPasswords(); // 주석 해제해서 한 번 실행 후 다시 주석 처리