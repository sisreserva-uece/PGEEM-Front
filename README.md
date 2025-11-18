# 1. Create your .env file

```
cp .env.example .env
```

# 2. Build the image

```
docker build -t pgeem-frontend .
```

# 3. Run the container

```
docker run -p 3000:3000 --name pgeem-app pgeem-frontend
```

---

