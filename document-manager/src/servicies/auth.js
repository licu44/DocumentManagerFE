import axios from 'axios';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

export const login = async (username, password) => {
    try {
        const response = await axios.post('https://localhost:7227/api/Auth/login', {
            username: username,
            password: password
        });
        console.log(response, 'response');

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
            console.log(response);
            sigIn({
                token: response.token,
                expiresIn: 60,
                tokenType: 'Bearer',
                authState: { userId: response.userId, userRole: response.role },
            });

            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return signInAndSetToken;
};
