from collections import Counter
from typing import Union


SPACING = 45


def pad(tup: tuple, indent=0) -> str:
    width = 50
    return '{}{:{}s}{}\n'.format(indent * ' ', str(tup[0]), width - indent, str(tup[1]))


class Report:
    def write_chunk(chunk: list[tuple]):
        pass
