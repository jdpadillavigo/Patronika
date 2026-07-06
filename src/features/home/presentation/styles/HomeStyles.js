import { StyleSheet } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';

export const PURPLE = Colors.primary;

export const createHomeStyles = (colors = Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: PURPLE,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: Colors.fixedWhite,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  addBtn: {
    backgroundColor: Colors.whiteAlpha20,
    borderRadius: 20,
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 8,
    paddingBottom: 8,
  },
  columns: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.imageBackground,
    overflow: 'hidden',
  },
  cardImageTall: {
    height: 210,
  },
  cardPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageContent: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: 10,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
    marginBottom: 6,
  },
  cardAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  cardAvatarText: {
    color: Colors.fixedWhite,
    fontSize: 9,
    fontWeight: '700',
  },
  cardAuthor: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  techniqueBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 5,
  },
  techniqueBadgeText: {
    fontSize: 10,
    color: colors.communityTechniqueText,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.iconMuted,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textDisabled,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export const homeStyles = createHomeStyles(Colors.light);
