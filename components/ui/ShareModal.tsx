import React, { useState } from 'react';
import { X, Link2, Twitter, Facebook, MessageCircle, Check, Copy } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  text?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url, text }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      color: copied ? 'text-green-600 bg-green-50' : 'text-slate-600 bg-slate-100',
      onClick: handleCopyLink,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500 bg-sky-50',
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || title)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600 bg-blue-50',
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600 bg-green-50',
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent((text || title) + ' ' + url)}`,
          '_blank'
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-slate-800 mb-2">Share</h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{title}</p>

        <div className="grid grid-cols-4 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.onClick}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.color}`}>
                <option.icon size={20} />
              </div>
              <span className="text-xs text-slate-600 font-medium">{option.name}</span>
            </button>
          ))}
        </div>

        {/* URL Preview */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-slate-400" />
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 bg-transparent text-sm text-slate-600 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
