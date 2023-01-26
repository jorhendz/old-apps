from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from providers.models.creditation import Creditation
from providers.models.language import Language
from providers.models.postal_code import PostalCode

from providers.models.theme import Theme
from analytics import timestamps

import time

# https://stackoverflow.com/questions/27583744/django-table-doesnt-exist


class AnalyticsEvent(models.Model):

    # This will receive a timestamp on .save()
    timestamp = models.DateTimeField(auto_now_add=True)

    # The reason we don't store a user directly has to do with GDPR
    user_id = models.IntegerField(null=True)
    user_type = models.CharField(
        verbose_name="Brugertype", max_length=255, null=True, blank=True
    )
    user_organization = models.CharField(
        verbose_name="Organisation", max_length=255, null=True, blank=True
    )

    class Meta:
        ordering = ('timestamp',)

    @staticmethod
    def not_logged_in():
        """AnalyticsEvent for users not logged in"""
        return AnalyticsEvent(
            user_id=None,
            user_type='AnonymousUser',
            user_organization='AnonymousUser',
        )

    def get_parent(self):
        model_names = [PageViewEvent, LoginEvent, RegisterEvent, SearchEvent]

        for model_name in model_names:
            try:
                content_type = ContentType.objects.get_for_model(model_name)
                model_cls = content_type.model_class()
                obj = model_cls.objects.get(base_event__id=self.id)

                if not obj:
                    continue
                return obj

            except ObjectDoesNotExist:
                pass

    def __str__(self):
        return f'''     
        Timestamp           {timestamps.to_string(self.timestamp)}       
        User ID:            {self.user_id}
        User type:          {self.user_type}
        User organization:  {self.user_organization}
        '''

    def _european_time_format(self):
        return self.timestamp.strftime('%d/%m/%Y %H:%M:%S')

    def _user_info_to_str(self, user_info):
        return f"{self.user_properties['user_type']}:\t\t{str(user_info)}"


class PageViewEvent(models.Model):

    base_event = models.OneToOneField(AnalyticsEvent, on_delete=models.CASCADE)
    page_path = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f'''
        {self.__class__.__name__}
        Path:               {self.page_path}
        {self.base_event}
        '''


class LoginEvent(models.Model):

    base_event = models.OneToOneField(AnalyticsEvent, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'''
        {self.__class__.__name__}
        {self.base_event}
        '''


class RegisterEvent(models.Model):

    base_event = models.OneToOneField(AnalyticsEvent, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'''
        {self.__class__.__name__}
        {self.base_event}
        '''


class SearchEvent(models.Model):

    base_event = models.OneToOneField(AnalyticsEvent, on_delete=models.CASCADE)

    freetext = models.CharField(
        verbose_name="Fritekst", max_length=255, null=True, blank=True
    )
    service_category = models.CharField(
        verbose_name="Type hjælp", max_length=255, null=True, blank=True
    )
    gender = models.CharField(verbose_name="Køn", max_length=20, null=True, blank=True)
    is_volunteer_organization = models.BooleanField(
        verbose_name="Frivilligt tilbud", null=True, blank=True
    )

    postal_codes = models.ManyToManyField(PostalCode, blank=True)
    themes = models.ManyToManyField(Theme, blank=True)
    languages = models.ManyToManyField(Language, blank=True)
    creditations = models.ManyToManyField(Creditation, blank=True)

    def __str__(self) -> str:
        return f'''
        {self.__class__.__name__}
        Freetext:           {self.freetext}
        Service category:   {self.service_category}
        Gender              {self.gender}
        Volunteer:          {self.is_volunteer_organization}

        Postal codes:       {len(self.postal_codes.all())}
        Themes:             {len(self.themes.all())}
        Languages:          {len(self.languages.all())}
        Creditations:       {len(self.creditations.all())}
        {self.base_event}
        '''
