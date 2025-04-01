"use client";

import * as React from "react";

interface ToastProps {
  description: string;
}

let showToast: (props: ToastProps) => void = () => {};

export function toast(props: ToastProps) {
  if (typeof window !== 'undefined') {
    showToast(props);
  }
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: number }>>([]);
  const [count, setCount] = React.useState(0);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    mounted.current = true;
    showToast = ({ description }) => {
      if (!mounted.current) return;
      const id = count;
      setCount(prev => prev + 1);
      setToasts(prev => [...prev, { id, description }]);
      setTimeout(() => {
        if (!mounted.current) return;
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };
    return () => {
      mounted.current = false;
    };
  }, [count]);

  // Don't render anything on the server
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {toasts.map(({ id, description }) => (
        <div
          key={id}
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.2s ease-out'
          }}
        >
          {description}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
} 