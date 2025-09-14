import React, { useState, createContext, useContext } from 'react';

const DialogContext = createContext(null);

export function Dialog({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ asChild, children, ...props }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');

  const handleClick = () => {
    context.setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick
    });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export function DialogContent({ className = '', children, ...props }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogContent must be used within Dialog');

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => context.setOpen(false)}
      />
      <div className={`relative bg-white rounded-lg shadow-lg ${className}`} {...props}>
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          onClick={() => context.setOpen(false)}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0">
      {children}
    </div>
  );
}

export function DialogTitle({ className = '', children, ...props }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  );
}