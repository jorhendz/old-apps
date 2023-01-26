from accounts.models import CustomUser
from boernebasen import settings
from django.contrib import admin

from .models import *

""" General advice from Stack Overflow on search_fields:
    Don't search on a foreign key directly ('user') but search for
    'user__email', for example, or 'municipality__name' rather
    than 'municipality' """


class ServiceInline(admin.TabularInline):
    model = Service


class ProviderActiveFilter(admin.SimpleListFilter):
    title = 'Aktiv'
    parameter_name = 'is_ready'

    def lookups(self, request, model_admin):
        return (
            ('active', 'Offentlig'),
            ('inactive', 'Skjult'),
        )

    def queryset(self, request, queryset):
        value = self.value()

        if value == 'active':
            return queryset.filter(
                id__in=[p.id for p in Provider.objects.all() if p.is_ready]
            )
        elif value == 'inactive':
            return queryset.filter(
                id__in=[p.id for p in Provider.objects.all() if not p.is_ready]
            )
        return queryset


@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    inlines = [ServiceInline]

    list_display = (
        "id",
        "name",
        "membership",
        "admin_first_name",
        "note",
        "data_checked",
        "owned_by",
        "is_ready",
        "created_at",
    )
    list_display_links = (
        "name",
        "admin_first_name",
        "note",
        "data_checked",
        "is_ready",
        "created_at",
    )
    list_filter = (
        ProviderActiveFilter,
        "owned_by",
        "created_at",
        "creditations",
        "membership",
        "data_checked",
    )
    list_editable = ("owned_by", "membership")

    search_fields = (
        "contact_email",
        "name",
        "user__email",
        "note",
        "user__migration_notes",
    )


@admin.register(SocialWorker)
class SocialWorker(admin.ModelAdmin):
    list_display = ("user", "municipality", "created_at")
    list_editable = ("municipality",)
    list_filter = (
        "municipality",
        "created_at",
    )
    search_fields = ("user__email", "municipality__name")


@admin.register(ProfessionalSubscriber)
class ProfessionalSubscriber(admin.ModelAdmin):
    list_display = ("user", "municipality", "created_at")
    list_editable = ("municipality",)
    list_filter = (
        "municipality",
        "created_at",
    )
    search_fields = ("user__email", "municipality__name")


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("name", "provider_count")


admin.site.register(Theme)
admin.site.register(Municipality)
admin.site.register(WorkMethod)
admin.site.register(SharedKnowledge)
admin.site.register(ServiceCategory)
admin.site.register(Region)
admin.site.register(PostalCode)
admin.site.register(Area)
admin.site.register(ToolboxTool)

admin.site.site_header = "Børnebasen back office"
admin.site.index_title = "Børnebasen"
admin.site.site_title = "Back office"
