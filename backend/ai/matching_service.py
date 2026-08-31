from ai.embeddings import create_embedding
from ai.matcher import calculate_similarity


def build_person_text(person, is_missing=True):

    if is_missing:
        name = person.get("name", "")
    else:
        name = person.get("person_name", "")

    return f"""
    Name: {name}
    Age: {person.get('age', '')}
    Location: {person.get('location', '')}
    District: {person.get('district', '')}
    Description: {person.get('description', '')}
    """
    

def find_matches(missing_people, rescue_reports):

    matches = []

    for missing in missing_people:

        missing_text = build_person_text(
            missing,
            True
        )

        missing_embedding = create_embedding(
            missing_text
        )

        for rescue in rescue_reports:

            rescue_text = build_person_text(
                rescue,
                False
            )

            rescue_embedding = create_embedding(
                rescue_text
            )

            score = calculate_similarity(
                missing_embedding,
                rescue_embedding
            )


            if score >= 70:

                matches.append({

                    "missing_id": missing.get("id"),

                    "missing_name":
                        missing.get("name"),

                    "found_name":
                        rescue.get("person_name"),

                    "confidence":
                        score,

                    "status":
                        "Needs Human Verification"

                })


    return matches