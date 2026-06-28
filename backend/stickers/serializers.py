from rest_framework import serializers

from .models import Country, Sticker, User, UserSticker


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class StickerSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    country_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    owned = serializers.SerializerMethodField()

    class Meta:
        model = Sticker
        fields = ["id", "name", "country", "country_id", "owned"]

    def get_owned(self, obj):
        return UserSticker.objects.filter(sticker=obj).exists()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email"]


class UserStickerSerializer(serializers.ModelSerializer):
    sticker = StickerSerializer(read_only=True)
    sticker_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserSticker
        fields = ["id", "sticker", "sticker_id", "added_at"]
        read_only_fields = ["added_at"]

    def create(self, validated_data):
        user = User.objects.first()
        obj, _ = UserSticker.objects.get_or_create(
            user=user,
            sticker_id=validated_data["sticker_id"],
        )
        return obj
