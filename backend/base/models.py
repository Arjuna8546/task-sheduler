from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self,username,email,password=None,**extra_fields):
        if not email:
            raise ValueError("The Email feild must be set")
        email = self.normalize_email(email)
        user = self.model(username = username,email=email,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,username,email,password=None,**extra_fields):
        extra_fields.setdefault("status","active")
        extra_fields.setdefault("role","admin")
        user = self.create_user(username, email, password, **extra_fields)
        
        return user



class Users(AbstractBaseUser):
    STATUS_CHOICE =[
        ("active","Active"),
        ("blocked","Blocked")
    ]

    ROLE_CHOICES = [
        ("admin","Admin"),
        ("user","User")
    ]

    username = models.CharField(max_length=150, unique=True)
    profile_url = models.URLField(blank=True,null=True)
    email =models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_google = models.BooleanField(default=False)
    status = models.CharField(max_length=10,choices=STATUS_CHOICE,default="active")
    role = models.CharField(max_length=10,choices=ROLE_CHOICES,default="user")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username


class Task(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=255)
    scheduled_for = models.DateTimeField()
    completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)      

    def __str__(self):
        return self.name
