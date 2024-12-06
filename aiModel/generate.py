import numpy as np
import tensorflow as tf
import json

# Load char_to_index and index_to_char mappings
def load_char_mappings():
    with open('char_mappings/char_to_index.json', 'r') as f:
        char_to_index = json.load(f)
    with open('char_mappings/index_to_char.json', 'r') as f:
        index_to_char = json.load(f)
    return char_to_index, index_to_char

def sample(predictions, temperature=1.0, top_k=5):
    predictions = np.asarray(predictions).astype("float64")
    predictions = predictions / temperature

    # Top-k sampling
    top_k_indices = predictions.argsort()[-top_k:][::-1]  # Get the top k indices
    top_k_probs = np.exp(predictions[top_k_indices])  # Apply softmax to the top k logits
    top_k_probs /= np.sum(top_k_probs)  # Normalize to make it a probability distribution

    return np.random.choice(top_k_indices, p=top_k_probs)


# Generate the itinerary from the given starting prompt
def generate_full_itinerary(starting_prompt, input_indices, char_to_index, index_to_char, seq_length=32, temperature=1.0):
    model = tf.keras.models.load_model('model/itinerary_model')  # Load the pre-trained model
    
    # Prepare the input data (reshape and pad if necessary)
    input_indices = np.array(input_indices)
    input_indices = np.reshape(input_indices, (1, len(input_indices), 1))  # Reshaping for batch size 1 and correct dimensions

    # Ensure input data fits within the model's expectations
    max_valid_index = len(char_to_index) - 1  # Maximum valid index
    input_indices = np.clip(input_indices, 0, max_valid_index)
    
    # Generate the itinerary prompt by predicting the next characters
    itinerary = starting_prompt
    for _ in range(seq_length):
        # Get model predictions
        predictions = model(input_indices)  # Model prediction (batch size 1, seq_length, vocab_size)

        # For each time step, apply temperature sampling to get the next predicted character
        predicted_logits = predictions[0, -1]  # Get the logits for the last predicted character
        
        # Print logits for debugging
        print(f"Logits: {predicted_logits}")
        
        predicted_index = sample(predicted_logits, temperature=temperature)  # Sample an index using temperature

        # Convert the predicted index to the corresponding character
        predicted_char = index_to_char[str(predicted_index)]

        # Append the predicted character to the itinerary
        itinerary += predicted_char

        # Update the input_indices for the next prediction (moving window)
        input_indices = np.roll(input_indices, -1, axis=1)  # Shift left by 1 in the sequence
        input_indices[0, -1, 0] = predicted_index  # Add the predicted character index at the end

    return itinerary


# For testing the generation
if __name__ == "__main__":
    starting_prompt = ""
    char_to_index, index_to_char = load_char_mappings()
    input_indices = [char_to_index[char] for char in starting_prompt]
    
    itinerary = generate_full_itinerary(starting_prompt, input_indices, char_to_index, index_to_char, temperature=1)
    print("Generated itinerary:", itinerary)
