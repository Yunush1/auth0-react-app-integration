import React, { useState } from "react";
import { Button, Alert, Spinner } from "reactstrap";
import { useAuth0 ,withAuthenticationRequired} from "@auth0/auth0-react";
import Loading from "../components/Loading";
import { getConfig } from "../config";
import ToDoList from "../components/component/TodoList";
export const AdminAccess = () => {
    const { apiOrigin } = getConfig();
    const { getAccessTokenSilently } = useAuth0(); // ✅ Auth0 Hook for secure API calls
    const [message, setMessage] = useState("Click to check admin permissions");
    const [isLoading, setIsLoading] = useState(false);
    const [permissions, setPermissions] = useState(null);
    const [showResult, setShowResult] = useState(false);

    // ✅ Fetch User Permissions from Backend
    const fetchUserPermissions = async () => {
        setIsLoading(true);
        setMessage("Checking admin permissions...");

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${apiOrigin}/user-permission`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch permissions");

            const data = await response.json();
            setPermissions(data.role);
            setMessage(`User has "${data.role}" permissions.`);
        } catch (error) {
            setMessage("Error fetching permissions. Please try again.");
            console.error("Permission error:", error);
        } finally {
            setIsLoading(false);
            setShowResult(true);
        }
    };

    return (
        <div className="admin-access-container">
            {showResult && (
                <Alert color={permissions === "admin" ? "success" : "warning"}>
                    {message}
                </Alert>
            )}

            <Button color="primary" onClick={fetchUserPermissions} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Check Admin Permissions"}
            </Button>
            <ToDoList/>
        </div>
    );
};

export default withAuthenticationRequired(AdminAccess, {
    onRedirecting: () => <Loading />,
  });