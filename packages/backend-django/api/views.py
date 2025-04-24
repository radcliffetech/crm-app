from .models import Instructor, Course, Student, Registration
from .serializers import InstructorSerializer, CourseSerializer, StudentSerializer, RegistrationSerializer, CourseListSerializer
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 100

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all().order_by("-created_at")
    serializer_class = InstructorSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name_first", "name_last", "email"]
    ordering_fields = ["name_last"]
    ordering = ["name_last"]

    def update(self, request, *args, **kwargs):
        print("Incoming data:", request.data)   
        return super().update(request, *args, **kwargs)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.order_by("-created_at")
    serializer_class = CourseSerializer
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        return CourseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.query_params.get("active_courses") == "true":
            today = now().date()
            queryset = queryset.filter(start_date__lte=today, end_date__gte=today)
        instructor_id = self.request.query_params.get("instructor_id")
        if instructor_id:
            queryset = queryset.filter(instructor_id=instructor_id)
        return queryset

def create(self, validated_data):
    instructor_id = validated_data.pop("instructor_id")
    instructor = Instructor.objects.get(id=instructor_id)
    return Course.objects.create(instructor=instructor, **validated_data)

def update(self, instance, validated_data):
    print("Incoming course data:", self.request.data)
    instructor_id = validated_data.pop("instructor_id", None)
    if instructor_id:
        instance.instructor = Instructor.objects.get(id=instructor_id)

    # Check to see if the instrcutor has changed...
    if instance.instructor != instructor_id:
        print("Instructor has changed")
        # Perform any additional logic here if needed
    # Check to see if the course fee has changed...
    if instance.course_fee != validated_data.get("course_fee", instance.course_fee):
        print("Course fee has changed")
        # Perform any additional logic here if needed

    return super().update(instance, validated_data)    

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("-created_at")
    serializer_class = StudentSerializer
    pagination_class = StandardResultsSetPagination

    # def get_queryset(self):
    #     TODO - Filter students who are in an active by the instructor


class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all().order_by("-created_at")
    serializer_class = RegistrationSerializer
    pagination_class = StandardResultsSetPagination

@api_view(["GET"])
def dashboard_summary(request):
    return Response({
        "studentCount": Student.objects.count(),
        "instructorCount": Instructor.objects.count(),
        "courseCount": Course.objects.count(),
        "registrationCount": Registration.objects.count(),
    })