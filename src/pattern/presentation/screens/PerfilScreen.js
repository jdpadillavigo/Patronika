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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { PURPLE } from '../styles/CommonStyles';
import ProfileUseCase from '../../domain/usecases/ProfileUseCase';
import SessionUseCase from '../../domain/usecases/SessionUseCase';

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
    ProfileUseCase.getCurrent().then(u => {
      setUsuario(u);
      setNuevoNombre(u?.username ?? '');
      setNuevaFoto(u?.avatar ?? null);
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
      setErrorPerfil('El nombre de usuario no puede estar vacÃ­o');
      return;
    }
    setLoadingPerfil(true);
    try {
      const result = await ProfileUseCase.updateProfile(nuevoNombre.trim(), nuevaFoto);
      if (!result.success) {
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
      setErrorPass('Las contraseÃ±as nuevas no coinciden');
      return;
    }
    if (passNueva.length < 4) {
      setErrorPass('La nueva contraseÃ±a debe tener al menos 4 caracteres');
      return;
    }
    setLoadingPass(true);
    try {
      const result = await ProfileUseCase.changePassword(passActual, passNueva, passConfirmar);
      if (!result.success) {
        setErrorPass(result.error || 'No se pudo cambiar la contrasena');
        return;
      }
      setExitoPass('ContraseÃ±a actualizada correctamente');
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

  const handleLogout = async () => {
    await SessionUseCase.logout(usuario?.id);
    navigation.replace('Login');
  };

  const fotoActual = editando ? nuevaFoto : usuario?.avatar;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      {/* Header */}
      <View style={{
        backgroundColor: PURPLE,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Mi perfil</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 36, paddingBottom: 48, gap: 24 }}>

        {/* â”€â”€ AVATAR â”€â”€ */}
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
              {usuario?.username ?? 'â€”'}
            </Text>
          )}
        </View>

        {/* â”€â”€ DATOS DEL PERFIL â”€â”€ */}
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
                {usuario?.username ?? 'â€”'}
              </Text>
            )}
          </View>

          {/* Correo (solo lectura) */}
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="mail-outline" size={16} color={PURPLE} />
              <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>CORREO ELECTRÃ“NICO</Text>
            </View>
            <Text style={{
              fontSize: 15, color: '#888',
              paddingVertical: 12, paddingHorizontal: 14,
              borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 10,
              backgroundColor: '#FAFAFA',
            }}>
              {usuario?.email ?? 'â€”'}
            </Text>
          </View>

          {errorPerfil ? (
            <Text style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center' }}>{errorPerfil}</Text>
          ) : null}

          {/* Botones ediciÃ³n */}
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

        {/* â”€â”€ CAMBIAR CONTRASEÃ‘A â”€â”€ */}
        <View style={{ borderTopWidth: 1, borderTopColor: '#EFEFEF', paddingTop: 20, gap: 14 }}>
          <TouchableOpacity
            onPress={() => { setExpandirPass(v => !v); setErrorPass(''); setExitoPass(''); }}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="lock-closed-outline" size={18} color={PURPLE} />
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111' }}>Cambiar contraseÃ±a</Text>
            </View>
            <Ionicons name={expandirPass ? 'chevron-up' : 'chevron-down'} size={20} color="#999" />
          </TouchableOpacity>

          {expandirPass && (
            <View style={{ gap: 12 }}>
              {/* ContraseÃ±a actual */}
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>CONTRASEÃ‘A ACTUAL</Text>
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
                    placeholder="ContraseÃ±a actual"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarActual(v => !v)}>
                    <Ionicons name={mostrarActual ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nueva contraseÃ±a */}
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>NUEVA CONTRASEÃ‘A</Text>
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
                    placeholder="Nueva contraseÃ±a"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarNueva(v => !v)}>
                    <Ionicons name={mostrarNueva ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar nueva */}
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>CONFIRMAR NUEVA CONTRASEÃ‘A</Text>
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
                    placeholder="Repite la nueva contraseÃ±a"
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
                  {loadingPass ? 'Actualizando...' : 'Actualizar contraseÃ±a'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* â”€â”€ CERRAR SESIÃ“N â”€â”€ */}
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
          <Text style={{ color: PURPLE, fontSize: 15, fontWeight: 'bold' }}>Cerrar sesiÃ³n</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

