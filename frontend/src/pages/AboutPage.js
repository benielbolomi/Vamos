import { MessageCircle, Award, Users, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const WHATSAPP_NUMBER = "243814773188";

export default function AboutPage() {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite en savoir plus sur VAMOS Couture et vos formations.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid="about-page">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-[#0F172A]" data-testid="about-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[#FCE7F3] text-sm uppercase tracking-widest mb-4">Notre histoire</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-6">
              À propos de VAMOS
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Un centre de formation professionnelle dédié à l'excellence de la couture congolaise.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24" data-testid="mission-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <img
                src="https://customer-assets.emergentagent.com/job_atelier-couture-4/artifacts/2zbp5ui1_IMG-20260409-WA0034.jpg"
                alt="Logo VAMOS"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div>
              <p className="text-[#475569] text-sm uppercase tracking-widest mb-3">Notre mission</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#0F172A] mb-6">
                "Crois Seulement"
              </h2>
              <p className="text-[#475569] leading-relaxed mb-6">
                VAMOS est bien plus qu'un simple atelier de couture. C'est un lieu où la passion pour la mode 
                africaine rencontre l'apprentissage et le savoir-faire traditionnel. Notre devise "Crois Seulement" 
                reflète notre conviction que chacun peut réaliser ses rêves avec détermination et foi.
              </p>
              <p className="text-[#475569] leading-relaxed">
                Fondé et dirigé par M. Ramazani Usseni, notre centre forme la prochaine génération de couturiers 
                tout en créant des pièces uniques pour notre clientèle fidèle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#475569] text-sm uppercase tracking-widest mb-3">Nos valeurs</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#0F172A]">
              Ce qui nous définit
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 text-center">
              <div className="w-16 h-16 bg-[#FCE7F3] flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-[#0F172A]" />
              </div>
              <h3 className="font-serif text-xl text-[#0F172A] mb-4">Excellence</h3>
              <p className="text-[#475569] leading-relaxed">
                Chaque création est réalisée avec le plus grand soin et attention aux détails, 
                garantissant une qualité irréprochable.
              </p>
            </div>

            <div className="bg-white p-8 text-center">
              <div className="w-16 h-16 bg-[#FCE7F3] flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#0F172A]" />
              </div>
              <h3 className="font-serif text-xl text-[#0F172A] mb-4">Formation</h3>
              <p className="text-[#475569] leading-relaxed">
                Nous transmettons notre savoir-faire aux jeunes talents, contribuant ainsi 
                au développement de notre communauté.
              </p>
            </div>

            <div className="bg-white p-8 text-center">
              <div className="w-16 h-16 bg-[#FCE7F3] flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#0F172A]" />
              </div>
              <h3 className="font-serif text-xl text-[#0F172A] mb-4">Passion</h3>
              <p className="text-[#475569] leading-relaxed">
                La couture n'est pas qu'un métier, c'est un art que nous pratiquons avec 
                passion et dévouement chaque jour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formation Section */}
      <section className="py-16 md:py-24" data-testid="formation-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[#475569] text-sm uppercase tracking-widest mb-3">Formation professionnelle</p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#0F172A] mb-6">
                Apprenez la couture avec nous
              </h2>
              <p className="text-[#475569] leading-relaxed mb-6">
                Notre centre de formation propose des programmes adaptés à tous les niveaux. 
                Que vous soyez débutant ou que vous souhaitiez perfectionner vos compétences, 
                nous avons un programme pour vous.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC]">
                  <span className="font-medium text-[#0F172A]">Formation 3 mois</span>
                  <span className="text-[#0F172A] font-semibold">100$</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC]">
                  <span className="font-medium text-[#0F172A]">Formation 6 mois</span>
                  <span className="text-[#0F172A] font-semibold">150$</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC]">
                  <span className="font-medium text-[#0F172A]">Formation 12 mois</span>
                  <span className="text-[#0F172A] font-semibold">200$</span>
                </div>
              </div>

              <button
                onClick={openWhatsApp}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 font-medium transition-colors"
                data-testid="formation-whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5" />
                S'inscrire via WhatsApp
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1771315938125-0ab0134bcf5a"
                alt="Machine à coudre"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-[#0F172A]" data-testid="team-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#FCE7F3] text-sm uppercase tracking-widest mb-3">Notre fondateur</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">
            M. Ramazani Usseni
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-white/70 leading-relaxed mb-8">
              Avec des années d'expérience dans la couture et une passion pour la transmission du savoir, 
              M. Ramazani Usseni a fondé VAMOS pour partager son art et former la nouvelle génération 
              de couturiers congolais. Son engagement envers l'excellence et sa foi inébranlable dans 
              le potentiel de chaque apprenant sont au cœur de notre mission.
            </p>
            <button
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 font-medium transition-colors"
              data-testid="founder-whatsapp-btn"
            >
              <MessageCircle className="w-5 h-5" />
              Contacter
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
