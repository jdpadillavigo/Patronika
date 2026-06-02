import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { PURPLE } from '../styles/CommonStyles';
import { misPatronesStyles as navStyles } from '../styles/MisPatronesStyles';
import ProfileUseCase from '../../domain/usecases/ProfileUseCase';
import SessionUseCase from '../../domain/usecases/SessionUseCase';
import { isSessionExpiredError } from '../../../core/data/networking/ApiClient';

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  // EdiciÃ³n de datos
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState('');
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  // Cambio de contraseÃ±a
  const [expandirPass, setExpandirPass] = useState(false);
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmar, setPassConfirmar] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);
  const [exitoPass, setExitoPass] = useState('');

  useEffect(() => {
    ProfileUseCase.getCurrent()
      .then(u => {
        setUsuario(u);
        setNuevoNombre(u?.username ?? '');
        setNuevaFoto(u?.avatar ?? null);
      })
      .catch(error => {
        if (!isSessionExpiredError(error)) {
          setErrorPerfil(error.message);
        }
      });
  }, []);

  const handlePickFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setNuevaFoto(result.assets[0].uri);
  };

  const handleGuardarPerfil = async () => {
    setErrorPerfil('');
    if (!nuevoNombre.trim()) {
      setErrorPerfil('El nombre de usuario no puede estar vacío');
      return;
    }
    setLoadingPerfil(true);
    try {
      const result = await ProfileUseCase.updateProfile(nuevoNombre.trim(), nuevaFoto);
      if (!result.success) {
        if (result.sessionExpired) return;
        setErrorPerfil(result.error || 'No se pudo actualizar el perfil');
        return;
      }
      setUsuario(result.data);
      setEditando(false);
    } catch (e) {
      setErrorPerfil(e.message);
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleCancelarEdicion = () => {
    setNuevoNombre(usuario?.username ?? '');
    setNuevaFoto(usuario?.avatar ?? null);
    setErrorPerfil('');
    setEditando(false);
  };

  const handleCambiarPassword = async () => {
    setErrorPass('');
    setExitoPass('');
    if (!passActual || !passNueva || !passConfirmar) {
      setErrorPass('Completa todos los campos');
      return;
    }
    if (passNueva !== passConfirmar) {
      setErrorPass('Las contraseñas nuevas no coinciden');
      return;
    }
    if (passNueva.length < 4) {
      setErrorPass('La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }
    setLoadingPass(true);
    try {
      const result = await ProfileUseCase.changePassword(passActual, passNueva, passConfirmar);
      if (!result.success) {
        if (result.sessionExpired) return;
        setErrorPass(result.error || 'No se pudo cambiar la contraseña');
        return;
      }
      setExitoPass('Contraseña actualizada correctamente');
      setPassActual('');
      setPassNueva('');
      setPassConfirmar('');
      setExpandirPass(false);
    } catch (e) {
      setErrorPass(e.message);
    } finally {
      setLoadingPass(false);
    }
  };

  const [modalLogout, setModalLogout] = useState(false);

  const handleLogout = () => {
    setModalLogout(true);
  };

  const handleConfirmarLogout = async () => {
    setModalLogout(false);
    await SessionUseCase.logout(usuario?.id);
    navigation.replace('Login');
  };

  const handleFab = () => {
    navigation.navigate('GenerarPatron');
  };

  const fotoActual = editando ? nuevaFoto : usuario?.avatar;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <View style={navStyles.header}>
        <Text style={navStyles.headerTitle}>Patrónika</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 36, paddingBottom: 48, gap: 24 }}
      >

        {/* AVATAR */}
        <View style={{ alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={editando ? handlePickFoto : undefined} activeOpacity={editando ? 0.7 : 1}>
            <View style={{
              width: 100, height: 100, borderRadius: 50,
              backgroundColor: '#F3EDF4', alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: PURPLE, overflow: 'hidden',
            }}>
              {fotoActual
                ? <Image source={{ uri: fotoActual }} style={{ width: 100, height: 100 }} />
                : <Ionicons name="person" size={56} color={PURPLE} />
              }
            </View>
            {editando && (
              <View style={{
                position: 'absolute', bottom: 2, right: 2,
                backgroundColor: PURPLE, borderRadius: 12, padding: 5,
                borderWidth: 2, borderColor: 'white',
              }}>
                <Ionicons name="camera" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {!editando && (
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111' }}>
              {usuario?.username ?? 'Usuario'}
            </Text>
          )}
        </View>

        {/* DATOS DEL PERFIL */}
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111' }}>Datos del perfil</Text>
            {!editando && (
              <TouchableOpacity onPress={() => setEditando(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="pencil-outline" size={16} color={PURPLE} />
                <Text style={{ color: PURPLE, fontSize: 14, fontWeight: '600' }}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nombre de usuario */}
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="person-outline" size={16} color={PURPLE} />
              <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>NOMBRE DE USUARIO</Text>
            </View>
            {editando ? (
              <TextInput
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  borderWidth: 1.5, borderColor: PURPLE, borderRadius: 10,
                  paddingHorizontal: 14, paddingVertical: 12,
                  fontSize: 15, color: '#111',
                }}
              />
            ) : (
              <Text style={{
                fontSize: 15, color: '#111',
                paddingVertical: 12, paddingHorizontal: 14,
                borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10,
                backgroundColor: '#FAFAFA',
              }}>
                {usuario?.username ?? 'Usuario'}
              </Text>
            )}
          </View>

          {/* Correo (solo lectura) */}
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="mail-outline" size={16} color={PURPLE} />
              <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>CORREO ELECTRÓNICO</Text>
            </View>
            <Text style={{
              fontSize: 15, color: '#888',
              paddingVertical: 12, paddingHorizontal: 14,
              borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10,
              backgroundColor: '#FAFAFA',
            }}>
              {usuario?.email ?? 'Email'}
            </Text>
          </View>

          {errorPerfil ? (
            <Text style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center' }}>{errorPerfil}</Text>
          ) : null}

          {/* Botones edición */}
          {editando && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <TouchableOpacity
                onPress={handleCancelarEdicion}
                style={{
                  flex: 1, borderWidth: 1.5, borderColor: '#CCC',
                  borderRadius: 10, paddingVertical: 13, alignItems: 'center',
                }}
              >
                <Text style={{ color: '#666', fontSize: 14, fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGuardarPerfil}
                disabled={loadingPerfil}
                style={{
                  flex: 1, backgroundColor: PURPLE,
                  borderRadius: 10, paddingVertical: 13, alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                  {loadingPerfil ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* CAMBIAR CONTRASEÑA */}
        <View style={{ borderTopWidth: 1, borderTopColor: '#EFEFEF', paddingTop: 20, gap: 14 }}>
          <TouchableOpacity
            onPress={() => { setExpandirPass(v => !v); setErrorPass(''); setExitoPass(''); }}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="lock-closed-outline" size={18} color={PURPLE} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111' }}>Cambiar contraseña</Text>
            </View>
            <Ionicons name={expandirPass ? 'chevron-up' : 'chevron-down'} size={20} color="#999" />
          </TouchableOpacity>

          {expandirPass && (
            <View style={{ gap: 12 }}>
              {/* Contraseña actual */}
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>CONTRASEÑA ACTUAL</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1.5, borderColor: PURPLE, borderRadius: 10,
                  paddingHorizontal: 14, paddingVertical: 12,
                }}>
                  <TextInput
                    value={passActual}
                    onChangeText={setPassActual}
                    secureTextEntry={!mostrarActual}
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: 15, color: '#111' }}
                    placeholder="Contraseña actual"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarActual(v => !v)}>
                    <Ionicons name={mostrarActual ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nueva contraseÃ±a */}
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>NUEVA CONTRASEÑA</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1.5, borderColor: PURPLE, borderRadius: 10,
                  paddingHorizontal: 14, paddingVertical: 12,
                }}>
                  <TextInput
                    value={passNueva}
                    onChangeText={setPassNueva}
                    secureTextEntry={!mostrarNueva}
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: 15, color: '#111' }}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarNueva(v => !v)}>
                    <Ionicons name={mostrarNueva ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar nueva */}
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>CONFIRMAR NUEVA CONTRASEÑA</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 1.5, borderColor: PURPLE, borderRadius: 10,
                  paddingHorizontal: 14, paddingVertical: 12,
                }}>
                  <TextInput
                    value={passConfirmar}
                    onChangeText={setPassConfirmar}
                    secureTextEntry={!mostrarConfirmar}
                    autoCapitalize="none"
                    style={{ flex: 1, fontSize: 15, color: '#111' }}
                    placeholder="Repite la nueva contraseña"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarConfirmar(v => !v)}>
                    <Ionicons name={mostrarConfirmar ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {errorPass ? (
                <Text style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center' }}>{errorPass}</Text>
              ) : null}
              {exitoPass ? (
                <Text style={{ color: '#27ae60', fontSize: 13, textAlign: 'center' }}>{exitoPass}</Text>
              ) : null}

              <TouchableOpacity
                onPress={handleCambiarPassword}
                disabled={loadingPass}
                style={{
                  backgroundColor: PURPLE, borderRadius: 10,
                  paddingVertical: 14, alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                  {loadingPass ? 'Actualizando...' : 'Actualizar contraseña'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            borderWidth: 1.5, borderColor: PURPLE,
            borderRadius: 12, paddingVertical: 15,
            alignItems: 'center', flexDirection: 'row',
            justifyContent: 'center', gap: 8,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={PURPLE} />
          <Text style={{ color: PURPLE, fontSize: 15, fontWeight: 'bold' }}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={navStyles.navBar}>
        <View style={navStyles.navLeft}>
          <TouchableOpacity
            style={navStyles.navItem}
            onPress={() => navigation.navigate('MisPatrones')}
          >
            <Ionicons name="grid-outline" size={24} color="#AAA" />
            <Text style={navStyles.navLabel}>Patrones</Text>
          </TouchableOpacity>
        </View>

        <View style={navStyles.navCenter} />

        <View style={navStyles.navRight}>
          <TouchableOpacity style={navStyles.navItem}>
            <Ionicons name="person-outline" size={24} color={PURPLE} />
            <Text style={[navStyles.navLabel, navStyles.navLabelActivo]}>Mi perfil</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={navStyles.fab}
          onPress={handleFab}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="camera-plus" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal de confirmación de cierre de sesión */}
      <Modal
        visible={modalLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setModalLogout(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 32,
            alignItems: 'center',
            width: '100%',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
          }}>
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              borderWidth: 2.5, borderColor: PURPLE,
              justifyContent: 'center', alignItems: 'center',
              marginBottom: 16,
            }}>
              <Ionicons name="log-out-outline" size={30} color={PURPLE} />
            </View>

            <Text style={{
              fontSize: 18, fontWeight: '800', color: '#1A1A1A',
              textAlign: 'center', lineHeight: 26, marginBottom: 8,
            }}>
              ¿Cerrar sesión?
            </Text>

            <Text style={{
              fontSize: 14, color: '#666',
              textAlign: 'center', marginBottom: 28,
            }}>
              ¿Estás seguro de que deseas cerrar sesión?
            </Text>

            <TouchableOpacity
              onPress={handleConfirmarLogout}
              style={{
                backgroundColor: PURPLE, borderRadius: 10,
                paddingVertical: 14, width: '100%',
                alignItems: 'center', marginBottom: 12,
              }}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalLogout(false)}
              style={{
                borderWidth: 1.5, borderColor: PURPLE, borderRadius: 10,
                paddingVertical: 14, width: '100%', alignItems: 'center',
              }}
            >
              <Text style={{ color: PURPLE, fontSize: 15, fontWeight: '700' }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

