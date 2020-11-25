from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token


class UserRegisterSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    def create(self,validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )

    def get_token(self, user):
        token, _ = Token.objects.get_or_create(user=user)
        return str(token)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'token']
