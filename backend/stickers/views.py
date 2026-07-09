from django.contrib.auth import authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Country, Sticker, UserSticker
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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


@api_view(["POST"])
@csrf_exempt
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user": {"id": user.id, "username": user.username, "email": user.email},
            }
        )
    return Response({"error": "Invalid credentials"}, status=401)


@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"ok": True})


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def status_view(request):
    return Response({"ok": True})


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def shared_view(request):
    from django.contrib.auth import get_user_model

    User = get_user_model()
    user = User.objects.get(username="rodrigo")
    stickers = Sticker.objects.select_related("country").all()
    serializer = StickerSerializer(
        stickers, many=True, context={"request": request, "shared_user": user}
    )
    return Response(serializer.data)


@api_view(["GET"])
def me_view(request):
    if request.user.is_authenticated:
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            }
        )
    return Response({"error": "Not authenticated"}, status=401)
