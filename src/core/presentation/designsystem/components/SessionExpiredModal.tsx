import React from 'react';
import Colors from '../Colors';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';
import { useAppTheme } from '../Theme';

interface Props {
    visible: boolean;
    onAccept: () => void;
}

export default function SessionExpiredModal({ visible, onAccept }: Props) {
    const { colors } = useAppTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onAccept}>
            <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modalCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
                    <View style={styles.modalIconContainer}>
                        <Ionicons name="time" size={36} color={PURPLE} />
                    </View>

                    <Text style={[styles.modalTitle, { color: colors.textHeading }]}>Sesión cerrada</Text>
                    <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>Se le cerró la sesión por inactividad.</Text>

                    <TouchableOpacity style={styles.modalButton} onPress={onAccept}>
                        <Text style={styles.modalButtonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    modalCard: {
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
    },
    modalIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 2.5,
        borderColor: PURPLE,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButton: {
        backgroundColor: PURPLE,
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 40,
        alignItems: 'center',
        width: '100%',
        elevation: 3,
        shadowColor: PURPLE,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    modalButtonText: {
        color: Colors.fixedWhite,
        fontSize: 15,
        fontWeight: '700',
    },
});
