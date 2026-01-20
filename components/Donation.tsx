import React, { useState } from 'react';
import { Heart, CreditCard, Gift, ShieldCheck } from 'lucide-react';

const Donation: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  
  const presets = [10, 25, 50, 100];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} fill="currentColor" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Support the Ministry</h1>
        <p className="text-slate-500 max-w-md mx-auto">
            Your generous contributions help us maintain the platform, support outreach programs, and help students in need.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8">
            <h3 className="font-semibold text-slate-700 mb-4">Select Amount</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
                {presets.map((val) => (
                    <button
                        key={val}
                        onClick={() => { setAmount(val); setCustomAmount(''); }}
                        className={`py-3 rounded-xl font-bold transition-all border ${
                            amount === val 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}
                    >
                        ${val}
                    </button>
                ))}
            </div>
            
            <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Or enter custom amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
                    <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 font-bold text-lg text-slate-800"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                <CreditCard size={20} />
                Give Now
            </button>
        </div>
        
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100">
            <div className="flex items-start gap-3">
                <ShieldCheck className="text-green-600 shrink-0" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-slate-800">Secure Transaction</h4>
                    <p className="text-xs text-slate-500 mt-1">
                        All donations are processed securely. You will receive a tax-deductible receipt via email.
                        Light On Campus is a registered non-profit organization.
                    </p>
                </div>
            </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <Gift size={20} />
              </div>
              <div>
                  <div className="text-sm font-bold text-slate-800">Student Fund</div>
                  <div className="text-xs text-slate-500">Support education</div>
              </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Heart size={20} />
              </div>
              <div>
                  <div className="text-sm font-bold text-slate-800">Outreach</div>
                  <div className="text-xs text-slate-500">Street ministry</div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Donation;
