# Script de setup para deploy

## 1. Banco de dados (Turso)

```bash
# Instalar CLI do Turso
curl -sSfL https://get.turso.tech | bash

# Criar banco
turso db create imocrm

# Obter URL e token
turso db show imocrm --url
turso db tokens create imocrm

# Rodar migrations
cp .env.example .env
# Edite .env com DATABASE_URL e DATABASE_AUTH_TOKEN do Turso
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

## 2. Upload de imagens (Vercel Blob)

```bash
# No dashboard da Vercel, vá em Storage > Create > Blob Store
# Copie o BLOB_READ_WRITE_TOKEN para as env vars da Vercel
```

## 3. Deploy na Vercel

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Deploy
vercel

# Setar env vars na Vercel
vercel env add DATABASE_URL
vercel env add DATABASE_AUTH_TOKEN
vercel env add JWT_SECRET
vercel env add SITE_URL
vercel env add BLOB_READ_WRITE_TOKEN
```

## Variáveis de ambiente necessárias

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | URL do Turso (`libsql://...`) ou `file:./dev.db` local |
| `DATABASE_AUTH_TOKEN` | Turso | Token de autenticação do Turso |
| `JWT_SECRET` | Sim | Chave secreta para JWT |
| `SITE_URL` | Opcional | URL base do site (para sitemap) |
| `BLOB_READ_WRITE_TOKEN` | Produção | Token do Vercel Blob Storage |
