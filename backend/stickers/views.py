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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = context["request"].user
        if user.is_authenticated:
            context["owned_ids"] = set(
                UserSticker.objects.filter(user=user).values_list("sticker_id", flat=True)
            )
        return context


class UserStickerViewSet(viewsets.ModelViewSet):
    queryset = UserSticker.objects.select_related("sticker__country", "user").all()
    serializer_class = UserStickerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = context["request"].user
        context["owned_ids"] = set(
            UserSticker.objects.filter(user=user).values_list("sticker_id", flat=True)
        )
        return context


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
def shared_view(request, username):
    from django.contrib.auth import get_user_model

    User = get_user_model()
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    stickers = Sticker.objects.select_related("country").all()
    owned_ids = set(UserSticker.objects.filter(user=user).values_list("sticker_id", flat=True))
    serializer = StickerSerializer(
        stickers, many=True, context={"request": request, "owned_ids": owned_ids}
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


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def users_view(request):
    from django.contrib.auth import get_user_model
    from django.db.models import Count

    User = get_user_model()
    total_stickers = Sticker.objects.count()
    users = (
        User.objects.filter(is_active=True)
        .annotate(owned_count=Count("stickers"))
        .order_by("username")
    )
    data = [
        {
            "id": u.id,
            "username": u.username,
            "owned": u.owned_count,
            "total": total_stickers,
            "pct": round((u.owned_count / total_stickers) * 100) if total_stickers else 0,
        }
        for u in users
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def progress_view(request):
    from collections import OrderedDict

    from django.contrib.auth import get_user_model

    User = get_user_model()
    username = request.query_params.get("username")
    if username:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
    elif request.user.is_authenticated:
        user = request.user
    else:
        return Response({"error": "Not authenticated"}, status=401)

    owned_ids = set(UserSticker.objects.filter(user=user).values_list("sticker_id", flat=True))
    stickers = Sticker.objects.select_related("country").all()

    slug_to_group = {
        "panini": "Panini",
        "fwc": "FWC",
        "a": "Group A",
        "b": "Group B",
        "c": "Group C",
        "d": "Group D",
        "e": "Group E",
        "f": "Group F",
        "g": "Group G",
        "h": "Group H",
        "i": "Group I",
        "j": "Group J",
        "k": "Group K",
        "l": "Group L",
        "cc": "Coca-Cola",
    }
    group_to_slug = {v: k for k, v in slug_to_group.items()}

    group_countries = {}
    for s in stickers:
        if s.country:
            g = f"Group {s.country.group}"
            if g not in group_countries:
                group_countries[g] = []
            if s.country.code not in group_countries[g]:
                group_countries[g].append(s.country.code)

    groups = OrderedDict()
    for s in stickers:
        if s.name == "00":
            key = "Panini"
        elif s.name.startswith("FWC"):
            key = "FWC"
        elif s.name.startswith("CC"):
            key = "Coca-Cola"
        elif s.country:
            key = f"Group {s.country.group}"
        else:
            continue
        if key not in groups:
            groups[key] = {
                "label": key,
                "slug": group_to_slug.get(key),
                "total": 0,
                "owned": 0,
                "country_codes": group_countries.get(key, []),
            }
        groups[key]["total"] += 1
        if s.id in owned_ids:
            groups[key]["owned"] += 1
    for g in groups.values():
        g["pct"] = round(g["owned"] / g["total"] * 100) if g["total"] else 0

    country_order = []
    seen = set()
    for s in stickers:
        code = s.country.code if s.country else None
        if code and code not in seen:
            seen.add(code)
            country_order.append(code)

    countries_list = []
    panini_stickers = [s for s in stickers if s.name == "00"]
    fwc_stickers = [s for s in stickers if s.name.startswith("FWC")]
    cc_stickers = [s for s in stickers if s.name.startswith("CC")]

    if panini_stickers:
        owned = sum(1 for s in panini_stickers if s.id in owned_ids)
        countries_list.append(
            {
                "label": "Panini",
                "code": "PANINI",
                "total": len(panini_stickers),
                "owned": owned,
                "pct": round(owned / len(panini_stickers) * 100),
            }
        )
    if fwc_stickers:
        owned = sum(1 for s in fwc_stickers if s.id in owned_ids)
        countries_list.append(
            {
                "label": "FWC",
                "code": "FWC",
                "total": len(fwc_stickers),
                "owned": owned,
                "pct": round(owned / len(fwc_stickers) * 100),
            }
        )

    code_to_country = {}
    for c in Country.objects.all():
        code_to_country[c.code] = c

    for code in country_order:
        country_stickers = [s for s in stickers if s.country and s.country.code == code]
        if not country_stickers:
            continue
        c = code_to_country.get(code)
        owned = sum(1 for s in country_stickers if s.id in owned_ids)
        countries_list.append(
            {
                "label": c.name if c else code,
                "code": code,
                "total": len(country_stickers),
                "owned": owned,
                "pct": round(owned / len(country_stickers) * 100),
            }
        )

    if cc_stickers:
        owned = sum(1 for s in cc_stickers if s.id in owned_ids)
        countries_list.append(
            {
                "label": "Coca-Cola",
                "code": "CC",
                "total": len(cc_stickers),
                "owned": owned,
                "pct": round(owned / len(cc_stickers) * 100),
            }
        )

    return Response({"by_group": list(groups.values()), "by_country": countries_list})
