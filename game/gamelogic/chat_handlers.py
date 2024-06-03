from typing import Dict, List


async def input_handler(data: Dict) -> List[bool]:
    """
    Main chat handler

    If the function is a command, run it
    If it isn't, pass the message to the message handler
    """
    data["message"]
    is_command = False

    if not is_command:
        return [True]
