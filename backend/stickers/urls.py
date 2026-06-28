from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, StickerViewSet

router = DefaultRouter()
router.register("stickers", StickerViewSet)
router.register("countries", CountryViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
