import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  // Feature, How it Works, Key Features, Testimonials, Privacy arrays
  const features = [
    { title: 'Personalized Insights', text: 'Receive tailored guidance and actionable insights based on your unique emotional patterns and conversations.' },
    { title: 'Unwavering Privacy', text: 'Your conversations are encrypted and confidential. We prioritize your privacy above all else, ensuring a safe space.' },
    { title: '24/7 Availability', text: 'Access support anytime, anywhere. MindFlow AI is always here to listen, day or night, without judgment.' },
    { title: 'Track Your Progress', text: 'Monitor your emotional shifts and growth over time with intuitive tracking and visual summaries.' },
  ];
  const howItWorks = [
    { step: 1, title: 'Connect Instantly', text: 'Download the MindFlow AI app and create your secure profile in minutes to begin your journey.' },
    { step: 2, title: 'Share & Reflect', text: 'Engage in natural, free-flowing conversations. The AI listens empathetically and helps you explore your thoughts.' },
    { step: 3, title: 'Receive Support', text: 'Get personalized insights, coping strategies, and guided exercises tailored to your current needs.' },
    { step: 4, title: 'Grow & Thrive', text: 'Continually track your progress and build resilience with ongoing support and encouragement.' },
  ];
  const testimonials = [
    { quote: 'MindFlow AI has been a game-changer for my anxiety. The personalized insights truly helped me understand myself better. It feels like a genuine conversation.', name: 'Sarah J.', role: 'Marketing Specialist' },
    { quote: 'I was skeptical at first, but the privacy and non-judgmental space MindFlow AI provides are invaluable. It’s a reliable companion through tough times.', name: 'David L.', role: 'Software Engineer' },
    { quote: 'The guided exercises and mood tracking have been incredibly helpful. It’s empowering to see my progress and have consistent support.', name: 'Emily R.', role: 'Student' },
  ];
  const privacy = [
    { title: 'End-to-End Encryption', text: 'All your data and conversations are secured with industry-leading encryption.' },
    { title: 'Anonymous Mode Option', text: 'Engage without sharing personally identifiable information if you choose.' },
    { title: 'Ethical AI Guidelines', text: 'Developed under strict ethical guidelines, prioritizing user safety and well-being.' },
  ];

  return (
    <div className="grainy-gradient-bg min-h-screen flex flex-col">
      {/* Hero Section - Full width background */}
      <div className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden" style={{position: 'relative'}}>
        <img 
          src="images/happy.png" 
          alt="Happy" 
          className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none select-none z-0" 
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between min-h-[520px]">
          <div className="md:w-1/2 flex flex-col items-start">
          
           
           
          </div>
        </div>
      </div>

      {/* Centered Main Message Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-center text-gray-900 mb-10 leading-tight">
          A Judgement Free<br />
          Place to Discuss<br />
          Everyday Problems.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-10">
          Whether it’s stress at work, relationship struggles, or just needing someone to listen – your AI Therapist is here to help. You can open up freely and explore your thoughts without worrying about being judged. Your AI therapist provides a safe, empathetic space to sort through your emotions, offering guidance and support when you need it most.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900"><span>✔️</span> Get Unbiased Advice</div>
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900"><span>✔️</span> Available 24/7</div>
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900"><span>✔️</span> Fully Anonymous</div>
        </div>
        <button 
          className="bg-purple-900 hover:bg-purple-800 text-white font-semibold px-16 py-4 rounded shadow flex items-center gap-2 text-lg"
          onClick={() => navigate('/app')}
        >
          <span role="img" aria-label="chat">💬</span> Talk Now
        </button>
      </section>

      {/* Features Row */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-16 pt-16">
        <div className="flex flex-wrap gap-6 justify-center">
          {features.map((f, i) => (
            <div key={i} className="flex-1 min-w-[220px] max-w-xs bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 bg-purple-100 rounded-full flex items-center justify-center text-2xl text-purple-500">
                <span role="img" aria-label="icon">🌟</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-600 text-base">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-5xl mx-auto px-4 mb-16" id="how-it-works">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">How MindFlow AI Works for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {howItWorks.map((s, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 mb-2 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">{s.step}</div>
              <h4 className="font-semibold text-base mb-1 text-gray-900">{s.title}</h4>
              <p className="text-gray-600 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 flex flex-col items-start">
              <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg text-gray-500">
                  <span role="img" aria-label="user">👤</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & Safety */}
      <section className="w-full max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">Your Privacy & Safety, Our Priority</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {privacy.map((p, i) => (
            <div key={i} className="flex-1 min-w-[220px] max-w-xs bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 mb-2 bg-blue-100 rounded-full flex items-center justify-center text-xl text-blue-500">
                <span role="img" aria-label="icon">🔒</span>
              </div>
              <h4 className="font-semibold text-base mb-1 text-gray-900">{p.title}</h4>
              <p className="text-gray-600 text-sm">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-5xl mx-auto px-4 mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FAQ Left Column */}
          <div className="flex flex-col gap-4">
            <FAQItem
              question="What is Sol, and how does it work?"
              answer="Sol is an AI companion designed to provide you with a supportive, non-judgmental space to talk through your feelings, challenges, and mental health goals. Sol uses advanced natural language processing to understand and respond to your emotions, offer tailored insights, and guide you through difficult situations."
              defaultOpen={true}
            />
            <FAQItem question="Is Sol a replacement for therapy?" answer="No, Sol is not a replacement for professional therapy or medical advice. It is a supportive tool to help you reflect and manage your emotions." defaultOpen={false} />
            <FAQItem question="Can Sol diagnose mental health conditions?" answer="No, Sol cannot diagnose or treat mental health conditions. For diagnosis or treatment, please consult a licensed professional." defaultOpen={false} />
            <FAQItem question="How does Sol personalize its advice?" answer="Sol learns from your conversations and emotional patterns to offer insights and suggestions tailored to your needs, while always respecting your privacy." defaultOpen={false} />
            <FAQItem question="Can I use Sol if I’m already seeing a therapist?" answer="Yes, Sol can be used alongside therapy as a supplemental tool for reflection and support." defaultOpen={false} />
            <FAQItem question="Will Sol judge me or give biased advice?" answer="No, Sol is designed to be non-judgmental and unbiased, providing a safe space for open conversation." defaultOpen={false} />
          </div>
          {/* FAQ Right Column */}
          <div className="flex flex-col gap-4">
            <FAQItem question="What should I do if I’m experiencing a crisis?" answer="If you are experiencing a crisis or emergency, please contact a mental health professional or emergency services immediately. Sol is not equipped to handle crisis situations." defaultOpen={false} />
            <FAQItem question="What kind of issues can Sol help with?" answer="Sol can assist with a wide range of mental health topics, including managing stress and anxiety, building emotional resilience, improving relationships, setting and achieving personal goals, and practicing self-compassion." defaultOpen={true} />
            <FAQItem question="Does Sol provide advice, or is it just for venting?" answer="Sol can provide both a listening ear and practical advice, depending on your needs and preferences." defaultOpen={false} />
            <FAQItem question="What’s included in the free version of Sol?" answer="The free version of Sol includes unlimited conversations, basic insights, and access to core features. Premium features may be available for a fee." defaultOpen={false} />
            <FAQItem question="How much does Sol cost?" answer="Sol offers a free version with optional premium upgrades. See our pricing page for details." defaultOpen={false} />
            <FAQItem question="How do I cancel my subscription?" answer="You can cancel your subscription anytime from your account settings. Your access to premium features will continue until the end of your billing period." defaultOpen={false} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-white border-t flex flex-col items-center mt-auto">
        <div className="font-bold text-gray-800 text-lg mb-2">MindFlow AI</div>
        <nav className="flex gap-6 mb-2">
          <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">About</a>
          <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Contact</a>
        </nav>
        <div className="text-gray-400 text-xs">© 2025 MindFlow AI. All rights reserved.</div>
      </footer>
    </div>
  );
}

// FAQItem component
function FAQItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div className={`transition-all duration-200 border rounded-xl bg-white/70 shadow-sm ${open ? 'border-purple-400' : 'border-gray-200'}`}>
      <button
        className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-xl"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={`font-semibold text-lg ${open ? 'text-purple-700' : 'text-gray-900'}`}>{question}</span>
        <span className={`ml-4 text-2xl transition-transform duration-200 ${open ? 'rotate-45 text-purple-700' : 'rotate-0 text-gray-400'}`}>{open ? '−' : '+'}</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 px-6 ${open ? 'max-h-96 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
        style={{fontSize: '1rem', color: '#6B7280'}}
      >
        {open && <div>{answer}</div>}
      </div>
    </div>
  );
}
