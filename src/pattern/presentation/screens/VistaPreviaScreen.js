import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vistaPreviaStyles as styles, PURPLE } from '../styles/VistaPreviaStyles';
import { useGeneratePatternFlow } from '../../../core/navigation/GeneratePatternFlowContext';
import { gridDataToImageUri } from '../utils/GridImage';
import PatternUseCase from '../../domain/usecases/PatternUseCase';

export default function VistaPreviaScreen({ navigation, route }) {
  const { closeFlow, acceptPattern } = useGeneratePatternFlow();
  const { patronUrl, imageUri, pattern } = route?.params || {};
  const [generatedUri, setGeneratedUri] = useState(null);
  const [isRenderingPattern, setIsRenderingPattern] = useState(Boolean(pattern?.gridData));
  const previewUri = generatedUri || patronUrl || (!isRenderingPattern ? imageUri : null);

  const discardPattern = async () => {
    if (pattern?.id) {
      await PatternUseCase.discard(pattern.id);
    }
  };

  const closeAndDiscard = async () => {
    await discardPattern();
    closeFlow();
  };

  const cancelAndDiscard = async () => {
    await discardPattern();
    navigation.goBack();
  };

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vista previa</Text>
        <TouchableOpacity onPress={closeAndDiscard} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="white" />
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
            onPress={acceptPattern}
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
    </SafeAreaView>
  );
}
