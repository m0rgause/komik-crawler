# --- Stage 1: Build the TypeScript application ---
# Gunakan image Node.js versi 20 (Alpine untuk ukuran yang lebih kecil) sebagai base untuk build
FROM node:20-alpine AS build

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json terlebih dahulu untuk menginstal dependensi
# Ini memanfaatkan Docker cache layer jika dependensi tidak berubah
COPY package*.json ./

# Instal semua dependensi (termasuk devDependencies untuk proses build)
RUN npm install

# Copy seluruh kode sumber aplikasi ke dalam working directory
COPY . .

# Generate Prisma client
# RUN npx prisma generate

# Jalankan perintah build TypeScript.
# Berdasarkan package.json, perintah 'build' adalah 'tsc && tsc-alias' yang akan mengkompilasi
# file .ts ke .js, dan outputnya akan ada di 'build/' directory
RUN npm run build

# --- Stage 2: Create the production-ready image ---
# Gunakan image Node.js versi 20 (Alpine) lagi, tapi kali ini untuk lingkungan produksi
FROM node:20-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Copy hanya package.json dan package-lock.json
COPY package*.json ./

# Instal hanya dependensi produksi (lebih kecil dan lebih aman)
RUN npm install --only=production

# Copy Prisma schema untuk generate client di production
# COPY prisma ./prisma

# Generate Prisma client untuk production
# RUN npx prisma generate

# Copy hasil kompilasi dari stage 'build'
# Output build ada di direktori 'build' dari stage 'build'
COPY --from=build /usr/src/app/build ./build
# Copy juga node_modules dari stage build (opsional, jika npm install --only=production tidak cukup)
# Dalam kasus ini, kita sudah install prod dependencies di tahap ini, jadi cukup copy dist
# Jika ada file lain seperti .env yang perlu dicopy ke production image, tambahkan di sini
# Misalnya, COPY --from=build /usr/src/app/.env .env

# Expose port yang digunakan aplikasi backend (berdasarkan src/app.ts, default 3000)
EXPOSE 3000

# Set environment variable untuk produksi
ENV NODE_ENV=production
ENV SCRAPING_URL="https://mangapark.net/"
# Anda bisa menambahkan ENV SCRAPING_URL="https://mangapark.net/" jika tidak ingin dari .env
# Atau variabel lain yang dibutuhkan di runtime

# Perintah untuk menjalankan aplikasi ketika container dimulai
CMD ["node", "build/app.js"]