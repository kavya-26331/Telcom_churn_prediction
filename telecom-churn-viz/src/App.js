import React, { useState } from "react";
import axios from "axios";
import './App.css';

// Set API URL based on environment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [formData, setFormData] = useState({
    // Numeric fields
    tenure: 0,
    MonthlyCharges: 0,
    TotalCharges: 0,
    
    // Categorical fields with proper options
    paperless_billing: "No",
    gender: "Male",
    has_partner: "No",
    has_dependents: "No",
    SeniorCitizen: "No",
    has_phone: "Yes",
    
    // Services with multiple options
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    
    // Contract and Payment
    Contract: "Month-to-month",
    PaymentMethod: "Electronic check"
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle changes for all input types
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Predict churn
  const predictChurn = async () => {
    setLoading(true);
    setPrediction(null);

    try {
      // Use the API_URL from environment variable
      const response = await axios.post(
        `${API_URL}/predict`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setPrediction(response.data);
      console.log('Prediction response:', response.data);

    } catch (error) {
      console.error('API Error:', error);
      console.error('Error details:', error.response || error.message);
      
      let errorMessage = "Error making prediction. ";
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage += "Cannot connect to backend server. Please ensure the backend is running.";
      } else if (error.response) {
        errorMessage += `Server error: ${error.response.status}`;
      } else {
        errorMessage += error.message;
      }
      
      setPrediction({
        prediction: "Error",
        churn_probability: 0,
        risk_level: "Error",
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };


  // Styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: '#1a237e',
      padding: '30px',
      color: 'white',
      textAlign: 'center',
      borderRadius: '10px 10px 0 0',
      marginBottom: '20px'
    },
    formCard: {
      backgroundColor: '#f8f9fa',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    section: {
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
      color: '#1a237e',
      borderBottom: '2px solid #1a237e',
      paddingBottom: '10px',
      marginBottom: '20px',
      fontSize: '1.2rem',
      fontWeight: 'bold'
    },
    fieldGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '15px'
    },
    field: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '5px',
      color: '#333',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ced4da',
      fontSize: '1rem',
      transition: 'border-color 0.15s ease-in-out'
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ced4da',
      fontSize: '1rem',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    button: {
      width: '100%',
      padding: '15px',
      backgroundColor: loading ? '#6c757d' : '#1a237e',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginTop: '20px',
      transition: 'background-color 0.15s ease-in-out'
    },
    predictionCard: {
      marginTop: '30px',
      padding: '25px',
      borderRadius: '10px',
      textAlign: 'center',
      animation: 'fadeIn 0.5s'
    },
    probabilityBar: {
      width: '100%',
      height: '20px',
      backgroundColor: '#e9ecef',
      borderRadius: '10px',
      marginTop: '15px',
      overflow: 'hidden'
    },
    probabilityFill: {
      height: '100%',
      backgroundColor: '#1a237e',
      transition: 'width 0.3s ease-in-out'
    },
    factorList: {
      listStyle: 'none',
      padding: 0,
      marginTop: '20px',
      textAlign: 'left'
    },
    factorItem: {
      padding: '8px 12px',
      marginBottom: '5px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      borderLeft: '3px solid #1a237e'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <header style={styles.header}>
        <h1>📞 Telecom Customer Churn Prediction</h1>
        <p>Enter customer details to predict churn probability</p>
      </header>
      
      <main>
        <div style={styles.formCard}>
          
          {/* Customer Information Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Customer Information</h3>
            <div style={styles.fieldGroup}>
              <div style={styles.field}>
                <label style={styles.label}>Tenure (months) *</label>
                <input
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  style={styles.input}
                  placeholder="e.g., 12"
                />
              </div>
              
              <div style={styles.field}>
                <label style={styles.label}>Monthly Charges ($) *</label>
                <input
                  type="number"
                  name="MonthlyCharges"
                  value={formData.MonthlyCharges}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  style={styles.input}
                  placeholder="e.g., 65.50"
                />
              </div>
              
              <div style={styles.field}>
                <label style={styles.label}>Total Charges ($) *</label>
                <input
                  type="number"
                  name="TotalCharges"
                  value={formData.TotalCharges}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  style={styles.input}
                  placeholder="e.g., 1500.75"
                />
              </div>
            </div>
          </div>

          {/* Demographics Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Demographics</h3>
            <div style={styles.fieldGroup}>
              <div style={styles.field}>
                <label style={styles.label}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={styles.select}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Senior Citizen</label>
                <select name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleChange} style={styles.select}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Has Partner</label>
                <select name="has_partner" value={formData.has_partner} onChange={handleChange} style={styles.select}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Has Dependents</label>
                <select name="has_dependents" value={formData.has_dependents} onChange={handleChange} style={styles.select}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Account Information</h3>
            <div style={styles.fieldGroup}>
              <div style={styles.field}>
                <label style={styles.label}>Contract Type</label>
                <select name="Contract" value={formData.Contract} onChange={handleChange} style={styles.select}>
                  <option value="Month-to-month">Month-to-month</option>
                  <option value="One year">One year</option>
                  <option value="Two year">Two year</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Payment Method</label>
                <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} style={styles.select}>
                  <option value="Electronic check">Electronic check</option>
                  <option value="Mailed check">Mailed check</option>
                  <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                  <option value="Credit card (automatic)">Credit card (automatic)</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Paperless Billing</label>
                <select name="paperless_billing" value={formData.paperless_billing} onChange={handleChange} style={styles.select}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Has Phone Service</label>
                <select name="has_phone" value={formData.has_phone} onChange={handleChange} style={styles.select}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Services</h3>
            
            <div style={styles.fieldGroup}>
              <div style={styles.field}>
                <label style={styles.label}>Internet Service</label>
                <select name="InternetService" value={formData.InternetService} onChange={handleChange} style={styles.select}>
                  <option value="DSL">DSL</option>
                  <option value="Fiber optic">Fiber optic</option>
                  <option value="No">No internet service</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Multiple Lines</label>
                <select name="MultipleLines" value={formData.MultipleLines} onChange={handleChange} style={styles.select}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No phone service">No phone service</option>
                </select>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              {[
                { label: "Online Security", name: "OnlineSecurity" },
                { label: "Online Backup", name: "OnlineBackup" },
                { label: "Device Protection", name: "DeviceProtection" },
                { label: "Tech Support", name: "TechSupport" },
                { label: "Streaming TV", name: "StreamingTV" },
                { label: "Streaming Movies", name: "StreamingMovies" }
              ].map((field) => (
                <div key={field.name} style={styles.field}>
                  <label style={styles.label}>{field.label}</label>
                  <select 
                    name={field.name} 
                    value={formData[field.name]} 
                    onChange={handleChange} 
                    style={styles.select}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Predict Button */}
          <button 
            onClick={predictChurn}
            disabled={loading}
            style={styles.button}
          >
            {loading ? '🔄 Predicting...' : '🔮 Predict Churn'}
          </button>

          {/* Prediction Display */}
          {prediction && (
            <div style={{
              ...styles.predictionCard,
              backgroundColor: prediction.prediction === 'Not Churn' ? '#d4edda' : 
                             prediction.prediction === 'Churn' ? '#f8d7da' : '#fff3cd',
              border: `1px solid ${
                prediction.prediction === 'Not Churn' ? '#c3e6cb' : 
                prediction.prediction === 'Churn' ? '#f5c6cb' : '#ffeeba'
              }`
            }}>
              <h2 style={{ 
                color: prediction.prediction === 'Not Churn' ? '#155724' : 
                       prediction.prediction === 'Churn' ? '#721c24' : '#856404',
                margin: '0 0 15px 0' 
              }}>
                {prediction.prediction === 'Churn' ? '⚠️ High Risk of Churn' : 
                 prediction.prediction === 'Not Churn' ? '✅ Low Risk of Churn' : 
                 '❌ Prediction Error'}
              </h2>
              
              {prediction.churn_probability !== undefined && (
                <>
                  <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>
                    Churn Probability: <strong>{(prediction.churn_probability * 100).toFixed(1)}%</strong>
                  </p>
                  
                  <div style={styles.probabilityBar}>
                    <div style={{
                      ...styles.probabilityFill,
                      width: `${prediction.churn_probability * 100}%`
                    }} />
                  </div>

                  <p style={{ 
                    color: prediction.risk_level === 'High' ? '#dc3545' : 
                           prediction.risk_level === 'Medium' ? '#fd7e14' : '#28a745',
                    fontWeight: 'bold',
                    marginTop: '10px'
                  }}>
                    Risk Level: {prediction.risk_level}
                  </p>
                </>
              )}

              {prediction.top_factors && (
                <div>
                  <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Top Influencing Factors:</h4>
                  <ul style={styles.factorList}>
                    {prediction.top_factors.map((factor, index) => (
                      <li key={index} style={styles.factorItem}>
                        <strong>{factor.feature.replace('_', ' ')}:</strong> {factor.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prediction.message && (
                <p style={{ color: '#856404', marginTop: '10px' }}>{prediction.message}</p>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
