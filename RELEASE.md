# Release Guide

Panduan untuk melakukan release extension Copilot Custom Rules.

## 🚀 Otomatis Release dengan GitHub Actions

### Metode 1: Push Tag (Recommended)
```bash
# Update version di package.json
npm version 1.0.2 --no-git-tag-version

# Commit perubahan
git add package.json package-lock.json
git commit -m "Bump version to 1.0.2"

# Push dan buat tag
git push origin main
git tag v1.0.2
git push origin v1.0.2
```

### Metode 2: Manual Trigger
1. Buka GitHub repository
2. Klik tab "Actions"
3. Pilih workflow "Release"
4. Klik "Run workflow"
5. Masukkan versi (contoh: 1.0.2)
6. Klik "Run workflow"

## 📦 Hasil Release

Setelah workflow selesai, akan tersedia:
- ✅ GitHub Release dengan file `.vsix`
- ✅ Release notes otomatis
- ✅ File VSIX siap install

## 🛍️ Publish ke VS Code Marketplace (Opsional)

### Setup Token
1. Buka [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
2. Buat Personal Access Token
3. Tambahkan sebagai secret `VSCE_PAT` di GitHub repository

### Publish
1. Buka GitHub repository
2. Klik tab "Actions"
3. Pilih workflow "Publish to VS Code Marketplace"
4. Klik "Run workflow"
5. Masukkan versi dan centang "Publish to VS Code Marketplace"
6. Klik "Run workflow"

## 🔧 Troubleshooting

### Workflow Gagal
- Pastikan semua dependencies terinstall
- Cek apakah ada error di TypeScript compilation
- Pastikan lint tidak ada error

### VSIX Tidak Terbuat
- Cek apakah `vsce` terinstall di devDependencies
- Pastikan script `package` ada di package.json

### Upload Gagal
- Pastikan repository memiliki permission `contents: write`
- Cek apakah GITHUB_TOKEN memiliki akses yang cukup

## 📋 Checklist Release

- [ ] Update CHANGELOG.md
- [ ] Test extension secara lokal
- [ ] Update version di package.json
- [ ] Commit semua perubahan
- [ ] Push tag atau trigger workflow
- [ ] Verifikasi release di GitHub
- [ ] Test install file VSIX
- [ ] (Opsional) Publish ke Marketplace
