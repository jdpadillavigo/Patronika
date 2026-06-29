import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { adminCommunityManagementStyles as styles, PURPLE } from '../styles/AdminCommunityManagementStyles';

const TABS = {
  COMMENTS: 'comments',
  PUBLICATIONS: 'publications',
};

function getReportCount(item) {
  return item?.reportCount ?? item?.reportsCount ?? item?.reportedCount ?? item?.reportQuantity ?? 0;
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

function CommentCard({ item, onDelete, onOpenPublication, onOpenUser }) {
  const username = item.user?.username || 'Usuario';
  const publicationName = item.publication?.pattern?.name || 'Publicación';

  return (
    <View style={styles.commentCard}>
      <View style={styles.commentAvatarBlock}>
        <Avatar
          imageUrl={item.user?.profileImageUrl || item.user?.avatar}
          onPress={() => item.user && onOpenUser(item.user)}
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

      <AdminCircleIconButton
        iconName="trash-outline"
        label="Eliminar comentario"
        onPress={() => onDelete(item)}
        style={styles.commentDeleteButton}
      />
    </View>
  );
}

function PublicationCard({ publication, tall, onOpen, onReport }) {
  const imageUri = publication.imageUrl
    || (publication.pattern?.gridData ? gridDataToImageUri(publication.pattern.gridData, { maxDimension: 300 }) : null);
  const reportCount = getReportCount(publication);

  return (
    <TouchableOpacity style={styles.publicationCard} onPress={onOpen} activeOpacity={0.88}>
      <AdminCircleIconButton
        iconName="gavel"
        iconLibrary="material"
        label="Sancionar publicación"
        count={reportCount}
        onPress={onReport}
        style={styles.reportFab}
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
          <Avatar
            imageUrl={publication.user?.profileImageUrl}
            size={20}
          />
          <Text style={styles.publicationAuthor} numberOfLines={1}>@{publication.user?.username || 'usuario'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AdminCommunityManagementScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState(TABS.COMMENTS);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [comments, setComments] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleOpenCommentPublication = useCallback((comment) => {
    navigation.navigate('PublicacionDetalle', {
      publicationId: comment.publicationId,
      publication: comment.publication || undefined,
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
        <ScreenState iconName="chatbubble-ellipses-outline" text="No hay comentarios para revisar" />
      ) : (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.commentsContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} />}
        >
          {filteredComments.map(comment => (
            <View key={comment.id} style={actionLoadingId === comment.id && styles.disabledItem}>
              <CommentCard
                item={comment}
                onDelete={handleAskDeleteComment}
                onOpenPublication={handleOpenCommentPublication}
                onOpenUser={setSelectedUser}
              />
            </View>
          ))}
        </ScrollView>
      );
    }

    return filteredPublications.length === 0 ? (
      <ScreenState iconName="images-outline" text="No hay publicaciones para revisar" />
    ) : (
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.publicationsContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} />}
      >
        <View style={styles.publicationColumns}>
          <View style={styles.publicationColumn}>
            {columns.left.map((publication, index) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                tall={index % 3 === 0}
                onOpen={() => navigation.navigate('PublicacionDetalle', { publicationId: publication.id, publication })}
                onReport={() => navigation.navigate('SancionarEliminarPublicacionAdmin', {
                  publicationId: publication.id,
                  publicationName: publication.pattern?.name || 'Publicación',
                })}
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
                onReport={() => navigation.navigate('SancionarEliminarPublicacionAdmin', {
                  publicationId: publication.id,
                  publicationName: publication.pattern?.name || 'Publicación',
                })}
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

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === TABS.COMMENTS && styles.tabButtonActive]}
          onPress={() => setActiveTab(TABS.COMMENTS)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === TABS.COMMENTS && styles.tabTextActive]}>Comentarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === TABS.PUBLICATIONS && styles.tabButtonActive]}
          onPress={() => setActiveTab(TABS.PUBLICATIONS)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === TABS.PUBLICATIONS && styles.tabTextActive]}>Publicaciones</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[styles.filtroGrid, activeFilter === 'todos' && styles.filtroGridActivo]}
          onPress={() => setActiveFilter('todos')}
          activeOpacity={0.8}
        >
          <Ionicons name="grid" size={18} color={activeFilter === 'todos' ? 'white' : PURPLE} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroPill, activeFilter === 'reportados' && styles.filtroPillActivo]}
          onPress={() => setActiveFilter('reportados')}
          activeOpacity={0.8}
        >
          <Ionicons name="flag" size={14} color={activeFilter === 'reportados' ? 'white' : '#555'} />
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

      <UserPreviewModal
        visible={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </View>
  );
}
