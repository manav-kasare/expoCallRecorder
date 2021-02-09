import React from "react";
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Audio } from "expo-av";
const sound = new Audio.Sound();
import * as Linking from "expo-linking";

const url = "tel:7208651881";

export default function App() {
  const [recording, setRecording] = React.useState(null);
  const [onCall, setOnCall] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [uri, setUri] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePhoneCall = async () => {
    setShow(false);
    setIsPlaying(false);
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
      setOnCall(true);
    } else {
      alert(`Can't call`);
    }
  };

  const startRecording = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === "granted") {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        console.log("Starting recording..");
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recording.startAsync();
        setRecording(recording);
        console.log("Recording started");
      } catch (err) {
        alert("startRecording err", err);
      }
    } else {
      alert(`Permission not granted`);
    }
  };

  const handleStopRecording = async () => {
    setOnCall(false);
    console.log("Stopping recording...");
    await recording.stopAndUnloadAsync();
    const _uri = recording.getURI();
    setRecording(null);
    setUri(_uri);
    setShow(true);
    console.log("Recording stopped and stored at", uri);
  };

  const handleCallNow = async () => {
    await handlePhoneCall();
    await startRecording();
  };

  const playAudio = async () => {
    setIsPlaying(true);
    await sound.loadAsync({ uri });
    await sound.playAsync();
  };

  const stopAudio = async () => {
    setIsPlaying(false);
    await sound.unloadAsync();
  };

  return (
    <SafeAreaView style={styles.container}>
      {show ? (
        <View style={styles.tile}>
          <Text style={{ marginVertical: 10 }}>{uri}</Text>
          <Button
            title={isPlaying ? "Stop" : "Play"}
            onPress={isPlaying ? stopAudio : playAudio}
          />
        </View>
      ) : (
        <></>
      )}

      <View style={styles.button}>
        <Button
          title={onCall ? "Stop recording" : "Call Now"}
          onPress={onCall ? handleStopRecording : handleCallNow}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  tile: {
    marginTop: 15,
  },
  button: {
    position: "absolute",
    bottom: 50,
  },
});
