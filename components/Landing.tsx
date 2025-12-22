
import React from 'react';
import Footer from './Footer';

interface Props {
  onStart: () => void;
}

const Landing: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Hero Section */}
      <nav className="flex justify-between items-center px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-green-700">
          <span>🌿</span> EcoTracker
        </div>
        <button 
          onClick={onStart}
          className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all"
        >
          Login
        </button>
      </nav>

      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold text-green-700 bg-green-100 rounded-full animate-bounce">
          New: AI-Powered Green Tips! ✨
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
          Track Your Footprint. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Save the Planet.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The gamified carbon tracker for students. Compete with classmates, earn badges, and lower your daily emissions with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onStart}
            className="bg-green-600 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-green-200 hover:scale-105 transition-transform"
          >
            Get Started Free
          </button>
          <a href="#how-it-works" className="bg-white border border-slate-200 text-slate-700 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-colors">
            Learn More
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-20 bg-white" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-16">Why students love EcoTracker</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Easy Logging', desc: 'Track your transport and food choices in seconds with our mobile-first interface.', icon: '📝' },
              { title: 'Gamified Experience', desc: 'Level up, earn XP, and unlock badges as you reduce your carbon footprint.', icon: '🏆' },
              { title: 'AI Insights', desc: 'Personalized recommendations from Gemini AI based on your actual habits.', icon: '🤖' },
            ].map((f, i) => (
              <div key={i} className="text-center group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-900 py-24 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-12">Join 10,000+ Students</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'CO2 Saved', val: '450 Tons' },
              { label: 'Active Users', val: '12k' },
              { label: 'Campuses', val: '80+' },
              { label: 'Tips Generated', val: '1M+' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-black mb-1 text-green-400">{s.val}</div>
                <div className="text-xs uppercase font-bold tracking-widest opacity-60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
