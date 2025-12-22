
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-12">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <h3 className="text-white text-xl font-bold flex items-center gap-2 mb-4">
            <span>🌿</span> EcoTracker
          </h3>
          <p className="text-sm leading-relaxed max-w-xs">
            Empowering students to take daily climate action through data, community, and gamification.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Leaderboard</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">AI Insights</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-green-400 transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} EcoTracker. All rights reserved. Built with ❤️ for the Earth.</p>
      </div>
    </footer>
  );
};

export default Footer;
