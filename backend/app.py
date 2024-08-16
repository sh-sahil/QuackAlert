from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the model

with open(r"C:\Users\sahil\Downloads\earthquake_regressor_model.pkl",'rb') as file:

    model = pickle.load(file)
                                
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    longitude = data['longitude']
    latitude = data['latitude']
    depth = data['depth']

    significance  = data['significance']
    
    # Prepare the input for the model
    input_data = np.array([[longitude, latitude, depth, significance]])

    
    # Predict using the loaded model
    magnitude = model.predict(input_data)[0]
    
    return jsonify({'magnitude': magnitude})

if __name__ == '__main__':
    app.run(debug=True, port=8001)
