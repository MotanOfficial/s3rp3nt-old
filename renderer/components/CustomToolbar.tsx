import React, { useEffect } from 'react';
import { FaWindowMinimize, FaTimes } from 'react-icons/fa'; // Import the icons

const CustomToolbar = () => {
  useEffect(() => {
    const { ipcRenderer } = window.electron;

    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');

    minimizeBtn?.addEventListener('click', () => {
      ipcRenderer.send('minimize-window');
    });

    closeBtn?.addEventListener('click', () => {
      ipcRenderer.send('close-window');
    });
  }, []);

  return (
    <div className="custom-toolbar flex justify-end items-center bg-[var(--color-background)] h-10 fixed top-0 left-0 right-0 border-b border-gray-700 z-50 select-none pr-4">
      <button id="minimize-btn" className="text-[var(--color-text)] mx-2 focus:outline-none">
        <FaWindowMinimize className="icon-hover" />
      </button>
      <button id="close-btn" className="text-[var(--color-text)] mx-2 focus:outline-none">
        <FaTimes className="icon-hover" />
      </button>
    </div>
  );
};

export default CustomToolbar;
