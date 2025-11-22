import { useState, useEffect } from "react";
import { Menu, ArrowRight, ShieldCheck, Sparkles, Clock, Quote, Instagram, Twitter, Linkedin, Bot, MoreHorizontal, ArrowUp, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 150;

      revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="font-serif text-2xl font-semibold tracking-tight flex items-center gap-2 text-black-soft">
            <div className="w-2 h-2 bg-black-soft rounded-full"></div>
            PsyMind
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black-light">
            <a href="#funcionalidades" className="hover:text-peach-500 transition-colors">Como funciona</a>
            <a href="#filosofia" className="hover:text-peach-500 transition-colors">Filosofia</a>
            <a href="#contato" className="hover:text-peach-500 transition-colors">Login</a>
            <Button className="bg-black-soft text-white hover:bg-gray-800 rounded-full px-5 py-2.5 transition-all transform hover:scale-105">
              Começar Agora
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6 text-black-soft" />
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-peach-50 p-6 border-b border-peach-200">
            <div className="flex flex-col gap-4 text-center">
              <a href="#funcionalidades" className="text-black-soft hover:text-peach-500 transition-colors">Como funciona</a>
              <a href="#filosofia" className="text-black-soft hover:text-peach-500 transition-colors">Filosofia</a>
              <a href="#contato" className="text-black-soft hover:text-peach-500 transition-colors">Login</a>
              <Button className="bg-black-soft text-white hover:bg-gray-800 rounded-full">
                Começar Agora
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-20 pb-12 px-6 overflow-hidden">
        {/* SVG Flower Decoration */}
        <div className="mb-8 opacity-80 animate-float">
          <svg width="80" height="120" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 140C50 140 55 100 45 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-black-soft"/>
            <path d="M50 110C40 105 30 115 50 120" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black-soft"/>
            <path d="M50 100C60 95 70 105 50 110" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black-soft"/>
            <path d="M45 70C30 60 20 40 35 25C40 20 45 30 50 35C55 30 60 20 65 25C80 40 70 60 55 70C50 73 45 70 45 70Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black-soft"/>
            <path d="M50 35V55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-peach-400"/>
          </svg>
        </div>

        <div className="text-center max-w-3xl mx-auto z-10">
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6 text-black-soft reveal active">
            PsyMind, seu<br/>
            <span className="italic text-peach-500">parceiro</span> de IA
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 font-light max-w-xl mx-auto reveal active" style={{ transitionDelay: '0.2s' }}>
            Organize seus pensamentos e crie insights que edificam. Um espaço seguro para a sua mente florescer, disponível a qualquer momento.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center reveal active" style={{ transitionDelay: '0.4s' }}>
            <Button className="bg-black-soft text-white hover:bg-gray-800 px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center gap-2">
              Iniciar Conversa <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="px-8 py-4 rounded-full text-lg font-medium border-black-soft/20 hover:bg-white/50 text-black-soft">
              Saiba Mais
            </Button>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-peach-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      </section>

      {/* Chat Preview Section */}
      <section className="pb-24 px-4 flex justify-center relative z-10">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-peach-200/50 border border-peach-100 overflow-hidden reveal">
          {/* Chat Header */}
          <div className="bg-peach-50/80 backdrop-blur px-6 py-4 border-b border-peach-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-peach-200 rounded-full flex items-center justify-center text-peach-600">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-black-soft">PsyMind</h3>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online agora
                </p>
              </div>
            </div>
            <MoreHorizontal className="text-gray-400 w-5 h-5" />
          </div>

          {/* Chat Body */}
          <div className="bg-white h-[450px] p-6 overflow-y-auto flex flex-col gap-5 no-scrollbar">
            <div className="text-center text-xs text-gray-300 my-2">Hoje, 14:02</div>

            {/* AI Message */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-peach-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 text-peach-600" />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 leading-relaxed shadow-sm max-w-[85%]">
                Olá. Como você está se sentindo hoje? Lembre-se, este é um espaço seguro para compartilhar o que quiser. 🌿
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-3 items-start flex-row-reverse">
              <div className="w-8 h-8 bg-black-soft rounded-full flex-shrink-0 flex items-center justify-center mt-1 text-white text-xs">
                Eu
              </div>
              <div className="bg-peach-500 text-white p-4 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-md max-w-[85%]">
                Sinto que minha cabeça não para. Estou um pouco sobrecarregado com o trabalho e não consigo organizar meus pensamentos.
              </div>
            </div>

            {/* AI Message */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-peach-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 text-peach-600" />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 leading-relaxed shadow-sm max-w-[85%]">
                Entendo perfeitamente. Essa sensação de "ruído mental" é muito comum. Vamos tentar uma coisa simples? Respire fundo. <br/><br/>Agora, se pudesse escolher apenas uma tarefa que está te preocupando mais, qual seria?
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="flex gap-3 items-end mt-auto">
              <div className="w-8 h-8 bg-peach-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-peach-600" />
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-50">
            <div className="bg-gray-50 rounded-full px-4 py-3 flex items-center justify-between border border-gray-100">
              <span className="text-gray-400 text-sm">Digite sua resposta...</span>
              <div className="w-8 h-8 bg-peach-500 rounded-full flex items-center justify-center shadow-sm shadow-peach-300">
                <ArrowUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-peach-500 font-medium tracking-wider text-sm uppercase">Por que PsyMind?</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 text-black-soft">Tecnologia com empatia</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-peach-50 hover:bg-peach-100 transition-colors duration-300 reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-peach-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl mb-3 text-black-soft">Privacidade Total</h3>
              <p className="text-gray-600 leading-relaxed">
                Suas conversas são criptografadas e anônimas. O que você compartilha com o PsyMind, fica no PsyMind.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-peach-50 hover:bg-peach-100 transition-colors duration-300 reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-peach-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl mb-3 text-black-soft">Insights Edificantes</h3>
              <p className="text-gray-600 leading-relaxed">
                Não apenas conversas, mas reflexões. Nossa IA identifica padrões e sugere novas perspectivas para seus desafios.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-peach-50 hover:bg-peach-100 transition-colors duration-300 reveal" style={{ transitionDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-peach-500">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl mb-3 text-black-soft">Sempre Disponível</h3>
              <p className="text-gray-600 leading-relaxed">
                Ansiedade na madrugada ou estresse antes de uma reunião? Estamos aqui 24/7 para te ajudar a se centrar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section id="filosofia" className="py-24 px-6 bg-black-soft text-peach-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 reveal">
          <Quote className="w-12 h-12 mx-auto mb-8 opacity-20" />
          <h2 className="font-serif text-3xl md:text-5xl leading-tight font-light">
            "Às vezes, tudo o que precisamos é de um momento de pausa e uma pergunta certa para clarear a mente."
          </h2>
          <div className="mt-8 w-16 h-[1px] bg-peach-500/50 mx-auto"></div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-64 h-64 border-2 border-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-peach-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* CTA Section */}
      <section id="contato" className="py-20 px-6 bg-peach-100 text-center">
        <div className="max-w-2xl mx-auto reveal">
          <h2 className="font-serif text-4xl mb-6 text-black-soft">Pronto para organizar sua mente?</h2>
          <p className="text-gray-700 mb-8">Junte-se a milhares de pessoas que encontraram clareza com o PsyMind.</p>
          <Button className="bg-peach-500 hover:bg-peach-400 text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-peach-500/30 transform hover:-translate-y-1">
            Experimentar Gratuitamente
          </Button>
          <p className="mt-4 text-sm text-gray-500">Não requer cartão de crédito • Cancelamento a qualquer momento</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-peach-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <a href="#" className="font-serif text-2xl font-semibold flex items-center gap-2 mb-4 text-black-soft">
                <div className="w-2 h-2 bg-black-soft rounded-full"></div>
                PsyMind
              </a>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tecnologia desenhada para o bem-estar humano. Cultivando saúde mental através de conversas significativas.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-black-soft">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-peach-500 transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-peach-500 transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-peach-500 transition-colors">Para Terapeutas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-black-soft">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-peach-500 transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-peach-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-peach-500 transition-colors">Carreiras</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-black-soft">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-peach-500 transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-peach-500 transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-peach-500 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2024 PsyMind. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Instagram className="w-5 h-5 cursor-pointer hover:text-peach-500 transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-peach-500 transition-colors" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-peach-500 transition-colors" />
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Index;
