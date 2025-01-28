import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { SidebarCloseIcon } from 'lucide-react';

interface IModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  customContainerClassName?: string;
  childrenContainerClassName?: string;
  onClose: () => void;
  title?: string;
  showCloseIcon?: boolean;
}

const Modal: React.FC<IModalProps> = ({
  isOpen,
  children,
  customContainerClassName = '',
  childrenContainerClassName = '',
  onClose,
  title = '',
  showCloseIcon = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Disable scroll on body
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scroll on body when modal is closed
      document.body.style.overflow = '';
    }

    // Clean up: reset body scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay fixed inset-0 z-50 m-auto flex items-center justify-center bg-black-base bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        className={`mx-auto h-4/5 w-full overflow-auto bg-blue-17 p-2 md:w-11/12 md:p-3 ${customContainerClassName}`}
      >
        {showCloseIcon && (
          <div
            onClick={onClose}
            className="flex cursor-pointer items-center justify-between"
          >
            <p className="text-blue-base text-lg font-bold">{title}</p>
            <SidebarCloseIcon className={`h-4 w-4 text-gray-800`} />
          </div>
        )}

        <div
          className={`${showCloseIcon ? 'my-10' : 'my-0'} ${childrenContainerClassName} h-full`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default React.memo(Modal);
