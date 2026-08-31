def calculate_final_score(
    text_score,
    missing,
    found
):

    score = text_score


    # Age comparison
    missing_age = missing.get("age")
    found_age = found.get("age")


    if missing_age and found_age:

        try:

            age_difference = abs(
                int(missing_age) - int(found_age)
            )


            if age_difference == 0:
                score += 5

            elif age_difference <= 2:
                score += 3

            elif age_difference <= 5:
                score -= 5

            else:
                score -= 15


        except:

            pass



    # Location comparison

    missing_location = (
        missing.get("location","")
        .lower()
    )

    found_location = (
        found.get("location","")
        .lower()
    )


    if missing_location and found_location:

        if missing_location == found_location:
            score += 5

        elif (
            missing_location in found_location
            or found_location in missing_location
        ):
            score += 2

        else:
            score -= 5



    # Keep score between 0-100

    score = max(
        0,
        min(
            100,
            score
        )
    )


    return round(
        score,
        2
    )