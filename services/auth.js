import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@patronika_users';
const SESSION_KEY = '@patronika_session';

export async function register({ username, email, password }) {
  const stored = await AsyncStorage.getItem(USERS_KEY);
  const users = stored ? JSON.parse(stored) : [];

  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('El nombre de usuario ya está en uso');
  }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('El correo ya está registrado');
  }

  const newUser = { id: String(Date.now()), username, email, password };
  const updated = [...users, newUser];
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));

  // Verificación: confirma que se guardó correctamente
  const check = await AsyncStorage.getItem(USERS_KEY);
  console.log('[Auth] Usuarios guardados:', check);

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return newUser;
}

export async function login({ username, password }) {
  const stored = await AsyncStorage.getItem(USERS_KEY);
  console.log('[Auth] Usuarios en storage al hacer login:', stored);

  const users = stored ? JSON.parse(stored) : [];

  const user = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) {
    console.log('[Auth] No se encontró usuario con:', { username, password });
    throw new Error('Usuario o contraseña incorrectos');
  }

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function getSession() {
  const stored = await AsyncStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function updateProfile({ userId, username, avatar }) {
  const stored = await AsyncStorage.getItem(USERS_KEY);
  const users = stored ? JSON.parse(stored) : [];

  const others = users.filter(u => u.id !== userId);
  if (others.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Ese nombre de usuario ya está en uso');
  }

  const updated = users.map(u => u.id === userId ? { ...u, username, avatar: avatar ?? u.avatar } : u);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));

  const newSession = updated.find(u => u.id === userId);
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
}

export async function changePassword({ userId, currentPassword, newPassword }) {
  const stored = await AsyncStorage.getItem(USERS_KEY);
  const users = stored ? JSON.parse(stored) : [];

  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('Usuario no encontrado');
  if (user.password !== currentPassword) throw new Error('La contraseña actual es incorrecta');

  const updated = users.map(u => u.id === userId ? { ...u, password: newPassword } : u);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));

  const newSession = updated.find(u => u.id === userId);
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
}
