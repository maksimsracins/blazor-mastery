import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { YouTubeRef } from '../types';
import { C } from '../constants/colors';

interface YouTubeCardProps {
  yt: YouTubeRef;
}

export default function YouTubeCard({ yt }: YouTubeCardProps) {
  const url = `https://www.youtube.com/watch?v=${yt.videoId}`;
  const thumb = `https://img.youtube.com/vi/${yt.videoId}/mqdefault.jpg`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.75}
      accessibilityLabel={`Watch: ${yt.title} on ${yt.channel}`}
    >
      <View style={styles.thumb}>
        <Image source={{ uri: thumb }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.playOverlay}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FF0000">
            <Path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9C22 15.1 22 12 22 12s0-3.1-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
          </Svg>
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>{yt.title}</Text>
        <Text style={styles.channel}>{yt.channel}</Text>
      </View>
      <Text style={styles.duration}>{yt.duration}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.bgCode,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 10,
    minHeight: 44,
  },
  thumb: {
    width: 56,
    height: 36,
    backgroundColor: '#1A1A1E',
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playOverlay: {
    position: 'absolute',
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: C.ink2,
  },
  channel: {
    fontSize: 11,
    color: C.inkDim,
    marginTop: 2,
  },
  duration: {
    fontSize: 11,
    color: C.inkDim,
    flexShrink: 0,
  },
});
