from ai.embeddings import create_embedding
from ai.matcher import calculate_similarity

from ai.image_embeddings import create_image_embedding
from ai.image_matcher import calculate_image_similarity

from ai.scoring import calculate_final_score



def get_image_path(photo_url):

    if not photo_url:
        return None

    return photo_url



def calculate_match(
    missing,
    rescue
):

    missing_text = f"""
    Name: {missing.get('name','')}
    Age: {missing.get('age','')}
    Location: {missing.get('location','')}
    District: {missing.get('district','')}
    Description:
    {missing.get('description','')}
    """


    rescue_text = f"""
    Name: {rescue.get('person_name','')}
    Age: {rescue.get('age','')}
    Location: {rescue.get('location','')}
    District: {rescue.get('district','')}
    Description:
    {rescue.get('description','')}
    """


    missing_embedding = create_embedding(
        missing_text
    )

    rescue_embedding = create_embedding(
        rescue_text
    )


    text_score = calculate_similarity(
        missing_embedding,
        rescue_embedding
    )

    image_score = None


    missing_image = get_image_path(
        missing.get("photo_url")
    )

    rescue_image = get_image_path(
        rescue.get("photo_url")
    )


    if missing_image and rescue_image:

        try:

            missing_image_embedding = (
                create_image_embedding(
                    missing_image
                )
            )


            rescue_image_embedding = (
                create_image_embedding(
                    rescue_image
                )
            )


            image_score = calculate_image_similarity(
                missing_image_embedding,
                rescue_image_embedding
            )

        except Exception as e:

            print(
                "Image comparison failed:",
                e
            )

    if image_score is not None:

        final_score = (
            text_score * 0.6
            +
            image_score * 0.4
        )

    else:

        final_score = text_score



    final_score = calculate_final_score(
        final_score,
        missing,
        rescue
    )


    return {

        "missing_name":
            missing.get("name"),

        "found_name":
            rescue.get("person_name"),

        "text_score":
            text_score,

        "image_score":
            image_score,

        "final_score":
            final_score,

        "status":
            "Needs Human Verification"

    }