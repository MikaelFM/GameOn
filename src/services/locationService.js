import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@gameon_user_location';

let cached = null;
let initPromise = null;

async function _doInit() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) cached = JSON.parse(saved);
  } catch {}

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return cached;

  try {
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    cached = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    try {
      const last = await Location.getLastKnownPositionAsync();
      if (last) cached = { latitude: last.coords.latitude, longitude: last.coords.longitude };
    } catch {}
  }
  return cached;
}

export function initLocation() {
  if (!initPromise) initPromise = _doInit();
  return initPromise;
}

export function getCachedLocation() {
  return cached;
}
