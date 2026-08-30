import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Header, Icons, useModal } from '@ohif/ui-next';
import { useSystem, Types, utils, useToolbar } from '@ohif/core';
import { Toolbar } from '../Toolbar/Toolbar';
import HeaderPatientInfo from './HeaderPatientInfo';
import { PatientInfoVisibility } from './HeaderPatientInfo/HeaderPatientInfo';
import { preserveQueryParameters } from '@ohif/app';
import usePatientInfo from '../hooks/usePatientInfo';

const { formatDate } = utils;

function useViewerHeaderMeta() {
  const { servicesManager } = useSystem();
  const { displaySetService } = servicesManager.services;
  const { patientInfo } = usePatientInfo();
  const [studyInfo, setStudyInfo] = useState({
    accessionNumber: '',
    studyDate: '',
    studyDescription: '',
    institutionName: '',
    modalities: '',
  });

  useEffect(() => {
    const syncStudyInfo = () => {
      const displaySets = displaySetService.getActiveDisplaySets();
      const displaySet = displaySets?.[0];
      const instance = displaySet?.instances?.[0] || displaySet?.instance;

      if (!instance) {
        return;
      }

      setStudyInfo({
        accessionNumber: instance.AccessionNumber || '',
        studyDate: formatDate(instance.StudyDate) || '',
        studyDescription: instance.StudyDescription || displaySet?.description || '',
        institutionName: instance.InstitutionName || '',
        modalities: instance.Modality || '',
      });
    };

    syncStudyInfo();

    const subscription = displaySetService.subscribe(
      displaySetService.EVENTS.DISPLAY_SETS_ADDED,
      syncStudyInfo
    );

    return () => subscription.unsubscribe();
  }, [displaySetService]);

  return { patientInfo, studyInfo };
}

function HeaderMetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="radiomind-header-meta-item">
      <span className="radiomind-header-meta-label">{label}</span>
      <span className="radiomind-header-meta-value">{value}</span>
    </div>
  );
}

function ToolbarCluster({
  section,
}: {
  section: string;
}) {
  const { toolbarButtons } = useToolbar({ buttonSection: section });

  if (!toolbarButtons || toolbarButtons.length === 0) {
    return null;
  }

  return (
    <div className="radiomind-toolbar-cluster">
      <div className="radiomind-toolbar-cluster-body">
        <Toolbar buttonSection={section} />
      </div>
    </div>
  );
}

