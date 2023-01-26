from pprint import pprint
from typing import OrderedDict
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.utils.serializer_helpers import ReturnList
from django.http import HttpResponseForbidden, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import AnonymousUser

from analytics.events import EventFactory
from analytics.user_properties import get_user_organization

# from providers.models.provider import Membership

from .models import (
    Provider,
    SocialWorker,
    Creditation,
    Theme,
    ServiceCategory,
    PostalCode,
    Language,
    Area,
    Region,
    Service,
    ProfessionalSubscriber,
    get_user_information,
    get_user_type,
)
from analytics.models import AnalyticsEvent


@csrf_exempt
def set_services(request):
    """
    Posting this should mean that the logged in provider now has only one Service
    [{"id": 1, "hourly_price": 12, "daily_price": 24, "online": true, "administration_included": false, ""}]
    """
    if not request.method == 'POST':
        return HttpResponseForbidden()
    user = request.user
    if not user.is_authenticated:
        return HttpResponseForbidden()

    if not hasattr(user, 'provider'):
        return HttpResponseForbidden()

    posted_services = json.loads(request.body)
    new_services = []
    print("posted services:", posted_services)
    for argument in posted_services:
        if argument is not None:
            # I'm truely sorry to the person reading this.
            # Tthe way that the backend and frontend communicates here is using an old version of the data structure
            # To see the details of changes look at migrations 0038_X.
            # Basicly I wasn't paid enough to this properly and rewrite everything, hence some communication between
            # backend and frontend ended up using the old data format and some of it the new one.
            # I'm sorry about the problems it might give you...
            # Mikkel B. G.
            print(argument)
            hourly_price = argument['hourly_price']
            full_day_price = argument['full_day_price']

            if hourly_price == 0 or full_day_price == 0:
                price_type = Service.FREE_TYPE
                price_value = 0
            elif hourly_price is not None and full_day_price is None:
                price_type = Service.HOURLY_TYPE
                price_value = hourly_price
            elif full_day_price is not None and hourly_price is None:
                price_type = Service.DAILY_TYPE
                price_value = full_day_price
            else:
                print("Ended in a weird case")
                price_type, price_value = None, None

            new_services.append(
                Service(
                    provider=user.provider,
                    category=ServiceCategory.objects.get(pk=argument['id']),
                    online=argument['online'],
                    administration_included=argument['administration_included'],
                    transport_included=argument["transport_included"],
                    for_parents=argument["for_parents"],
                    price_value=price_value,
                    price_type=price_type,
                )
            )
            print(new_services[-1].online)

    Service.objects.filter(provider=user.provider).all().delete()

    for s in new_services:
        s.save()
    return JsonResponse("Done", safe=False)


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        depth = 1
        fields = [
            "category",
            "price_type",
            "price_value",
            "online",
            "transport_included",
            "administration_included",
            "for_parents",
        ]


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer

    def get_queryset(self):
        return self.request.user.provider.services.all()


class ServiceCategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "service_type"]


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer


class AreaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Area
        fields = ["id", "name"]


class AreaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class CreditationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Creditation
        fields = ["id", "name"]


class CreditationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Creditation.objects.all()
    serializer_class = CreditationSerializer


class PostalCodeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PostalCode
        fields = ["id", "name", "number"]


class PostalCodeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PostalCode.objects.all()
    serializer_class = PostalCodeSerializer


class LanguageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name"]


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class RegionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Region
        fields = ["id", "name"]


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class ThemeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "name", "theme_type"]


class ThemeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer


class ProviderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Provider
        fields = [
            'id',
            'name',
            'price_string',
            'contact_phone',
            "contact_name",
            "contact_postal_code",
            "is_online",
            "is_transport_included",
            "is_administration_included",
            "is_for_parents",
            "is_internal",
            "membership",
        ]


class ProviderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Provider.objects.filter(user__is_active=True).all()
    serializer_class = ProviderSerializer

    def list(self, request):
        user = self.request.user
        if not user.is_authenticated:
            return Response([])

        # Authenticate the user as social worker or professionalsubscriber here
        if (
            hasattr(user, 'socialworker')
            or hasattr(user, 'professionalsubscriber')
            or hasattr(user, 'is_superuser')
        ):
            # Search for providers
            from django.db.models import Q

            query = Q()
            query.add(Q(is_public=True), Q.AND)

            user_org = get_user_organization(user)

            # Only show internal providers to socialworkers and professionalsubscribers
            # from the same organization (municipality)
            query.add(Q(owned_by__isnull=True) | Q(owned_by=user_org), Q.AND)

            misc = request.query_params.getlist("misc", [])
            language_ids = request.query_params.getlist("language_ids", [])
            creditation_ids = request.query_params.getlist("creditation_ids", [])
            page = int(request.query_params.get("page", 0))
            languages = [Language.objects.get(pk=int(i)) for i in language_ids]
            creditations = [Creditation.objects.get(pk=int(i)) for i in creditation_ids]
            postal_code_ids = request.query_params.getlist("postal_code_ids", [])
            postal_codes = [PostalCode.objects.get(pk=int(i)) for i in postal_code_ids]
            # sorting = request.query_params.get("sort", None)

            area_ids = request.query_params.getlist("area_ids", [])
            areas = [Area.objects.get(pk=int(i)) for i in area_ids]
            postal_codes = postal_codes + sum(
                [list(area.postal_codes.all()) for area in areas], start=[]
            )

            service_category_id = request.query_params.get("service_category_id", None)
            if service_category_id:
                service_category = ServiceCategory.objects.get(
                    pk=int(service_category_id)
                )
            else:
                service_category = None
            theme_ids = request.query_params.getlist("theme_ids", [])
            themes = [Theme.objects.get(pk=int(i)) for i in theme_ids]

            waiting_time = request.query_params.get("waiting_time", None)
            gender = request.query_params.get("gender", None)
            if gender:
                if gender == "BOYS":
                    gender = Provider.ONLY_BOYS
                elif gender == "GIRLS":
                    gender = Provider.ONLY_GIRLS
                else:
                    return Response([])

            age = request.query_params.get("age", None)
            if age:
                age = int(age)

            analytics_query = {}

            freetext = request.query_params.get("freetext")
            if freetext:
                analytics_query['freetext'] = freetext
                query.add(Q(name__icontains=freetext), Q.AND)
            # Location filters
            if postal_codes:
                analytics_query['postal_codes'] = postal_codes
                query.add(Q(postal_codes__in=postal_codes), Q.AND)

            if service_category:
                analytics_query['service_category'] = service_category
                query.add(Q(service__category=service_category), Q.AND)

            if themes:
                analytics_query['themes'] = themes
                query.add(Q(themes__in=themes), Q.AND)

            if waiting_time:
                # Todo: Fix
                query.add(Q(waiting_time=waiting_time), Q.AND)

            if gender:
                analytics_query['gender'] = gender
                query.add(Q(sexes=gender), Q.AND)

            if languages:
                analytics_query['languages'] = languages
                query.add(Q(languages__in=languages), Q.AND)

            if creditations:
                analytics_query['creditations'] = creditations
                query.add(Q(creditations__in=creditations), Q.AND)

            if age:
                # todo: fix
                query.add(Q(min_age__lte=age) | Q(max_age__gte=age), Q.AND)

            if 'VOLUNTEER' in misc:
                analytics_query['is_volunteer_organization'] = True
                query.add(Q(is_volunteer_organization=True), Q.AND)

            EventFactory(user).search(analytics_query)

            def get_internal_providers():
                # Internal means that Provider.owned_by should equal user_org
                query.add(Q(owned_by__isnull=False), Q.AND)
                query.add(Q(owned_by=user_org), Q.AND)

            # Misc filters
            if 'INTERNAL' in misc:
                get_internal_providers()

            # if sorting:
            #    if sorting == "name-asc":
            #        self.queryset = self.queryset.order_by("name")
            #    elif sorting == "name-desc":
            #        self.queryset = self.queryset.order_by("-name")
            #    elif sorting == "postal-asc":
            #        self.queryset = self.queryset.order_by(
            #            "contact_postal_code")
            #    elif sorting == "postal-desc":
            #        self.queryset = self.queryset.order_by(
            #            "-contact_postal_code")
            #    else:
            #        print(f"> Encountered unknown sorting option {sorting}")
            self.queryset = self.queryset.order_by("-membership")
            self.queryset = self.queryset.filter(query).distinct()[
                page * 20 : (page + 1) * 20
            ]

            serializer = ProviderSerializer(self.queryset, many=True)

            r = Response(serializer.data)

            return r
        else:
            return Response([])
