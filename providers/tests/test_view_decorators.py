from django.test import SimpleTestCase
from providers.models.provider import Membership
from providers.view_decorators import membership_level_sufficient

# Use SimpleTestCase for anything that doesn't require
# access to the database


class TestMembership(SimpleTestCase):
    def test_membership_level_sufficient(self):
        self.assertTrue(membership_level_sufficient(Membership.FREE, Membership.FREE))

        self.assertFalse(membership_level_sufficient(Membership.FREE, Membership.BASIS))

        self.assertFalse(
            membership_level_sufficient(Membership.BASIS, Membership.EXPERT)
        )

        self.assertTrue(
            membership_level_sufficient(Membership.EXPERT, Membership.EXPERT)
        )

        self.assertTrue(
            membership_level_sufficient(Membership.EXPERT, Membership.BASIS)
        )
