# Firebase Kurulum Rehberi

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" (Proje ekle) butonuna tıklayın
3. Proje adı girin (örn: "atolye-app")
4. Google Analytics'i istediğiniz gibi ayarlayın
5. "Create project" butonuna tıklayın

## 2. Web Uygulaması Ekleme

1. Firebase Console'da projenize gidin
2. Sol menüden "Project Overview" > "Project settings" (⚙️ ikonu)
3. "Your apps" bölümünde "</>" (Web) ikonuna tıklayın
4. App nickname girin (örn: "Atölye Web")
5. "Register app" butonuna tıklayın
6. Firebase SDK configuration kodunu kopyalayın

## 3. Authentication Ayarlama

1. Sol menüden "Authentication" seçin
2. "Get started" butonuna tıklayın
3. "Sign-in method" sekmesine gidin
4. "Google" seçeneğini bulun ve tıklayın
5. "Enable" toggle'ını açın
6. Project support email seçin
7. "Save" butonuna tıklayın

## 4. Firebase Config'i Güncelleme

`src/lib/firebase.ts` dosyasını açın ve aşağıdaki değerleri Firebase Console'dan aldığınız değerlerle değiştirin:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // Firebase Console'dan alın
  authDomain: "YOUR_AUTH_DOMAIN",      // Örn: "atolye-app.firebaseapp.com"
  projectId: "YOUR_PROJECT_ID",        // Örn: "atolye-app"
  storageBucket: "YOUR_STORAGE_BUCKET", // Örn: "atolye-app.appspot.com"
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
\`\`\`

## 5. Test Etme

1. Uygulamayı başlatın: `npm run dev`
2. Ana sayfada "Atölyenizi Şimdi Ücretsiz Kurun" butonuna tıklayın
3. Google hesabınızla giriş yapın
4. Atölye sayfasına yönlendirileceksiniz!

## 6. Topluluk Özelliği İçin (Gelecek)

Topluluk özelliğini eklemek için Firestore Database'i de aktif etmeniz gerekecek:

1. Sol menüden "Firestore Database" seçin
2. "Create database" butonuna tıklayın
3. "Start in test mode" seçin (geliştirme için)
4. Location seçin (Europe-west için "eur3" önerilir)
5. "Enable" butonuna tıklayın

## Notlar

- **Güvenlik**: Production'a geçmeden önce Firebase Security Rules'u güncellemeyi unutmayın!
- **API Key**: API key'i public olarak kullanmak güvenlidir, Firebase Security Rules ile korunur
- **Domain**: Firebase Console'da authorized domains listesine production domain'inizi eklemeyi unutmayın

## Sorun Giderme

### "Firebase: Error (auth/unauthorized-domain)"
- Firebase Console > Authentication > Settings > Authorized domains
- `localhost` ve production domain'inizi ekleyin

### "Firebase: Error (auth/popup-closed-by-user)"
- Normal bir durum, kullanıcı popup'ı kapattı
- Tekrar denemesi yeterli
