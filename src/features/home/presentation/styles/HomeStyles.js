import { StyleSheet } from 'react-native';

export const PURPLE = '#763A6C';

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  addBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 8,
    paddingBottom: 90,
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
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#EEE',
  },
  cardImageTall: {
    height: 210,
  },
  cardPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#F0E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    padding: 10,
  },
  cardDesc: {
    fontSize: 12,
    color: '#333',
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
    color: 'white',
    fontSize: 9,
    fontWeight: '700',
  },
  cardAuthor: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  techniqueBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0E8EF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 5,
  },
  techniqueBadgeText: {
    fontSize: 10,
    color: PURPLE,
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
    color: '#AAA',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BBB',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
