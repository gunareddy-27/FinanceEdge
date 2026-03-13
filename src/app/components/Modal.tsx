'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    if (!isOpen) return null;

    return createPortal(
        <div className={`modal-overlay open`} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal" style={{ animation: 'slideInModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h3 className="text-xl">{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        className="modal-close-btn"
                    >
                        <X size={24} color="var(--text-muted)" />
                    </button>
                </div>
                {children}

                <style jsx>{`
                    @keyframes slideInModal {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .modal-close-btn:hover {
                        background: var(--bg-body);
                    }
                `}</style>
            </div>
        </div>,
        document.body
    );
}
