import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const FeatureImportanceChart = ({ data }) => {
  // Feature importance data from the XGBoost model (filtered from CSV)
  // Excluding customerIDs and zero-importance features
  const featureData = data && data.length > 0 ? data : [
    { feature: 'PaymentMethod_Electronic check', importance: 0.1514 },
    { feature: 'InternetService_Fiber optic', importance: 0.0423 },
    { feature: 'Contract_Two year', importance: 0.0375 },
    { feature: 'Partner_Yes', importance: 0.0323 },
    { feature: 'PaperlessBilling_Yes', importance: 0.0308 },
    { feature: 'ChargeLevel_Medium-Low', importance: 0.0305 },
    { feature: 'Tenure_Charges_Ratio', importance: 0.0297 },
    { feature: 'HasPartner_or_Dependents', importance: 0.0269 },
    { feature: 'HasPartner_and_Dependents', importance: 0.0237 },
    { feature: 'Contract_One year', importance: 0.0202 },
    { feature: 'PhoneService_Yes', importance: 0.0186 },
    { feature: 'MultipleLines_No phone service', importance: 0.0184 },
    { feature: 'StreamingMovies_Yes', importance: 0.0175 },
    { feature: 'Dependents_Yes', importance: 0.0155 },
    { feature: 'PaymentMethod_Credit card (automatic)', importance: 0.0147 }
  ];

  // Sort by importance descending
  const sortedData = [...featureData].sort((a, b) => b.importance - a.importance);

  // Colors for bars
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFE194',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
    '#F1C40F', '#E74C3C', '#1ABC9C', '#9B59B6', '#34495E'
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: 0, color: '#FF6B6B' }}>
            Importance: {payload[0].value.toFixed(4)}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            {(payload[0].value * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const maxImportance = sortedData[0]?.importance || 1;
  const totalImportance = sortedData.reduce((sum, item) => sum + item.importance, 0);

  return (
    <div style={{ width: '100%', height: 600, padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        Feature Importance Analysis - XGBoost Model
      </h2>
      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 180, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" tickFormatter={(value) => value.toFixed(2)} />
          <YAxis 
            type="category" 
            dataKey="feature" 
            width={170}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="importance" 
            name="Importance Score"
            fill="#8884d8"
            barSize={20}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Statistics */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div style={statCardStyle}>
          <h4>Total Features</h4>
          <p>{featureData.length}</p>
        </div>
        <div style={statCardStyle}>
          <h4>Top Feature</h4>
          <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{sortedData[0]?.feature}</p>
          <small>Importance: {sortedData[0]?.importance?.toFixed(4)}</small>
        </div>
        <div style={statCardStyle}>
          <h4>Bottom Feature</h4>
          <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{sortedData[sortedData.length - 1]?.feature}</p>
          <small>Importance: {sortedData[sortedData.length - 1]?.importance?.toFixed(4)}</small>
        </div>
        <div style={statCardStyle}>
          <h4>Total Importance</h4>
          <p>{totalImportance.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

const statCardStyle = {
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export default FeatureImportanceChart;

