from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = "Drops all tables, runs migrations, and seeds fresh data"

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute(
                "DROP TABLE IF EXISTS "
                "stickers_sticker, stickers_country, "
                "django_admin_log, auth_permission, auth_group_permissions, "
                "auth_group, auth_user_groups, auth_user_user_permissions, "
                "auth_user, auth_user, django_content_type, "
                "django_session, django_migrations "
                "CASCADE"
            )
        self.stdout.write("Tables dropped")

        call_command("migrate")
        self.stdout.write("Migrations applied")

        call_command("seed_wc26")
        self.stdout.write(self.style.SUCCESS("Database reset and seeded"))
