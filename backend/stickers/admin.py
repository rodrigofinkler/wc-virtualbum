from django.contrib import admin
from .models import Country, Sticker


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "group"]
    list_filter = ["group"]


@admin.register(Sticker)
class StickerAdmin(admin.ModelAdmin):
    list_display = ["name", "country"]
    list_filter = ["name"]
