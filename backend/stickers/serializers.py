from rest_framework import serializers
from .models import Country, Sticker


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class StickerSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Sticker
        fields = ["id", "name", "country", "country_id"]
