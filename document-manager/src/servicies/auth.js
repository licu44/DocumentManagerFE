import axios from 'axios';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

export const login = async (username, password) => {
    try {
        const response = await axios.post('https://localhost:7227/api/Auth/login', {
            username: username,
            password: password
        });

        const { data } = response;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const useAuthSignIn = () => {
    const sigIn = useSignIn();
    const navigate = useNavigate();

    const signInAndSetToken = async (username, password) => {
        try {
            const response = await login(username, password);

            sigIn({
                token: response,
                expiresIn: 3600,
                tokenType: 'Bearer',
                authState: { username: username }
            });

            // Redirect to the home page upon successful login
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return signInAndSetToken;
};
