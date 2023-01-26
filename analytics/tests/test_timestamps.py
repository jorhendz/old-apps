import datetime
import pytz

from django.test import SimpleTestCase

from analytics import timestamps


class TestTimestamps(SimpleTestCase):
    def test_get_datetime(self):
        actual = timestamps.get_datetime(year=1988, month=3, day=24)
        self.assertTrue(actual.tzinfo == datetime.timezone.utc)
        self.assertTrue(actual.year == 1988)
        self.assertTrue(actual.day == 24)

    def test_utc_to_local(self):
        before = timestamps.get_now()
        with self.assertRaises(ValueError):
            timestamps.utc_to_local(timestamps.utc_to_local(before))

        after = timestamps.utc_to_local(before)

        self.assertEqual(before.hour + 2, after.hour)

    def test_to_string(self):
        ts = timestamps.get_datetime(year=1981, month=2, day=3, hour=4, minute=5)
        actual = timestamps.to_string(ts)
        self.assertEquals(actual, '1981-02-03 04:05:00')
