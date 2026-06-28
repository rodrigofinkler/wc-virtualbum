from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)
    group = models.CharField(max_length=1)

    class Meta:
        verbose_name_plural = "countries"
        ordering = ["group", "name"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class Sticker(models.Model):
    name = models.CharField(max_length=10)
    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.name
