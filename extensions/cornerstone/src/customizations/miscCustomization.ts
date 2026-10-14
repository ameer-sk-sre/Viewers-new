import CinePlayerWithSkip from '../components/CinePlayer/CinePlayerWithSkip';
import DicomUpload from '../components/DicomUpload/DicomUpload';

// Provide a wider default container for the DICOM Upload modal, without
// affecting other dialogs. We attach a static property that WorkList reads.
const DicomUploadWithSize = Object.assign(DicomUpload, {
  containerClassName: 'max-w-3xl',
});

export default {
  cinePlayer: CinePlayerWithSkip,
  autoCineModalities: ['OT', 'US'],
  'panelMeasurement.disableEditing': false,
  onBeforeSRAddMeasurement: ({ measurement, StudyInstanceUID, SeriesInstanceUID }) => {
    return measurement;
  },
  onBeforeDicomStore: ({ dicomDict, measurementData, naturalizedReport }) => {
    return dicomDict;
  },
  dicomUploadComponent: DicomUploadWithSize,
  codingValues: {},
};
