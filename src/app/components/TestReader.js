import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import CustomModal from "../features/modal/CustomModal"; // import your custom modal component

const TestReader = ({ testData, subjectKey }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  if (!testData) return <Text>Loading test...</Text>;

  const handleSelectAnswer = (questionId, option) => {
    if (showResult) return; // Prevent selecting answers after submission
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const saveTestResult = async (result) => {
    try {
      const storedResults = await SecureStore.getItemAsync(subjectKey);
      const parsedResults = storedResults ? JSON.parse(storedResults) : [];

      // Add the current result with timestamp
      parsedResults.push({
        testName: testData.testTitle,
        timestamp: new Date().toISOString(),
        grade: result.correctAnswers, // Grade based on correct answers
        totalQuestions: result.totalQuestions,
      });

      await SecureStore.setItemAsync(subjectKey, JSON.stringify(parsedResults));
    } catch (error) {
      console.error("Error saving test result:", error);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    testData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const result = {
      totalQuestions: testData.questions.length,
      correctAnswers: correctCount,
      wrongAnswers: testData.questions.length - correctCount,
    };

    const message = `تم حفظ تقريرك! \n\n الإجابات الصحيحة ${correctCount}\nالإجابات الخاطئة ${result.wrongAnswers}\n\n يمكنك رؤية تقريقك في الشاشاة الرئيسية`;

    setModalMessage(message);
    setModalVisible(true); // Show the modal

    saveTestResult(result); // Save the result to Secure Store
    setShowResult(true);
  };

  const handleModalClose = () => {
    setModalVisible(false); // Close the modal when the user presses the button
  };

  const getOptionStyle = (question, option) => {
    const isSelected = selectedAnswers[question.id] === option;
    const isCorrect = option === question.correctAnswer;
    const isWrong = isSelected && !isCorrect;

    if (showResult) {
      if (isCorrect) {
        return [styles.option, styles.correctOption]; // Green background for correct answers
      }
      if (isWrong) {
        return [styles.option, styles.wrongOption]; // Red background for wrong answers
      }
    }

    return [
      styles.option,
      isSelected && styles.selectedOption, // Blue background for selected option
    ];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{testData.testTitle}</Text>
      {testData.questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
          {question.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(question, option)} // Apply dynamic styles based on selection and correctness
              onPress={() => handleSelectAnswer(question.id, option)}
              disabled={showResult} // Disable selecting after submission
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>تحقق من النتائج</Text>
      </TouchableOpacity>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </ScrollView>
  );
};

export default TestReader;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Tajawal-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  questionContainer: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontFamily: "Tajawal-Medium",
    marginBottom: 8,
    lineHeight: 24,
  },
  option: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    backgroundColor: "#cce5ff",
    borderColor: "#0056b3",
  },
  correctOption: {
    backgroundColor: "#c8e6c9", // Light green
    borderColor: "#388e3c", // Green border
  },
  wrongOption: {
    backgroundColor: "#f8d7da", // Light red
    borderColor: "#e53935", // Red border
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Tajawal-Regular",
  },

  submitBtn: {
    width: "100%",
    backgroundColor: "#327FE9",
    padding: 8,
    borderRadius: 16,
    elevation: 5,
    marginBottom: 32,
  },

  submitText: {
    fontFamily: "Tajawal-Bold",
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
});
