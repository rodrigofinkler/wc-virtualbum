from rest_framework import serializers

from .models import Country, Sticker, UserSticker


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
        owned_ids = self.context.get("owned_ids")
        if owned_ids is not None:
            return obj.id in owned_ids
        user = self.context.get("shared_user") or self.context["request"].user
        if user.is_authenticated:
            return UserSticker.objects.filter(sticker=obj, user=user).exists()
        return False


class UserStickerSerializer(serializers.ModelSerializer):
    sticker = StickerSerializer(read_only=True)
    sticker_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserSticker
        fields = ["id", "sticker", "sticker_id", "added_at"]
        read_only_fields = ["added_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        obj, _ = UserSticker.objects.get_or_create(
            user=user,
            sticker_id=validated_data["sticker_id"],
        )
        return obj
