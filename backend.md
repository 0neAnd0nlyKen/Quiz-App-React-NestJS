# Backend Quiz App - NestJS

## Deskripsi Proyek

Proyek ini adalah backend untuk aplikasi kuis interaktif yang dibangun menggunakan NestJS, sebuah framework Node.js untuk aplikasi server-side. Backend ini menyediakan API untuk mengelola kuis, pertanyaan, jawaban, pengguna, dan sesi kuis. Aplikasi ini menggunakan database SQL untuk penyimpanan data dan JWT untuk autentikasi.

## a. Operasi CRUD yang Saling Berkaitan

Aplikasi ini memiliki minimal 2 operasi CRUD yang saling berkaitan:

1. **Quiz CRUD**: Membuat, membaca, memperbarui, dan menghapus kuis.
2. **Questions CRUD**: Membuat, membaca, memperbarui, dan menghapus pertanyaan yang terkait dengan kuis tertentu.

Kuis dan pertanyaan saling berkaitan karena setiap kuis memiliki banyak pertanyaan, dan pertanyaan milik kuis tertentu. Ini memungkinkan struktur data hierarkis.

![CRUD Operations 1](./public/crud1.png)
![CRUD Operations 2](./public/crud2.png)

## b. Penyimpanan Data Menggunakan Database SQL

Backend ini menggunakan database SQL (kemungkinan PostgreSQL atau MySQL) untuk menyimpan data. NestJS terintegrasi dengan TypeORM atau Prisma untuk ORM, yang memungkinkan mapping objek-relasi dan query SQL yang efisien.

![SQL Database](./public/sql-database.png)

## c. Authentication API Menggunakan JWT Token

Sistem autentikasi menggunakan JWT (JSON Web Tokens) untuk mengamankan API endpoints. Pengguna dapat login dan mendapatkan token JWT yang digunakan untuk mengakses endpoint yang dilindungi.

Modul auth menyediakan:
- Login endpoint yang mengembalikan JWT token
- Guard untuk melindungi route menggunakan JWT

![JWT Token](./public/jwt-token.png)

## d. E2E Testing untuk Token API

Fitur e2e testing telah dibuat untuk menguji token API. Test ini mencakup:
- Registrasi pengguna
- Login dan penerimaan JWT token
- Akses endpoint yang dilindungi menggunakan token
- Validasi token expired atau invalid

File test terkait: `auth-login.e2e-spec.ts`, `auth-register.e2e-spec.ts`, dll.

![E2E Tests](./public/e2e-tests.png)

## e. Pattern Project: MVC (Model-View-Controller)

Pattern project yang sering digunakan adalah MVC (Model-View-Controller). Dalam NestJS, implementasi MVC dilakukan sebagai berikut:

- **Controller**: Menangani request HTTP, validasi input, dan response. Contoh: `quiz.controller.ts`, `questions.controller.ts`.
- **Service**: Mengandung logika bisnis, interaksi dengan database. Contoh: `quiz.service.ts`, `questions.service.ts`.
- **Module**: Mengorganisir komponen terkait, dependency injection. Contoh: `quiz.module.ts`.

NestJS menggunakan dependency injection untuk menghubungkan Controller ke Service, memisahkan concerns dengan jelas.

## f. Mengapa Menggunakan Pattern MVC

Pattern MVC digunakan karena:

- **Separation of Concerns**: Memisahkan logika presentasi (Controller), logika bisnis (Service), dan data (Entity/Model).
- **Maintainability**: Mudah untuk mengubah satu bagian tanpa mempengaruhi yang lain.
- **Testability**: Setiap komponen dapat diuji secara terpisah.
- **Scalability**: Mudah untuk menambah fitur baru dengan struktur yang jelas.

Dalam README GitHub, pattern ini dijelaskan untuk membantu developer memahami struktur kode dan berkontribusi dengan efisien.

## g. Dokumentasi API

Untuk dokumentasi API lengkap, import [Postman Collection](./backend/test/Quiz Sessions API.postman_collection.json) ke Postman atau tool serupa. Collection ini berisi semua endpoint API dengan contoh request dan response.

Atau gunakan Swagger/OpenAPI yang terintegrasi dengan NestJS untuk dokumentasi interaktif.
