# Node.js 이미지 사용
FROM node:16

# 컨테이너 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 실행 포트 설정
EXPOSE 3001

# 서버 실행
CMD ["npm", "start"]