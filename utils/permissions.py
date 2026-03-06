class Perms:
    def __init__(self):
        self.app_usage = "app_usage"
        self.full_perm = "full_perm"
        self.add_server = "add_server"

class Permissions:
    def __init__(self):
        self.users_perms = [Perms().app_usage]
        self.premium_users_perms = []
        self.admin_perms = [Perms().add_server]
        self.owner_perms = [Perms().full_perm]

    def get_permissions(self, role):
        if role == "user":
            return self.users_perms
        elif role == "premium_user":
            return self.premium_users_perms + self.users_perms
        elif role == "admin":
            return self.users_perms + self.premium_users_perms + self.admin_perms
        elif role == "owner":
            return self.owner_perms + self.admin_perms + self.premium_users_perms + self.users_perms
        else:
            raise ValueError("Invalid role")

class InheritedPermissions(Permissions):
    def __init__(self):
        super().__init__()

    def get_permissions(self, role):
        if role == "admin":
            return super().get_permissions("admin")
        elif role == "owner":
            return super().get_permissions("owner")
        else:
            return super().get_permissions(role)