import React, { ReactNode } from 'react';
import classNames from 'classnames';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Icons,
  Button,
  ToolButton,
} from '../';
import { IconPresentationProvider } from '@ohif/ui-next';

import NavBar from '../NavBar';

// Todo: we should move this component to composition and remove props base

interface HeaderProps {
  children?: ReactNode;
  menuOptions: Array<{
    title: string;
    icon?: string;
    onClick: () => void;
  }>;
  isReturnEnabled?: boolean;
  onClickReturnButton?: () => void;
  isSticky?: boolean;
  WhiteLabeling?: {
    createLogoComponentFn?: (React: any, props: any) => ReactNode;
  };
  PatientInfo?: ReactNode;
  Secondary?: ReactNode;
  UndoRedo?: ReactNode;
}

function Header({
  children,
  menuOptions,
  isReturnEnabled = true,
  onClickReturnButton,
  isSticky = false,
  WhiteLabeling,
  PatientInfo,
  UndoRedo,
  Secondary,
  ...props
}: HeaderProps): ReactNode {
  const onClickReturn = () => {
    if (isReturnEnabled && onClickReturnButton) {
      onClickReturnButton();
    }
  };

  const logoComponent = WhiteLabeling?.createLogoComponentFn?.(React, props);

  return (
    <IconPresentationProvider
      size="large"
      IconContainer={ToolButton}
    >
      <NavBar
        isSticky={isSticky}
        {...props}
      >
        <div className="relative w-full px-3 py-2">
          <div className="absolute right-0 mb-2 flex w-full items-center justify-between gap-4">
            <div
              className={classNames(
                'flex items-center gap-2',
                isReturnEnabled && 'cursor-pointer'
              )}
              onClick={onClickReturn}
              data-cy="return-to-work-list"
            >
              {isReturnEnabled && <Icons.ArrowLeft className="text-primary h-7 w-7" />}
              <div className="flex items-center gap-2 text-base font-semibold tracking-wide text-white">
                {logoComponent ? (
                  <>{logoComponent}</>
                ) : (
                  <span>PACS</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">{Secondary}</div>

            <div className="flex items-center gap-2">
              {UndoRedo}
              <div className="border-primary-dark h-[25px] border-r" />
              {PatientInfo}
              <div className="border-primary-dark h-[25px] border-r" />
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:bg-primary-dark h-full w-full"
                    >
                      <Icons.GearSettings />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {menuOptions.map((option, index) => {
                      const IconComponent = option.icon
                        ? Icons[option.icon as keyof typeof Icons]
                        : null;
                      return (
                        <DropdownMenuItem
                          key={index}
                          onSelect={option.onClick}
                          className="flex items-center gap-2 py-2"
                        >
                          {IconComponent && (
                            <span className="flex h-4 w-4 items-center justify-center">
                              <Icons.ByName name={option.icon} />
                            </span>
                          )}
                          <span className="flex-1">{option.title}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[min(920px,calc(100vw-280px))] flex-wrap items-center justify-center gap-1 px-3">
            {children}
          </div>
        </div>
      </NavBar>
    </IconPresentationProvider>
  );
}

export default Header;
