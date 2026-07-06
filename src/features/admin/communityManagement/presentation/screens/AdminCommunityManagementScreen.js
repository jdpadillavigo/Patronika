import React, { useCallback, useMemo, useState } from 'react';
import { useAppTheme } from '../../../../../core/presentation/designsystem/Theme';
import Colors from '../../../../../core/presentation/designsystem/Colors';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { AdminBottomNavigationItem } from '../../../../../core/domain/BottomNavigationItem';
import AdminCircleIconButton from '../../../../../core/presentation/designsystem/components/AdminCircleIconButton';
import AdminBottomBar from '../../../../../core/presentation/designsystem/components/AdminBottomBar';
import AppTopBar from '../../../../../core/presentation/designsystem/components/AppTopBar';
import ConfirmationModal from '../../../../../core/presentation/designsystem/components/ConfirmationModal';
import ScreenState from '../../../../../core/presentation/designsystem/components/ScreenState';
import UserPreviewModal from '../../../../../core/presentation/designsystem/components/UserPreviewModal';
import { gridDataToImageUri } from '../../../../../core/presentation/designsystem/utils/GridImage';
import AdminCommunityUseCase from '../../domain/usecases/AdminCommunityUseCase';
import { createAdminCommunityManagementStyles, adminCommunityManagementStyles as styles, PURPLE } from '../styles/AdminCommunityManagementStyles';
import { REFRESH_TOP_BAR_OFFSET } from '../../../../../core/presentation/designsystem/components/CommonStyles';
let themedStyles = styles;

const TABS = {
  COMMENTS: 'comments',
  PUBLICATIONS: 'publications',
};

function getReportCount(item) {
  const count = Number(item?.reportCount);
  return Number.isFinite(count) ? count : 0;
}

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

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

