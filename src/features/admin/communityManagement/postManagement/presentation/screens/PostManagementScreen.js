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
import { gridDataToImageUri } from '../../../../../../core/presentation/designsystem/utils/GridImage';
import { createPostManagementStyles, PURPLE } from '../styles/PostManagementStyles';

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

function getReportCount(item) {
  const count = Number(item?.reportCount);
  return Number.isFinite(count) ? count : 0;
}

function getActionWidth(action) {
  return action?.props?.count > 0 ? 50 : 32;
}

function Avatar({ imageUrl, size = 20, styles }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!imageUrl && !imageFailed;

  return showImage ? (
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
}

function CardActionMenu({ actions, menuId, activeMenuId, onToggleMenu, styles }) {
  const progress = React.useRef(new Animated.Value(0)).current;
  const visibleActions = actions.filter(Boolean);
  const open = activeMenuId === menuId;
  const verticalHeight = visibleActions.length * 38;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [open, progress]);

  return (
    <View style={styles.cardActionMenu}>
      <TouchableOpacity
        style={[styles.cardActionToggle, open && styles.cardActionToggleOpen]}
        onPress={() => onToggleMenu(open ? null : menuId)}
        activeOpacity={0.84}
        accessibilityRole="button"
        accessibilityLabel={open ? 'Cerrar acciones' : 'Abrir acciones'}
      >
        <Ionicons name={open ? 'close' : 'ellipsis-vertical'} size={18} color={open ? PURPLE : Colors.fixedWhite} />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.cardActionMenuItems,
          {
            height: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, verticalHeight],
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
    </View>
  );
}

function PublicationCard({ publication, tall, activeMenuId, onToggleMenu, onOpen, onClearReports, onDelete, onReport, styles }) {
  const imageUri = publication.imageUrl
    || (publication.patternGridData || publication.pattern?.gridData
      ? gridDataToImageUri(publication.patternGridData || publication.pattern?.gridData, { maxDimension: 300 })
      : null);
  const reportCount = getReportCount(publication);

  return (
    <TouchableOpacity style={styles.publicationCard} onPress={() => onOpen(publication)} activeOpacity={0.88}>
      <CardActionMenu
        menuId={`publication-${publication.id}`}
        activeMenuId={activeMenuId}
        onToggleMenu={onToggleMenu}
        styles={styles}
        actions={[
          {
            key: 'delete',
            props: {
              iconName: 'trash',
              label: 'Eliminar publicación',
              onPress: () => onDelete(publication),
            },
          },
          {
            key: 'sanction',
            props: {
              iconName: 'gavel',
              iconLibrary: 'material',
              label: 'Sancionar publicación',
              count: reportCount,
              onPress: () => onReport(publication),
            },
          },
          reportCount > 0 ? {
            key: 'clear',
            props: {
              iconName: 'checkmark',
              label: 'Eliminar reportes de la publicación',
              onPress: () => onClearReports(publication),
            },
          } : null,
        ]}
      />

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.publicationImage, tall && styles.publicationImageTall]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.publicationPlaceholder, tall && styles.publicationImageTall]}>
          <Ionicons name="image-outline" size={36} color={PURPLE} />
        </View>
      )}

      <View style={styles.publicationInfo}>
        {TECHNIQUES[publication.technique] ? (
          <View style={styles.techniqueBadge}>
            <Text style={styles.techniqueBadgeText}>{TECHNIQUES[publication.technique]}</Text>
          </View>
        ) : null}
        <Text style={styles.publicationDescription} numberOfLines={2}>{publication.description}</Text>
        <View style={styles.publicationAuthorRow}>
          <Avatar imageUrl={publication.user?.profileImageUrl} styles={styles} />
          <Text style={styles.publicationAuthor} numberOfLines={1}>@{publication.user?.username || 'usuario'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PostManagementScreen({
  publications,
  activeMenuId,
  refreshing,
  onRefresh,
  onToggleMenu,
  onOpen,
  onClearReports,
  onDelete,
  onReport,
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createPostManagementStyles(colors), [colors]);
  const columns = useMemo(() => ({
    left: publications.filter((_, index) => index % 2 === 0),
    right: publications.filter((_, index) => index % 2 !== 0),
  }), [publications]);

  if (publications.length === 0) {
    return (
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.emptyContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
      >
        <ScreenState iconName="images-outline" text="No hay publicaciones para revisar" />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.contentScroll}
      contentContainerStyle={styles.publicationsContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
    >
      <View style={styles.publicationColumns}>
        <View style={styles.publicationColumn}>
          {columns.left.map((publication, index) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              tall={index % 3 === 0}
              activeMenuId={activeMenuId}
              onToggleMenu={onToggleMenu}
              onOpen={onOpen}
              onClearReports={onClearReports}
              onDelete={onDelete}
              onReport={onReport}
              styles={styles}
            />
          ))}
        </View>
        <View style={styles.publicationColumn}>
          {columns.right.map((publication, index) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              tall={index % 3 === 1}
              activeMenuId={activeMenuId}
              onToggleMenu={onToggleMenu}
              onOpen={onOpen}
              onClearReports={onClearReports}
              onDelete={onDelete}
              onReport={onReport}
              styles={styles}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
