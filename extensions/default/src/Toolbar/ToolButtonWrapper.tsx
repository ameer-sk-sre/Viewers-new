import React from 'react';
import { useIconPresentation, Icons, Button } from '@ohif/ui-next';

export function ToolButtonWrapper(props) {
  const { IconContainer, containerProps } = useIconPresentation();

  const Icon = <Icons.ByName name={props.icon} />;

  if (IconContainer) {
    return (
      <IconContainer
        disabled={props.disabled}
        {...props}
        {...containerProps}
      >
        {Icon}
      </IconContainer>
    );
  }

  return (
    <Button variant="ghost" size="icon" disabled={props.disabled}>
      {Icon}
    </Button>
  );
}
