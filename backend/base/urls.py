from django.urls import path
from .views import CoustomTokenObtainPairView,CoustomTokenRefreshView,Register,Tasks,Logout,VerifyOtp,ResendOtp

urlpatterns = [
    path('token/',CoustomTokenObtainPairView.as_view()),
    path('token/refresh/',CoustomTokenRefreshView.as_view()),
    path('register/',Register.as_view()),
    path('resendotp/',ResendOtp.as_view()),
    path('verifyotp/',VerifyOtp.as_view()),
    path('tasks/<int:user_id>',Tasks.as_view()),
    path('tasks/',Tasks.as_view()),
    path('tasks/edit/<int:task_id>',Tasks.as_view()),
    path('tasks/delete/<int:task_id>',Tasks.as_view()),
    path('logout/',Logout.as_view())
]
