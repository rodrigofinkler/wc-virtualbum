from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CountryViewSet, StickerViewSet, UserStickerViewSet

router = DefaultRouter()
router.register("stickers", StickerViewSet)
router.register("countries", CountryViewSet)
router.register("user-stickers", UserStickerViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
