import React, { useMemo, useState } from 'react';
import {
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../../../../../core/presentation/designsystem/Colors';
import { useAppTheme } from '../../../../../../core/presentation/designsystem/Theme';
import AdminCircleIconButton from '../../../../../../core/presentation/designsystem/components/AdminCircleIconButton';
import ScreenState from '../../../../../../core/presentation/designsystem/components/ScreenState';
import { REFRESH_TOP_BAR_OFFSET } from '../../../../../../core/presentation/designsystem/components/CommonStyles';
import { createCommentManagementStyles, PURPLE } from '../styles/CommentManagementStyles';

function getReportCount(item) {
  const count = Number(item?.reportCount);
  return Number.isFinite(count) ? count : 0;
}

function formatRelativeDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86400000));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Hace 1 día';
  return `Hace ${diffDays} días`;
}

function getActionWidth(action) {
  return action?.props?.count > 0 ? 50 : 32;
}

function Avatar({ imageUrl, size = 58, onPress, styles }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!imageUrl && !imageFailed;
  const content = showImage ? (
    <Image
      source={{ uri: imageUrl }}
      style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
      onError={() => setImageFailed(true)}
    />
  ) : (
    <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="person" size={size * 0.48} color={PURPLE} />
    </View>
  );

  if (!onPress) return content;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.78}>
      {content}
    </TouchableOpacity>
  );
}

function CardActionMenu({ actions, menuId, activeMenuId, onToggleMenu, styles }) {
  const progress = React.useRef(new Animated.Value(0)).current;
  const visibleActions = actions.filter(Boolean);
  const open = activeMenuId === menuId;
  const horizontalWidth = visibleActions.reduce((total, action, index) => (
    total + getActionWidth(action) + (index > 0 ? 6 : 0)
  ), 0);

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [open, progress]);

  return (
    <View style={styles.cardActionMenu}>
      <Animated.View
        style={[
          styles.cardActionMenuItems,
          {
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, horizontalWidth],
            }),
            opacity: progress,
          },
        ]}
        pointerEvents={open ? 'auto' : 'none'}
      >
        {visibleActions.map(action => (
          <View key={action.key} style={[styles.cardActionMenuItem, { width: getActionWidth(action) }]}>
            <AdminCircleIconButton {...action.props} />
          </View>
        ))}
      </Animated.View>
      <TouchableOpacity
        style={[styles.cardActionToggle, open && styles.cardActionToggleOpen]}
        onPress={() => onToggleMenu(open ? null : menuId)}
        activeOpacity={0.84}
        accessibilityRole="button"
        accessibilityLabel={open ? 'Cerrar acciones' : 'Abrir acciones'}
      >
        <Ionicons name={open ? 'close' : 'ellipsis-vertical'} size={18} color={open ? PURPLE : Colors.fixedWhite} />
      </TouchableOpacity>
    </View>
  );
}

function CommentCard({ item, activeMenuId, onToggleMenu, onClearReports, onDelete, onSanction, onOpenPublication, onOpenUser, styles }) {
  const username = item.user?.username || 'Usuario';
  const reportCount = getReportCount(item);

  return (
    <View style={styles.commentCard}>
      <View style={styles.commentAvatarBlock}>
        <Avatar
          imageUrl={item.user?.profileImageUrl || item.user?.avatar}
          onPress={() => item.user && onOpenUser(item.user)}
          styles={styles}
        />
        <Text style={styles.commentUserName} numberOfLines={1}>{username}</Text>
      </View>

      <View style={styles.commentBody}>
        <View style={styles.commentMetaRow}>
          <Text style={styles.commentMeta} numberOfLines={1}>{formatRelativeDate(item.createdAt)}</Text>
          <Text style={styles.commentMetaSeparator}>|</Text>
          <TouchableOpacity onPress={() => onOpenPublication(item)} activeOpacity={0.75}>
            <Text style={styles.commentPublicationLink}>Ir a la publicación</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.commentText} numberOfLines={2}>
          Comentario: {item.content}
        </Text>
      </View>

      <CardActionMenu
        menuId={`comment-${item.id}`}
        activeMenuId={activeMenuId}
        onToggleMenu={onToggleMenu}
        styles={styles}
        actions={[
          reportCount > 0 ? {
            key: 'clear',
            props: {
              iconName: 'checkmark',
              label: 'Eliminar reportes del comentario',
              onPress: () => onClearReports(item),
            },
          } : null,
          {
            key: 'sanction',
            props: {
              iconName: 'gavel',
              iconLibrary: 'material',
              label: 'Sancionar usuario y eliminar comentario',
              count: reportCount,
              onPress: () => onSanction(item),
            },
          },
          {
            key: 'delete',
            props: {
              iconName: 'trash',
              label: 'Eliminar comentario',
              onPress: () => onDelete(item),
            },
          },
        ]}
      />
    </View>
  );
}

export default function CommentManagementScreen({
  comments,
  activeMenuId,
  actionLoadingId,
  refreshing,
  onRefresh,
  onToggleMenu,
  onClearReports,
  onDelete,
  onSanction,
  onOpenPublication,
  onOpenUser,
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createCommentManagementStyles(colors), [colors]);

  if (comments.length === 0) {
    return (
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.emptyContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
      >
        <ScreenState iconName="chatbubble-ellipses-outline" text="No hay comentarios para revisar" />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.contentScroll}
      contentContainerStyle={styles.commentsContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
    >
      {comments.map(comment => (
        <View key={comment.id} style={actionLoadingId === comment.id && styles.disabledItem}>
          <CommentCard
            item={comment}
            activeMenuId={activeMenuId}
            onToggleMenu={onToggleMenu}
            onClearReports={onClearReports}
            onDelete={onDelete}
            onSanction={onSanction}
            onOpenPublication={onOpenPublication}
            onOpenUser={onOpenUser}
            styles={styles}
          />
        </View>
      ))}
    </ScrollView>
  );
}
