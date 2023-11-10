import React from 'react';
import { View, Text } from 'react-native';
import YouTube from 'react-native-youtube'; 

export default function TrailerPlayer({ videoKey }) {
  if (!videoKey) {
    return (
      <View style={{ backgroundColor: 'black', height: 200, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>Trailer não disponível</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <YouTube
        videoId={videoKey}
        play
        fullscreen
        loop
        style={{ alignSelf: 'stretch', flex: 1 }}
      />
    </View>
  );
}
