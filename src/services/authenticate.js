import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userpool from '../userpool';

export const authenticate = (Email, Password, newPassword) => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: Email,
            Pool: userpool
        });

        const authDetails = new AuthenticationDetails({
            Username: Email,
            Password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log("login successful");
                resolve(result);
            },
            onFailure: (err) => {
                console.log("login failed", err);
                reject(err);
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                // User was authenticated but needs to set a new password
                user.completeNewPasswordChallenge(newPassword, userAttributes, {
                    onSuccess: (result) => {
                        console.log("Password change successful:", result);
                        resolve(result);
                    },
                    onFailure: (err) => {
                        console.error("Password change failed:", err);
                        reject(err);
                    }
                });
            }
        });
    });
};

export const logout = () => {
    const user = userpool.getCurrentUser();
    if (user) {
        user.signOut();
    }
    window.location.href = '/';
};
