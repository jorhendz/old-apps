from .models import Provider
from django.core.exceptions import ValidationError

cleaned, total = 0, 0
for provider in Provider.objects.all():
    try:
        provider.clean()
        provider.save()
        cleaned += 1

    except ValidationError as err:
        print(f"Error in {provider.pk}\t{err}")

    total += 1

print(f"Successfuly cleaned {cleaned}/{total} providers")
