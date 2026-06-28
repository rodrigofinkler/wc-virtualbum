from rest_framework import viewsets
from .models import Country, Sticker
from .serializers import CountrySerializer, StickerSerializer


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class StickerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sticker.objects.select_related("country").all()
    serializer_class = StickerSerializer
