docker build \
--build-arg NEXT_PUBLIC_API_BASE_URL="https://api.college.edu" \
--build-arg NEXT_PUBLIC_APP_URL="https://app.college.edu" \
-t pgeem-frontend .


docker run -d \
-p 3000:3000 \
-e JWT_SECRET="JWT_SECRET" \
--name pgeem-app \
pgeem-frontend