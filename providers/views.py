from django.forms import inlineformset_factory
from django.http import (
    HttpResponse,
    Http404,
    HttpResponseRedirect,
    HttpResponseNotFound,
)
from django.shortcuts import redirect, render
from django.conf import settings
from mailchimp_marketing import Client
from mailchimp_marketing.api_client import ApiClientError
from django.contrib.auth import authenticate, login
from django.contrib.auth import views as auth_views
from django.forms.utils import ErrorList
import re
import json

from accounts.models import CustomUser
from providers.models.provider import Membership
from .models import (
    Provider,
    SocialWorker,
    Service,
    get_user_information,
    Municipality,
    PostalCode,
    ProfessionalSubscriber,
    Area,
    ToolboxTool,
)
from .forms import (
    ProviderContactInfoForm,
    ProviderAboutInfoForm,
    ProviderBasisInfoForm,
    SocialWorkerForm,
    ProviderSignupForm,
    ProviderAdminInfoForm,
    ProfessionalSubscriberSignupForm,
    CustomAuthForm,
)
from .analytics import GAUserInfo
from .view_decorators import page_view_event, user_types_allowed, membership_required


def index(request):
    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect("login")
    elif user.is_superuser:
        return HttpResponseRedirect("admin")
    elif hasattr(user, 'socialworker'):
        return HttpResponseRedirect("search")
    elif hasattr(user, 'professionalsubscriber'):
        return HttpResponseRedirect("search")
    elif hasattr(user, 'provider'):
        return HttpResponseRedirect("profile")
    else:
        return Http404()


# Mailchimp


# Mailchimp Settings
api_key = settings.MAILCHIMP_API_KEY
server = settings.MAILCHIMP_DATA_CENTER
list_id_providers = settings.MAILCHIMP_EMAIL_LIST_ID_PROVIDERS
list_id_social_workers = settings.MAILCHIMP_EMAIL_LIST_ID_SOCIAL_WORKERS


# Subscription Logic
def subscribe(list_id, email, name, tag):
    """
    Contains code handling the communication to the mailchimp api
    to create a contact/member in an audience/list.
    """

    mailchimp = Client()
    mailchimp.set_config(
        {
            "api_key": api_key,
            "server": server,
        }
    )

    member_info = {
        "email_address": email,
        "merge_fields": {"FNAME": name},
        "tags": [tag],
        "status": "subscribed",
    }

    try:
        response = mailchimp.lists.add_list_member(list_id, member_info)
        print("response: {}".format(response))
    except ApiClientError as error:
        print("An exception occurred: {}".format(error.text))


def formatted_url(url_from_db):
    """User submitted website URL's are inconsistent. This adds "https://"
    to the beginning if needed, so the links can be
    clicked and are not seen as relative links."""
    if not re.match('(?:http|https)://', url_from_db):
        return 'http://{}'.format(url_from_db)
    return url_from_db


class CustomLoginView(auth_views.LoginView):
    """Extending the built-in LoginView in order to be able to
    call methods on successful logins"""

    authentication_form = CustomAuthForm
    form_class = CustomAuthForm
    template_name = 'login.html'

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)

        return super(auth_views.LoginView, self).form_valid(form)


@user_types_allowed(Provider, SocialWorker, ProfessionalSubscriber)
@page_view_event()
def provider(request, provider_id):
    # Special case. Don't use the @user_types_allowed decorator here.
    # To do: Allow providers to see this page, but only
    # if for their own tilbud

    user = request.user
    if not user.is_authenticated:
        return HttpResponseRedirect("/login")

    provider = Provider.objects.get(id=provider_id)
    # We should now show providers that are not active yet
    if not (user.is_superuser or provider.is_ready or provider.user == user):
        return Http404()

    area_overview = {
        a.name: [
            postal_code
            for postal_code in provider.postal_codes.filter(
                area=Area.objects.get(name=a.name)
            )
        ]
        for a in provider.areas
    }

    # Notice that services and themes are sorted by name
    context = {
        'provider': provider,
        'title': provider.name,
        'services': sorted(
            [
                (
                    service.category.name,
                    service.price_string,
                    service.online,
                    service.transport_included,
                    service.administration_included,
                    service.for_parents,
                )
                for service in provider.services
            ]
        ),
        'themes': sorted([theme.name for theme in provider.themes.all()]),
        'top_postal_codes': provider.postal_codes.all()[0:5],
        'municipality_credits': sorted(
            [
                (credit.name, credit.logo)
                for credit in provider.municipality_creditations.all()
            ]
        ),
        'ga_user_info': GAUserInfo(user),
        'area_overview': area_overview,
    }

    # Only send a pageview to Google Analytics
    # if the visiting user is not a provider looking at his own page
    try:
        visiting_provider = user.provider
        if provider.id == visiting_provider.id:
            context['dont_send_events'] = True
    except Provider.DoesNotExist:
        context['dont_send_events'] = False

    if provider.contact_website:
        context['contact_url'] = formatted_url(provider.contact_website)

    return render(request, "provider.html", context)


