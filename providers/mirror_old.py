import pymysql
from providers.models import (
    Provider,
    Municipality,
    SocialWorker,
    Language,
    Theme,
    ServiceCategory,
    Region,
    Creditation,
    Service,
)
from accounts.models import CustomUser
from django.db.utils import IntegrityError, DataError
from django.core.files import File
import random
import providers.models
import time

t0 = time.time()


def generate_email(prefix=""):
    rand = "".join([str(random.choice(range(10))) for _ in range(10)])
    if prefix != "":
        return f"{prefix}-{rand}@generated.dk"
    else:
        return f"{rand}@generated.dk"


db = pymysql.connect(
    host="mysql54.unoeuro.com",
    user="boernebasen_dk",
    password="zgt9p4y5",
    db="boernebasen_dk_db_app",
)
cursor = db.cursor()

### Initialization done ###

### Creditation start ###
print("> Starting Creditation")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM bornebasen_udmaerkelse")
data = cursor.fetchall()
credit_titles = ["id", "udmaerkelse", "img"]
credit_raw_data = []
for cre in data:
    credit_raw_data.append(dict(zip(credit_titles, cre)))

Creditation.objects.all().delete()

for credit in credit_raw_data:
    creditation = Creditation(
        pk=credit["id"],
        name=credit["udmaerkelse"],
    )
    creditation.save()

### Creditation end ###

### Region start ###
print("> Starting Region")
print(f"> Time {round(time.time()-t0)} sec")
cursor.execute("SELECT * FROM bornebasen_lokation")
data = cursor.fetchall()
titles = ["id", "lokation"]
raw_data = []
for point in data:
    raw_data.append(dict(zip(titles, point)))

Region.objects.all().delete()

for reg in raw_data:
    region = Region(
        pk=reg["id"],
        name=reg["lokation"],
    )
    region.save()
### Region end ###

### ServiceCategory start ###
print("> Starting ServiceCategory")
print(f"> Time {round(time.time()-t0)} sec")

sc_map = {
    '1': ServiceCategory.PREVENTIVE_TYPE,
    '2': ServiceCategory.INTRUSIVE_TYPE,
    '3': ServiceCategory.OTHER_TYPE,
}

cursor.execute("SELECT * FROM bornebasen_type")
data = cursor.fetchall()
sc_titles = ["id", "typer", "kategori"]
sc_raw_data = []
for sc in data:
    sc_raw_data.append(dict(zip(sc_titles, sc)))

ServiceCategory.objects.all().delete()

for sc in sc_raw_data:
    service_category = ServiceCategory(
        pk=sc["id"], name=sc["typer"], service_type=sc_map[sc["kategori"]]
    )
    service_category.save()

### ServiceCategory end ###

### Theme start ###
theme_category_map = {
    3: Theme.SOCIAL_TYPE,
    1: Theme.PHYSICAL_TYPE,
    2: Theme.MENTAL_TYPE,
}

cursor.execute("SELECT * FROM bornebasen_tema")
data = cursor.fetchall()
theme_titles = ["id", "tema", "cat"]
theme_raw_data = []
for t_data in data:
    theme_raw_data.append(dict(zip(theme_titles, t_data)))

Theme.objects.all().delete()
for t in theme_raw_data:
    theme = Theme(pk=t["id"], name=t["tema"], theme_type=theme_category_map[t["cat"]])
    theme.save()

### Theme end ###

### Kommuner start ###
print("> Starting Municipality")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM kommuner")

data = cursor.fetchall()
kommune_titles = [
    "id",
    "lokation_id",
    "kommune",
    "logo",
    "adresse",
    "zip",
    "city",
    "phone",
    "email",
    "vidensdeling",
    "tld",
]
municipality_raw_data = []
for kommune_data in data:
    municipality_raw_data.append(dict(zip(kommune_titles, kommune_data)))

Municipality.objects.all().delete()

for municipality in municipality_raw_data:
    m_object = Municipality.objects.create(
        id=municipality["id"],
        name=municipality["kommune"],
        email_domain=municipality["tld"].replace("_cancel", ""),
        is_member=not municipality["tld"].endswith("_cancel"),
    )
    m_object.save()

for user in CustomUser.objects.all():
    if not user.is_superuser and user.password.startswith("BBOldHasher$"):
        user.delete()

cursor.execute("SELECT * FROM bornebasen_lokation")
data = cursor.fetchall()
lokation_titles = ["id", "lokation"]
region_raw_data = []
for lokation_data in data:
    region_raw_data.append(dict(zip(lokation_titles, lokation_data)))

