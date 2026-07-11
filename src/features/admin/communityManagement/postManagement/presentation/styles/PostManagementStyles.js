import { StyleSheet } from 'react-native';
import Colors from '../../../../../../core/presentation/designsystem/Colors';
import { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export const createPostManagementStyles = (colors = Colors.light) => StyleSheet.create({
  contentScroll: {
    flex: 1,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  publicationsContent: {
    padding: 14,
    paddingBottom: 10,
  },
  publicationColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  publicationColumn: {
    flex: 1,
    gap: 10,
  },
  publicationCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  publicationImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.imageBackground,
  },
  publicationImageTall: {
    height: 210,
  },
  publicationPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publicationInfo: {
    padding: 10,
  },
  publicationDescription: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  publicationAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  publicationAuthor: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  avatarImage: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    backgroundColor: colors.imageBackground,
  },
  avatarFallback: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    backgroundColor: colors.modalHandle,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.communityTechniqueText,
    fontSize: 10,
    fontWeight: '700',
  },
  cardActionMenu: {
    position: 'absolute',
    top: 9,
    right: 9,
    flexDirection: 'column',
    alignItems: 'flex-end',
    zIndex: 8,
  },
  cardActionMenuItems: {
    gap: 6,
    alignItems: 'flex-end',
    overflow: 'hidden',
    marginTop: 6,
  },
  cardActionMenuItem: {
    width: 32,
    alignItems: 'center',
  },
  cardActionToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PURPLE,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardActionToggleOpen: {
    backgroundColor: colors.surface,
  },
});

export const postManagementStyles = createPostManagementStyles(Colors.light);