@user_types_allowed(SocialWorker, ProfessionalSubscriber)
@page_view_event()
def shared_knowledge(request):
    user_information = get_user_information(request.user)
    municipality = user_information.municipality
    work_methods = municipality.sharedknowledge_set.all()
    context = {
        'work_methods': work_methods,
        'municipality': municipality,
        'title': 'Viden på tværs',
        'ga_user_info': GAUserInfo(request.user),
    }
    return render(request, "shared_knowledge.html", context)


@user_types_allowed(SocialWorker, ProfessionalSubscriber)
@page_view_event()
def work_methods(request):
    user_information = get_user_information(request.user)
    municipality = user_information.municipality
    work_methods = municipality.workmethod_set.all()
    context = {
        'work_methods': work_methods,
        'municipality': municipality,
        'title': 'Metoder',
        'ga_user_info': GAUserInfo(request.user),
    }
    return render(request, "work_methods.html", context)


@user_types_allowed(SocialWorker, ProfessionalSubscriber)
@page_view_event()
def search(request):
    user = request.user
    user_information = get_user_information(user)
    if isinstance(user_information, SocialWorker):
        municipality = user_information.municipality
        context = {'name': request.user.name, 'municipality': municipality}
    elif isinstance(user_information, ProfessionalSubscriber):
        context = {'name': request.user.first_name}

    if request.GET.get("freetext"):
        context["freetext"] = request.GET.get("freetext")

    context['title'] = 'Søg'
    context['ga_user_info'] = GAUserInfo(user)
    return render(request, 'search.html', context)


@user_types_allowed(Provider)
@page_view_event()
def profile(request):
    user = request.user
    provider = get_user_information(user)

    if request.method == "POST":
        if "save_public_or_private" in request.POST:
            action = request.POST.get("action")
            print(f'action: {action}')
            if action == "makepublic":
                if provider.publication_requirements_sattisfied:
                    provider.is_public = True
                    provider.save()
            elif action == "makeprivate":
                provider.is_public = False
                provider.save()

    name = provider.name
    context = {
        'name': name,
        'provider': provider,
        'title': 'Profil',
        'user': provider,
        'ga_user_info': GAUserInfo(request.user),
    }

    return render(request, "profile.html", context)


@user_types_allowed(Provider)
@page_view_event()
def profile_admin(request):
    """Provider settings (admin-info form)"""
    user_information = get_user_information(request.user)

    name = user_information.name
    context = {
        'name': name,
        'provider': user_information,
        "form_title": "Udfyld dine profiloplysninger",
        "form_description": "Dine oplysninger her bliver ikke vist på din profil.",
        'title': 'Admin',
        'ga_user_info': GAUserInfo(request.user),
    }

    if request.method == 'POST':
        context['form'] = ProviderAdminInfoForm(
            request.POST, files=request.FILES, instance=user_information
        )
        if context['form'].is_valid():
            context['form'].save()
            return redirect('/profile/admin')
        else:
            print(context['form'].errors)
    else:
        context['form'] = ProviderAdminInfoForm(instance=user_information)
    return render(request, "standard_provider_form.html", context)


@user_types_allowed(Provider)
@page_view_event()
def profile_contact(request):
    """Provider contact-info form"""
    user_information = get_user_information(request.user)

    name = user_information.name
    context = {
        'name': name,
        'provider': user_information,
        'form_title': 'Udfyld tilbuddets kontaktoplysninger',
        'title': 'Udfyld kontaktoplysninger',
        'ga_user_info': GAUserInfo(request.user),
    }
    if request.method == 'POST':
        context['form'] = ProviderContactInfoForm(
            request.POST, files=request.FILES, instance=user_information
        )
        if context['form'].is_valid():
            context['form'].save()
            return redirect('/profile/contact')
        else:
            print(context['form'].errors)
    else:
        context['form'] = ProviderContactInfoForm(instance=user_information)
    return render(request, "standard_provider_form.html", context)


