from django.core.management.base import BaseCommand
from stickers.models import Sticker


DEMO_STICKERS = [
    {"name": "Lionel Messi", "collection": "FIFA World Cup 2022", "number": "1"},
    {"name": "Kylian Mbappé", "collection": "FIFA World Cup 2022", "number": "2"},
    {"name": "Cristiano Ronaldo", "collection": "FIFA World Cup 2022", "number": "3"},
    {"name": "Neymar Jr", "collection": "FIFA World Cup 2022", "number": "4"},
    {"name": "Harry Kane", "collection": "FIFA World Cup 2022", "number": "5"},
    {"name": "Pikachu", "collection": "Pokémon Base Set", "number": "1/102"},
    {"name": "Charizard", "collection": "Pokémon Base Set", "number": "4/102"},
    {"name": "Blastoise", "collection": "Pokémon Base Set", "number": "9/102"},
    {"name": "Venusaur", "collection": "Pokémon Base Set", "number": "15/102"},
    {"name": "Mewtwo", "collection": "Pokémon Base Set", "number": "10/102"},
]


class Command(BaseCommand):
    help = "Seeds the database with demo sticker data"

    def handle(self, *args, **options):
        for data in DEMO_STICKERS:
            Sticker.objects.get_or_create(
                collection=data["collection"],
                number=data["number"],
                defaults={"name": data["name"]},
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(DEMO_STICKERS)} stickers"))
