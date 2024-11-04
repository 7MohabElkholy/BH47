import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const ImageReader = ({ subject, lecture }) => {
  const [images, setImages] = useState([]);
  const cacheKey = `${subject}_${lecture}`;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const cachedPaths = await SecureStore.getItemAsync(cacheKey);
        if (cachedPaths) {
          const paths = JSON.parse(cachedPaths);
          setImages(paths.map((path) => ({ url: path })));
        } else {
          const urls = await downloadAndCacheImages();
          setImages(urls);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [subject, lecture]);

  const downloadAndCacheImages = async () => {
    const path = `/lectures/${subject}/${lecture}`;
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);

    const cacheDir = `${FileSystem.documentDirectory}.cacheImages`;
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });

    const urls = await Promise.all(
      result.items.map(async (itemRef) => {
        const filePath = `${cacheDir}/${itemRef.name}`;
        const fileUri = `${FileSystem.documentDirectory}.cacheImages/${itemRef.name}`;
        const fileExists = await FileSystem.getInfoAsync(fileUri);

        if (!fileExists.exists) {
          const url = await getDownloadURL(itemRef);
          const { uri } = await FileSystem.downloadAsync(url, fileUri);
          return { url: uri };
        }
        return { url: fileUri };
      })
    );

    const paths = urls.map(({ url }) => url);
    await SecureStore.setItemAsync(cacheKey, JSON.stringify(paths));
    return urls;
  };

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <ImageViewer
          imageUrls={images}
          enableSwipeDown={false}
          backgroundColor="#fff"
          renderIndicator={() => null}
        />
      ) : (
        <Text>Loading images...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default ImageReader;
