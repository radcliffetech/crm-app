from .models import Instructor, Course, Student, Registration
from .serializers import InstructorSerializer, CourseSerializer, StudentSerializer, RegistrationSerializer, CourseListSerializer
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.utils.timezone import now
from django.db import transaction
from .services.email_service import EmailService

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

    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True)
        return queryset

    def update(self, request, *args, **kwargs):
        print("Incoming data:", request.data)   
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=204)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.order_by("-created_at")
    serializer_class = CourseSerializer
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        return CourseSerializer

    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True)
        if self.request.query_params.get("active_courses") == "true":
            today = now().date()
            queryset = queryset.filter(start_date__lte=today, end_date__gte=today)
        instructor_id = self.request.query_params.get("instructor_id")
        if instructor_id:
            queryset = queryset.filter(instructor_id=instructor_id)
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=204)

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

    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True)
        course_id = self.request.query_params.get("course_id")
        eligible = self.request.query_params.get("eligible_for_course")

        if course_id:
            registered_ids = Registration.objects.filter(
                registration_status="registered",
                course_id=course_id
            ).values_list("student_id", flat=True)
            if eligible == "true":
                queryset = queryset.exclude(id__in=registered_ids)
            else:
                queryset = queryset.filter(id__in=registered_ids)

        instructor_id = self.request.query_params.get("instructor_id")

        if instructor_id:
            registered_ids = Registration.objects.filter(
                registration_status="registered",
                course__instructor_id=instructor_id
            ).values_list("student_id", flat=True)
            if eligible == "true":
                queryset = queryset.exclude(id__in=registered_ids)
            else:
                queryset = queryset.filter(id__in=registered_ids)


        return queryset

    def destroy(self, request, *args, **kwargs):
        print("Destroying student:", self.request.data)
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=204)


class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all().order_by("-created_at")
    serializer_class = RegistrationSerializer
    pagination_class = StandardResultsSetPagination

    email_service = EmailService()    

    def get_queryset(self):
        queryset = super().get_queryset().filter(is_active=True)
        student_id = self.request.query_params.get("student_id")
        course_id = self.request.query_params.get("course_id")
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    @transaction.atomic
    @action(detail=False, methods=["post"], url_path="unregister")
    def unregister_student_from_course(self, request):
        student_id = request.data.get("student_id")
        course_id = request.data.get("course_id")
        print("Post data:", request.data)

        if not student_id or not course_id:
            return Response({"error": "student_id and course_id are required"}, status=400)

        try:
            registration = Registration.objects.get(student_id=student_id, course_id=course_id)
            registration.registration_status = "cancelled"
            registration.save()

            self.email_service.send_unregistration_email(
                student=Student.objects.get(id=student_id),
                course=Course.objects.get(id=course_id)
            )
            return Response({"message": "Student unregistered successfully."})
        except Registration.DoesNotExist:
            return Response({"error": "Registration not found."}, status=404)


    @transaction.atomic
    @action(detail=False, methods=["post"], url_path="register")
    def register_student_for_course(self, request):
        student_id = request.data.get("student_id")
        course_id = request.data.get("course_id")
        print("Post data:", request.data)

        if not student_id or not course_id:
            return Response({"error": "student_id and course_id are required"}, status=400)

        try:
            _ = Registration.objects.create(
                student_id=student_id,
                course_id=course_id,
                registration_status="registered",
                payment_status="pending"
            )

            self.email_service.send_registration_email(
               student=Student.objects.get(id=student_id),
                course=Course.objects.get(id=course_id)
            )
            return Response({"message": "Student registered successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(status=204)

@api_view(["GET"])
def search_all(request):
    query = request.query_params.get("q", "").strip()

    if not query:
        return Response({"error": "Missing search query parameter 'q'"}, status=400)

    students = Student.objects.filter(
        is_active=True,
        name_first__icontains=query
    ) | Student.objects.filter(
        is_active=True,
        name_last__icontains=query
    ) | Student.objects.filter(
        is_active=True,
        email__icontains=query
    )

    instructors = Instructor.objects.filter(
        is_active=True,
        name_first__icontains=query
    ) | Instructor.objects.filter(
        is_active=True,
        name_last__icontains=query
    ) | Instructor.objects.filter(
        is_active=True,
        email__icontains=query
    )

    courses = Course.objects.filter(
        is_active=True,
        title__icontains=query
    ) | Course.objects.filter(
        is_active=True,
        description__icontains=query
    )

    return Response({
        "students": StudentSerializer(students.distinct(), many=True).data,
        "instructors": InstructorSerializer(instructors.distinct(), many=True).data,
        "courses": CourseSerializer(courses.distinct(), many=True).data,
    })

@api_view(["GET"])
def dashboard_summary(request):
    return Response({
        "studentCount": Student.objects.filter(is_active=True).count(),
        "instructorCount": Instructor.objects.filter(is_active=True).count(),
        "courseCount": Course.objects.filter(is_active=True).count(),
        "registrationCount": Registration.objects.filter(is_active=True).count(),
    })

@api_view(["GET"])
def search_all(request):
    query = request.query_params.get("q", "").strip()

    if not query:
        return Response({"error": "Missing search query parameter 'q'"}, status=400)

    students = Student.objects.filter(
        is_active=True,
        name_first__icontains=query
    ) | Student.objects.filter(
        is_active=True,
        name_last__icontains=query
    ) | Student.objects.filter(
        is_active=True,
        email__icontains=query
    )

    instructors = Instructor.objects.filter(
        is_active=True,
        name_first__icontains=query
    ) | Instructor.objects.filter(
        is_active=True,
        name_last__icontains=query
    ) | Instructor.objects.filter(
        is_active=True,
        email__icontains=query
    )

    courses = Course.objects.filter(
        is_active=True,
        title__icontains=query
    ) | Course.objects.filter(
        is_active=True,
        description__icontains=query
    )

    registrations = Registration.objects.filter(
        is_active=True,
        registration_status__icontains=query
    )

    return Response({
        "students": StudentSerializer(students.distinct(), many=True).data,
        "instructors": InstructorSerializer(instructors.distinct(), many=True).data,
        "courses": CourseSerializer(courses.distinct(), many=True).data,
        "registrations": RegistrationSerializer(registrations.distinct(), many=True).data,
    })

