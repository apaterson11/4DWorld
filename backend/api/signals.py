from django.contrib.auth.models import Group, User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Layer, Map, Profile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile(user=instance)
        group = Group.objects.create(name=f"{instance.username} (me)")
        group.user_set.add(instance)
        group.save()
        profile.default_group = group
        profile.save()

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=Map)
def create_layer_with_map(sender, instance, created, **kwargs):
    if created:
        layer = Layer(name=f'Map {instance.id} Base', description="Base layer", map=instance)
        layer.save()