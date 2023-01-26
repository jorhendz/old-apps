"""
With this one, we want to know:

For each municipality that has Providers (tilbud):
    For each Provider:
        How many PageViews does that provider have?
"""
import os
from collections import Counter

from providers.models import Municipality, Provider
from analytics.models import PageViewEvent
from analytics import timestamps


def pad(tup: tuple, indent=0) -> str:
    width = 64
    return '{}{:{}s}{}\n'.format(indent * ' ', str(tup[0]), width - indent, str(tup[1]))


def write_to_file(text: str, name: str):
    file_name = (
        name.replace('\'', '')
        .replace('\"', '')
        .replace('\`', '')
        .replace(' ', '_')
        .lower()
    )

    folder = os.path.join('.', 'reports')
    if not os.path.exists(folder):
        os.mkdir(folder)
    elif not os.path.isdir(folder):
        print(f'Creating the {folder} folder')
        return
    f = open(os.path.join(folder, file_name), 'w+')
    f.write(text)
    f.close()
    print(f'Wrote reports/{file_name}')


def about_provider(p: Provider):
    pageview_events = PageViewEvent.objects.filter(
        page_path=f'/provider/{p.id}/')
    count = pageview_events.count()
    dimension, metric = p.name, count
    # print(f'{p.name}: {count} pageviews')
    return pad((dimension, metric), indent=4)


def provider_report(p: Provider):
    file_name = f'{p}_pageviews.txt'
    title = f'Pageviews for ************{p}************\n\n'
    write_to_file(title + about_provider(p), file_name)


def providers_report(m: Municipality) -> None:
    providers = Provider.objects.filter(owned_by=m)
    content_text = ''.join([about_provider(p) for p in providers])

    file_name = f'{m}_pageviews.txt'
    title = 'Pageviews for ************{m}************\n\n'
    write_to_file(title + content_text, file_name)


""" 
flora1 = Provider.objects.get(
    name='Florafamilie, Center for Udvikling og Integration')
flora2 = Provider.objects.get(name='Opholdsstedet Florahuset')
provider_report(flora1)
provider_report(flora2) """


""" start_date = timestamps.get_datetime(2022, 4, 1)
end_date = timestamps.get_datetime(2022, 12, 1) """


""" 
from analytics.scripts.provider_report import *
"""
