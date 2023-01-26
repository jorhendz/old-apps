from .models import Provider

"""
22. April 2022:
profiler: 1304
profiler uden velkomsttekst: 1154
begyndere: 1249
begyndere uden velkomsttekst: 1139
basis brugere: 48
basis brugere uden velkomsttekst: 13
eksperter: 7
eksperter uden velkomsttekst: 2

Give all providers without a welcome message a default one
"""

without_msg = Provider.objects.filter(welcome_message='')

counter = 0
for provider in without_msg:
    assert provider.welcome_message == ''
    provider.welcome_message = Provider.default_welcome_msg
    provider.save()
    counter += 1

print(f'{counter} providers affected')


# import providers.add_welcome_messages
