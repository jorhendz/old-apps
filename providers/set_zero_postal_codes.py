from providers.models import Provider

for p in Provider.objects.filter(contact_postal_code=0).all():
    p.contact_postal_code = None
    p.save()
