from ai.embeddings import create_embedding
from ai.matcher import calculate_similarity


person1 = """
Name: Ram Bahadur Thapa
Age: 35
Location: Dhading
Description: Wearing blue jacket
"""


person2 = """
Name: Ram B Thapa
Age: 36
Location: Dhading
Description: Blue coat
"""


embedding1 = create_embedding(person1)
embedding2 = create_embedding(person2)


score = calculate_similarity(
    embedding1,
    embedding2
)


print(
    f"Similarity score: {score}%"
)