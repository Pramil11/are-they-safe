from ai.combined_matcher import calculate_match


MATCH_THRESHOLD = 70


def find_matches(
    missing_people,
    rescue_reports
):

    matches = []


    for missing in missing_people:

        for rescue in rescue_reports:


            result = calculate_match(
                missing,
                rescue
            )


            if result["final_score"] >= MATCH_THRESHOLD:

                result["missing_id"] = missing.get("id")
                result["rescue_id"] = rescue.get("id")

                matches.append(result)


    matches.sort(
        key=lambda x:x["final_score"],
        reverse=True
    )


    return matches