# We have to load in here since the App isn't loaded before ready is called
# TODO: Figure out which of these should actually be rerun on application restart
# I have left them this way to make it easy to spin up a clean installation in the
# creation phase
from .models import Region, Language, ServiceCategory, Theme, Creditation
from django.db.utils import IntegrityError

REGIONS = [
    "Hovedstaden",
    "Fyn",
    "Midtjylland",
    "Nordjylland",
    "Sjælland",
    "Sønderjylland",
]
for region in REGIONS:
    try:
        region_object = Region.objects.create(name=region)
        region_object.save()
        print(f"Added {region} to the regions table")
    except IntegrityError:
        pass

CREDITATIONS = [
    "Akkrediteret af RådgivningsDanmark",
    "Godkendt af Socialtilsynet",
    "Medlem af Center for Frivilligt Socialt Arbejde",
    "Medlem af Dansk Psykolog Forening",
    "Medlem af Dansk Psykoterapeutforening",
    "Medlem af Foreningen af Professionelle Støttepersoner",
    "Medlem af Landsorganisationen for sociale tilbud",
]

for credit in CREDITATIONS:
    try:
        credit_object = Creditation.objects.create(name=credit)
        credit_object.save()
        print(f"Added {credit} to the Creditations table")
    except IntegrityError:
        pass

SOCIAL_THEMES = [
    "Alkoholmisbrug",
    "Anbragte børn",
    "Børn af Indsatte forældre",
    "Ensomhed",
    "Fattigdom",
    "Hjemløshed",
    "Kriminalitet",
    "Kulturelle udfordringer",
    "Mobning",
    "Omsorgssvigt",
    "Prostitution",
    "Radikalisering",
    "Skilsmisse",
    "Skolefravær",
    "Stofmisbrug",
    "Ung",
    "Vold / overgreb",
]

MENTAL_THEMES = [
    "ADHD",
    "Andre diagnoser",
    "Andre psykiske vanskeligheder",
    "Angst",
    "Autisme",
    "Depression",
    "Konflikter / adfærd",
    "Læsevanskeligheder",
    "OCD",
    "Overvægt/spiseforstyrrelser",
    "Seksualitet",
    "Selvmord",
    "Selvskadende adfærd",
    "Sorg",
    "Stress",
    "Tilknytningsforstyrrelse",
    "Udviklingsforstyrrelse",
]

PHYSICAL_THEMES = [
    "Fysiske Handicap",
    "Graviditet / småbørn",
    "Sygdom",
]

for theme in SOCIAL_THEMES:
    try:
        theme_object = Theme.objects.create(name=theme)
        theme_object.theme_type = "Socialt"
        theme_object.save()
        print(f"Added {theme} to the themes table")
    except IntegrityError:
        pass

for theme in MENTAL_THEMES:
    try:
        theme_object = Theme.objects.create(name=theme)
        theme_object.theme_type = "Psykisk"
        theme_object.save()
        print(f"Added {theme} to the themes table")
    except IntegrityError:
        pass

for theme in PHYSICAL_THEMES:
    try:
        theme_object = Theme.objects.create(name=theme)
        theme_object.theme_type = "Fysisk"
        theme_object.save()
        print(f"Added {theme} to the themes table")
    except IntegrityError:
        pass

LANGUAGES = [
    "Arabisk",
    "Dansk",
    "Farsi",
    "Fransk",
    "Kroatisk",
    "Litaunsk",
    "Norsk",
    "Polsk",
    "Serbokoratisk",
    "Spansk",
    "Swahili",
    "Tysk",
    "Bosnisk",
    "Engelsk",
    "Fillipinsk",
    "Grønlandsk",
    "Kurdisk",
    "Marokkansk",
    "Pashto",
    "Russisk",
    "Somali",
    "Svensk",
    "Tyrkisk",
    "Ungarsk",
]
for language in LANGUAGES:
    try:
        language_object = Language.objects.create(name=language)
        language_object.save()
        print(f"Added {language} to the language table")
    except IntegrityError:
        pass

SERVICES = [
    "Andre tilbud",
    "Arrangement/oplevelse",
    "Bisidder",
    "Brevkasse",
    "Bydelsmødre",
    "Chat/Debatforum",
    "Coaching",
    "Familierådslagning",
    "Familiesamtaler",
    "Ferielejr",
    "Foredrag",
    "Fritidstilbud",
    "Gruppetilbud",
    "Julehjælp",
    "Konfliktmægling",
    "Kurser",
    "Lektiehjælp",
    "Læsetræning",
    "Mentor",
    "Netværk",
    "Rådgivning",
    "Undervisning",
    "Vidensbank",
    "Værested",
]
for service in SERVICES:
    try:
        service_object = ServiceCategory.objects.create(
            name=service, service_type=ServiceCategory.PREVENTIVE_TYPE
        )
        service_object.save()
        print(f"Added {service} to Services table")
    except IntegrityError:
        pass

INTRUSIVE_SERVICES = [
    "Aflastning §52 stk.2 nr.5/ §41 SEL stk. 3 SEL",
    "Afrusning §101 SEL",
    "Bo-støtte §76 stk.3 nr.4 SEL",
    "Bolig §52 stk.3 nr.9 SEL",
    "Børnefaglige undersøgelse §50 SEL",
    "Dagbehandling / skoletilbud §52 stk.3 nr.1 SEL",
    "Døgninstitution §66 stk.1 nr.7 SEL",
    "Familiebehandling §52 stk.3 nr.3 SEL",
    "Familieinstitution §52 stk.3 nr.4 SEL",
    "Forældreevneundersøgelse §46 SEL",
    "Fysisk træning/behandling §44 SEL",
    "Julemærkehjem §52 stk.3 nr.9 SEL",
    "Juridisk rådgivning §11 stk.3 nr.1 SEL",
    "Klubtilbud §52 stk.3 nr.1 SEL",
    "Kontaktperson §52 stk.3 nr.6 SEL",
    "Kost- og efterskole §66 stk.1 nr.8/§52A SEL",
    "Krisecenter §109 SEL",
    "Opholdssted §66 stk.1 nr.6 SEL",
    "Overvåget samvær §71 stk.3 SEL",
    "Praktisk pædagogisk vejledning §52 stk.3 nr.2 SEL",
    "Psykologiske undersøgelse §46 SEL",
    "Sikret institution §63B SEL",
    "Skibsprojekt §66 stk.1 nr.6 SEL",
    "Støtte til uddannelse og job §76/§76A SEL",
    "Støtteperson §54 SEL",
]

for service in INTRUSIVE_SERVICES:
    try:
        service_object = ServiceCategory.objects.create(
            name=service, service_type=ServiceCategory.INTRUSIVE_TYPE
        )
        service_object.save()
        print(f"Added {service_object} to Services table")
    except IntegrityError:
        pass

OTHER_SERVICES = ["Tegnsprogstolk §7 FVL", "Tolkebistand §7 FVL"]

for service in OTHER_SERVICES:
    try:
        service_object = ServiceCategory.objects.create(
            name=service, service_type=ServiceCategory.OTHER_TYPE
        )
        service_object.save()
        print(f"Added {service_object} to Services table")
    except IntegrityError:
        pass
