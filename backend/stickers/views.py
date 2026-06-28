from rest_framework import permissions, viewsets

from .models import Country, Sticker, User, UserSticker
from .serializers import CountrySerializer, StickerSerializer, UserStickerSerializer


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class StickerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sticker.objects.select_related("country").all()
    serializer_class = StickerSerializer


class UserStickerViewSet(viewsets.ModelViewSet):
    queryset = UserSticker.objects.select_related("sticker__country", "user").all()
    serializer_class = UserStickerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = User.objects.first()
        if user:
            return self.queryset.filter(user=user)
        return self.queryset.none()
