from rest_framework import serializers
from .models import Instructor, Course, Student, Registration

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    instructor_id = serializers.UUIDField(source="instructor.id")
    prerequisites = serializers.ListField(child=serializers.CharField())
    
    class Meta:
        model = Course
        fields = [
            "id", "course_code", "title", "description", "description_full",
            "instructor_id", 
            "start_date", "end_date", "course_fee",
            "syllabus_url", "prerequisites", "created_at", 
            "updated_at", "is_active"
        ]
        read_only_fields = ["id", "instructor", "created_at", "updated_at", "is_active"]

    def create(self, validated_data):
        instructor_data = validated_data.pop("instructor", None)

        instructor = Instructor.objects.get(id=instructor_data["id"])

        course = Course.objects.create(instructor=instructor, **validated_data)

        return course
    
    def update(self, instance, validated_data):
        instructor_data = validated_data.pop("instructor", None)

        if instructor_data:
            instructor = Instructor.objects.get(id=instructor_data["id"])
            instance.instructor = instructor

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance

class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField(read_only=True)
    enrollment_count = serializers.SerializerMethodField(read_only=True)
    instructor_id = serializers.UUIDField(source="instructor.id", read_only=True)
    prerequisites = serializers.ListField(child=serializers.CharField())
    
    class Meta:
        model = Course
        fields = [
            "id", "title", "description", "description_full",
            "instructor_id",
            "start_date", "end_date", "syllabus_url", "course_fee",
            "created_at", "updated_at",
            "instructor_name", "enrollment_count", "course_code", "prerequisites"
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
    student_id = serializers.UUIDField(source="student.id", read_only=True)
    course_id = serializers.UUIDField(source="course.id", read_only=True)
    student_name = serializers.SerializerMethodField(read_only=True)
    course_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Registration
        fields = [
            "id", "student_id", "student_name", "course_id", "course_name",
            "created_at", "updated_at", "registered_at", "registration_status", "payment_status"
        ]

    def get_student_name(self, obj):
        return f"{obj.student.name_first} {obj.student.name_last}"

    def get_course_name(self, obj):
        return obj.course.title