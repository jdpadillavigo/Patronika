import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { useAppTheme } from '../../../../core/presentation/designsystem/Theme';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDetalleStyles, detalleStyles as styles, PURPLE } from '../styles/PostDetailStyles';
let themedStyles = styles;
import CommentUseCase from '../../domain/usecases/CommentUseCase';
import PublicationUseCase from '../../domain/usecases/PublicationUseCase';
import PatternUseCase from '../../../pattern/domain/usecases/PatternUseCase';
import PatternLibraryUseCase from '../../../pattern/domain/usecases/PatternLibraryUseCase';
import HttpClient from '../../../../core/data/network/HttpClientExt';
import UserRemoteDataSource from '../../../../core/data/user/networking/UserRemoteDataSource';
import { gridDataToImageUri } from '../../../../core/presentation/designsystem/utils/GridImage';
import BackButton from '../../../../core/presentation/designsystem/components/BackButton';
import ScreenState from '../../../../core/presentation/designsystem/components/ScreenState';
import { useErrorPopup } from '../../../../core/presentation/designsystem/components/ErrorPopup';

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function CommentAvatar({ initial, imageUrl, styles }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (imageUrl && !imageFailed) {
    return <Image source={{ uri: imageUrl }} style={themedStyles.commentAvatarImage} onError={() => setImageFailed(true)} />;
  }
  return (
    <View style={themedStyles.commentAvatar}>
      <Ionicons name="person" size={16} color={Colors.fixedWhite} />
    </View>
  );
}

