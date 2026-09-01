import torch
import open_clip
from PIL import Image


model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="laion2b_s34b_b79k"
)


def create_image_embedding(image_path):

    image = Image.open(
        image_path
    ).convert("RGB")


    image = preprocess(
        image
    ).unsqueeze(0)


    with torch.no_grad():

        embedding = model.encode_image(
            image
        )


    embedding /= embedding.norm(
        dim=-1,
        keepdim=True
    )


    return embedding[0].tolist()