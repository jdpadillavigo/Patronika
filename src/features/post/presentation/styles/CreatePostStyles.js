import { StyleSheet, Platform } from 'react-native';

export const PURPLE = '#763A6C';

export const crearStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#222',
    paddingHorizontal: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  patternList: {
    gap: 10,
  },
  patternCard: {
    width: 110,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#F5F5F5',
  },
  patternCardSelected: {
    borderColor: PURPLE,
  },
  patternThumb: {
    width: 110,
    height: 90,
    backgroundColor: '#EEE',
  },
  patternThumbPlaceholder: {
    width: 110,
    height: 90,
    backgroundColor: '#F0E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternCardName: {
    fontSize: 11,
    color: '#555',
    padding: 6,
    fontWeight: '500',
  },
  patternCardNameSelected: {
    color: PURPLE,
    fontWeight: '700',
  },
  noPatterns: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    height: 90,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  techniqueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techniquePill: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'white',
  },
  techniquePillSelected: {
    borderColor: PURPLE,
    backgroundColor: '#F0E8EF',
  },
  techniquePillText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  techniquePillTextSelected: {
    color: PURPLE,
    fontWeight: '700',
  },
  otrosInput: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
    marginTop: 8,
  },
  imagePickerBtn: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 12,
    borderStyle: 'dashed',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
  },
  imagePickerText: {
    fontSize: 13,
    color: '#888',
  },
  selectedImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    padding: 4,
  },
  submitBtn: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#CCC',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  savedPatternNote: {
    fontSize: 12,
    color: '#E53935',
    marginBottom: 8,
    marginTop: 2,
  },
  savedLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  savedLabelText: {
    fontSize: 10,
    color: PURPLE,
    fontWeight: '600',
  },
});
