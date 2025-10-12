# 📱 PWA Kurulum Rehberi

## Uygulamayı Telefona Yükleme

### 📱 Android (Chrome/Edge)
1. Tarayıcıda uygulamayı aç
2. Sağ üst köşedeki ⋮ menüye tıkla
3. "Ana ekrana ekle" seçeneğini seç
4. "Yükle" veya "Ekle" butonuna bas
5. Uygulama ana ekranına eklendi! 🎉

### 🍎 iOS (Safari)
1. Safari'de uygulamayı aç
2. Alt menüdeki Paylaş (⬆️) butonuna tıkla
3. Aşağı kaydır ve "Ana Ekrana Ekle" seçeneğini bul
4. "Ekle" butonuna bas
5. Uygulama ana ekranına eklendi! 🎉

### 💻 Masaüstü (Chrome/Edge)
1. Adres çubuğunun sağındaki yükle ikonuna (⬇️) tıkla
2. "Yükle" butonuna bas
3. Uygulama ayrı pencerede açılır

## ✨ PWA Özellikleri

✅ **Offline Çalışma** - İnternet olmadan kullanılabilir
✅ **Ana Ekranda** - Uygulama gibi çalışır
✅ **Hızlı Yüklenme** - Cache sayesinde anında açılır
✅ **Bildirimler** - Dinlenme ve çalkalama hatırlatıcıları
✅ **Mobil Optimize** - Touch-friendly arayüz

## 🎨 İkon Oluşturma

`public/` klasöründe şu dosyalar gerekli:
- `icon-192.png` (192x192 piksel)
- `icon-512.png` (512x512 piksel)

### Hızlı Icon Oluşturma:
1. [Canva](https://canva.com) veya [Figma](https://figma.com) kullan
2. 512x512 boyutunda tasarım yap
3. Renk paleti:
   - Ana renk: `#C0A080` (altın/bakır)
   - Arka plan: `#0D1117` (koyu gri)
4. Beher/şişe simgesi ekle
5. PNG olarak export et
6. [ImageResizer](https://imageresizer.com) ile 192x192 versiyonu oluştur

## 🚀 Netlify Deploy Sonrası

Deploy sonrası PWA otomatik çalışır:
- `manifest.json` servise alınır
- Service Worker kaydolur
- Tarayıcı "Yükle" düğmesi gösterir

## 🔧 Sorun Giderme

### "Yükle" butonu görünmüyor:
- HTTPS kullanıldığından emin ol (Netlify otomatik sağlar)
- `manifest.json` doğru yüklendi mi kontrol et
- Console'da hata var mı bak

### Bildirimler çalışmıyor:
- Tarayıcı izinlerini kontrol et
- Settings > Bildirimler açık mı kontrol et
- iOS Safari bildirim desteği sınırlı

### Offline çalışmıyor:
- Service Worker kaydoldu mu kontrol et
- Console'da `Service Worker registered` yazısı var mı
- Cache oluşturuldu mu kontrol et

## 📊 PWA Test Araçları

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome DevTools
- [PWABuilder](https://www.pwabuilder.com/) - PWA validasyonu
- Chrome DevTools > Application > Service Workers
