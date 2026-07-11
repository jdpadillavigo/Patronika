import React, { useCallback, useMemo, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useAppTheme } from '../../../../../../core/presentation/designsystem/Theme';
import Colors from '../../../../../../core/presentation/designsystem/Colors';
import { AdminBottomNavigationItem } from '../../../../../../core/domain/BottomNavigationItem';
import AdminBottomBar from '../../../../../../core/presentation/designsystem/components/AdminBottomBar';
import AppTopBar from '../../../../../../core/presentation/designsystem/components/AppTopBar';
import ConfirmationModal from '../../../../../../core/presentation/designsystem/components/ConfirmationModal';
import ScreenState from '../../../../../../core/presentation/designsystem/components/ScreenState';
import UserPreviewModal from '../../../../../../core/presentation/designsystem/components/UserPreviewModal';
import AdminCommentUseCase from '../../domain/usecases/AdminCommentUseCase';
import CommentManagementScreen from './CommentManagementScreen';
import AdminPostUseCase from '../../../postManagement/domain/usecases/AdminPostUseCase';
import PostManagementScreen from '../../../postManagement/presentation/screens/PostManagementScreen';
import PatternUseCase from '../../../../../pattern/domain/usecases/PatternUseCase';
import { createAdminCommunityManagementStyles, PURPLE } from '../styles/AdminCommunityManagementStyles';

const TABS = {
  COMMENTS: 'comments',
  PUBLICATIONS: 'publications',
};

function getReportCount(item) {
  const count = Number(item?.reportCount);
  return Number.isFinite(count) ? count : 0;
}

export default function AdminCommunityManagementScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createAdminCommunityManagementStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState(TABS.COMMENTS);
  const [tabsWidth, setTabsWidth] = useState(0);
  const [commentsFilter, setCommentsFilter] = useState('todos');
  const [publicationsFilter, setPublicationsFilter] = useState('todos');
  const [activeMenuId, setActiveMenuId] = useState(null);
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
    setActiveMenuId(null);
  }, [activeTab, tabIndicator]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError('');

    const publicationsResult = await AdminPostUseCase.loadPublications();
    const commentsResult = publicationsResult.success
      ? await AdminCommentUseCase.loadComments(publicationsResult.data || [])
      : { success: false, sessionExpired: publicationsResult.sessionExpired, error: publicationsResult.error };

    if (!commentsResult.success || !publicationsResult.success) {
      if (!commentsResult.sessionExpired && !publicationsResult.sessionExpired) {
        setError('No se pudo cargar la información. Revisa tu conexión e inténtalo nuevamente.');
      }
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const publicationsData = publicationsResult.data || [];
    const missingPatternIds = [...new Set(
      publicationsData
        .filter(publication => !publication.imageUrl && publication.patternId && !publication.pattern?.gridData)
        .map(publication => publication.patternId)
    )];
    const patternGridMap = {};

    await Promise.all(missingPatternIds.map(async (patternId) => {
      const result = await PatternUseCase.getById(patternId);
      if (result.success && result.data?.gridData) {
        patternGridMap[patternId] = result.data.gridData;
      }
    }));

    setComments(commentsResult.data || []);
    setPublications(publicationsData.map(publication => ({
      ...publication,
      patternGridData: publication.pattern?.gridData || patternGridMap[publication.patternId] || null,
    })));
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

  const handleDeleteComment = useCallback(async () => {
    const comment = commentToDelete;
    if (!comment) return;

    setActionLoadingId(comment.id);
    const result = await AdminCommentUseCase.deleteComment(comment.id);
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

    const result = await AdminCommentUseCase.clearCommentReports(comment.id);
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

    const result = await AdminPostUseCase.clearPublicationReports(publication.id);
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
    const result = await AdminPostUseCase.deletePublication(publication.id);
    setActionLoadingId(null);
    setPublicationToDelete(null);
    if (!result.success) {
      if (!result.sessionExpired) setError(result.error || 'No se pudo eliminar la publicación');
      return;
    }
    setPublications(current => current.filter(item => item.id !== publication.id));
  }, [publicationToDelete]);

  const handleOpenCommentPublication = useCallback((comment) => {
    setActiveMenuId(null);
    navigation.navigate('PublicacionDetalle', {
      publicationId: comment.publicationId,
      publication: comment.publication || undefined,
    });
  }, [navigation]);

  const handleSanctionComment = useCallback((comment) => {
    setActiveMenuId(null);
    navigation.navigate('SancionarEliminarPublicacionAdmin', {
      targetType: 'comment',
      commentId: comment.id,
      commentContent: comment.content,
      userId: comment.userId || comment.user?.id,
    });
  }, [navigation]);

  const handleOpenPublication = useCallback((publication) => {
    setActiveMenuId(null);
    navigation.navigate('PublicacionDetalle', { publicationId: publication.id, publication });
  }, [navigation]);

  const handleSanctionPublication = useCallback((publication) => {
    setActiveMenuId(null);
    navigation.navigate('SancionarEliminarPublicacionAdmin', {
      targetType: 'publication',
      publicationId: publication.id,
      publicationName: publication.pattern?.name || 'Publicación',
      userId: publication.user?.id,
    });
  }, [navigation]);

  const filteredComments = useMemo(() => (
    comments.filter(comment => commentsFilter === 'todos' || getReportCount(comment) > 0)
  ), [comments, commentsFilter]);

  const filteredPublications = useMemo(() => (
    publications.filter(publication => publicationsFilter === 'todos' || getReportCount(publication) > 0)
  ), [publications, publicationsFilter]);

  const activeFilter = activeTab === TABS.COMMENTS ? commentsFilter : publicationsFilter;
  const setActiveFilterForCurrentTab = activeTab === TABS.COMMENTS ? setCommentsFilter : setPublicationsFilter;

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
      return (
        <CommentManagementScreen
          comments={filteredComments}
          activeMenuId={activeMenuId}
          actionLoadingId={actionLoadingId}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onToggleMenu={setActiveMenuId}
          onClearReports={(comment) => {
            setActiveMenuId(null);
            setCommentReportsToClear(comment);
          }}
          onDelete={(comment) => {
            setActiveMenuId(null);
            setCommentToDelete(comment);
          }}
          onSanction={handleSanctionComment}
          onOpenPublication={handleOpenCommentPublication}
          onOpenUser={setSelectedUser}
        />
      );
    }

    return (
      <PostManagementScreen
        publications={filteredPublications}
        activeMenuId={activeMenuId}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onToggleMenu={setActiveMenuId}
        onOpen={handleOpenPublication}
        onClearReports={(publication) => {
          setActiveMenuId(null);
          setPublicationReportsToClear(publication);
        }}
        onDelete={(publication) => {
          setActiveMenuId(null);
          setPublicationToDelete(publication);
        }}
        onReport={handleSanctionPublication}
      />
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
          onPress={() => setActiveFilterForCurrentTab('todos')}
          activeOpacity={0.8}
        >
          <Ionicons name={activeTab === TABS.COMMENTS ? 'chatbubbles' : 'images'} size={18} color={activeFilter === 'todos' ? Colors.fixedWhite : PURPLE} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroPill, activeFilter === 'reportados' && styles.filtroPillActivo]}
          onPress={() => setActiveFilterForCurrentTab('reportados')}
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
