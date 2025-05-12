import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const BusinessInformationScreen = ({ navigation }) => {
  const [sellerType, setSellerType] = React.useState('Sole Proprietorship');
  const [vatStatus, setVatStatus] = React.useState('VAT Registered');

  const handleSubmit = () => {
    Alert.alert('Success', 'Business Information Saved Successfully!');
    navigation.navigate('RegistrationSuccess');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerText}>Business Information</Text>
        <TouchableOpacity onPress={handleSubmit}>
          {/* <Text style={styles.saveText}>Save</Text> */}
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          This information will be used to ensure proper compliance to seller onboarding requirements to e-marketplace
          and invoicing purposes.
        </Text>
      </View>

      <View style={styles.formWrapper}>
        {/* Seller Type */}
        <Text style={styles.label}>Seller Type *</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity onPress={() => setSellerType('Sole Proprietorship')} style={styles.radioButton}>
            <View style={[styles.radioCircle, sellerType === 'Sole Proprietorship' && styles.radioSelected]}>
              {sellerType === 'Sole Proprietorship' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Sole Proprietorship</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSellerType('Partnership / Corporation')} style={styles.radioButton}>
            <View style={[styles.radioCircle, sellerType === 'Partnership / Corporation' && styles.radioSelected]}>
              {sellerType === 'Partnership / Corporation' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Partnership / Corporation</Text>
          </TouchableOpacity>
        </View>

        {/* Registered Name */}
        <Text style={styles.label}>Registered Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name, First Name (e.g., Dela Cruz, Juan) / ABC, Inc."
        />

        {/* Address */}
        <Text style={styles.label}>Address *</Text>
        <TouchableOpacity style={styles.inputButton}>
          <Text style={styles.inputButtonText}>Set</Text>
        </TouchableOpacity>

        {/* TIN */}
        <Text style={styles.label}>Taxpayer Identification Number (TIN) *</Text>
        <TextInput style={styles.input} placeholder="Input" />

        {/* VAT Status */}
        <Text style={styles.label}>Value Added Tax Registration Status *</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity onPress={() => setVatStatus('VAT Registered')} style={styles.radioButton}>
            <View style={[styles.radioCircle, vatStatus === 'VAT Registered' && styles.radioSelected]}>
              {vatStatus === 'VAT Registered' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>VAT Registered</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setVatStatus('Non-VAT Registered')} style={styles.radioButton}>
            <View style={[styles.radioCircle, vatStatus === 'Non-VAT Registered' && styles.radioSelected]}>
              {vatStatus === 'Non-VAT Registered' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Non-VAT Registered</Text>
          </TouchableOpacity>
        </View>

        {/* BIR Certificate */}
        <Text style={styles.label}>BIR Certificate of Registration *</Text>
        <TouchableOpacity style={styles.inputButton}>
          <Text style={styles.inputButtonText}>Upload Photo</Text>
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveText: {
    fontSize: 16,
    color: '#09320a',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#d9ead3',
    padding: 12,
    borderRadius: 5,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold'
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  inputButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputButtonText: {
    fontSize: 14,
    color: '#555',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#09320a',
  },
  radioSelected: {
    borderColor: '#09320a',
  },
  radioLabel: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  backButton: {
    backgroundColor: 'black',
  },
  submitButton: {
    backgroundColor: '#09320a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessInformationScreen;