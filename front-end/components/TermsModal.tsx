import React, { useState, useRef, useEffect } from 'react';
import TermsAndPrivacyContent from './TermsAndPrivacyContent';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept, onDecline }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const checkScrollBottom = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Add a small tolerance (e.g., 1px) for floating point inaccuracies
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        setHasScrolledToBottom(true);
      } else {
        setHasScrolledToBottom(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Reset scroll state when modal opens
      setHasScrolledToBottom(false);
      // Timeout to allow content to render and dimensions to be accurate
      setTimeout(() => {
        if (contentRef.current) {
          const { scrollHeight, clientHeight } = contentRef.current;
          // If content is not scrollable, enable button immediately
          if (scrollHeight <= clientHeight) {
            setHasScrolledToBottom(true);
          } else {
            // Check initial scroll position
            checkScrollBottom();
          }
        }
      }, 100); // Adjust timeout if necessary
    }
  }, [isOpen]);

  const handleScroll = () => {
    checkScrollBottom();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-grow mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        >
          <TermsAndPrivacyContent />
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={onDecline}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onAccept}
            disabled={!hasScrolledToBottom}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              hasScrolledToBottom
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
