FROM nginx:latest

# Nginx 설정 파일 복사
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# 정적 파일 복사 (React 빌드 결과)
COPY frontend/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]