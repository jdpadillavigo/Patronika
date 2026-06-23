import React, { useState, useMemo, useRef } from 'react';
import {
    View, Text, TouchableOpacity,
    FlatList, Dimensions, type ViewToken,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../../core/presentation/designsystem/Theme';
import { createOnboardingStyles } from '../styles/OnboardingStyles';
import type { RootStackParamList } from '../../../../main/navigationTypes';

const { width } = Dimensions.get('window');

const ONBOARDING_KEY = '@patronika_onboarding_done';

interface Slide {
    id: string;
    icon: string;
    title: string;
    description: string;
}

const SLIDES: Slide[] = [
    {
        id: '1',
        icon: '👋',
        title: '¡Bienvenido a Patrónika!',
        description:
            'Tu herramienta para crear patrones de tejido a partir de cualquier imagen.',
    },
    {
        id: '2',
        icon: '📸',
        title: 'Sube una imagen',
        description:
            'Toma una foto o selecciona de tu galería. Patrónika la convertirá en un patrón paso a paso.',
    },
    {
        id: '3',
        icon: '🎨',
        title: 'Genera tu patrón',
        description:
            'Obtén un patrón listo para tejer en técnicas como tapestry crochet, filet crochet e intarsia.',
    },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
    const { colors } = useAppTheme();
    const styles = useMemo(() => createOnboardingStyles(colors), [colors]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList<Slide>>(null);

    const isLastSlide = currentIndex === SLIDES.length - 1;

    const handleNext = () => {
        if (isLastSlide) {
            handleFinish();
        } else {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    const handleSkip = () => {
        handleFinish();
    };

    const handleFinish = async () => {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken<Slide>[] }) => {
            if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index ?? 0);
            }
        },
    ).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const renderSlide = ({ item }: { item: Slide }) => (
        <View style={[styles.slideContainer, { width }]}>
            <View style={styles.iconContainer}>
                <Text style={styles.iconText}>{item.icon}</Text>
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                bounces={false}
            />

            {/* Footer */}
            <View style={styles.footer}>
                {/* Dots indicator */}
                <View style={styles.dotsContainer}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Buttons */}
                {isLastSlide ? (
                    <TouchableOpacity style={styles.startButton} onPress={handleFinish}>
                        <Text style={styles.startButtonText}>Empezar</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                            <Text style={styles.skipButtonText}>Saltar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                            <Text style={styles.nextButtonText}>Siguiente</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
