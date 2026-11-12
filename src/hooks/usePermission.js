import { hasPermission } from "@/config/haspermission";
import { useAuthStore } from "@/stores/auth-store";
 

export function usePermission(resource, action) {
    const { auth } = useAuthStore();

    const role = auth.user?.role;

    return hasPermission(role, resource, action);
}