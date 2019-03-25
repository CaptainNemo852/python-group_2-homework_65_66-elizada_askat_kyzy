from webapp.models import Movie, Hall, Show, Seat, Category, Booking, Discount, Tickets
from rest_framework import viewsets
from api_v1.serializers import MovieCreateSerializer, MovieDisplaySerializer, HallSerializer, \
    ShowSerializer, SeatSerializer, CategorySerializer, BookingCreateSerializer, \
    DiscountSerializer, TicketsSerializer, BookingDisplaySerializer, UserSerializer, UserUpdateSerializer
from django_filters import rest_framework as filters
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class UserCreateView(CreateAPIView):
    model = User
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetailView(viewsets.ModelViewSet):
    queryset = User.objects.all()

    model = User
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'id': user.pk,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
})


class BaseViewSet(viewsets.ModelViewSet):
    # Метод, который отвечает за проверку разрешений на доступ к данному ViewSet
    def get_permissions(self):
        permissions = super().get_permissions()
        # IsAuthenticated - класс разрешения, требующий аутентификацию
        # добавляем его объект IsAuthenticated() к разрешениям только
        # для "опасных" методов - добавление, редактирование, удаление данных
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated(), IsAdminUser())
        return permissions



class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.active().order_by('-release_date')
    serializer_class = MovieCreateSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return MovieDisplaySerializer
        else:
            return MovieCreateSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer


# Shows
class ShowFilter(filters.FilterSet):
    movie_id = filters.NumberFilter(field_name="movie_id")
    hall_id = filters.NumberFilter(field_name='hall_id')
    starts_after = filters.DateFilter(field_name="begin_show_time", lookup_expr='gte')
    starts_before = filters.DateFilter(field_name="begin_show_time", lookup_expr='lte')

    class Meta:
        model: Show
        fields = ['movie_id', 'hall_id', 'starts_after', 'starts_before']


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ShowFilter

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
#


class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all().order_by('-hall')
    serializer_class = SeatSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer

    def get_serializer_class(self):
        if self.request.method == "GET":
            return BookingDisplaySerializer
        else:
            return BookingCreateSerializer


class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Tickets.objects.all()
    serializer_class = TicketsSerializer
