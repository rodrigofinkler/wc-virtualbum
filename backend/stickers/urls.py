from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CountryViewSet,
    StickerViewSet,
    UserStickerViewSet,
    login_view,
    logout_view,
    me_view,
    shared_view,
    status_view,
    users_view,
)

router = DefaultRouter()
router.register("stickers", StickerViewSet)
router.register("countries", CountryViewSet)
router.register("user-stickers", UserStickerViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/login/", login_view, name="login"),
    path("auth/logout/", logout_view, name="logout"),
    path("auth/me/", me_view, name="me"),
    path("status/", status_view, name="status"),
    path("shared/<str:username>/", shared_view, name="shared"),
    path("users/", users_view, name="users"),
]
