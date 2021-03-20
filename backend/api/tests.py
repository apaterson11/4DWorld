from django.contrib.auth.models import User
from django.db.models.deletion import ProtectedError
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from api.models import Project, Map, MapStyle, Layer

# Create your tests here.
class TestUserRegisterAndLoginView(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.token_url = reverse('token_obtain_pair')

    def test_user_can_register(self):
        """ Tests that a user can be succesfully registered """
        data = {
            "email": "test@test.com",
            "password": "password",
            "username": "test_user"
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, 201)

        # test that re-adding the user fails due to duplicate username/email
        response2 = self.client.post(self.register_url, data)
        self.assertEqual(response2.status_code, 400)

    def test_login_returns_tokens(self):
        """ Ensures the login route returns an access and refresh token """
        user_details = dict(username='test', password='test')
        user = User.objects.create_user(**user_details)
        response = self.client.post(
            reverse('token_obtain_pair'), user_details
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())


class TestUserDetailViewset(TestCase):
    def setUp(self):
        """ Performs setup by creating a user and obtaining
            an access token, and storing as instance variables
        """
        self.client = APIClient()
        self.url = reverse('user-details-list')
        self.user_details = dict(
            username='test', password='test'
        )
        User.objects.create_user(**self.user_details)
        self.access_token = self.client.post(
            reverse('token_obtain_pair'), self.user_details
        ).json()['access']
        self.auth_header = f'JWT {self.access_token}'
    
    def test_unauthenticated_users_cannot_get_user_details(self):
        """ Tests that unauthenticated users CANNOT access the 
            User Details endpoint
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_get_user_details(self):
        """ Tests that authenticated users CAN access the 
            User Details endpoint
        """
        response = self.client.get(self.url, {}, HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(response.status_code, 200)


class ProjectTests(TestCase):
    def setUp(self):
        """ Performs setup by creating a user and obtaining
            an access token, and storing as instance variables
        """
        self.client = APIClient()
        self.url = reverse('user-details-list')
        self.user_details = dict(
            username='test', password='test'
        )
        User.objects.create_user(**self.user_details)
        self.access_token = self.client.post(
            reverse('token_obtain_pair'), self.user_details
        ).json()['access']
        self.auth_header = f'JWT {self.access_token}'

    def test_layer_is_created_with_map(self):
        map_post_endpoint = reverse('maps-list')
        project = Project.objects.create(title='test', description='test')

        # ensure that there are no layers in the DB
        self.assertEqual(Layer.objects.count(), 0)

        # create a Map
        response = self.client.post(map_post_endpoint, {
            'id': 1,
            'project': project.id,
            'latitude': 34.4,
            'longitude': 54.2,
            'zoom': 10,
            'style': MapStyle.objects.create(
                min_zoom=10, max_zoom=12, name='x', attribution='a', url='https://x.com'
            ).id
        }, HTTP_AUTHORIZATION=self.auth_header)

        # ensure an associated layer has been created
        self.assertEqual(Layer.objects.filter(map=1).count(), 1)

    def test_user_default_group_is_created(self):
        user = User.objects.get(username=self.user_details.get('username'))
        self.assertEqual(user.profile.default_group.name, f"{user.username} (me)")

    def test_user_cannot_delete_default_group(self):
        user = User.objects.get(username=self.user_details.get('username'))
        delete_grp_endpoint = reverse(
            'groups-detail', kwargs={"pk": user.profile.default_group.pk}
        )

        with self.assertRaises(ProtectedError) as err:
            response = self.client.delete(
                delete_grp_endpoint,
                HTTP_AUTHORIZATION=self.auth_header
            )
