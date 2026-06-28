from django.contrib import admin

from .models import Country, Sticker, User, UserSticker


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "group"]
    list_filter = ["group"]


@admin.register(Sticker)
class StickerAdmin(admin.ModelAdmin):
    list_display = ["name", "country"]
    list_filter = ["name"]


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["name", "email"]


@admin.register(UserSticker)
class UserStickerAdmin(admin.ModelAdmin):
    list_display = ["user", "sticker", "added_at"]
