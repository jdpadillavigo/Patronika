import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { detalleStyles as styles, PURPLE } from '../styles/PostDetailStyles';
import CommentUseCase from '../../domain/usecases/CommentUseCase';
import PublicationUseCase from '../../domain/usecases/PublicationUseCase';
import PatternUseCase from '../../../pattern/domain/usecases/PatternUseCase';
import PatternLibraryUseCase from '../../../pattern/domain/usecases/PatternLibraryUseCase';
import HttpClient from '../../../../core/data/network/HttpClientExt';
import UserRemoteDataSource from '../../../user/data/networking/UserRemoteDataSource';
import { gridDataToImageUri } from '../../../../core/presentation/designsystem/utils/GridImage';
import { useErrorPopup } from '../../../../core/presentation/designsystem/components/ErrorPopup';

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function CommentAvatar({ initial, imageUrl }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (imageUrl && !imageFailed) {
    return <Image source={{ uri: imageUrl }} style={styles.commentAvatarImage} onError={() => setImageFailed(true)} />;
  }
  return (
    <View style={styles.commentAvatar}>
      <Ionicons name="person" size={16} color="white" />
    </View>
  );
}

export default function PublicacionDetalleScreen({ navigation, route }) {
  const { publication: initialPub, publicationId } = route.params || {};
  const [pub] = useState(initialPub);
  const [fetchedPattern, setFetchedPattern] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPub, setDeletingPub] = useState(false);
  const [fullscreenUri, setFullscreenUri] = useState(null);
  const [fullscreenLoading, setFullscreenLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingPattern, setSavingPattern] = useState(false);
  const [userMap, setUserMap] = useState({});
  const [authorAvatarFailed, setAuthorAvatarFailed] = useState(false);
  const [reportedComments, setReportedComments] = useState(new Set());

  // Clave de AsyncStorage por usuario para persistir los comentarios reportados
  const getReportKey = useCallback((userId) => `@patronika_reported_comments_${userId}`, []);

  useEffect(() => {
    async function loadReported() {
      const user = await HttpClient.getCurrentUser();
      if (!user?.id) return;
      const stored = await AsyncStorage.getItem(getReportKey(user.id));
      if (stored) setReportedComments(new Set(JSON.parse(stored)));
    }
    loadReported();
  }, [getReportKey]);
  const inputRef = useRef(null);
  const { showConfirm, errorPopup } = useErrorPopup();

  const currentUserId = currentUser?.id || null;
  const isOwnPublication = pub?.user?.id && currentUserId && pub.user.id === currentUserId;

  // patternId puede venir como campo plano (nuevo backend) o dentro del objeto pattern (compatibilidad)
  const patternId = pub?.patternId || pub?.pattern?.id || null;

  const patternImageUri = fetchedPattern?.gridData
    ? gridDataToImageUri(fetchedPattern.gridData, { maxDimension: 600 })
    : null;

  const resultImageUri = pub?.imageUrl || null;

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
    if (!patternId) return;
    PatternUseCase.getById(patternId).then(result => {
      if (result.success && result.data) setFetchedPattern(result.data);
    });
  }, [patternId]);

  // Verificar si el patrón ya está guardado (solo para publicaciones ajenas)
  useEffect(() => {
    if (!patternId || !currentUserId || isOwnPublication) return;
    PatternLibraryUseCase.listSaved().then(result => {
      if (result.success) {
        setIsSaved(result.data.some(entry => entry.pattern.id === patternId));
      }
    });
  }, [patternId, currentUserId, isOwnPublication]);

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
    if (!commentText.trim() || sending) return;
    setSending(true);

    if (editingComment) {
      const result = await CommentUseCase.editComment(editingComment.id, publicationId, commentText);
      if (result.success) {
        setComments(prev => prev.map(c =>
          c.id === editingComment.id ? { ...c, content: commentText.trim() } : c
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
      { acceptText: 'Eliminar' },
    );
  };

  const handleDeletePublication = async () => {
    setDeletingPub(true);
    const result = await PublicationUseCase.remove(publicationId);
    setDeletingPub(false);
    setShowDeleteModal(false);
    if (result.success) navigation.goBack();
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setCommentText('');
  };

  const handleReportComment = (commentId) => {
    Alert.alert(
      'Reportar comentario',
      '¿Quieres reportar este comentario como inapropiado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reportar',
          style: 'destructive',
          onPress: async () => {
            const result = await CommentUseCase.reportComment(commentId);
            if (result.success) {
              const user = await HttpClient.getCurrentUser();
              const updated = new Set([...reportedComments, commentId]);
              setReportedComments(updated);
              if (user?.id) {
                await AsyncStorage.setItem(getReportKey(user.id), JSON.stringify([...updated]));
              }
            }
          },
        },
      ]
    );
  };

  const patternName = fetchedPattern?.name || pub?.pattern?.name || null;

  return (
    <View style={styles.safeArea}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicación</Text>
        {!isOwnPublication && patternId && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleToggleSave} disabled={savingPattern}>
            {savingPattern
              ? <ActivityIndicator size="small" color={PURPLE} />
              : <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={22} color={PURPLE} />
            }
          </TouchableOpacity>
        )}
        {isOwnPublication && (
          <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDeleteModal(true)}>
            <Ionicons name="trash-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Foto del resultado */}
          {resultImageUri && (
            <TouchableOpacity style={styles.imageBlock} onPress={() => openFullscreen(resultImageUri)} activeOpacity={0.92}>
              <Image source={{ uri: resultImageUri }} style={styles.image} resizeMode="cover" />
              <View style={styles.imageLabelBadge}>
                <Ionicons name="camera" size={11} color="white" />
                <Text style={styles.imageLabelText}>Foto del resultado · toca para ampliar</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Separador si hay ambas imágenes */}
          {resultImageUri && patternImageUri && <View style={styles.imageDivider} />}

          {/* Patrón generado */}
          {patternImageUri ? (
            <TouchableOpacity style={styles.imageBlock} onPress={() => openFullscreen(patternImageUri)} activeOpacity={0.92}>
              <Image source={{ uri: patternImageUri }} style={styles.imageSmall} resizeMode="contain" />
              <View style={styles.imageLabelBadge}>
                <Ionicons name="grid" size={11} color="white" />
                <Text style={styles.imageLabelText}>Patrón generado · toca para ampliar</Text>
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
                  <Ionicons name="person" size={20} color="white" />
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
                <Text style={{ color: '#888', fontSize: 14, marginTop: 8 }}>Cargando comentarios...</Text>
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
                      <CommentAvatar initial={displayUsername[0]} imageUrl={displayAvatar} />
                      <Text style={styles.commentAuthor}>@{displayUsername}</Text>
                      {isOwnComment ? (
                        <View style={styles.commentActions}>
                          <TouchableOpacity style={styles.commentActionBtn} onPress={() => handleEditComment(comment)}>
                            <Ionicons name="pencil-outline" size={14} color="#888" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.commentActionBtn} onPress={() => handleDeleteComment(comment.id)}>
                            <Ionicons name="trash-outline" size={14} color="#E53935" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.commentActionBtn}
                          onPress={() => handleReportComment(comment.id)}
                          disabled={reportedComments.has(comment.id)}
                        >
                          <Ionicons
                            name={reportedComments.has(comment.id) ? 'flag' : 'flag-outline'}
                            size={14}
                            color={reportedComments.has(comment.id) ? '#E53935' : '#BBB'}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
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

        <View style={styles.inputBar}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Escribe un comentario..."
            placeholderTextColor="#BBB"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={250}
            scrollEnabled={false}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!commentText.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!commentText.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size="small" color="white" />
              : <Ionicons name="send" size={18} color="white" />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Visor fullscreen */}
      <Modal
        visible={!!fullscreenUri}
        transparent
        animationType="none"
      >
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity style={styles.fullscreenClose} onPress={() => setFullscreenUri(null)}>
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>
          {fullscreenUri && (
            <>
              {fullscreenLoading && (
                <ActivityIndicator size="large" color="white" style={{ position: 'absolute' }} />
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

      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="trash-outline" size={40} color="#E53935" />
            <Text style={styles.modalTitle}>Eliminar publicación</Text>
            <Text style={styles.modalMessage}>Esta acción no se puede deshacer.</Text>
            <TouchableOpacity style={styles.modalDanger} onPress={handleDeletePublication} disabled={deletingPub}>
              <Text style={styles.modalDangerText}>{deletingPub ? 'Eliminando...' : 'Eliminar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDeleteModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {errorPopup}
    </View>
  );
}