### Kommuner slut ###

### Sprog start ###
print("Starting Language")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM bornebasen_sprog")

Language.objects.all().delete()

data = cursor.fetchall()
sprog_title = ["id", "sprog"]
language_raw_data = []
for lang_data in data:
    language_raw_data.append(dict(zip(sprog_title, lang_data)))

for lang in language_raw_data:
    l = Language(pk=lang["id"], name=lang["sprog"])
    l.save()

### Provider start ###
print("> Starting Provider")
print(f"> Time {round(time.time()-t0)} sec")

if True:
    cursor.execute("SELECT * FROM bornebasen_udbydere")
else:
    print("ONLY MIGRATING INTERNAL - HOPE YOU KNOW WHAT YOU ARE DOING")
    cursor.execute("SELECT * FROM bornebasen_udbydere WHERE intern != 0")

data = cursor.fetchall()
udbyder_titles = [
    "id",
    "oprettet",
    "selvregistreret",
    "signed_fra_hjemmesiden",
    "samtykke",
    "mailsendt",
    "send_in_newsletter",
    "deleted",
    "intern",
    "ban",
    "navn",
    "logo",
    "kontaktperson",
    "beskrivelse",
    "beskrivelse_af_ydelser",
    "adresse",
    "postnr",
    "cvr",
    "byen",
    "kommune",
    "telefon",
    "telefon2",
    "signup_email",
    "password",
    "email",
    "email2",
    "hjemmeside",
    "maalgruppefra",
    "maalgruppetil",
    "koen",
    "pristime",
    "prisgratis",
    "prisvarierer",
    "ventetid",
    "erfaring",
    "stiftet",
    "statusrapport",
    "andreopgaver",
    "sogeord",
    "online_tilbud",
    "note",
]

koen_map = {
    0: Provider.BOTH_SEXES,
    1: Provider.ONLY_GIRLS,
    2: Provider.ONLY_BOYS,
}

waiting_time_map = {
    0: Provider.WAITING_TIME_NOT_PROVIDED,
    '': Provider.WAITING_TIME_NOT_PROVIDED,
    '0': Provider.WAITING_TIME_NOT_PROVIDED,
    1: Provider.NO_WAITING_TIME,
    '1': Provider.NO_WAITING_TIME,
    2: Provider.POSSIBLE_WAITING_TIME,
    '2': Provider.POSSIBLE_WAITING_TIME,
}

status_report_map = {
    '0': Provider.STATUS_REPORT_INTERVAL_UNKNOWN,
    '': Provider.STATUS_REPORT_INTERVAL_UNKNOWN,
    '99': Provider.STATUS_REPORT_INTERVAL_NOT_RELEVANT,
    '1': Provider.STATUS_REPORT_INTERVAL_MONTHLY,
    1: Provider.STATUS_REPORT_INTERVAL_MONTHLY,
    '2': Provider.STATUS_REPORT_INTERVAL_QUARTERLY,
    '3': Provider.STATUS_REPORT_INTERVAL_BIYEARLY,
    '4': Provider.STATUS_REPORT_INTERVAL_YEARLY,
    '5': Provider.STATUS_REPORT_BY_AGREEMENT,
}

provider_raw_data = []
for udbyder_data in data:
    provider_raw_data.append(dict(zip(udbyder_titles, udbyder_data)))

