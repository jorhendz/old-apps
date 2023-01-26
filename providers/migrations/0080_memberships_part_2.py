# Generated by Django 3.2.12 on 2022-04-24 14:17

from django.db import migrations

# Do not import any models, since they may be gone next time
# this migration is run


"""
We're making a change providers' memberships. 
We're changing Provider.membership from a CharField to an IntegerField.
That can be done in four migrations:

    Migration 1 (0079_provider_membership2.py):
        Create an additional field in Provider called membership2.
        This is temporary and should hold memberships as integers.
        After migration 1, this row will be empty.

    Migration 2 (This one):
        Use the code below to populate membership2.

    Migration 3:
        Remove Provider.membership so only Provider.membership2 is left

    Migration 4:
        Rename Provider.membership2 to Provider.membership
"""


class Membership:
    FREE = "Begynder"
    BASIS = "Basis"
    EXPERT = "Ekspert"


class Membership2:
    FREE = 0
    BASIS = 1
    EXPERT = 2


def _membership_value(old_membership):
    membership_levels = {
        Membership.FREE: Membership2.FREE,
        Membership.BASIS: Membership2.BASIS,
        Membership.EXPERT: Membership2.EXPERT,
    }
    return membership_levels[old_membership]


def memberships_part_2(apps, schema_editor):
    Provider = apps.get_model("providers", "Provider")
    for p in Provider.objects.all():
        p.membership2 = _membership_value(p.membership)
        assert p.membership2 in [0, 1, 2]
        p.save()
        print(p.membership, p.membership2)


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0079_provider_membership2'),
    ]

    operations = [migrations.RunPython(memberships_part_2)]