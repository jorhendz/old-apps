from typing import List
import logging

from .models import Provider, PostalCode


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(message)s')


def set_logger_filename(filename):
    fh = logging.FileHandler(f'providers/logs/{filename}', mode='w')
    for hdlr in logger.handlers[:]:  # remove all old handlers
        logger.removeHandler(hdlr)
    fh.setFormatter(formatter)
    logger.addHandler(fh)


def postal_codes_for_provider(provider) -> List[PostalCode]:
    areas = provider.area.all()
    list_of_lists = [postal_codes_in_area(area) for area in areas]
    # Return all the postal codes as a one-dimensional list
    return sum(list_of_lists, [])


def print_provider(provider):
    print(provider.name)
    print(provider.area.all())
    print(provider.postal_codes.all())
    print()


def log_provider(provider):
    logger.debug(provider.id)
    logger.debug(provider.name)
    logger.debug(provider.area.all())
    for pc in provider.postal_codes.all():
        logger.debug(f'{pc.number} - {pc.name}')
    logger.debug('\n')


def get_problem_providers():
    """Get all providers that used the previous area form
    to set their area manually"""
    all_providers = Provider.objects.all()
    problem_providers = []
    for p in all_providers:
        len_area = p.area.all().count()
        if len_area > 0:
            problem_providers.append(p)
    return problem_providers


def postal_codes_in_area(area):
    queryset = area.postal_codes.all()
    return [pc for pc in queryset]


def debug_provider(provider):
    # Take care not to lose any previously set postal codes
    new_postal_codes = postal_codes_for_provider(provider)

    set_logger_filename(f'{provider.id}.log')
    logger.debug("Before fix:")
    log_provider(provider)

    logger.debug("After fix:")
    for pc in new_postal_codes:
        logger.debug(f'{pc.number} - {pc.name}')

    print('Fixed ' + provider.name)


def fix_provider(provider):
    """Remove the old (wrong) postal codes
    and add the new ones"""

    # Take care not to lose any previously set postal codes
    new_postal_codes = postal_codes_for_provider(provider)
    provider.postal_codes.add(*new_postal_codes)
    print('Fixed ' + provider.name)


provider = Provider.objects.get(pk=4441)
# fix_provider(provider)
problem_providers = get_problem_providers()
for pp in problem_providers:
    fix_provider(pp)
