# 1. Node.js 환경에서 React 앱 빌드
FROM node:18 as build

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사 및 빌드 실행
COPY . .
RUN npm run build

# 2. 빌드된 정적 파일을 Nginx에 복사
FROM nginx:1.21

# Nginx 기본 설정 파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d

# React 빌드 파일 복사
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Nginx 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
