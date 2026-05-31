import { StyleSheet, Platform } from 'react-native';

// ─── Colores globales ────────────────────────────────────────────────────────
export const PURPLE = '#7B3F7E';
export const DARK_BG = '#1A0B08';
export const DARK_BANNER = '#1C1C1E';

// Gradientes para pantallas de autenticación
export const AUTH_GRADIENTS = [
  ['#3D1547', '#1A0B08', '#2C0D3A'],
  ['#1C0B2E', '#4A1259', '#0D0518'],
  ['#2C1654', '#1A0B08', '#3D1050'],
];

// Equivalente a StyleSheet.absoluteFill (para Login y Registro)
export const absoluteFill = StyleSheet.absoluteFill;

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  titleGroup: {
    gap: 8,
    marginBottom: 48,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  form: {
    flex: 1,
    gap: 28,
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.35)',
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 4,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(123,63,126,0.45)',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkCenter: {
    alignItems: 'center',
  },
  linkText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  bottomText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  bottomLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// ─── Registro ────────────────────────────────────────────────────────────────
export const registroStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 40,
  },
  titleGroup: {
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DARK_BG,
  },
  form: {
    gap: 22,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.35)',
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  checkLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  checkLabelLink: {
    textDecorationLine: 'underline',
    color: 'white',
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(123,63,126,0.45)',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 28,
  },
  bottomText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  bottomLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// ─── Generar Patrón ──────────────────────────────────────────────────────────
export const generarPatronStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 30,
    paddingBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitleContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  subtitle: {
    color: '#555',
    fontSize: 14,
  },
  banner: {
    backgroundColor: DARK_BANNER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  bannerText: {
    color: 'white',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: PURPLE,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: PURPLE,
    borderRadius: 8,
    padding: 8,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: {
    color: PURPLE,
    fontSize: 14,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4a2750',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
    lineHeight: 30,
  },
});

// ─── Formulario de Patrón ────────────────────────────────────────────────────
export const formularioStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 30,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PURPLE,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#f5eef6',
  },
  stepperSymbol: {
    fontSize: 22,
    color: PURPLE,
    fontWeight: 'bold',
  },
  stepperDisabled: {
    color: '#ccc',
  },
  stepperInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    paddingVertical: 14,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b89aba',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
  },
  infoTextGroup: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
  },
  infoDesc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  modalBtn: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 4,
  },
  modalBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

// ─── Vista Previa ────────────────────────────────────────────────────────────
export const vistaPreviaStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 30,
    paddingBottom: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 40,
  },
  patternContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: PURPLE,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  patternPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  placeholderText: {
    color: PURPLE,
    fontSize: 14,
  },
  buttons: {
    width: '100%',
    gap: 14,
  },
  buttonSolid: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonSolidText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// ─── Mis Patrones ────────────────────────────────────────────────────────────
export const misPatronesStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 30,
    paddingBottom: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
  },
  tabTextActivo: {
    color: PURPLE,
    fontWeight: 'bold',
  },
  tabIndicador: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 2.5,
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  contenido: {
    flex: 1,
    backgroundColor: 'white',
  },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacioText: {
    fontSize: 15,
    color: '#999',
  },
  listaPatrones: {
    padding: 16,
    gap: 16,
  },
  cardPatron: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardImagen: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3EDF4',
  },
  cardInfo: {
    backgroundColor: PURPLE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  cardNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cardCreador: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardValoracion: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  cardDificultad: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingBottom: Platform.OS === 'ios' ? 18 : 25,
    paddingTop: 8,
    paddingHorizontal: 8,
    position: 'relative',
  },
  navLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navCenter: {
    width: 72,
  },
  navRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#AAA',
  },
  navLabelActivo: {
    color: PURPLE,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -31,
    bottom: Platform.OS === 'ios' ? 22 : 10,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