function Avatar({ imageUrl, size = 58, onPress }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!imageUrl && !imageFailed;
  const content = showImage ? (
    <Image
      source={{ uri: imageUrl }}
      style={[themedStyles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
      onError={() => setImageFailed(true)}
    />
  ) : (
    <View style={[themedStyles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
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

function getActionWidth(action) {
  return action?.props?.count > 0 ? 50 : 32;
}

function CardActionMenu({ actions, direction = 'left' }) {
  const [open, setOpen] = useState(false);
  const progress = React.useRef(new Animated.Value(0)).current;
  const visibleActions = actions.filter(Boolean);
  const isDown = direction === 'down';
  const actionsLength = visibleActions.length;
  const horizontalWidth = visibleActions.reduce((total, action, index) => (
    total + getActionWidth(action) + (index > 0 ? 6 : 0)
  ), 0);
  const verticalHeight = actionsLength * 38;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [open, progress]);

  return (
    <View style={[themedStyles.cardActionMenu, isDown && themedStyles.cardActionMenuDown]}>
      {!isDown ? (
        <Animated.View
          style={[
            themedStyles.cardActionMenuItems,
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
            <View key={action.key} style={[themedStyles.cardActionMenuItem, { width: getActionWidth(action) }]}>
              <AdminCircleIconButton {...action.props} />
            </View>
          ))}
        </Animated.View>
      ) : null}
      <TouchableOpacity
        style={[themedStyles.cardActionToggle, open && themedStyles.cardActionToggleOpen]}
        onPress={() => setOpen(value => !value)}
        activeOpacity={0.84}
        accessibilityRole="button"
        accessibilityLabel={open ? 'Cerrar acciones' : 'Abrir acciones'}
      >
        <Ionicons name={open ? 'close' : 'ellipsis-vertical'} size={18} color={open ? PURPLE : Colors.fixedWhite} />
      </TouchableOpacity>
      {isDown ? (
        <Animated.View
          style={[
            themedStyles.cardActionMenuItemsDown,
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
            <View key={action.key} style={[themedStyles.cardActionMenuItem, { width: getActionWidth(action) }]}>
              <AdminCircleIconButton {...action.props} />
            </View>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
}

function CommentCard({ item, onClearReports, onDelete, onSanction, onOpenPublication, onOpenUser }) {
  const username = item.user?.username || 'Usuario';
  const publicationName = item.publication?.pattern?.name || 'Publicación';
  const reportCount = getReportCount(item);

  return (
    <View style={themedStyles.commentCard}>
      <View style={themedStyles.commentAvatarBlock}>
        <Avatar
          imageUrl={item.user?.profileImageUrl || item.user?.avatar}
          onPress={() => item.user && onOpenUser(item.user)}
        />
        <Text style={themedStyles.commentUserName} numberOfLines={1}>{username}</Text>
      </View>

      <View style={themedStyles.commentBody}>
        <View style={themedStyles.commentMetaRow}>
          <Text style={themedStyles.commentMeta} numberOfLines={1}>{formatRelativeDate(item.createdAt)}</Text>
          <Text style={themedStyles.commentMetaSeparator}>|</Text>
          <TouchableOpacity onPress={() => onOpenPublication(item)} activeOpacity={0.75}>
            <Text style={themedStyles.commentPublicationLink}>Ir a la publicación</Text>
          </TouchableOpacity>
        </View>
        <Text style={themedStyles.commentText} numberOfLines={2}>
          Comentario: {item.content}
        </Text>
      </View>

      <CardActionMenu
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

function PublicationCard({ publication, tall, onOpen, onClearReports, onDelete, onReport }) {
  const imageUri = publication.imageUrl
    || (publication.pattern?.gridData ? gridDataToImageUri(publication.pattern.gridData, { maxDimension: 300 }) : null);
  const reportCount = getReportCount(publication);

  return (
    <TouchableOpacity style={themedStyles.publicationCard} onPress={onOpen} activeOpacity={0.88}>
      <CardActionMenu
        direction="down"
        actions={[
          {
            key: 'delete',
            props: {
              iconName: 'trash',
              label: 'Eliminar publicación',
              onPress: onDelete,
            },
          },
          {
            key: 'sanction',
            props: {
              iconName: 'gavel',
              iconLibrary: 'material',
              label: 'Sancionar publicación',
              count: reportCount,
              onPress: onReport,
            },
          },
          reportCount > 0 ? {
            key: 'clear',
            props: {
              iconName: 'checkmark',
              label: 'Eliminar reportes de la publicación',
              onPress: onClearReports,
            },
          } : null,
        ]}
      />

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[themedStyles.publicationImage, tall && themedStyles.publicationImageTall]}
          resizeMode="cover"
        />
      ) : (
        <View style={[themedStyles.publicationPlaceholder, tall && themedStyles.publicationImageTall]}>
          <Ionicons name="image-outline" size={36} color={PURPLE} />
        </View>
      )}

      <View style={themedStyles.publicationInfo}>
        {TECHNIQUES[publication.technique] ? (
          <View style={themedStyles.techniqueBadge}>
            <Text style={themedStyles.techniqueBadgeText}>{TECHNIQUES[publication.technique]}</Text>
          </View>
        ) : null}
        <Text style={themedStyles.publicationDescription} numberOfLines={2}>{publication.description}</Text>
        <View style={themedStyles.publicationAuthorRow}>
          <Avatar
            imageUrl={publication.user?.profileImageUrl}
            size={20}
          />
          <Text style={themedStyles.publicationAuthor} numberOfLines={1}>@{publication.user?.username || 'usuario'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AdminCommunityManagementScreen({navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createAdminCommunityManagementStyles(colors), [colors]);
  themedStyles = styles;
  const [activeTab, setActiveTab] = useState(TABS.COMMENTS);
  const [tabsWidth, setTabsWidth] = useState(0);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [comments, setComments] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentReportsToClear, setCommentReportsToClear] = useState(null);
  const [publicationToDelete, setPublicationToDelete] = useState(null);
  const [publicationReportsToClear, setPublicationReportsToClear] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const tabIndicator = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(tabIndicator, {
      toValue: activeTab === TABS.PUBLICATIONS ? 1 : 0,
      duration: 230,
      useNativeDriver: true,
    }).start();
  }, [activeTab, tabIndicator]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError('');

    const result = await AdminCommunityUseCase.loadDashboard();
    if (!result.success) {
      if (!result.sessionExpired) setError('No se pudo cargar la información. Revisa tu conexión e inténtalo nuevamente.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setComments(result.data?.comments || []);
    setPublications(result.data?.publications || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadDashboard();
  }, [loadDashboard]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard(true);
  }, [loadDashboard]);

  const handleAskDeleteComment = useCallback((comment) => {
    setCommentToDelete(comment);
  }, []);

  const handleDeleteComment = useCallback(async () => {
    const comment = commentToDelete;
    if (!comment) return;

    setActionLoadingId(comment.id);
    const result = await AdminCommunityUseCase.deleteComment(comment.id);
    setActionLoadingId(null);
    setCommentToDelete(null);
    if (!result.success) {
      if (!result.sessionExpired) setError(result.error || 'No se pudo eliminar el comentario');
      return;
    }
    setComments(current => current.filter(item => item.id !== comment.id));
  }, [commentToDelete]);

  const handleClearCommentReports = useCallback(async () => {
    const comment = commentReportsToClear;
    if (!comment) return;
    const result = await AdminCommunityUseCase.clearCommentReports(comment.id);
    if (!result.success) {
      if (!result.sessionExpired) setError(result.error || 'No se pudieron eliminar los reportes del comentario');
      return;
    }
    setComments(current => current.map(item => (
      item.id === comment.id ? { ...item, reportCount: 0 } : item
    )));
    setCommentReportsToClear(null);
  }, [commentReportsToClear]);

  const handleClearPublicationReports = useCallback(async () => {
    const publication = publicationReportsToClear;
    if (!publication) return;
    const result = await AdminCommunityUseCase.clearPublicationReports(publication.id);
    if (!result.success) {
      if (!result.sessionExpired) setError(result.error || 'No se pudieron eliminar los reportes de la publicación');
      return;
    }
    setPublications(current => current.map(item => (
      item.id === publication.id ? { ...item, reportCount: 0 } : item
    )));
    setPublicationReportsToClear(null);
  }, [publicationReportsToClear]);

  const handleDeletePublication = useCallback(async () => {
    const publication = publicationToDelete;
    if (!publication) return;

    setActionLoadingId(publication.id);
    const result = await AdminCommunityUseCase.deletePublication(publication.id);
    setActionLoadingId(null);
    setPublicationToDelete(null);
    if (!result.success) {
      if (!result.sessionExpired) setError(result.error || 'No se pudo eliminar la publicación');
      return;
    }
    setPublications(current => current.filter(item => item.id !== publication.id));
  }, [publicationToDelete]);

  const handleOpenCommentPublication = useCallback((comment) => {
    navigation.navigate('PublicacionDetalle', {
      publicationId: comment.publicationId,
      publication: comment.publication || undefined,
    });
  }, [navigation]);

  const handleSanctionComment = useCallback((comment) => {
    navigation.navigate('SancionarEliminarPublicacionAdmin', {
      targetType: 'comment',
      commentId: comment.id,
      commentContent: comment.content,
    });
  }, [navigation]);

  const handleSanctionPublication = useCallback((publication) => {
    navigation.navigate('SancionarEliminarPublicacionAdmin', {
      targetType: 'publication',
      publicationId: publication.id,
      publicationName: publication.pattern?.name || 'Publicación',
    });
  }, [navigation]);

  const columns = useMemo(() => ({
    left: publications
      .filter(publication => activeFilter === 'todos' || getReportCount(publication) > 0)
      .filter((_, index) => index % 2 === 0),
    right: publications
      .filter(publication => activeFilter === 'todos' || getReportCount(publication) > 0)
      .filter((_, index) => index % 2 !== 0),
  }), [publications, activeFilter]);

  const filteredComments = useMemo(() => (
    comments.filter(comment => activeFilter === 'todos' || getReportCount(comment) > 0)
  ), [comments, activeFilter]);

  const filteredPublications = useMemo(() => (
    publications.filter(publication => activeFilter === 'todos' || getReportCount(publication) > 0)
  ), [publications, activeFilter]);

  const renderContent = () => {
    if (loading) {
      return <ScreenState loading text={`Cargando ${activeTab === TABS.COMMENTS ? 'comentarios' : 'publicaciones'}...`} />;
    }

    if (error) {
      return (
        <ScreenState
          iconName="cloud-offline-outline"
          text={error}
          actionText="Reintentar"
          onAction={() => loadDashboard()}
        />
      );
    }

    if (activeTab === TABS.COMMENTS) {
      return filteredComments.length === 0 ? (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.emptyContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
        >
          <ScreenState iconName="chatbubble-ellipses-outline" text="No hay comentarios para revisar" />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.commentsContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
        >
          {filteredComments.map(comment => (
            <View key={comment.id} style={actionLoadingId === comment.id && styles.disabledItem}>
              <CommentCard
                item={comment}
                onClearReports={setCommentReportsToClear}
                onDelete={handleAskDeleteComment}
                onSanction={handleSanctionComment}
                onOpenPublication={handleOpenCommentPublication}
                onOpenUser={setSelectedUser}
              />
            </View>
          ))}
        </ScrollView>
      );
    }

    return filteredPublications.length === 0 ? (
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.emptyContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
      >
        <ScreenState iconName="images-outline" text="No hay publicaciones para revisar" />
      </ScrollView>
    ) : (
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
                onOpen={() => navigation.navigate('PublicacionDetalle', { publicationId: publication.id, publication })}
                onClearReports={() => setPublicationReportsToClear(publication)}
                onDelete={() => setPublicationToDelete(publication)}
                onReport={() => handleSanctionPublication(publication)}
              />
            ))}
          </View>
          <View style={styles.publicationColumn}>
            {columns.right.map((publication, index) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                tall={index % 3 === 1}
                onOpen={() => navigation.navigate('PublicacionDetalle', { publicationId: publication.id, publication })}
                onClearReports={() => setPublicationReportsToClear(publication)}
                onDelete={() => setPublicationToDelete(publication)}
                onReport={() => handleSanctionPublication(publication)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.safeArea}>
      <AppTopBar subtitle="Gestión de Comunidad" />

      <View style={styles.tabs} onLayout={event => setTabsWidth(event.nativeEvent.layout.width)}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab(TABS.COMMENTS)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === TABS.COMMENTS && styles.tabTextActive]}>Comentarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab(TABS.PUBLICATIONS)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === TABS.PUBLICATIONS && styles.tabTextActive]}>Publicaciones</Text>
        </TouchableOpacity>
        {tabsWidth > 0 ? (
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: tabsWidth / 2,
                transform: [{
                  translateX: tabIndicator.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, tabsWidth / 2],
                  }),
                }],
              },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[styles.filtroGrid, activeFilter === 'todos' && styles.filtroGridActivo]}
          onPress={() => setActiveFilter('todos')}
          activeOpacity={0.8}
        >
          <Ionicons name={activeTab === TABS.COMMENTS ? 'chatbubbles' : 'images'} size={18} color={activeFilter === 'todos' ? Colors.fixedWhite : PURPLE} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroPill, activeFilter === 'reportados' && styles.filtroPillActivo]}
          onPress={() => setActiveFilter('reportados')}
          activeOpacity={0.8}
        >
          <Ionicons name="flag" size={14} color={activeFilter === 'reportados' ? Colors.fixedWhite : colors.textSecondary} />
          <Text style={[styles.filtroPillText, activeFilter === 'reportados' && styles.filtroPillTextActivo]}>
            Reportados
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>{renderContent()}</View>

      <AdminBottomBar
        activeItem={AdminBottomNavigationItem.COMMUNITY_MANAGEMENT}
        onPressUsers={() => navigation.navigate('GestionUsuarios')}
        onPressCommunity={() => undefined}
        onPressTutorials={() => navigation.navigate('GestionTutorialesAdmin')}
        onPressProfile={() => navigation.navigate('Perfil', { isAdmin: true })}
      />

      <ConfirmationModal
        visible={!!commentToDelete}
        title="¿Quieres eliminar este comentario?"
        loading={!!actionLoadingId}
        loadingText="Eliminando..."
        onCancel={() => setCommentToDelete(null)}
        onConfirm={handleDeleteComment}
      />

      <ConfirmationModal
        visible={!!commentReportsToClear}
        title="¿Quieres eliminar todos los reportes de este comentario?"
        confirmText="Eliminar"
        onCancel={() => setCommentReportsToClear(null)}
        onConfirm={handleClearCommentReports}
      />

      <ConfirmationModal
        visible={!!publicationReportsToClear}
        title="¿Quieres eliminar todos los reportes de esta publicación?"
        confirmText="Eliminar"
        onCancel={() => setPublicationReportsToClear(null)}
        onConfirm={handleClearPublicationReports}
      />

      <ConfirmationModal
        visible={!!publicationToDelete}
        title="¿Quieres eliminar esta publicación?"
        loading={!!actionLoadingId}
        loadingText="Eliminando..."
        onCancel={() => setPublicationToDelete(null)}
        onConfirm={handleDeletePublication}
      />

      <UserPreviewModal
        visible={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </View>
  );
}
