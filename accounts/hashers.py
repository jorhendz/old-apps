from django.contrib.auth.hashers import BasePasswordHasher, mask_hash
from django.utils.crypto import (
    constant_time_compare,
    get_random_string,
    pbkdf2,
)
from django.utils.encoding import force_bytes, force_str, force_text
from collections import OrderedDict
import hashlib

# This code has been written by looking at
# https://docs.djangoproject.com/en/1.8/_modules/django/contrib/auth/hashers/
# in the BasePasswordHasher and trying to get what needed to be overwritten.


class BBOldHasher(BasePasswordHasher):

    algorithm = "BBOldHasher"

    def encode(self, password, salt):
        # assert "$" not in salt
        m = hashlib.sha512()
        m.update(force_bytes(password))
        hash_value = m.hexdigest()[:60]
        return "%s$%d$%s$%s" % (self.algorithm, 1, self.salt(), hash_value)

    def verify(self, password, encoded):
        algorithm, data = encoded.split('$', 1)
        assert algorithm == self.algorithm
        encoded_2 = self.encode(password, force_bytes(data))
        return constant_time_compare(encoded, encoded_2)

    def salt(self):
        return "salt"

    def safe_summary(self, encoded):
        algorithm, iterations, salt, hash = encoded.split('$', 3)
        assert algorithm == self.algorithm
        return OrderedDict(
            [
                ('algorithm', algorithm),
                ('iterations', iterations),
                ('salt', mask_hash(salt)),
                ('hash', mask_hash(hash)),
            ]
        )

    def must_update(self, encoded):
        return True
