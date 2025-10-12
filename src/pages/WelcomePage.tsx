import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, Users, Briefcase } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase';

export function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        localStorage.setItem('distil_user_email', user.email || '');
        localStorage.setItem('distil_user_name', user.displayName || user.email?.split('@')[0] || 'Kullanıcı');
        localStorage.setItem('distil_user_photo', user.photoURL || '');
        localStorage.setItem('distil_onboarded', 'true');
        navigate('/workshop');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#e6edf3]">
      <style>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Hero Section */}
      <header className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20 bg-[radial-gradient(ellipse_at_bottom,#161B22_0%,#0D1117_70%)]">
        <h1 className="fade-in-section text-5xl md:text-7xl font-bold leading-tight mb-6">
          Koku Sanatını Yeniden Tanımlayın.
        </h1>
        <p className="fade-in-section max-w-2xl text-xl text-[#8b949e] mb-10" style={{transitionDelay: '0.2s'}}>
          Atölye, hayalinizdeki kokuyu yaratmanız için size profesyonel araçlar sunan bir platformdur.
        </p>
        <Button 
          onClick={handleGetStarted}
          className="fade-in-section bg-[#C0A080] hover:bg-[#D4B99D] text-[#0D1117] text-lg px-8 py-6 h-auto font-semibold"
          style={{transitionDelay: '0.4s'}}
        >
          Atölyenizi Şimdi Ücretsiz Kurun
        </Button>
      </header>

      {/* Problem Section */}
      <section id="problem" className="container mx-auto max-w-5xl px-4 py-24 border-b border-[#30363d]">
        <div className="fade-in-section text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Dağınık Notlar. Karmaşık Hesaplar. Kaybolan Fikirler.
          </h2>
          <p className="text-lg text-[#8b949e] mb-6 leading-relaxed">
            Kağıt parçalarına dağılmış formüller, her seferinde yeniden yapılan oran hesaplamaları, 
            unutulan dinlendirme süreleri... Parfüm yaratma süreci, tutkulu olduğu kadar kaotik de olabilir. 
            Yaratıcılığınız, organizasyon eksikliği yüzünden gölgede kalmamalı.
          </p>
          <p className="text-xl font-semibold text-[#C0A080]">
            Atölye, bu kaosu sanata dönüştürür.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto max-w-6xl px-4 py-24 border-b border-[#30363d]">
        <div className="fade-in-section text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Her Şey Tek Bir Yerde. Ustalıkla.
          </h2>
        </div>

        {/* Feature 1 */}
        <div className="fade-in-section grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h3 className="text-3xl font-bold mb-4">Profesyonel Formülasyon. Kusursuz Kontrol.</h3>
            <p className="text-[#8b949e] mb-6">
              Fikirlerinizi saniyeler içinde formüle dökün. Parfüm adı, notalar, esans oranı (%EDP, %EDT) 
              ve şişe hacmi gibi bilgileri girin, gerisini Atölye'ye bırakın.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#C0A080] mr-3 font-bold">✓</span>
                <span><strong className="text-[#e6edf3]">Hatasız Oran Hesaplama:</strong> Gerekli alkol miktarını otomatik hesaplayarak hata payını sıfırlar.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C0A080] mr-3 font-bold">✓</span>
                <span><strong className="text-[#e6edf3]">Anlık Maliyet Analizi:</strong> Her bir şişenin net maliyetini anında görün, bütçenizi yönetin.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C0A080] mr-3 font-bold">✓</span>
                <span><strong className="text-[#e6edf3]">Akıllı Hatırlatmalar:</strong> Özel dinlendirme süreleri belirleyin ve çalkalama zamanlarını asla kaçırmayın.</span>
              </li>
            </ul>
          </div>
          <div className="bg-[#161B22] border border-[#30363d] rounded-xl p-8 h-auto flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="flex justify-between items-baseline border-b border-[#30363d] pb-4 mb-6">
                <h4 className="text-2xl font-semibold">Creed Aventus</h4>
                <span className="text-[#8b949e]">%22 EDP</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm text-[#8b949e]">
                    <span>Esans</span>
                    <span>22%</span>
                  </div>
                  <div className="h-2 bg-[#0D1117] rounded-full border border-[#30363d]">
                    <div className="h-full w-[22%] bg-[#C0A080] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-[#8b949e]">
                    <span>Alkol</span>
                    <span>78%</span>
                  </div>
                  <div className="h-2 bg-[#0D1117] rounded-full border border-[#30363d]">
                    <div className="h-full w-[78%] bg-[#C0A080] rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#30363d] pt-4 mt-6">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm text-[#8b949e]">
                    <span>Şişe:</span>
                    <span>60.00 ₺</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8b949e]">
                    <span>Esans:</span>
                    <span>90.00 ₺</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8b949e]">
                    <span>Alkol:</span>
                    <span>11.70 ₺</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8b949e]">
                    <span>Saf Su:</span>
                    <span>0.30 ₺</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#30363d]">
                  <span className="text-[#8b949e]">Toplam Maliyet:</span>
                  <strong className="text-[#C0A080] text-2xl">162.00 ₺</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="fade-in-section grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-[#161B22] border border-[#30363d] rounded-xl p-8 h-96 flex items-center justify-center">
            <svg className="w-full max-w-md" viewBox="-5 -5 120 110">
              {/* Grid lines */}
              <polygon points="50,10 95,35 80,85 20,85 5,35" fill="none" stroke="#30363d" strokeWidth="0.5"/>
              <polygon points="50,20 85,40 75,75 25,75 15,40" fill="none" stroke="#30363d" strokeWidth="0.5"/>
              <polygon points="50,30 75,45 70,65 30,65 25,45" fill="none" stroke="#30363d" strokeWidth="0.5"/>
              
              {/* Axis lines */}
              <line x1="50" y1="10" x2="50" y2="90" stroke="#30363d" strokeWidth="0.5"/>
              <line x1="95" y1="35" x2="20" y2="85" stroke="#30363d" strokeWidth="0.5"/>
              <line x1="5" y1="35" x2="80" y2="85" stroke="#30363d" strokeWidth="0.5"/>
              
              {/* Data polygon */}
              <polygon points="50,18 80,45 70,65 25,80 10,38" fill="rgba(192, 160, 128, 0.4)" stroke="#C0A080" strokeWidth="1.5"/>
              
              {/* Labels */}
              <text x="50" y="5" textAnchor="middle" fill="#8b949e" fontSize="5" fontFamily="Poppins">Kalıcılık</text>
              <text x="105" y="42" textAnchor="end" fill="#8b949e" fontSize="5" fontFamily="Poppins">Yayılım</text>
              <text x="83" y="98" textAnchor="end" fill="#8b949e" fontSize="5" fontFamily="Poppins">Beğeni</text>
              <text x="17" y="98" textAnchor="start" fill="#8b949e" fontSize="5" fontFamily="Poppins">Karakter</text>
              <text x="0" y="38" textAnchor="start" fill="#8b949e" fontSize="5" fontFamily="Poppins">F/P</text>
            </svg>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-bold mb-4">Bir Zanaatkar Gibi Organize Olun. Bir Uzman Gibi Analiz Edin.</h3>
            <p className="text-[#8b949e] mb-6">
              Düzinelerce deneme arasında kaybolmayın. Her bir kreasyonunuzu takip edin, test edin ve mükemmelleştirin.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#C0A080] mr-3 font-bold">✓</span>
                <span><strong className="text-[#e6edf3]">Kişisel Formül Kütüphanesi:</strong> Tüm formülleriniz güvenli "Atölyem"de. Kopyalayın, düzenleyin, versiyonlayın.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C0A080] mr-3 font-bold">✓</span>
                <span><strong className="text-[#e6edf3]">Detaylı Test Modülü:</strong> Kalıcılık, yayılım ve genel beğeni gibi metriklerle parfümlerinizi puanlayın.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C0A080] mr-3 font-bold">✓</span>
                <span><strong className="text-[#e6edf3]">Yapay Zeka Destekli Geliştirme:</strong> Test notlarınızı analiz eden yapay zeka ile kişiselleştirilmiş öneriler alın.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section id="audience" className="container mx-auto max-w-6xl px-4 py-24 border-b border-[#30363d]">
        <div className="fade-in-section text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Kimin İçin Tasarlandı?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="fade-in-section bg-[#161B22] border border-[#30363d] rounded-xl p-8 hover:border-[#C0A080] transition-all hover:-translate-y-2">
            <div className="w-12 h-12 rounded-full bg-[#C0A080]/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-[#C0A080]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#C0A080]">Yeni Başlayan Meraklılar</h3>
            <p className="text-[#8b949e]">
              Koku dünyasına ilk adımı atmak isteyen ama nereden başlayacağını bilemeyenler için.
            </p>
          </div>
          <div className="fade-in-section bg-[#161B22] border border-[#30363d] rounded-xl p-8 hover:border-[#C0A080] transition-all hover:-translate-y-2">
            <div className="w-12 h-12 rounded-full bg-[#C0A080]/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-[#C0A080]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#C0A080]">Tutkulu Hobiler</h3>
            <p className="text-[#8b949e]">
              Denemelerini bir üst seviyeye taşımak, formüllerini organize etmek ve veriye dayalı kararlar almak isteyenler için.
            </p>
          </div>
          <div className="fade-in-section bg-[#161B22] border border-[#30363d] rounded-xl p-8 hover:border-[#C0A080] transition-all hover:-translate-y-2">
            <div className="w-12 h-12 rounded-full bg-[#C0A080]/10 flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-[#C0A080]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#C0A080]">Butik Üreticiler</h3>
            <p className="text-[#8b949e]">
              Üretim süreçlerini profesyonelleştirmek, maliyetlerini kontrol altında tutmak ve formül arşivlerini güvenle yönetmek isteyenler için.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="fade-in-section bg-[#161B22] rounded-2xl p-12 border border-[#30363d]">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Koku Maceranız Burada Başlıyor.
          </h1>
          <p className="text-xl text-[#8b949e] mb-8">
            Hayal gücünüzü organize edin, bilginizi derinleştirin ve kendi imza kokunuzu yaratın.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-[#C0A080] hover:bg-[#D4B99D] text-[#0D1117] text-lg px-8 py-6 h-auto font-semibold"
          >
            Atölyenizi Şimdi Ücretsiz Kurun
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-[#8b949e] text-sm border-t border-[#30363d]">
        <p>© 2025 Atölye. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}
