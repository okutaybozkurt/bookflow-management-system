# 📦 KitapÜssü Proje Gereksinimleri

Bu dosya projede kullanılan temel teknolojileri ve sonradan eklenen paketleri listeler.

## Core Stack
- **Framework**: [Next.js 16.2 (Beta)](https://nextjs.org/)
- **Runtime**: Node.js 20.x
- **UI/UX**: Tailwind CSS 4.0, Shadcn UI, Lucide Icons

## Backend & Database
- **Database**: MySQL
- **ORM**: [Prisma 7.8.0](https://www.prisma.io/)
- **Driver Adapter**: `@prisma/adapter-mariadb` (MySQL uyumluluğu için)
- **Database Driver**: `mysql2`

## Development Tools
- **Language**: TypeScript
- **Script Runner**: `tsx` (Seeder ve scriptleri çalıştırmak için)
- **Environment**: `dotenv`

## Key Dependencies (package.json)
```json
{
  "dependencies": {
    "next": "16.2.0",
    "react": "^19",
    "react-dom": "^19",
    "prisma": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "@prisma/adapter-mariadb": "^7.8.0",
    "mysql2": "^3.12.0",
    "zod": "^3.24.1",
    "lucide-react": "^0.564.0"
  },
  "devDependencies": {
    "tsx": "^4.21.0",
    "typescript": "5.7.3"
  }
}
```
