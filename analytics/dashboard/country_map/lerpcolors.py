def translate_to_new_range(value, old_min, old_max, new_min, new_max):
    """
    I want to change the value 0.2 to a number between 42 and 18,
    with 18 being the highest number.
    The old range was [0; 1]:

    translate(0.2, 0, 1, 42, 18) -> 37.2

    and if I let 42 be the highest number of the new range:

    translate(0.2, 0, 1, 18, 42) -> 22.8
    """
    # Figure out how 'wide' each range is
    old_range = old_max - old_min
    new_range = new_max - new_min

    # Convert the left range into a 0-1 range (float)
    value_scaled = float(value - old_min) / float(old_range)

    # Convert the 0-1 range into a value in the right range.
    return new_min + (value_scaled * new_range)