@user_types_allowed(Provider)
@page_view_event()
def profile_about(request):
    user_information = get_user_information(request.user)
    name = user_information.name
    context = {
        'name': name,
        'provider': user_information,
        'form_title': 'Udfyld tilbudoplysninger',
        'title': 'Udfyld tilbudsoplysninger',
        'ga_user_info': GAUserInfo(request.user),
    }

    if request.method == 'POST':
        context['form'] = ProviderAboutInfoForm(
            request.POST, files=request.FILES, instance=user_information
        )
        if context['form'].is_valid():
            context['form'].save()
            return redirect('/profile/about')
        else:
            print(context['form'].errors)
    else:
        initial_welcome_msg = user_information.welcome_message
        if initial_welcome_msg == Provider.default_welcome_msg:
            initial_welcome_msg = ''
        context['form'] = ProviderAboutInfoForm(
            instance=user_information, initial={
                'welcome_message': initial_welcome_msg}
        )
    return render(request, "standard_provider_form.html", context)


@user_types_allowed(Provider)
@membership_required(Membership.BASIS)
@page_view_event()
def profile_basis(request):
    """Provider basis form"""
    user_information = get_user_information(request.user)
    name = user_information.name
    context = {
        'name': name,
        'provider': user_information,
        'form_title': 'Udfyld uddybende oplysninger',
        'title': 'Udfyld uddybende oplysninger',
        'ga_user_info': GAUserInfo(request.user),
    }

    if request.method == 'POST':
        context['form'] = ProviderBasisInfoForm(
            request.POST, files=request.FILES, instance=user_information
        )
        if context['form'].is_valid():
            context['form'].save()
            return redirect('/profile/basis')
        else:
            print(context['form'].errors)
    else:
        context['form'] = ProviderBasisInfoForm(instance=user_information)
    return render(request, "standard_provider_form.html", context)


@page_view_event()
def social_worker_signup(request):
    user = request.user
    if user.is_authenticated:
        # We redirect you to the default page
        # if you try to sign up as a user already signed up
        return HttpResponseRedirect("/")

    if request.method == 'POST':
        form = SocialWorkerForm(request.POST)
        if form.is_valid():
            form.save()
            email = form.cleaned_data.get('email')

            municipality = Municipality.objects.filter(
                email_domain=email.split("@")[1]
            ).first()
            if not municipality:
                # TODO: https://docs.djangoproject.com/en/dev/ref/forms/api/#django.forms.Form.add_error
                errors = form._errors.setdefault('email', ErrorList())
                errors.append("Brug din arbejdsemail i stedet for din private")
                CustomUser.objects.get(email=email).delete()
            else:
                first_name = form.cleaned_data.get('first_name')
                last_name = form.cleaned_data.get('last_name')
                municipality_name = municipality.name

                # Social Worker is subscribed to mailchimp
                subscribe(list_id_social_workers, email,
                          first_name, municipality_name)
                info_mail_consent_given = form.cleaned_data.get(
                    'info_mail_consent_given'
                )
                raw_password = form.cleaned_data.get('password1')

                # Save social worker to DB and login
                user = authenticate(
                    email=email,
                    password=raw_password,
                    first_name=first_name,
                    last_name=last_name,
                    info_mail_consent_given=info_mail_consent_given,
                )
                social_worker = SocialWorker(
                    user=user, municipality=municipality)
                social_worker.save()
                login(request, user)

                return redirect('/search')
        else:
            print("Not valid")
    else:
        form = SocialWorkerForm()

    context = {
        'form': form,
    }
    return render(request, 'signup_social_worker.html', context)


@page_view_event()
def professional_subscriber_signup(request):
    user = request.user
    if user.is_authenticated:
        # We redirect you to the default page
        # if you try to sign up as a user already signed up
        return HttpResponseRedirect("/")

    if request.method == 'POST':
        form = ProfessionalSubscriberSignupForm(request.POST)
        if form.is_valid():
            form.save()
            email = form.cleaned_data.get('email')
            info_mail_consent_given = form.cleaned_data.get(
                'info_mail_consent_given')
            first_name = form.cleaned_data.get('first_name')
            last_name = form.cleaned_data.get('last_name')
            raw_password = form.cleaned_data.get('password1')

            # Professional Subscriber is subscribed to mailchimp
            subscribe(list_id_social_workers, email, first_name, 'Fagperson')

            # Professional Subscriber is saved to database
            user = authenticate(
                email=email,
                password=raw_password,
                first_name=first_name,
                last_name=last_name,
                info_mail_consent_given=info_mail_consent_given,
            )
            professional_subscriber = ProfessionalSubscriber(
                user=user,
                municipality=Municipality.objects.filter(
                    name="Børnebasen").first(),
            )
            professional_subscriber.save()
            login(request, user)

            return redirect('/search')
        else:
            print("Not valid")
    else:
        form = ProfessionalSubscriberSignupForm()
    return render(request, 'signup_professional_subscriber.html', {'form': form})


