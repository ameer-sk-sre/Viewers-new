/** @type {AppTypes.Config} */
window.config = {
  name: 'config/radiomind_orthanc.js',
  routerBasename: null,
  showStudyList: false,
  extensions: [],
  modes: [],
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  experimentalStudyBrowserSort: false,
  strictZSpacingForVolumeViewport: true,
  showPatientInfo: 'disabled',
  radiomindHideSettings: true,
  radiomindHideUndoRedo: true,
  radiomindDefaultStudyInstanceUIDs: '1.2.840.113564.0.224.76.104.18.160.20260723104212527.10380',
  investigationalUseDialog: {
    option: 'never',
  },
  studyPrefetcher: {
    enabled: true,
    displaySetsCount: 2,
    maxNumPrefetchRequests: 10,
    order: 'closest',
  },
  whiteLabeling: {
    createLogoComponentFn: function (React) {
      return React.createElement(
        'span',
        {
          className: 'radiomind-viewer-logo text-white',
        },
        'RadioMind PACS'
      );
    },
  },
  customizationUrlPrefixes: {
    default: './customizations/',
  },
  customizationService: {
    global: [
      {
        'studyBrowser.studyMode': {
          $set: 'primary',
        },
        'studyBrowser.viewPresets': {
          $set: [
            {
              id: 'list',
              iconName: 'ListView',
              selected: false,
            },
            {
              id: 'thumbnails',
              iconName: 'ThumbnailView',
              selected: true,
            },
          ],
        },
      },
    ],
    mode: {
      viewer: {
        toolbarSections: {
          $set: [
            {
              view: [
                'WindowLevel',
                'Pan',
                'Zoom',
                'StackScroll',
                'Probe',
                'Magnify',
              ],
            },
            {
              measure: [
                'MeasurementTools',
                'Length',
                'Bidirectional',
                'Angle',
                'EllipticalROI',
                'RectangleROI',
                'CircleROI',
              ],
            },
            {
              annotate: [
                'ArrowAnnotate',
                'PlanarFreehandROI',
                'SplineROI',
                'LivewireContour',
              ],
            },
            {
              layout: ['Layout', 'Crosshairs', 'ReferenceLines', 'ImageSliceSync'],
            },
            {
              other: [
                'Cine',
                'Capture',
                'invert',
                'rotate-right',
                'flipHorizontal',
                'TagBrowser',
                'Reset',
                'MoreTools',
              ],
            },
            {
              MoreTools: [
                'CobbAngle',
                'ReferenceLines',
                'ImageOverlayViewer',
                'CalibrationLine',
                'AdvancedMagnify',
                'WindowLevelRegion',
              ],
            },
          ],
        },
      },
    },
  },
  defaultDataSourceName: 'orthancProxy',
  dataSources: [
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'orthancProxy',
      configuration: {
        friendlyName: 'RadioMind Orthanc Proxy',
        name: 'Orthanc',
        wadoUriRoot: '/pacs',
        qidoRoot: '/pacs',
        wadoRoot: '/pacs',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        bulkDataURI: {
          enabled: false,
        },
        dicomUploadEnabled: true,
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: true,
        supportsWildcard: true,
        omitQuotationForMultipartRequest: true,
        withCredentials: false,
      },
    },
  ],
  httpErrorHandler: error => {
    console.warn(`HTTP Error Handler (status: ${error.status})`, error);
  },
};
