import csv
import requests

from django.core.management.base import BaseCommand

from api.models import City, Country, State


class Command(BaseCommand):
    help = 'Fetch country, state/district and city names and their coordinates'

    def handle(self, *args, **options):
        header = {'X-CSCAPI-KEY': 'UGNFd2VNZWJsOXE4WEFkSHVzZUwzT1Z3aEg2VXNva3MyYWR3WEtaSw=='}
        base_url = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/'

        # fetch countries
        countries_url = base_url + 'countries.json'
        countries_data = requests.get(countries_url, headers=header).json()
        countries = []
        for country in countries_data:
            countries.append(Country(
                name=country['name'], 
                country_code=country['iso2'],
                latitude=float(country['latitude']) if country['latitude'] else None, 
                longitude=float(country['longitude']) if country['longitude'] else None
            ))
        Country.objects.bulk_create(countries)
        self.stdout.write(self.style.SUCCESS('Countries fetched. Fetching states/districts...'))

        # fetch states/districts
        states_url = base_url + 'states.json'
        states_data = requests.get(states_url, headers=header).json()
        states = []
        for state in states_data:
            # State.objects.create(
            states.append(State(
                name=state['name'], 
                country=Country.objects.get(country_code=state['country_code']),
                state_code=state['state_code'],
                latitude=float(state['latitude']) if state['latitude'] else None, 
                longitude=float(state['longitude']) if state['longitude'] else None
            ))
        State.objects.bulk_create(states, batch_size=1250)
        self.stdout.write(self.style.SUCCESS('States/districts fetched. Fetching cities...'))

        # fetch cities
        cities_url = base_url + 'cities.json'
        cities_data = requests.get(cities_url, headers=header).json()
        cities = []
        for city in cities_data:
            country = Country.objects.get(country_code=city['country_code'])
            try:
                state = State.objects.get(country=country, state_code=city['state_code'])
            except State.DoesNotExist as e:
                state = None

            city = City(
                name=city['name'], 
                country=country,
                state=state,
                latitude=float(city['latitude']) if city['latitude'] else None, 
                longitude=float(city['longitude']) if city['longitude'] else None
            )
            cities.append(city)
        City.objects.bulk_create(cities, batch_size=1250)

        self.stdout.write(self.style.SUCCESS('Cities fetched. Done.'))