@page_view_event()
def provider_signup(request):
    user = request.user
    if user.is_authenticated:
        # We redirect you to the default page
        # if you try to sign up as a user already signed up
        return HttpResponseRedirect("/")

    if request.method == 'POST':
        form = ProviderSignupForm(request.POST)
        if form.is_valid():
            form.save()
            first_name = form.cleaned_data.get('first_name')
            last_name = form.cleaned_data.get('last_name')
            provider_name = form.cleaned_data.get('provider_name')
            email = form.cleaned_data.get('email')
            # Provider is subscribed to mailchimp
            subscribe(list_id_providers, email,
                      provider_name, 'Selvregistreret')
            consent_given = form.cleaned_data.get('consent_given')
            info_mail_consent_given = form.cleaned_data.get(
                'info_mail_consent_given')
            raw_password = form.cleaned_data.get('password1')

            # Save provider to DB and login
            user = authenticate(email=email, password=raw_password)
            provider = Provider(
                user=user,
                name=provider_name,
                admin_first_name=first_name,
                admin_last_name=last_name,
                contact_email=email,
                consent_given=consent_given,
                info_mail_consent_given=info_mail_consent_given,
            )
            provider.save()
            login(request, user)

            return redirect('/profile')
        else:
            print("Not valid")
    else:
        form = ProviderSignupForm()
    return render(request, 'signup_provider.html', {'form': form})


@user_types_allowed(Provider)
@page_view_event()
def profile_postal_codes(request):
    """Provider settings (area form)"""

    provider = get_user_information(request.user)

    if request.method == 'POST':
        # Get selected postal codes
        postal_codes = request.POST.getlist('pc')
        new_postal_codes = [PostalCode.objects.get(
            pk=pc) for pc in postal_codes]

        # Remove the old postal codes associated with the provider
        provider.postal_codes.remove(*provider.postal_codes.all())
        provider.save()

        # Save the newly selected postal codes on the provider
        provider.postal_codes.add(*new_postal_codes)

        return redirect('/profile/postal_codes')

    if request.method == 'GET':
        all_areas = Area.objects.all()

        current_pcs = provider.postal_codes.values('id')
        current_pc_ids = [pc['id'] for pc in current_pcs]

        areas = {}
        for area in all_areas:
            areas[str(area.id)] = {
                'name': area.name,
                'codes': [
                    {
                        'id': str(pc.id),
                        'name': str(pc),
                    }
                    for pc in area.postal_codes.all()
                ],
            }

        area_ids = json.dumps(list(areas.keys()))

        context = {
            'areas': areas,
            'current_pc_ids_json': json.dumps(current_pc_ids),
            'area_ids': area_ids,
        }
        return render(request, 'profile_postal_codes.html', context)


@user_types_allowed(Provider)
@page_view_event()
def profile_services(request):
    provider = get_user_information(request.user)
    ServiceFormset = inlineformset_factory(
        Provider,
        Service,
        fields=(
            'price_type',
            'price_value',
        ),
        can_delete=True,
        extra=1,
    )

    if request.method == 'POST':
        formset = ServiceFormset(
            request.POST, request.FILES, instance=provider)
        if formset.is_valid():
            formset.save()
            return redirect(
                'profile_services',
            )
        else:
            print(formset.is_valid())
            print(formset)
    formset = ServiceFormset(instance=provider)
    return render(
        request,
        'profile_service.html',
        {
            'formset': formset,
            'provider': provider,
            'title': 'Vælg indsatser',
            'ga_user_info': GAUserInfo(request.user),
        },
    )


@user_types_allowed(Provider)
@membership_required(Membership.BASIS)
@page_view_event()
def profile_toolbox(request):
    toolbox_tools = ToolboxTool.objects.all()
    context = {
        'toolbox_tools': toolbox_tools,
        'title': 'Den faglige værktøjskasse',
        'ga_user_info': GAUserInfo(request.user),
    }
    return render(request, "social_toolbox.html", context)


@user_types_allowed(SocialWorker, ProfessionalSubscriber)
@page_view_event()
def legislation(request):
    user = request.user

    context = {
        'title': 'Lovgivning',
        'ga_user_info': GAUserInfo(user),
    }

    return render(request, "legislation.html", context)


@page_view_event()
def help(request):
    context = {
        'title': 'Hjælp',
    }
    return render(request, "help.html", context)
