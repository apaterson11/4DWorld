import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'psd_backend.settings')

import django
django.setup()
from api.models import Layer

def main():
    add_layer("Default", "Default")

def add_layer(name, description):
    l = Layer.objects.get_or_create(name=name, description=description)[0]
    l.save()
    return l

if __name__ == "__main__":
    main()