export default function PublicacionDetalleScreen({navigation, route }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createDetalleStyles(colors), [colors]);
  themedStyles = styles;
  const { publication: initialPub, publicationId } = route.params || {};
  const [pub] = useState(initialPub);
  const [fetchedPattern, setFetchedPattern] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [fullscreenUri, setFullscreenUri] = useState(null);
  const [fullscreenLoading, setFullscreenLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingPattern, setSavingPattern] = useState(false);
  const [userMap, setUserMap] = useState({});
  const [authorAvatarFailed, setAuthorAvatarFailed] = useState(false);
  const [reportedComments, setReportedComments] = useState(new Set());
  const [patternLoadDone, setPatternLoadDone] = useState(!initialPub?.patternId && !initialPub?.pattern?.id);
  const [resultImageLoaded, setResultImageLoaded] = useState(!initialPub?.imageUrl);
  const [patternImageLoaded, setPatternImageLoaded] = useState(false);
  const [isPublicationReported, setIsPublicationReported] = useState(false);

  const getReportKey = useCallback((userId) => `@patronika_reported_comments_${userId}`, []);
  const getReportPubKey = useCallback((userId) => `@patronika_reported_publications_${userId}`, []);

  useEffect(() => {
    async function loadReported() {
      const user = await HttpClient.getCurrentUser();
      if (!user?.id) return;
      const stored = await AsyncStorage.getItem(getReportKey(user.id));
      if (stored) setReportedComments(new Set(JSON.parse(stored)));
      const storedPubs = await AsyncStorage.getItem(getReportPubKey(user.id));
      if (storedPubs) {
        const reportedPubs = JSON.parse(storedPubs);
        if (reportedPubs.includes(publicationId)) setIsPublicationReported(true);
      }
    }
    loadReported();
  }, [getReportKey, getReportPubKey, publicationId]);
  const inputRef = useRef(null);
  const { showConfirm, showError, errorPopup } = useErrorPopup();

  const currentUserId = currentUser?.id || null;
  const isAdmin = currentUser?.isAdmin === true;
  const isOwnPublication = pub?.user?.id && currentUserId && pub.user.id === currentUserId;

  // patternId puede venir como campo plano (nuevo backend) o dentro del objeto pattern (compatibilidad)
  const patternId = pub?.patternId || pub?.pattern?.id || null;

  const patternImageUri = fetchedPattern?.gridData
    ? gridDataToImageUri(fetchedPattern.gridData, { maxDimension: 600 })
    : null;

  const resultImageUri = pub?.imageUrl || null;
  const loadingPublication = !patternLoadDone
    || (!!resultImageUri && !resultImageLoaded)
    || (!!patternImageUri && !patternImageLoaded);

  const openFullscreen = (uri) => {
    setFullscreenLoading(true);
    setFullscreenUri(uri);
  };

  // Cargar usuario en sesión y agregarlo al mapa de usuarios
  useEffect(() => {
    HttpClient.getCurrentUser().then(u => {
      if (!u) return;
      setCurrentUser(u);
      setUserMap(prev => ({
        ...prev,
        [u.id]: { username: u.username, profileImageUrl: u.profileImageUrl ?? null },
      }));
    });
  }, []);

  // Fetch del patrón para obtener gridData y nombre
  useEffect(() => {
    if (!patternId) {
      setPatternLoadDone(true);
      return;
    }
    setPatternLoadDone(false);
    PatternUseCase.getById(patternId).then(result => {
      if (result.success && result.data) setFetchedPattern(result.data);
    }).finally(() => setPatternLoadDone(true));
  }, [patternId]);

  useEffect(() => {
    setResultImageLoaded(!resultImageUri);
  }, [resultImageUri]);

  useEffect(() => {
    setPatternImageLoaded(!patternImageUri);
  }, [patternImageUri]);

  // Verificar si el patrón ya está guardado (solo para publicaciones ajenas)
  useEffect(() => {
    if (!patternId || !currentUserId || isOwnPublication || isAdmin) return;
    PatternLibraryUseCase.listSaved().then(result => {
      if (result.success) {
        setIsSaved(result.data.some(entry => entry.pattern.id === patternId));
      }
    });
  }, [patternId, currentUserId, isOwnPublication, isAdmin]);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    const result = await CommentUseCase.loadForPublication(publicationId);
    if (result.success) {
      setComments(result.data);
      const uniqueIds = [...new Set(result.data.map(c => c.userId))];
      const entries = await Promise.all(
        uniqueIds.map(async uid => {
          try {
            const u = await UserRemoteDataSource.loadById(uid);
            return [uid, { username: u.username, profileImageUrl: u.profileImageUrl ?? null }];
          } catch {
            return [uid, { username: 'Usuario', profileImageUrl: null }];
          }
        })
      );
      setUserMap(prev => ({ ...prev, ...Object.fromEntries(entries) }));
    }
    setLoadingComments(false);
  }, [publicationId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const handleToggleSave = async () => {
    if (savingPattern || !patternId) return;
    setSavingPattern(true);
    if (isSaved) {
      const result = await PatternLibraryUseCase.remove(patternId);
      if (result.success) setIsSaved(false);
    } else {
      const result = await PatternLibraryUseCase.save(patternId);
      if (result.success) setIsSaved(true);
    }
    setSavingPattern(false);
  };

  const handleSend = async () => {
    if (currentUser && currentUser.status !== 0) return;
    if (!commentText.trim() || sending) return;
    if (editingComment && commentText.trim() === editingComment.content.trim()) return;
    setSending(true);

    if (editingComment) {
      const result = await CommentUseCase.editComment(editingComment.id, publicationId, commentText);
      if (result.success) {
        setComments(prev => prev.map(c =>
          c.id === editingComment.id ? { ...c, content: commentText.trim(), updatedAt: new Date().toISOString() } : c
        ));
        setEditingComment(null);
        setCommentText('');
      }
    } else {
      const result = await CommentUseCase.addComment(publicationId, commentText);
      if (result.success && result.data) {
        setComments(prev => [...prev, result.data]);
        setCommentText('');
      }
    }
    setSending(false);
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.content);
    inputRef.current?.focus();
  };

  const handleDeleteComment = (commentId) => {
    showConfirm(
      '¿Seguro que quieres eliminar este comentario?',
      'Eliminar comentario',
      async () => {
          const result = await CommentUseCase.deleteComment(commentId);
          if (result.success) setComments(prev => prev.filter(c => c.id !== commentId));
      },
      { acceptText: 'Eliminar', iconName: 'trash' },
    );
  };

  const handleDeletePublication = () => {
    showConfirm(
      'Esta acción no se puede deshacer.',
      'Eliminar publicación',
      async () => {
        const result = await PublicationUseCase.remove(publicationId);
        if (result.success) navigation.goBack();
        else if (!result.sessionExpired) showError(result.error || 'No se pudo eliminar la publicación');
      },
      { acceptText: 'Eliminar', iconName: 'trash' },
    );
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setCommentText('');
  };

  const handleReportPublication = () => {
    showConfirm(
      '¿Quieres reportar esta publicación como inapropiada?',
      'Reportar publicación',
      async () => {
        const result = await PublicationUseCase.reportPublication(publicationId);
        if (!result.success) {
          if (!result.sessionExpired) showError(result.error || 'No se pudo reportar la publicación');
          return;
        }

        const user = await HttpClient.getCurrentUser();
        setIsPublicationReported(true);
        if (user?.id) {
          const key = getReportPubKey(user.id);
          const stored = await AsyncStorage.getItem(key);
          const previousReports = stored ? JSON.parse(stored) : [];
          await AsyncStorage.setItem(key, JSON.stringify([...previousReports, publicationId]));
        }
      },
      { acceptText: 'Reportar', iconName: 'flag' },
    );
  };

  const handleReportComment = (commentId) => {
    showConfirm(
      '¿Quieres reportar este comentario como inapropiado?',
      'Reportar comentario',
      async () => {
        const result = await CommentUseCase.reportComment(commentId);
        if (!result.success) {
          if (!result.sessionExpired) showError(result.error || 'No se pudo reportar el comentario');
          return;
        }

        const user = await HttpClient.getCurrentUser();
        const updated = new Set([...reportedComments, commentId]);
        setReportedComments(updated);
        if (user?.id) {
          await AsyncStorage.setItem(getReportKey(user.id), JSON.stringify([...updated]));
        }
      },
      { acceptText: 'Reportar', iconName: 'flag' },
    );
  };

  const patternName = fetchedPattern?.name || pub?.pattern?.name || null;

  return (
    <View style={styles.safeArea}>

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Publicación</Text>
          {!isAdmin && !isOwnPublication && (
            <>
              {patternId && (
                <TouchableOpacity style={styles.saveBtn} onPress={handleToggleSave} disabled={savingPattern}>
                  {savingPattern
                    ? <ActivityIndicator size="small" color={PURPLE} />
                    : <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={22} color={PURPLE} />
                  }
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteBtn} onPress={handleReportPublication} disabled={isPublicationReported}>
                <Ionicons
                  name={isPublicationReported ? 'flag' : 'flag-outline'}
                  size={20}
                  color={isPublicationReported ? Colors.errorStrong : colors.textDisabled}
                />
              </TouchableOpacity>
            </>
          )}
          {isOwnPublication && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeletePublication}>
              <Ionicons name="trash-outline" size={20} color={Colors.errorStrong} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 18 : 0}
      >
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Foto del resultado */}
          {resultImageUri && (
            <TouchableOpacity style={styles.imageBlock} onPress={() => openFullscreen(resultImageUri)} activeOpacity={0.92}>
              <Image
                source={{ uri: resultImageUri }}
                style={styles.image}
                resizeMode="cover"
                onLoadEnd={() => setResultImageLoaded(true)}
                onError={() => setResultImageLoaded(true)}
              />
              <View style={styles.imageLabelBadge}>
                <Ionicons name="camera" size={11} color={Colors.fixedWhite} />
                <Text style={styles.imageLabelText}>Foto del resultado · Toca para ampliar</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Separador si hay ambas imágenes */}
          {resultImageUri && patternImageUri && <View style={styles.imageDivider} />}

          {/* Patrón generado */}
          {patternImageUri ? (
            <TouchableOpacity style={styles.imageBlock} onPress={() => openFullscreen(patternImageUri)} activeOpacity={0.92}>
              <Image
                source={{ uri: patternImageUri }}
                style={styles.imageSmall}
                resizeMode="contain"
                onLoadEnd={() => setPatternImageLoaded(true)}
                onError={() => setPatternImageLoaded(true)}
              />
              <View style={styles.imageLabelBadge}>
                <Ionicons name="grid" size={11} color={Colors.fixedWhite} />
                <Text style={styles.imageLabelText}>Patrón generado · Toca para ampliar</Text>
              </View>
            </TouchableOpacity>
          ) : !resultImageUri && (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={64} color={PURPLE} />
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.authorRow}>
              {pub?.user?.profileImageUrl && !authorAvatarFailed ? (
                <Image
                  source={{ uri: pub.user.profileImageUrl }}
                  style={styles.avatarImage}
                  onError={() => setAuthorAvatarFailed(true)}
                />
              ) : (
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color={Colors.fixedWhite} />
                </View>
              )}
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>@{pub?.user?.username}</Text>
                <Text style={styles.publishedDate}>{formatDate(pub?.publishedAt)}</Text>
              </View>
            </View>

            {TECHNIQUES[pub?.technique] && (
              <View style={styles.techniqueBadge}>
                <Text style={styles.techniqueBadgeText}>{TECHNIQUES[pub.technique]}</Text>
              </View>
            )}

            <Text style={styles.description}>{pub?.description}</Text>
            {patternName && (
              <Text style={styles.patternName}>Patrón: {patternName}</Text>
            )}

            <View style={styles.divider} />

            <Text style={styles.commentsTitle}>
              Comentarios {comments.length > 0 ? `(${comments.length})` : ''}
            </Text>

            {loadingComments ? (
              <View style={{ alignItems: 'center', marginVertical: 16 }}>
                <ActivityIndicator color={PURPLE} />
                <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 8 }}>Cargando comentarios...</Text>
              </View>
            ) : comments.length === 0 ? (
              <Text style={styles.noComments}>¡Sé el primero en comentar!</Text>
            ) : (
              comments.map(comment => {
                const commentUser = userMap[comment.userId];
                const isOwnComment = comment.userId === currentUserId;
                const displayUsername = commentUser?.username || 'Usuario';
                const displayAvatar = commentUser?.profileImageUrl || null;
                return (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <CommentAvatar initial={displayUsername[0]} imageUrl={displayAvatar} styles={styles} />
                      <Text style={styles.commentAuthor}>@{displayUsername}</Text>
                      {isOwnComment ? (
                        <View style={styles.commentActions}>
                          <TouchableOpacity style={styles.commentActionBtn} onPress={() => handleEditComment(comment)}>
                            <Ionicons name="pencil-outline" size={14} color={colors.textMuted} />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.commentActionBtn} onPress={() => handleDeleteComment(comment.id)}>
                            <Ionicons name="trash-outline" size={14} color={Colors.errorStrong} />
                          </TouchableOpacity>
                        </View>
                      ) : !isAdmin ? (
                        <TouchableOpacity
                          style={styles.commentActionBtn}
                          onPress={() => handleReportComment(comment.id)}
                          disabled={reportedComments.has(comment.id)}
                        >
                          <Ionicons
                            name={reportedComments.has(comment.id) ? 'flag' : 'flag-outline'}
                            size={14}
                            color={reportedComments.has(comment.id) ? Colors.errorStrong : colors.textDisabled}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <View style={styles.commentDateRow}>
                      <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                      {comment.updatedAt && comment.updatedAt !== comment.createdAt ? (
                        <Text style={styles.commentEditedText}>(editado)</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {editingComment && (
          <View style={styles.editingBanner}>
            <Text style={styles.editingBannerText}>Editando comentario</Text>
            <TouchableOpacity onPress={cancelEdit}>
              <Ionicons name="close" size={16} color={PURPLE} />
            </TouchableOpacity>
          </View>
        )}

        {currentUser && currentUser.status !== 0 ? (
          <View style={styles.suspendedInputBar}>
            <Ionicons name="ban" size={16} color={Colors.errorStrong} />
            <Text style={styles.suspendedInputText}>Tu cuenta está suspendida y no puedes comentar</Text>
          </View>
        ) : (
          <View style={styles.inputBar}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Escribe un comentario..."
              placeholderTextColor={colors.textDisabled}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={250}
              scrollEnabled={false}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!commentText.trim() || sending || (editingComment && commentText.trim() === editingComment.content.trim())) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!commentText.trim() || sending || (editingComment && commentText.trim() === editingComment.content.trim())}
            >
              {sending
                ? <ActivityIndicator size="small" color={Colors.fixedWhite} />
                : <Ionicons name="send" size={18} color={Colors.fixedWhite} />
              }
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Visor fullscreen */}
      <Modal
        visible={!!fullscreenUri}
        transparent
        animationType="none"
      >
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity style={styles.fullscreenClose} onPress={() => setFullscreenUri(null)}>
            <Ionicons name="close" size={22} color={Colors.fixedWhite} />
          </TouchableOpacity>
          {fullscreenUri && (
            <>
              {fullscreenLoading && (
                <ActivityIndicator size="large" color={Colors.fixedWhite} style={{ position: 'absolute' }} />
              )}
              <Image
                source={{ uri: fullscreenUri }}
                style={styles.fullscreenImage}
                resizeMode="contain"
                onLoadEnd={() => setFullscreenLoading(false)}
              />
            </>
          )}
        </View>
      </Modal>

      {loadingPublication ? (
        <View style={styles.loadingOverlay}>
          <ScreenState loading text="Cargando publicación..." />
        </View>
      ) : null}
      {errorPopup}
    </View>
  );
}
