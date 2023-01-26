import django
from .models import PostalCode, Provider, Area
from typing import Dict, Tuple, List, Set

# These are the default ranges chosen if no relevant Area is defined
region_ranges: Dict[str, Tuple[int, int]] = {
    "Hovedstaden": (1000, 2999),
    "Midtjylland": (7000, 8999),
    "Sjælland": (3000, 4999),
    "Fyn": (5000, 5999),
    "Sønderjylland": (
        6000,
        6799,
    ),  # An arbitrary line drawn on the map decided on the phone
    "Nordjylland": (9000, 9999),
}

region_pcs: Dict[str, django.db.models.query.QuerySet] = {
    name: PostalCode.objects.filter(number__lte=upper, number__gte=lower).all()
    for (name, (lower, upper)) in region_ranges.items()
}

# If an area is defined that has one of the region names,
# we will use those instead of the default ranges
for key in region_pcs.keys():
    try:
        area = Area.objects.get(name=key)
        print("Found an area", area.name, "which is used instead of default range")
        region_pcs[key] = area.postal_codes.all()

    except Area.DoesNotExist:
        print("We didn't have an area", key, "using default range ", region_ranges[key])
        pass

print("Starting migration")
unhandled_regions: List[str] = []
unknown_postal_codes: Set[int] = set()
for provider in Provider.objects.all():
    provider.postal_codes.set([])
    for region in provider.regions.all():
        if region.name in region_pcs.keys():
            provider.postal_codes.add(*region_pcs[region.name])
            provider.save()
        elif region.name not in unhandled_regions:
            print(region.name, 'is unhandled')
            unhandled_regions.append(region.name)

        if provider.contact_postal_code:
            contact_postal_code = provider.contact_postal_code
            if 1000 <= contact_postal_code and contact_postal_code <= 9999:
                try:
                    pc = PostalCode.objects.get(number=contact_postal_code)
                    provider.postal_codes.add(pc)
                    provider.save()
                except Exception as e:
                    if str(e).startswith("PostalCode matching query does not exist"):
                        unknown_postal_codes.add(contact_postal_code)
                    else:
                        print(e)
                        quit(1)

print("We didn't know these postal codes")
print(unknown_postal_codes)
