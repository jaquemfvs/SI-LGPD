
import React from 'react';
import TermsAndPrivacyContent from './TermsAndPrivacyContent';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="overflow-y-auto flex-grow mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
