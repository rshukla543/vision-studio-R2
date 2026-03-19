import { useEffect } from 'react';

export function useImageProtection() {
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
        return false;
      }
    };

    const preventDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventContextMenu, true);
    document.addEventListener('dragstart', preventDragStart, true);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu, true);
      document.removeEventListener('dragstart', preventDragStart, true);
    };
  }, []);
}
