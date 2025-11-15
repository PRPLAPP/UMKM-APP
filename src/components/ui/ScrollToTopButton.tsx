import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const isVisible = window.scrollY > 150; // lower threshold for testing
      setVisible(isVisible);
      // debug log for visibility changes
      // eslint-disable-next-line no-console
      console.debug('[ScrollToTopButton] scrollY=', window.scrollY, 'visible=', isVisible);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // debug mount
  // eslint-disable-next-line no-console
  console.debug('[ScrollToTopButton] mounted=', mounted, 'visible=', visible);

  if (!mounted) return null;
  if (!visible) return null;

  const button = (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      // use a very high z-index and safe-area offset so button stays inside viewport
      className="fixed right-4 z-[99999] bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:opacity-90 focus:outline-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0) + 16px)' }}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );

  return typeof document !== 'undefined' ? createPortal(button, document.body) : null;
}
