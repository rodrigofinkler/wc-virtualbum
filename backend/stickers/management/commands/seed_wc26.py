from django.core.management.base import BaseCommand
from stickers.models import Country, Sticker

COUNTRIES = [
    ("Mexico", "MEX", "A"), ("South Africa", "RSA", "A"), ("Korea Republic", "KOR", "A"), ("Czechia", "CZE", "A"),
    ("Canada", "CAN", "B"), ("Bosnia-Herzegovina", "BIH", "B"), ("Qatar", "QAT", "B"), ("Switzerland", "SUI", "B"),
    ("Brazil", "BRA", "C"), ("Morocco", "MAR", "C"), ("Haiti", "HAI", "C"), ("Scotland", "SCO", "C"),
    ("USA", "USA", "D"), ("Paraguay", "PAR", "D"), ("Australia", "AUS", "D"), ("Türkiye", "TUR", "D"),
    ("Germany", "GER", "E"), ("Curaçao", "CUW", "E"), ("Côte d'Ivoire", "CIV", "E"), ("Ecuador", "ECU", "E"),
    ("Netherlands", "NED", "F"), ("Japan", "JPN", "F"), ("Sweden", "SWE", "F"), ("Tunisia", "TUN", "F"),
    ("Belgium", "BEL", "G"), ("Egypt", "EGY", "G"), ("IR Iran", "IRN", "G"), ("New Zealand", "NZL", "G"),
    ("Spain", "ESP", "H"), ("Cabo Verde", "CPV", "H"), ("Saudi Arabia", "KSA", "H"), ("Uruguay", "URU", "H"),
    ("France", "FRA", "I"), ("Senegal", "SEN", "I"), ("Iraq", "IRQ", "I"), ("Norway", "NOR", "I"),
    ("Argentina", "ARG", "J"), ("Algeria", "ALG", "J"), ("Austria", "AUT", "J"), ("Jordan", "JOR", "J"),
    ("Portugal", "POR", "K"), ("Congo DR", "COD", "K"), ("Uzbekistan", "UZB", "K"), ("Colombia", "COL", "K"),
    ("England", "ENG", "L"), ("Croatia", "CRO", "L"), ("Ghana", "GHA", "L"), ("Panama", "PAN", "L"),
]


class Command(BaseCommand):
    help = "Seeds complete FIFA World Cup 26 sticker collection"

    def handle(self, *args, **options):
        Sticker.objects.all().delete()
        Country.objects.all().delete()

        # 1. create countries
        country_map = {}
        for name, code, group in COUNTRIES:
            country, _ = Country.objects.get_or_create(
                code=code, defaults={"name": name, "group": group}
            )
            country_map[code] = country

        total = 0

        # 2. sticker 00 – dedicated Panini sticker
        Sticker.objects.create(name="00")

        # 3. FWC00–FWC08 (9 stickers)
        for i in range(9):
            Sticker.objects.create(name=f"FWC0{i}")

        # 4. country stickers – each country 20 stickers (CODE01–CODE20)
        for code in [c[1] for c in COUNTRIES]:
            country = country_map[code]
            for i in range(1, 21):
                Sticker.objects.create(
                    name=f"{code}{i:02d}",
                    country=country,
                )
                total += 1

        # 5. FWC09–FWC19 (11 stickers)
        for i in range(9, 20):
            Sticker.objects.create(name=f"FWC{i:02d}")

        # 6. CC01–CC14 (14 Coca-Cola stickers)
        for i in range(1, 15):
            Sticker.objects.create(name=f"CC{i:02d}")

        total += 1 + 9 + 11 + 14  # non-country stickers
        self.stdout.write(self.style.SUCCESS(
            f"Created {Country.objects.count()} countries and {Sticker.objects.count()} stickers"
        ))
