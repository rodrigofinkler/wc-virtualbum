from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from rest_framework.authtoken.models import Token

from stickers.models import Country, Sticker, UserSticker

COUNTRIES = [
    ("Mexico", "MEX", "A"),
    ("South Africa", "RSA", "A"),
    ("Korea Republic", "KOR", "A"),
    ("Czechia", "CZE", "A"),
    ("Canada", "CAN", "B"),
    ("Bosnia-Herzegovina", "BIH", "B"),
    ("Qatar", "QAT", "B"),
    ("Switzerland", "SUI", "B"),
    ("Brazil", "BRA", "C"),
    ("Morocco", "MAR", "C"),
    ("Haiti", "HAI", "C"),
    ("Scotland", "SCO", "C"),
    ("USA", "USA", "D"),
    ("Paraguay", "PAR", "D"),
    ("Australia", "AUS", "D"),
    ("Türkiye", "TUR", "D"),
    ("Germany", "GER", "E"),
    ("Curaçao", "CUW", "E"),
    ("Côte d'Ivoire", "CIV", "E"),
    ("Ecuador", "ECU", "E"),
    ("Netherlands", "NED", "F"),
    ("Japan", "JPN", "F"),
    ("Sweden", "SWE", "F"),
    ("Tunisia", "TUN", "F"),
    ("Belgium", "BEL", "G"),
    ("Egypt", "EGY", "G"),
    ("IR Iran", "IRN", "G"),
    ("New Zealand", "NZL", "G"),
    ("Spain", "ESP", "H"),
    ("Cabo Verde", "CPV", "H"),
    ("Saudi Arabia", "KSA", "H"),
    ("Uruguay", "URU", "H"),
    ("France", "FRA", "I"),
    ("Senegal", "SEN", "I"),
    ("Iraq", "IRQ", "I"),
    ("Norway", "NOR", "I"),
    ("Argentina", "ARG", "J"),
    ("Algeria", "ALG", "J"),
    ("Austria", "AUT", "J"),
    ("Jordan", "JOR", "J"),
    ("Portugal", "POR", "K"),
    ("Congo DR", "COD", "K"),
    ("Uzbekistan", "UZB", "K"),
    ("Colombia", "COL", "K"),
    ("England", "ENG", "L"),
    ("Croatia", "CRO", "L"),
    ("Ghana", "GHA", "L"),
    ("Panama", "PAN", "L"),
]


class Command(BaseCommand):
    help = "Seeds the database for production (mirrors local dev state)"

    def handle(self, *args, **options):
        self.stdout.write("Clearing existing data…")
        UserSticker.objects.all().delete()
        Sticker.objects.all().delete()
        Country.objects.all().delete()
        Token.objects.all().delete()

        from django.contrib.auth.models import User

        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write("Creating countries…")
        country_map = {}
        for name, code, group in COUNTRIES:
            country, _ = Country.objects.get_or_create(
                code=code, defaults={"name": name, "group": group}
            )
            country_map[code] = country

        self.stdout.write("Seeding 994 stickers…")
        Sticker.objects.create(name="00")
        for i in range(1, 20):
            Sticker.objects.create(name=f"FWC{i}")
        for code in [c[1] for c in COUNTRIES]:
            country = country_map[code]
            for i in range(1, 21):
                Sticker.objects.create(name=f"{code}{i}", country=country)
        for i in range(1, 15):
            Sticker.objects.create(name=f"CC{i:02d}")

        from django.contrib.auth.models import User

        user, _ = User.objects.get_or_create(
            username="rodrigo",
            defaults={
                "email": "rodrigo@example.com",
                "password": make_password("rodrigo"),
                "is_active": True,
            },
        )
        token, _ = Token.objects.get_or_create(user=user)

        self.stdout.write(self.style.SUCCESS("User rodrigo created"))
        self.stdout.write(self.style.SUCCESS(f"Auth token: {token.key}"))

        total = Sticker.objects.count()
        self.stdout.write(
            self.style.SUCCESS(f"Done — {Country.objects.count()} countries, {total} stickers")
        )
