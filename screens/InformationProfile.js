import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { db } from "../firebaseConfig";
import { updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from "../providers/AuthProvider";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Yup from "yup";

const InformationProfile = ({ navigation }) => {

  const { userData, setUserData } = useContext(AuthContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // This manages the date

  const userSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().required("Email is required"),
    phone_number: Yup.string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(11, "Must be at least 11 digits")
      .required("Phone number is required"),
    date_of_birth: Yup.date().required("Date of Birth is required"),
  });

  const handleRegistration = async (values) => {
    const userRef = doc(db, "users", userData.uid);

    try {
      await updateDoc(userRef, {
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        email: values.email,
        phone_number: values.phone_number,
        date_of_birth: values.date_of_birth,
      });

      setUserData((prevData) => ({
        ...prevData,
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        email: values.email,
        phone_number: values.phone_number,
        date_of_birth: values.date_of_birth,
      }));

      console.log(userData);

      Alert.alert("Success", "User Information Updated Successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);

    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update user information. Please try again.");
    }

    console.log(values);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.header}>Edit Information</Text>

        <Formik
          initialValues={{
            first_name: userData.first_name,
            last_name: userData.last_name,
            gender: userData.gender,
            email: userData.email,
            phone_number: userData.phone_number,
            date_of_birth: selectedDate, // Manage the date via selectedDate state
          }}
          validationSchema={userSchema}
          onSubmit={handleRegistration}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
          }) => (
            <View>
              {/* First Name */}
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("first_name")}
                onBlur={handleBlur("first_name")}
                value={userData.first_name}
                placeholder="Enter first name"
              />
              {touched.first_name && errors.first_name && (
                <Text style={styles.error}>{errors.first_name}</Text>
              )}

              {/* Last Name */}
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("last_name")}
                onBlur={handleBlur("last_name")}
                value={userData.last_name}
                placeholder="Enter last name"
              />
              {touched.last_name && errors.last_name && (
                <Text style={styles.error}>{errors.last_name}</Text>
              )}

              {/* Email */}
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="Enter email address"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              {/* Phone Number */}
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("phone_number")}
                onBlur={handleBlur("phone_number")}
                value={values.phone_number}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
              {touched.phone_number && errors.phone_number && (
                <Text style={styles.error}>{errors.phone_number}</Text>
              )}

              {/* Gender */}
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("gender")}
                onBlur={handleBlur("gender")}
                value={values.gender}
                placeholder="Enter Gender"
              />
              {touched.gender && errors.gender && (
                <Text style={styles.error}>{errors.gender}</Text>
              )}

              {/* Date of Birth */}
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text>
                  {values.date_of_birth
                    ? values.date_of_birth.toLocaleDateString()
                    : "Select Date of Birth"}
                </Text>
              </TouchableOpacity>
              {touched.date_of_birth && errors.date_of_birth && (
                <Text style={styles.error}>{errors.date_of_birth}</Text>
              )}

              {/* DatePicker using DateTimePicker */}
              {datePickerVisible && (
                <DateTimePicker
                  mode="date"
                  value={selectedDate}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setSelectedDate(selectedDate);
                      setFieldValue("date_of_birth", selectedDate);
                    }
                    setDatePickerVisible(false);
                  }}
                />
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "5%",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#09320a",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    fontSize: 12,
    color: "#ff0000",
    marginBottom: 10,
  },
});

export default InformationProfile;
