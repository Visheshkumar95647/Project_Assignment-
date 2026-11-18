from datetime import datetime


def log_register(user_email: str, room_id: int):
    """
    Log registration details.
    """

    with open("booking.log", "a") as file:
        file.write(
            f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | "
            f"INFO | "
            f"Email: {user_email:<18} | "
            f"Room ID: {room_id} | "
            f"Registration Successful\n"
        )