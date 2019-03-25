from webapp.models import Movie, Hall, Seat, Show, Category, Booking, Discount, Tickets
from rest_framework import serializers
from django.contrib.auth.models import User



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    # validated_data - содержит все данные, пришедшие при запросе (уже проверенные на правильность заполнения)
    def create(self, validated_data):
        # выкидываем из validated_data поле пароля и присваиваем его содержимое в переменную password
        password = validated_data.pop('password')
        # распаковываем validated_data и передаем все поля, кроме пароля, в user
        # для распаковки используется ** для словарей, * - для списков
        user = User.objects.create(**validated_data)
        # записываем пароль отдельно, чтобы он хранился в зашифрованном виде (hash), используя спец. метод set_password
        user.set_password(password)
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email']

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    def update(self, instance, validated_data):

        instance.first_name = validated_data.get('first_name')
        instance.last_name = validated_data.get('last_name')
        instance.email = validated_data.get('email')

        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email']



class ShowSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:show-detail')

    movie_url = serializers.HyperlinkedRelatedField(
        view_name='api_v1:movie-detail',
        read_only=True,
        source='movie'
    )

    hall_url = serializers.HyperlinkedRelatedField(
        view_name='api_v1:hall-detail',
        read_only=True,
        source='hall'
    )

    hall_name = serializers.SerializerMethodField(read_only=True, source='hall')
    movie_name = serializers.SerializerMethodField(read_only=True, source='movie')

    def get_movie_name(self, show):
        return show.movie.name

    def get_hall_name(self, show):
        return show.hall.name

    class Meta:
        model = Show
        fields = ('id', 'url', 'movie_url', 'hall_url', 'begin_show_time', 'finish_show_time',
                  'ticket_price', 'movie', 'hall', 'is_deleted', 'hall_name', 'movie_name')


class CategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:category-detail')

    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'url')


# For displaying id and name of the genre of movie in Movie serializer
class InlineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class SeatSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:seat-detail')

    class Meta:
        model = Seat
        fields = ('id', 'url', 'row', 'seat', 'hall')


# Serializer for displaying seats in Hall serializer
class InlineSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ('id', 'row', 'seat')


class HallSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:hall-detail')
    seat = InlineSeatSerializer(many=True, read_only=True)

    class Meta:
        model = Hall
        fields = ('id', 'url',  'name', 'seat')


class MovieCreateSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:movie-detail')

    class Meta:
        model = Movie
        fields = ('id', 'name', 'description', 'poster', 'release_date',
                  'finish_date', 'categories', 'is_deleted', 'url')


class MovieDisplaySerializer(MovieCreateSerializer):
    categories = InlineCategorySerializer(many=True, read_only=True)


# For creating booking and for displaying same as Movie serializers
class BookingCreateSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:booking-detail')
    show_url = serializers.HyperlinkedRelatedField(view_name='api_v1:show-detail', read_only=True, source='show')

    class Meta:
        model = Booking
        fields = ('id', 'url', 'unique_code', 'created_date', 'updated_date', 'show', 'seats', 'status', 'show_url')


class BookingDisplaySerializer(BookingCreateSerializer):
    seats = InlineSeatSerializer(many=True, read_only=True)
#


class DiscountSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:discount-detail')

    class Meta:
        model = Discount
        fields = ('name', 'url', 'discount', 'disc_started', 'disc_finished')


class TicketsSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:tickets-detail')
    seat = InlineSeatSerializer()
    show_url = serializers.HyperlinkedRelatedField(view_name='api_v1:show-detail', read_only=True, source='show')

    class Meta:
        model = Tickets
        fields = ('show', 'url', 'show_url', 'seat', 'ticket_discount', 'returned')
