from django.db import models
from django.conf import settings
import random
import string


class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.name


class SoftDeleteMovieManager(models.Manager):
    def active(self):
        return self.filter(is_deleted=False)

    def deleted(self):
        return self.filter(is_deleted=True)


class Movie(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)
    poster = models.ImageField(upload_to='posters', null=True, blank=True)
    release_date = models.DateField()
    finish_date = models.DateField(null=True, blank=True)
    categories = models.ManyToManyField(Category, related_name='movie')
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteMovieManager()

    def __str__(self):
        return self.name


class Hall(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Seat(models.Model):
    row = models.CharField(max_length=255, null=True, blank=True)
    seat = models.CharField(max_length=255, null=True, blank=True)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='seat')

    def __str__(self):
        return 'Your seat: {0}, Your row: {1} Hall is : {2}'.format(self.seat, self.row, self.hall.name)


class SoftDeleteShowManager(models.Manager):
    def active(self):
        return self.filter(is_deleted=False)


class Show(models.Model):
    begin_show_time = models.DateTimeField()
    finish_show_time = models.DateTimeField()
    ticket_price = models.DecimalField(max_digits=6, decimal_places=2)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='show_movie')
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='show_hall')
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteShowManager()

    def __str__(self):
        return '{0} Show time is: {1} - {2}'\
            .format(self.movie,
                    self.begin_show_time.strftime('%d.%m. %Y %H:%M'),
                    self.finish_show_time.strftime('%d.%m. %Y %H:%M'))


class Discount(models.Model):
    name = models.CharField(max_length=255)
    discount = models.DecimalField(max_digits=4, decimal_places=2)
    disc_started = models.DateTimeField(blank=True, null=True)
    disc_finished = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return '%s, discount is: %.2f' % (self.name, float(self.discount))


def generate_code():
    code = ""
    for i in range(0, settings.BOOKING_CODE_LENGTH):
        code += random.choice(string.digits)
    return code


class Booking(models.Model):
    BOOKING_STATUS = (
        ("Created", "Создано"),
        ("Bought", "Выкуплено"),
        ("Canceled", "Отменено")
    )

    unique_code = models.CharField(max_length=12, unique_for_date='created_date', default=generate_code, editable=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    show = models.ForeignKey(Show, on_delete=models.CASCADE, related_name='booked_show')
    seats = models.ManyToManyField(Seat, related_name='booked_seat')
    status = models.CharField(max_length=12, choices=BOOKING_STATUS, default='Created')

    def __str__(self):
        return "%s, %s" % (self.show, self.unique_code)

    def get_seats_display(self):
        seats = ""
        for seat in self.seats.all():
            seats += "R:%s S:%s" % (seat.row, seat.seat)
        return seats


class Tickets(models.Model):
    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name='tickets_on_show')
    seat = models.ForeignKey(Seat, on_delete=models.PROTECT, related_name='tickets_on_seat')
    ticket_discount = models.ForeignKey(Discount, on_delete=models.PROTECT,
                                        related_name='tickets_discount', blank=True, null=True)
    returned = models.BooleanField(default=False)

    def __str__(self):
        return "%s, %s" % (self.show, self.seat)
