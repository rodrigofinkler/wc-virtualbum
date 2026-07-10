from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from rest_framework.authtoken.models import Token


class Command(BaseCommand):
    help = "Creates a new user with an auth token"

    def add_arguments(self, parser):
        parser.add_argument("username", type=str)
        parser.add_argument("password", type=str)

    def handle(self, *args, **options):
        from django.contrib.auth.models import User

        username = options["username"]
        password = options["password"]

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": f"{username}@example.com",
                "password": make_password(password),
                "is_active": True,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"User '{username}' created"))
        else:
            self.stdout.write(self.style.WARNING(f"User '{username}' already exists"))

        token, _ = Token.objects.get_or_create(user=user)
        self.stdout.write(self.style.SUCCESS(f"Auth token: {token.key}"))
