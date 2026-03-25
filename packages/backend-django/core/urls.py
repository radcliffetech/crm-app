from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import CustomTokenObtainPairView, current_user

urlpatterns = [
    path('api/', include('api.urls')),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', current_user, name='current_user'),
]
