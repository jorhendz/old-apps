from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser
from providers.models import Provider


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = (
        'id',
        'email',
        'first_name',
        'last_name',
        'old_email',
        'is_staff',
        'is_active',
        'socialworker',
        'professionalsubscriber',
        'provider',
    )
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('first_name', 'last_name', 'email', 'password')}),
        (
            'Permissions',
            {
                'fields': (
                    'is_staff',
                    'is_active',
                    'consent_given',
                    'info_mail_consent_given',
                )
            },
        ),
        ("Migrationsdata", {'fields': ('old_email', 'migration_notes')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'old_email',
                    'password1',
                    'password2',
                    'is_staff',
                    'is_active',
                ),
            },
        ),
    )
    search_fields = ('first_name', 'last_name', 'email', 'old_email', "migration_notes")
    ordering = ('email', 'old_email')
    readonly_fields = ("old_email", "migration_notes")


admin.site.register(CustomUser, CustomUserAdmin)
