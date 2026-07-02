import django.db.models.deletion
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations, models


def create_auth_user(apps, schema_editor):
    User = apps.get_model("auth", "User")
    OldUser = apps.get_model("stickers", "User")

    old = OldUser.objects.first()
    if old is None:
        return

    # create auth user with the same id so existing FK values stay valid
    auth_user = User.objects.create(
        id=old.id,
        username="rodrigo",
        email=old.email or "rodrigo@example.com",
        password=make_password("rodrigo"),
        is_active=True,
    )
    # also ensure the id sequence is past any existing value
    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT setval('auth_user_id_seq', GREATEST(%s, nextval('auth_user_id_seq') - 1))",
            [auth_user.id],
        )


def reverse_func(apps, schema_editor):
    User = apps.get_model("auth", "User")
    User.objects.filter(username="rodrigo").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("stickers", "0002_user_usersticker"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(create_auth_user, reverse_func),
        migrations.AlterField(
            model_name="usersticker",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="stickers",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.DeleteModel(
            name="User",
        ),
    ]
