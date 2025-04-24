from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstructorViewSet, CourseViewSet, StudentViewSet, RegistrationViewSet, dashboard_summary

router = DefaultRouter()
router.register(r'instructors', InstructorViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'students', StudentViewSet)
router.register(r'registrations', RegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-summary/', dashboard_summary, name='dashboard-summary'),

]