function ViewerHeader({ appConfig }: withAppTypes<{ appConfig: AppTypes.Config }>) {
  const { servicesManager, extensionManager, commandsManager } = useSystem();
  const { customizationService } = servicesManager.services;
  const { patientInfo, studyInfo } = useViewerHeaderMeta();
  const [isMetaCollapsed, setIsMetaCollapsed] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const onClickReturnButton = () => {
    const { pathname } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);

    const dataSourceName = pathname.substring(dataSourceIdx + 1);
    const existingDataSource = extensionManager.getDataSources(dataSourceName);

    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1 && existingDataSource) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }
    preserveQueryParameters(searchQuery);

    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString()),
    });
  };

  const { t } = useTranslation();
  const { show } = useModal();

  const AboutModal = customizationService.getCustomization(
    'ohif.aboutModal'
  ) as Types.MenuComponentCustomization;

  const AppearanceModal = customizationService.getCustomization(
    'ohif.appearanceModal'
  ) as Types.MenuComponentCustomization;

  const UserPreferencesModal = customizationService.getCustomization(
    'ohif.userPreferencesModal'
  ) as Types.MenuComponentCustomization;

  const menuOptions = [
    {
      title: AboutModal?.menuTitle ?? t('Header:About'),
      icon: 'info',
      onClick: () =>
        show({
          content: AboutModal,
          title: AboutModal?.title ?? 'About RadioMind Viewer',
          containerClassName: AboutModal?.containerClassName ?? 'max-w-md',
        }),
    },
    {
      title: UserPreferencesModal.menuTitle ?? t('Header:Preferences'),
      icon: 'settings',
      onClick: () =>
        show({
          content: UserPreferencesModal,
          title: UserPreferencesModal.title ?? t('UserPreferencesModal:User preferences'),
          containerClassName:
            UserPreferencesModal?.containerClassName ?? 'flex max-w-4xl p-6 flex-col',
        }),
    },
  ];

  if (AppearanceModal) {
    menuOptions.splice(1, 0, {
      title: AppearanceModal.menuTitle ?? t('Header:Appearance'),
      icon: 'ColorChange',
      onClick: () =>
        show({
          content: AppearanceModal,
          title: AppearanceModal.title ?? t('AppearanceModal:Appearance'),
          containerClassName: AppearanceModal.containerClassName ?? 'max-w-md',
        }),
    });
  }

  if (appConfig.oidc) {
    menuOptions.push({
      title: t('Header:Logout'),
      icon: 'power-off',
      onClick: async () => {
        navigate(`/logout?redirect_uri=${encodeURIComponent(window.location.href)}`);
      },
    });
  }

  return (
    <Header
      CustomContent={
        <div className="radiomind-clinical-header">
          <div
            className={`radiomind-header-topband ${isMetaCollapsed ? 'is-collapsed' : ''}`}
          >
            <div
              className="radiomind-header-topband-brand flex items-center gap-2"
              data-cy="return-to-work-list"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-muted/20 mr-1 h-8 w-8 cursor-pointer p-0"
                onClick={onClickReturnButton}
                title={t('Header:Back to study list') || 'Back to study list'}
                aria-label={t('Header:Back to study list') || 'Back to study list'}
              >
                <Icons.ArrowLeft className="h-6 w-6" />
              </Button>
              <div
                className="cursor-pointer"
                onClick={onClickReturnButton}
              >
                {appConfig.whiteLabeling?.createLogoComponentFn?.(React, {}) || (
                  <span className="radiomind-viewer-logo text-lg font-bold text-white select-none">
                    RadioMind PACS
                  </span>
                )}
              </div>
            </div>
            <div className="radiomind-header-meta-panel">
              <div className="radiomind-header-summary-strip">
                <span className="radiomind-header-summary-pill">
                  {patientInfo.PatientName || 'Patient'}
                </span>
                {studyInfo.studyDescription || studyInfo.modalities ? (
                  <span className="radiomind-header-summary-pill">
                    {studyInfo.studyDescription || studyInfo.modalities}
                  </span>
                ) : null}
                {studyInfo.studyDate ? (
                  <span className="radiomind-header-summary-pill">{studyInfo.studyDate}</span>
                ) : null}
              </div>
              <div className="radiomind-header-meta-grid">
                <HeaderMetaItem
                  label="Patient ID"
                  value={patientInfo.PatientID || ''}
                />
                <HeaderMetaItem
                  label="Patient Name"
                  value={patientInfo.PatientName || ''}
                />
                <HeaderMetaItem
                  label="DOB"
                  value={patientInfo.PatientDOB || ''}
                />
                <HeaderMetaItem
                  label="Sex"
                  value={patientInfo.PatientSex || ''}
                />
                <HeaderMetaItem
                  label="Accession #"
                  value={studyInfo.accessionNumber}
                />
                <HeaderMetaItem
                  label="Study Date"
                  value={studyInfo.studyDate}
                />
                <HeaderMetaItem
                  label="Study"
                  value={studyInfo.studyDescription || studyInfo.modalities}
                />
              </div>
            </div>
            <div className="radiomind-header-topband-actions">
              {studyInfo.institutionName ? (
                <div className="radiomind-header-status-pill">{studyInfo.institutionName}</div>
              ) : (
                <div className="radiomind-header-status-pill">Diagnostic Workspace</div>
              )}
              <button
                type="button"
                className="radiomind-header-collapse-btn"
                onClick={() => setIsMetaCollapsed(value => !value)}
                title={isMetaCollapsed ? 'Expand patient details' : 'Collapse patient details'}
                aria-label={isMetaCollapsed ? 'Expand patient details' : 'Collapse patient details'}
              >
                <Icons.ArrowLeft className={isMetaCollapsed ? '-rotate-90' : 'rotate-90'} />
              </button>
            </div>
          </div>
          <div className="radiomind-toolbar-band-shell">
            <div className="radiomind-toolbar-band">
              <div className="radiomind-toolbar-band-full">
                <ToolbarCluster section="primary" />
                <ToolbarCluster section="secondary" />
                <ToolbarCluster section="view" />
                <ToolbarCluster section="measure" />
                <ToolbarCluster section="annotate" />
                <ToolbarCluster section="layout" />
                <ToolbarCluster section="other" />
              </div>
            </div>
          </div>
        </div>
      }
      menuOptions={appConfig.radiomindHideSettings ? [] : menuOptions}
      isReturnEnabled={!!appConfig.showStudyList}
      onClickReturnButton={onClickReturnButton}
      WhiteLabeling={appConfig.whiteLabeling}
      PatientInfo={
        appConfig.showPatientInfo !== PatientInfoVisibility.DISABLED && (
          <HeaderPatientInfo
            servicesManager={servicesManager}
            appConfig={appConfig}
          />
        )
      }
      UndoRedo={
        appConfig.radiomindHideUndoRedo ? null : (
          <div className="text-primary flex cursor-pointer items-center">
            <Button
              variant="ghost"
              className="hover:bg-muted"
              data-cy="undo-btn"
              onClick={() => {
                commandsManager.run('undo');
              }}
            >
              <Icons.Undo className="" />
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-muted"
              data-cy="redo-btn"
              onClick={() => {
                commandsManager.run('redo');
              }}
            >
              <Icons.Redo className="" />
            </Button>
          </div>
        )
      }
    />
  );
}

export default ViewerHeader;
