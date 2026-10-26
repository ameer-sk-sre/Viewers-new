/** @type {AppTypes.Config} */
window.config = {
  name: 'config/docker-nginx-orthanc-api.js',
  routerBasename: null,
  showStudyList: false,
  extensions: [],
  modes: [],
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  experimentalStudyBrowserSort: false,
  strictZSpacingForVolumeViewport: true,
  investigationalUseDialog: {
    option: 'never',
  },
  studyPrefetcher: {
    enabled: true,
    displaySetsCount: 2,
    maxNumPrefetchRequests: 10,
    order: 'closest',
  },

  // Flag indicating unrestricted API access (no authentication required)
  unrestrictedAccess: true,

  whiteLabeling: {
    createLogoComponentFn: function (React) {
      return React.createElement(
        'span',
        {
          className: 'radiomind-viewer-logo text-white font-bold text-lg select-none',
        },
        'RadioMind PACS'
      );
    },
  },
  customizationUrlPrefixes: {
    default: './customizations/',
  },
  customizationService: {
    'studyBrowser.studyMode': 'primary',
    'studyBrowser.viewPresets': [
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
  defaultDataSourceName: 'orthancProxy',
  dataSources: [
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'orthancProxy',
      configuration: {
        friendlyName: 'RadioMind Orthanc Proxy',
        name: 'Orthanc',
        wadoUriRoot: '/wado',
        qidoRoot: '/pacs',
        wadoRoot: '/pacs',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        bulkDataURI: {
          enabled: false,
        },
        dicomUploadEnabled: false,
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
