import { useAuth0 } from "@auth0/auth0-react";
import {jwtDecode} from "jwt-decode"; // ✅ Correct import
import { useState, useEffect } from "react";

const usePermissions = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [permissions, setPermissions] = useState([]); // ✅ Always an array
    const [role, setRole] = useState([]); // ✅ Default empty array

    useEffect(() => {
        const fetchPermissions = async () => {
            if (!isAuthenticated) return;

            try {
                const nameSpace = "https://auth0-nodejs-backend-production.up.railway.app/";
                const token = await getAccessTokenSilently();

                // Decode token after getting it
                const decodedToken = jwtDecode(token);

                // Extract roles & permissions safely
                const userRoles = decodedToken[`${nameSpace}roles`] || [];
                const userPermissions = decodedToken.permissions || [];

                // Store in sessionStorage for faster access
                sessionStorage.setItem("accessToken", token);
                sessionStorage.setItem("userRoles", JSON.stringify(userRoles));
                sessionStorage.setItem("userPermissions", JSON.stringify(userPermissions));

                // Update state
                setRole(userRoles);
                setPermissions(userPermissions);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };

        fetchPermissions();
    }, [isAuthenticated, getAccessTokenSilently]); //  Removed `role` to prevent infinite loop

    // Helper function to check specific permission
    const hasPermission = (perm) => permissions.includes(perm);

    return { role, permissions, hasPermission };
};

export default usePermissions;
