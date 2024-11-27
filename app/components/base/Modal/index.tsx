import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../Button';

interface ModalProps {
  modalDescription: string | React.ReactElement;
  handlePositiveClick?: () => void;
  handleNegativeClick?: () => void;
  positiveButtonName?: string;
  negativeButtonName?: string;
}

// TODO: outside click needs to be handled
function Modal(props: ModalProps) {
  const { modalDescription, handlePositiveClick, positiveButtonName, negativeButtonName, handleNegativeClick } = props;
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out" />
      <div ref={modalRef} className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="text-base text-gray-500">{modalDescription}</div>
        <div className="mt-4 flex justify-end space-x-2">
          {handleNegativeClick && (
            <Button variant="outline" onClick={handleNegativeClick} className="rounded">
              {negativeButtonName}
            </Button>
          )}
          {handlePositiveClick && (
            <Button variant="secondary" onClick={handlePositiveClick} className="rounded">
              {positiveButtonName}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