for provider in provider_raw_data:
    if (
        provider["ban"] == 1
        or provider["deleted"] == 1
        or not provider["samtykke"] == 1
        or provider['email'] == "-"
    ):
        deactivated = True
    else:
        deactivated = False
    try:
        try:
            password = provider["password"]  # this is a hash
            provider_user = CustomUser.objects.create(email=provider["email"])
            if deactivated:
                if provider["deleted"]:
                    provider_user.add_migration_note(
                        f"ERR-DELE Dette tilbud var deleted={provider['deleted']} og blev derfor ikke sat som aktivt tilbud"
                    )
                if provider["ban"]:
                    provider_user.add_migration_note(
                        f"ERR-BAN Dette tilbud var ban={provider['ban']}og blev derfor ikke sat som aktivt tilbud"
                    )
                if provider["email"] == "-":
                    provider_user.add_migration_note(
                        f"ERR-EDASH Dette tilbud havde email='{provider['email']}' og blev derfor ikke sat som aktivt tilbud"
                    )

                if not provider["samtykke"]:
                    provider_user.add_migration_note(
                        f"ERR-SAMT Dette tilbud havde samtykke={provider['samtykke']} og blev derfor ikke sat som aktivt tilbud"
                    )

                provider_user.old_email = provider["email"]
                provider_user.is_active = False

            provider_user.password = "BBOldHasher$1$salt$" + password[:60]
            provider_user.save()
        except IntegrityError:
            new_email = generate_email(prefix=provider["navn"][:10])
            provider_user = CustomUser.objects.create(email=new_email)
            password = "BBOldHasher$1$salt$" + provider['password'][:60]
            provider_user.password = password
            provider_user.is_active = not deactivated
            provider_user.email = new_email
            provider_user.old_email = provider["email"]
            provider_user.save()
            provider_user.add_migration_note(
                f"Vi forsøgte at oprettet denne bruger som en Provider (id: {provider['id']}) - {provider['navn']}"
            )
            provider_user.add_migration_note(
                f"ERR-USREXST Der var allerede en bruger med email \"{provider['email']}\""
            )
            provider_user.save()

        provider_object = Provider(
            pk=provider["id"],
            user=provider_user,
            consent_given=provider["samtykke"],
            registered_externally=provider["selvregistreret"],
            name=provider["navn"],
            note=provider["note"],
            sexes=koen_map[provider["koen"]],
            status_report_interval=status_report_map[
                provider.get("statusrapport", '0')
            ],  # The 0 maps to the Unknown
            waiting_time=waiting_time_map[provider["ventetid"]],
            service_description=provider["beskrivelse_af_ydelser"],
            company_description=provider["beskrivelse"],
            contact_phone=provider["telefon"],
            contact_phone_2=provider["telefon2"],
            min_age=provider["maalgruppefra"],
            max_age=provider["maalgruppetil"],
            open_hours=provider["andreopgaver"],
            contact_name=provider["kontaktperson"],
            contact_title=provider[
                "stiftet"
            ],  # This is stupidly named.. see model definition
            contact_email=provider["email"],
            contact_email_2=provider["email2"],
            contact_address=provider["adresse"],
            contact_postal_code=provider["postnr"],
            contact_city=provider["byen"],
            contact_cvr=provider["cvr"],
            contact_website=provider["hjemmeside"][:100],
            owned_by=None
            if provider["intern"] == 0
            else Municipality.objects.get(pk=provider["intern"]),
            migrated_postal_code=provider["postnr"],
        )
        if provider["intern"] != 0:
            print(
                f"Internal in {Municipality.objects.get(pk=provider['intern'])} - {provider['navn']} ({provider['id']})"
            )

        logo = provider["logo"]
        try:
            if logo:
                provider_object.logo.save(
                    logo, File(open("./providers/migration-data/logos/" + logo, "rb"))
                )
        except FileNotFoundError:
            provider_object.user.add_migration_note(
                f"ERR-LOGO Havde logo='{logo}', men dette blev ikke fundet blandt vores logoer"
            )
            print(f"Missing logo {logo} for provider {provider['id']}")

        res = provider_object.save()
        if provider["intern"] != 0:
            print(provider_object.id)

    except DataError:
        print(provider)

### Provider end ###

### Privoder Creditations START ###
print("> Starting ProviderCreditation")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM bornebasen_udbydere_udmaerkelse")
data = cursor.fetchall()
pl_titles = ["id", "udbyder_id", "udmaerkelse_id"]
pl_raw_data = []
for udm_data in data:
    pl_raw_data.append(dict(zip(pl_titles, udm_data)))

for link in pl_raw_data:
    try:
        provider_pl = Provider.objects.get(pk=link["udbyder_id"])
        creditation = Creditation.objects.get(pk=link["udmaerkelse_id"])
        provider_pl.creditations.add(creditation)
        provider_pl.save()
    except Exception as e:
        if not str(e).startswith("Provider"):
            print(
                f"Failed link from prov={link['udbyder_id']} to cred={link['udmaerkelse_id']}"
            )
            print(e)

### Privoder Creditations END ###

### Provider Region START ###
print("> Starting ProviderRegion")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM bornebasen_udbydere_lokation")
data = cursor.fetchall()
pl_titles = ["id", "udbyder_id", "lokation_id"]
pl_raw_data = []
for tema_data in data:
    pl_raw_data.append(dict(zip(pl_titles, tema_data)))

for link in pl_raw_data:
    try:
        provider_pl = Provider.objects.get(pk=link["udbyder_id"])
        region = Region.objects.get(pk=link["lokation_id"])
        provider_pl.regions.add(region)
        provider_pl.save()
    except Exception as e:
        if not str(e).startswith("Provider"):
            print(
                f"Failed link from prov={link['udbyder_id']} to reg={link['lokation_id']}"
            )
            print(e)

