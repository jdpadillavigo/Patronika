import { StyleSheet } from 'react-native';
import Colors from '../../../../../../core/presentation/designsystem/Colors';
import { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export const createCommentManagementStyles = (colors = Colors.light) => StyleSheet.create({
  contentScroll: {
    flex: 1,
  },
  commentsContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 10,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  commentCard: {
    minHeight: 98,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 4,
  },
  commentAvatarBlock: {
    width: 86,
    alignItems: 'center',
    gap: 5,
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
  commentUserName: {
    color: colors.textStrong,
    fontSize: 12,
    fontWeight: '800',
    maxWidth: 82,
  },
  commentBody: {
    flex: 1,
    paddingRight: 0,
  },
  commentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  commentMeta: {
    color: colors.textSubtle,
    fontSize: 12,
  },
  commentMetaSeparator: {
    color: Colors.gray475,
    fontSize: 12,
  },
  commentPublicationLink: {
    color: PURPLE,
    fontSize: 12,
    fontWeight: '800',
  },
  commentText: {
    color: colors.textSubtle,
    fontSize: 12,
    lineHeight: 16,
  },
  cardActionMenu: {
    position: 'absolute',
    top: 9,
    right: 9,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 8,
  },
  cardActionMenuItems: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginRight: 6,
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
  disabledItem: {
    opacity: 0.55,
  },
});

export const commentManagementStyles = createCommentManagementStyles(Colors.light);
