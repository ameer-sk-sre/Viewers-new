import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

function hasRenderableContent(node: React.ReactNode): boolean {
  if (node === null || node === undefined || node === false || node === true) {
    return false;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).trim().length > 0;
  }
  if (Array.isArray(node)) {
    return node.some(hasRenderableContent);
  }
  if (React.isValidElement(node)) {
    const { type, props } = node as { type: any; props: any };
    if (
      typeof type === 'string' &&
      ['div', 'span', 'p', 'section', 'header', 'footer', 'article', 'main'].includes(type)
    ) {
      if (!props || !('children' in props) || props.children === undefined || props.children === null) {
        return false;
      }
      return hasRenderableContent(props.children);
    }
    if (type === React.Fragment) {
      return props && 'children' in props ? hasRenderableContent(props.children) : false;
    }
    return true;
  }
  return true;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => {
  if (!hasRenderableContent(children)) {
    return null;
  }

  return (
    <TooltipPortal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'bg-primary-dark border-secondary-light text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded border px-2 py-1.5 text-sm',
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPortal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
