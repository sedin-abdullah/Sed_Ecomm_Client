import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

/** Renders children into a dedicated DOM node appended to <body>, for overlays. */
export function Portal({ children, containerId = 'portal-root' }: PortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let node = document.getElementById(containerId);
    let created = false;
    if (!node) {
      node = document.createElement('div');
      node.id = containerId;
      document.body.appendChild(node);
      created = true;
    }
    setContainer(node);

    return () => {
      if (created && node?.childElementCount === 0) {
        node.remove();
      }
    };
  }, [containerId]);

  if (!container) return null;
  return createPortal(children, container);
}
