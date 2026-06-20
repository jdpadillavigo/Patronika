import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  SafeAreaView, StatusBar, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { detalleStyles as styles, PURPLE } from '../styles/PublicacionDetalleStyles';
import CommentUseCase from '../../domain/usecases/CommentUseCase';
import PublicationUseCase from '../../domain/usecases/PublicationUseCase';
import ApiClient from '../../../core/data/networking/ApiClient';
import { gridDataToImageUri } from '../utils/GridImage';

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Avatar del autor de un comentario.
// Muestra la foto de perfil si está disponible, si no muestra la inicial.
function CommentAvatar({ username, imageUrl }) {
  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={styles.commentAvatarImage} />;
  }
  return (
    <View style={styles.commentAvatar}>
      <Text style={styles.commentAvatarText}>{(username || '?')[0].toUpperCase()}</Text>
    </View>
  );
}

export default function PublicacionDetalleScreen({ navigation, route }) {
  const { publication: initialPub, publicationId } = route.params || {};
  const [pub] = useState(initialPub);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPub, setDeletingPub] = useState(false);
  const [fullscreenUri, setFullscreenUri] = useState(null);
  const [fullscreenLoading, setFullscreenLoading] = useState(false); // spinner mientras carga imagen en fullscreen

  // Abre el visor fullscreen activando el spinner en el mismo toque,
  // antes de que el Modal se renderice, para dar feedback inmediato al usuario.
  const openFullscreen = (uri) => {
    setFullscreenLoading(true);
    setFullscreenUri(uri);
  };
  const inputRef = useRef(null);

  useEffect(() => {
    ApiClient.getCurrentUser().then(u => setCurrentUserId(u?.id || null));
  }, []);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    const result = await CommentUseCase.loadForPublication(publicationId);
    if (result.success) setComments(result.data);
    setLoadingComments(false);
  }, [publicationId]);

  useEffect(() => { loadComments(); }, [loadComments]);

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
    Alert.alert('Eliminar comentario', '¿Seguro que quieres eliminar este comentario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          const result = await CommentUseCase.deleteComment(commentId);
          if (result.success) setComments(prev => prev.filter(c => c.id !== commentId));
        },
      },
    ]);
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

  // Imagen 1: foto real del resultado (subida por el usuario al publicar)
  const resultImageUri = pub?.imageUrl || null;
  // Imagen 2: el patrón generado, convertido de gridData (JSON) a imagen en el cliente
  const patternImageUri = pub?.pattern?.gridData
    ? gridDataToImageUri(pub.pattern.gridData, { maxDimension: 600 })
    : null;

  const isOwnPublication = pub?.user?.id && currentUserId && pub.user.id === currentUserId;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicación</Text>
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

          {/* Foto del resultado (si existe) */}
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
              {pub?.user?.profileImageUrl ? (
                <Image source={{ uri: pub.user.profileImageUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(pub?.user?.username || '?')[0].toUpperCase()}</Text>
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
            {pub?.pattern?.name && (
              <Text style={styles.patternName}>Patrón: {pub.pattern.name}</Text>
            )}

            <View style={styles.divider} />

            <Text style={styles.commentsTitle}>
              Comentarios {comments.length > 0 ? `(${comments.length})` : ''}
            </Text>

            {loadingComments ? (
              <ActivityIndicator color={PURPLE} style={{ marginVertical: 16 }} />
            ) : comments.length === 0 ? (
              <Text style={styles.noComments}>Sé el primero en comentar</Text>
            ) : (
              comments.map(comment => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <CommentAvatar username={comment.user?.username} imageUrl={comment.user?.profileImageUrl} />
                    <Text style={styles.commentAuthor}>@{comment.user?.username}</Text>
                    {comment.user?.id === currentUserId && (
                      <View style={styles.commentActions}>
                        <TouchableOpacity style={styles.commentActionBtn} onPress={() => handleEditComment(comment)}>
                          <Ionicons name="pencil-outline" size={14} color="#888" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn} onPress={() => handleDeleteComment(comment.id)}>
                          <Ionicons name="trash-outline" size={14} color="#E53935" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                </View>
              ))
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
        statusBarTranslucent
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
    </SafeAreaView>
  );
}
