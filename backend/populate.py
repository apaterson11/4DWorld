import os
import uuid
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'psd_backend.settings')

import django
django.setup()
from api.models import Layer
from django.contrib.auth.models import User

def main():
    add_layer("Default", "Default")

def add_layer(name, description):
    l = Layer.objects.get_or_create(name=name, description=description)[0]
    l.save()
    return l

def add_user(email, username, password):
    #id = uuid.uuid4()
    u = User.objects.create( 
        username = username,
        email = email,
        password = password
    )
    u.save()

if __name__ == "__main__":
    main()