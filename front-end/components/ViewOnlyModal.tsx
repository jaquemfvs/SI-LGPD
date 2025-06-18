import React from 'react';
import TermsAndPrivacyContent from './TermsAndPrivacyContent';
import PrivacyPolicyContent from './PrivacyPolicyContent';

interface ViewOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalFocus: 'terms' | 'privacy';
}

const ViewOnlyModal: React.FC<ViewOnlyModalProps> = ({ isOpen, onClose, modalFocus }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors text-4xl bg-white rounded-full p-2 shadow-md"
        >
          &times;
        </button>
        <div className="mt-12 overflow-y-auto flex-grow mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {modalFocus === 'privacy' ? <PrivacyPolicyContent /> : <TermsAndPrivacyContent />}
        </div>
      </div>
    </div>
  );
};

export default ViewOnlyModal;
