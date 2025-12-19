
# TeamCore - Fiziksel Çıktı Odaklı Görev Yönetim Sistemi

Bu proje, yazılım ekipleri için geliştirilmiş, her görevin somut bir çıktısı (URL, Repo, Servis) olmasını zorunlu kılan bir görev yönetim sistemidir.

## Özellikler

- **Proje ve Dal Yönetimi:** Projeleri `backend`, `frontend`, `design` gibi dallara ayırın.
- **Görev Marketi:** Ekip üyeleri havuzdan (`AVAILABLE`) görev seçer.
- **Bağımlılıklar:** Bir görev bitmeden diğerini alamazsınız.
- **Zamanlı Görevler:** `dueAt` süresi dolan görevler otomatik olarak havuz'a geri döner.
- **Fiziksel Çıktı:** Görevi teslim etmek için bir URL veya output identifier girmek zorunludur.

## Kurulum

1. **Gereksinimler:** Node.js 18+, PostgreSQL veritabanı.
2. **Projeyi Hazırlama:**
   ```bash
   git clone <repo>
   cd team-core
   npm install
   ```
3. **Çevre Değişkenleri:**
   `.env` dosyasını oluşturun ve veritabanı bağlantınızı ekleyin:
   ```env
   DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/teamcore_db"
   ```
   *Not: PostgreSQL kurulu değilse docker ile kaldırabilirsiniz.*

4. **Veritabanı Kurulumu:**
   Prisma ile şemayı veritabanına uygulayın:
   ```bash
   npx prisma db push
   # Veya migration ile:
   # npx prisma migrate dev
   ```

5. **Uygulamayı Başlatma:**
   ```bash
   npm run dev
   ```
   Tarayıcıda `http://localhost:3000` adresine gidin.

## Admin ve Kullanıcı

- **Admin Paneli:** `/admin` rotasından erişilir.
  - Proje ve Görev oluşturabilirsiniz.
  - *Demo Modu:* Giriş yaparken email olarak `admin@team.core` kullanırsanız Admin yetkisiyle açılır.
- **Kullanıcı:** `/login` sayfasından herhangi bir email ile giriş yapabilirsiniz (şifre önemsiz, mock auth).

## Cron Job (Otomasyon)

Süresi dolan görevleri boşa çıkarmak için aşağıdaki endpoint'i düzenli aralıklarla (örneğin her 10 dakikada bir) tetikleyin:

`GET /api/cron/check-expired`

Bunu `curl` ile veya Vercel Cron gibi servislerle yapabilirsiniz.
```bash
curl http://localhost:3000/api/cron/check-expired
```

## SQL İstatistikleri

`queries.sql` dosyasında proje ve kullanıcı analizi için kullanabileceğiniz hazır SQL sorguları bulunmaktadır.

## Geliştirme Notları

### Branch Ownership (Alan Sahiplenme)
Proje dallarının (branch) belirli uzmanlar tarafından sahiplenilmesini sağlamak amacıyla `BranchOwnership` modeli eklenmiştir. Bu yapı sayesinde kullanıcılar belirli bir branşta `OWNER`, `CO_OWNER` veya `CONTRIBUTOR` rolü üstlenebilir. Bu, sorumluluk dağılımını netleştirir ve uzman liderliğini sisteme entegre eder.

### Prisma Komutları
Veritabanı şemasında değişiklik yapıldığında migration oluşturmak ve client'ı güncellemek için:
```bash
# Migration oluştur ve uygula
npx prisma migrate dev

# Prisma Client'ı güncelle (kod tamamlama için)
npx prisma generate
```
