from rest_framework import serializers
from .models import Instructor, Course, Student, Registration

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    instructor_id = serializers.UUIDField(source="instructor.id", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "title", "description", "description_full",
            "instructor_id",
            "start_date", "end_date", "syllabus_url", "course_fee",
            "created_at", "updated_at"
        ]

class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField(read_only=True)
    enrollment_count = serializers.SerializerMethodField(read_only=True)
    instructor_id = serializers.UUIDField(source="instructor.id", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "title", "description", "description_full",
            "instructor_id",
            "start_date", "end_date", "syllabus_url", "course_fee",
            "created_at", "updated_at",
            "instructor_name", "enrollment_count"
        ]

    def get_instructor_name(self, obj):
        return f"{obj.instructor.name_first} {obj.instructor.name_last}"

    def get_enrollment_count(self, obj):
        return Registration.objects.filter(course=obj).count()
    
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'
