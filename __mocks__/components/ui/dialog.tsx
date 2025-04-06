import React from 'react';

// Create simple mock components for Dialog
const Dialog = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogFooter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogTitle = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogDescription = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogClose = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}; 