from ai.image_embeddings import create_image_embedding
from ai.image_matcher import calculate_image_similarity


img1 = "uploads/beckham_clean.png"
img2 = "uploads/jlo_adv_eps_1.png"


embedding1 = create_image_embedding(img1)

embedding2 = create_image_embedding(img2)


score = calculate_image_similarity(
    embedding1,
    embedding2
)


print(
    "Image similarity:",
    score,
    "%"
)