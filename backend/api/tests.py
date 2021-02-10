from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

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
