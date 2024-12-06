import json
import numpy as np
import tensorflow as tf
from generate import generate_full_itinerary


# Load the char_to_index and index_to_char mappings from JSON files
def load_char_mappings():
    with open('char_mappings/char_to_index.json', 'r') as f:
        char_to_index = json.load(f)
    with open('char_mappings/index_to_char.json', 'r') as f:
        index_to_char = json.load(f)
    return char_to_index, index_to_char

# Generate itinerary from the starting prompt
def generate_itinerary(starting_prompt):
    # Load char mappings
    char_to_index, index_to_char = load_char_mappings()
    
    # Ensure the prompt is within the allowed characters
    input_indices = [char_to_index.get(char, -1) for char in starting_prompt]
    input_indices = [index for index in input_indices if index != -1]
    
    # Check if the indices are valid for the model
    max_valid_index = len(char_to_index) - 1  # Maximum valid index
    input_indices = [index for index in input_indices if 0 <= index <= max_valid_index]
    
    # Ensure that the input is not empty after validation
    if not input_indices:
        raise ValueError("No valid characters in the input prompt.")

    # Call the generate_full_itinerary function to generate the itinerary
    itinerary = generate_full_itinerary(starting_prompt, input_indices, char_to_index, index_to_char)
    
    return itinerary

if __name__ == '__main__':
    # Example of a starting prompt for the itinerary
    starting_prompt = " e"
    
    try:
        itinerary = generate_itinerary(starting_prompt)
        print("Generated itinerary:", itinerary)
    except Exception as e:
        print(f"Error: {e}")
