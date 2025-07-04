from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Cart


# Signals to create a cart whenever a new user is created
@receiver(post_save, sender=User)
def create_or_update_cart(sender, instance, created, **kwargs):
    if created:
        # Create a new cart for the user
        Cart.objects.create(user=instance)