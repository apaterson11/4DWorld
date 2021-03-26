import os
import sys
import csv
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'psd_backend.settings')

import django
django.setup()
from api.models import User

def main():
    cwd = os.getcwd()
    for root, dirs, files in os.walk(cwd):
        for file in files:
            if file.endswith(".csv"):
                f=open(file, 'r')
                rows = csv.reader(f)
                next(rows, None)
                    
                for row in rows:
                    add_user(row[2], row[2].split('@')[0], row[3], row[0], row[1], row[4], row[5])
                f.close()

def add_user(email, username, password, first_name, last_name, superuser, status):
    u = User.objects.get_or_create(username=username, email=email, first_name=first_name, last_name=last_name)[0]
    u.set_password(password) 
    if (superuser == "Manager"):
        u.is_superuser = True
        u.is_staff = True
    else:
        u.is_staff = False
        u.is_superuser = False
    
    if (status == "Suspended"):
        u.is_active = False
    else:
        u.is_active = True
    print("Added user: " + email)
    u.save()

if __name__ == "__main__":
    main()