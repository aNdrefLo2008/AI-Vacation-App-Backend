import tensorflow as tf
import numpy as np
import pandas as pd
import json

# Load dataset
data_path = 'data/travel_data.csv'
df = pd.read_csv(data_path)

additional_phrases = [
    "Paris",
    "Visit the Eiffel Tower",
    "One of the most iconic landmarks in the world.",
    "1 day",
    "Tokyo",
    "Explore the Shibuya Crossing",
    "The busiest pedestrian crossing in the world.",
    "3 hours",
    "New York",
    "Visit Central Park",
    "A large public park in the heart of NYC.",
    "Half day",
    "London",
    "Visit the British Museum",
    "A world-famous museum housing historical artifacts.",
    "2 hours"
]

# Tokenize text
text = '\n'.join(df['activity'] + ": " + df['description'] + " (" + df['duration'] + ")")
text += "\n".join(additional_phrases)

vocab = sorted(set(text))  # Get unique characters
char_to_index = {char: index for index, char in enumerate(vocab)}
index_to_char = {index: char for index, char in enumerate(vocab)}

# Save char_to_index and index_to_char to JSON files
with open('char_mappings/char_to_index.json', 'w') as f:
    json.dump(char_to_index, f)

with open('char_mappings/index_to_char.json', 'w') as f:
    json.dump(index_to_char, f)

text_as_int = np.array([char_to_index[char] for char in text])

# Prepare dataset for training
seq_length = 100
examples_per_epoch = len(text) // seq_length

char_dataset = tf.data.Dataset.from_tensor_slices(text_as_int)

# Create sequences of length 'seq_length'
sequences = char_dataset.batch(seq_length, drop_remainder=True)

# Reshape the data to have the correct input shape for the LSTM
# The LSTM expects a shape of (batch_size, seq_length, 1)
sequences = sequences.map(lambda x: tf.expand_dims(x, -1))  # Add the 'features' dimension, making it 3D

# Build the RNN model
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(len(vocab), 256, batch_input_shape=[None, None]),  # Embedding layer
    tf.keras.layers.LSTM(512, return_sequences=True, stateful=False),  # LSTM layer
    tf.keras.layers.Dense(len(vocab))  # Output layer
])

# Compile the model
model.compile(optimizer='adam', loss=tf.losses.SparseCategoricalCrossentropy(from_logits=True))

# Train the model
epochs = 10
for epoch in range(epochs):
    for batch_n, sequence in enumerate(sequences):
        with tf.GradientTape() as tape:
            predictions = model(sequence)
            loss = tf.reduce_mean(
                tf.nn.sparse_softmax_cross_entropy_with_logits(labels=sequence, logits=predictions)
            )
        gradients = tape.gradient(loss, model.trainable_variables)
        model.optimizer.apply_gradients(zip(gradients, model.trainable_variables))

    print(f"Epoch {epoch+1}/{epochs} - Loss: {loss.numpy():.4f}")

# Save the trained model
model.save('model/itinerary_model')
