import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

const ImageReader = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showIndicator, setShowIndicator] = useState(true);
  const hideIndicatorTimeout = useRef(null);

  const images = [
    { url: "", props: { source: require("../../imgs/test.jpg") } },
    { url: "", props: { source: require("../../imgs/test2.jpg") } },
  ];

  const handlePageChange = (index) => {
    setCurrentIndex(index + 1);
    showPageIndicator();
  };

  const showPageIndicator = () => {
    setShowIndicator(true);
    clearTimeout(hideIndicatorTimeout.current);

    hideIndicatorTimeout.current = setTimeout(() => {
      setShowIndicator(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hideIndicatorTimeout.current); // Clear timeout on unmount
    };
  }, []);

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={images}
        enableSwipeDown={false}
        backgroundColor="#fff"
        renderIndicator={() => null}
        saveToLocalByLongPress={false}
        onChange={handlePageChange}
      />

      {showIndicator && (
        <View style={styles.indicatorContainer}>
          <Text style={styles.pageIndicator}>
            الصفحة {currentIndex} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ImageReader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
