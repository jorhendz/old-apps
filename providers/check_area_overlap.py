from .models import Area, PostalCode

for area1 in Area.objects.all():
    print(area1)
    for area2 in Area.objects.all():
        if not area1 == area2:
            overlap = PostalCode.objects.intersection(
                area1.postal_codes.all(), area2.postal_codes.all()
            )
            print(area2, end="\t")
            print("Overlap count: ", overlap.count(), end="\t")
            if overlap.count() > 0:
                print("For instance:", [o.number for o in overlap.all()[:5]], end="")

            print()
    print()
