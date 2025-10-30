import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

// Small accessible info tooltip used across the app.
export default function InfoTooltip({ text, id, variant = 'light' }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const btnRef = useRef(null);

  const show = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      // Simple positioning - always below with more space
      setPos({ left: rect.left + rect.width / 2, top: rect.bottom + 12 });
    }
    setVisible(true);
  };

  const hide = () => setVisible(false);

  const tooltipNode = visible ? (
    createPortal(
      <div
        id={id}
        role="tooltip"
        style={{ left: pos.left, top: pos.top, transform: 'translateX(-50%)' }}
        className="fixed z-[9999] max-w-lg px-4 py-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-xl whitespace-normal min-h-fit"
      >
        {text}
      </div>,
      document.body
    )
  ) : null;

  return (
    <span className="relative inline-block ml-2">
      <button
        ref={btnRef}
        aria-describedby={id}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className={`w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
          variant === 'dark'
            ? 'bg-black/40 text-white border-white/10'
            : 'bg-white text-gray-700 border-gray-200'
        }`}
        aria-label={`More info`}
        style={{ lineHeight: 0 }}
      >
        {/* Information icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={variant === 'dark' ? 'white' : 'currentColor'} strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {tooltipNode}
    </span>
  );
}
