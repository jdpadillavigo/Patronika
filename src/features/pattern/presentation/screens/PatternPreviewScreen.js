import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { useAppTheme } from '../../../../core/presentation/designsystem/Theme';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createVistaPreviaStyles, vistaPreviaStyles as styles, PURPLE } from '../styles/PatternPreviewStyles';
import { useGeneratePatternFlow } from '../../../../main/GeneratePatternFlowContext';
import { gridDataToImageUri } from '../../../../core/presentation/designsystem/utils/GridImage';
import PatternUseCase from '../../domain/usecases/PatternUseCase';

export default function VistaPreviaScreen({navigation, route }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createVistaPreviaStyles(colors), [colors]);
  const { closeFlow, acceptPattern } = useGeneratePatternFlow();
  const { patronUrl, imageUri, pattern } = route?.params || {};
  const [generatedUri, setGeneratedUri] = useState(null);
  const [isRenderingPattern, setIsRenderingPattern] = useState(Boolean(pattern?.gridData));
  const discardStartedRef = useRef(false);
  const allowRemoveRef = useRef(false);
  const previewUri = generatedUri || patronUrl || (!isRenderingPattern ? imageUri : null);

  const discardPattern = useCallback(async () => {
    if (!pattern?.id || discardStartedRef.current) return;
    discardStartedRef.current = true;
    try {
      await PatternUseCase.discard(pattern.id);
    } catch {
      // Permite completar la navegación incluso si el backend no responde.
    }
  }, [pattern?.id]);

  const closeAndDiscard = async () => {
    await discardPattern();
    allowRemoveRef.current = true;
    closeFlow();
  };

  const cancelAndDiscard = async () => {
    await discardPattern();
    navigation.goBack();
  };

  const acceptAndClose = () => {
    allowRemoveRef.current = true;
    acceptPattern();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (allowRemoveRef.current) return;

      event.preventDefault();
      discardPattern().finally(() => {
        allowRemoveRef.current = true;
        navigation.dispatch(event.data.action);
      });
    });

    return unsubscribe;
  }, [discardPattern, navigation]);

  useEffect(() => {
    let mounted = true;

    if (!pattern?.gridData) {
      setIsRenderingPattern(false);
      return () => {
        mounted = false;
      };
    }

    setIsRenderingPattern(true);
    setTimeout(() => {
      const uri = gridDataToImageUri(pattern.gridData);
      if (mounted) {
        setGeneratedUri(uri);
        setIsRenderingPattern(false);
      }
    }, 0);

    return () => {
      mounted = false;
    };
  }, [pattern?.gridData]);

  return (
    <View style={styles.safeArea}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vista previa</Text>
        <TouchableOpacity onPress={closeAndDiscard} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color={Colors.fixedWhite} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.patternContainer}>
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={styles.patternImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.patternPlaceholder}>
              <ActivityIndicator size="large" color={PURPLE} />
              <Text style={styles.placeholderText}>
                {isRenderingPattern ? 'Preparando vista previa...' : 'Generando patrón...'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.buttonSolid}
            onPress={acceptAndClose}
          >
            <Text style={styles.buttonSolidText}>Aceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={cancelAndDiscard}
          >
            <Text style={styles.buttonOutlineText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