### Provider Region END ###

### Provider Services START ###
print("> Starting ProviderServices")
print(f"> Time {round(time.time()-t0)} sec")
cursor.execute("SELECT * FROM bornebasen_udbydere_type")
data = cursor.fetchall()
titles = ["id", "udbyder_id", "type_id", "takst", "takst_doegn"]
raw_data = []
for ser_data in data:
    raw_data.append(dict(zip(titles, ser_data)))

Service.objects.all().delete()

for link in raw_data:
    try:
        provider_pt = Provider.objects.get(pk=link["udbyder_id"])
        service_category = ServiceCategory.objects.get(pk=link["type_id"])
        service = Service(
            provider=provider_pt,
            category=service_category,
            full_day_price=link["takst_doegn"],
            hourly_price=link["takst"],
        )
        service.save()
    except Exception as e:
        if not str(e).startswith("Provider"):
            print(
                f"Failed link from prov={link['udbyder_id']} to ser_cat={link['type_id']}"
            )
            print(e)

### Provider Services END ###

### Provider Theme START ###
print("Starting ProviderThemes")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM bornebasen_udbydere_tema")
data = cursor.fetchall()
pt_titles = ["id", "udbyder_id", "tema_id"]
pt_raw_data = []
for tema_data in data:
    pt_raw_data.append(dict(zip(pt_titles, tema_data)))

for link in pt_raw_data:
    try:
        provider_pt = Provider.objects.get(pk=link["udbyder_id"])
        theme = Theme.objects.get(pk=link["tema_id"])
        provider_pt.themes.add(theme)
        provider_pt.save()
    except Exception as e:
        if not str(e).startswith("Provider"):
            print(
                f"Failed link from prov={link['udbyder_id']} to tema={link['tema_id']}"
            )
            print(e)

### Provider Theme END ###

### Provider Languages ###
print("> Starting Provider Languages")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM bornebasen_udbydere_sprog")
data = cursor.fetchall()
pl_titles = ["id", "udbyder_id", "sprog_id"]
pl_raw_data = []
for lan_data in data:
    pl_raw_data.append(dict(zip(pl_titles, lan_data)))

for link in pl_raw_data:
    try:
        provider_pl = Provider.objects.get(pk=link["udbyder_id"])
        language = Language.objects.get(pk=link["sprog_id"])
        provider_pl.languages.add(language)
        provider_pl.save()
    except Exception as e:
        if not str(e).startswith("Provider"):
            print(
                f"Failed link from prov={link['udbyder_id']} to lang={link['sprog_id']}"
            )
            print(e)

### Provider Language ###

### SocialWorker start ###
print("> Starting SocialWorker")
print(f"> Time {round(time.time()-t0)} sec")

cursor.execute("SELECT * FROM users")
data = cursor.fetchall()
users_titles = [
    "id",
    "create_date",
    "name",
    "profession",
    "email",
    "phone",
    "password",
    "newsletter",
    "aktiv",
]
user_raw_data = []
for lokation_data in data:
    user_raw_data.append(dict(zip(users_titles, lokation_data)))

for user in user_raw_data:
    try:
        social_user = CustomUser.objects.create(
            email=user["email"],
        )
        social_user.password = "BBOldHasher$1$salt$" + user["password"][:60]
        social_user.is_active = bool(user["aktiv"])
        social_user.name = user["name"]
        social_user.save()

        try:
            municipality = Municipality.objects.get(
                email_domain=user["email"].split("@")[1]
            )

            if municipality:
                social_worker = SocialWorker(
                    municipality=municipality,
                    newsletter=bool(user["newsletter"]),
                    user=social_user,
                )
                social_worker.save()
            else:
                social_user.add_migration_note(
                    f"ERR-NOMUNIC Der var ikke nogen kommune der brugte {user['email'].split('@')[1]}"
                )
        except IndexError:
            social_user.is_active = False
            social_user.add_migration_note(
                f"Emailen {user['email']} har ikke en tilhørende kommune"
            )
            social_user.save()
        except Exception as e:
            pass
            # print("Failed", user["email"], e)

    except IntegrityError:
        social_user = CustomUser(email=generate_email(prefix="sw-" + user["name"]))
        social_user.old_email = user["email"]
        social_user.is_active = False
        social_user.add_migration_note(
            f"En anden bruger havde allerede email: {user['email']}"
        )
        social_user.save()

### SocialWorker end ###

db.close()
