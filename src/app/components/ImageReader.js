import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const ImageReader = ({ subject, lecture }) => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isIndicatorVisible, setIsIndicatorVisible] = useState(true); // Track visibility of the indicator
  const cacheKey = `${subject}_${lecture}`;
  let hideTimeout;

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

    // Clean up timeout on component unmount
    return () => clearTimeout(hideTimeout);
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

  const handlePageChange = (index) => {
    setCurrentPage(index + 1);
    setIsIndicatorVisible(true);

    // Clear any previous timeout
    if (hideTimeout) clearTimeout(hideTimeout);

    // Set a new timeout to hide the indicator after 3 seconds
    hideTimeout = setTimeout(() => {
      setIsIndicatorVisible(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <>
          <ImageViewer
            imageUrls={images}
            enableSwipeDown={false}
            backgroundColor="#fff"
            renderIndicator={() => null}
            saveToLocalByLongPress={false}
            onChange={handlePageChange} // Track page changes
          />
          {isIndicatorVisible && (
            <View style={styles.pageIndicator}>
              <Text style={styles.pageText}>
                {currentPage} / {images.length}
              </Text>
            </View>
          )}
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageIndicator: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  pageText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ImageReader;
