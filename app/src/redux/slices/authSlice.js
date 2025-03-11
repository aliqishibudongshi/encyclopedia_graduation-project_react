import { createSlice } from '@reduxjs/toolkit';

const initialState = () => {
    const username = localStorage.getItem('username');
    const steamData = username
        ? JSON.parse(localStorage.getItem(`steamData_${username}`))
        : null;

    return {
        isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
        username: localStorage.getItem('username') || null,
        token: localStorage.getItem('token') || null,
        lastRoute: '/dashboard/illustrations',
        platforms: {
            steam: {
                bound: !!steamData,
                steamId: steamData?.steamId || null,
                games: steamData?.games || [],
                profile: steamData?.profile || {},
                total: steamData?.total || 0,
                totalPlaytime: steamData?.totalPlaytime || 0
            }
        }
    }
}
// const initialState = {
//     isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
//     username: localStorage.getItem('username') || null,
//     token: localStorage.getItem('token') || null,
//     lastRoute: '/dashboard/illustrations',
//     platforms: {
//         steam: {
//             bound: false,
//             steamId: null,
//             games: [],
//             profile: {},
//             totalPlaytime: null,
//         },
//     }
// };


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.username = action.payload.username;
            // Save to localStorage
            localStorage.setItem('isLoggedIn', JSON.stringify(true));
            localStorage.setItem('username', action.payload.username);
            localStorage.setItem('token', action.payload.token);
        },
        logout(state) {
            // 清除用户专属数据
            if (state.username) {
                localStorage.removeItem(`steamData_${state.username}`);
            }

            state.isLoggedIn = false;
            state.username = null;
            state.token = null;
            state.lastRoute = '/dashboard/illustrations';
            // Remove from localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('token');
        },
        setLastRoute(state, action) {
            state.lastRoute = action.payload;
        },
        bindPlatform: (state, action) => {
            const { platform, data } = action.payload;
            state.platforms[platform].bound = true;
            if (platform === 'steam') state.platforms.steam.steamId = data;
        },
        updateGames: (state, action) => {
            const { platform, games, profile, totalPlaytime, total, merge = false } = action.payload;

            if (merge) {
                state.platforms[platform].games = [...state.platforms[platform].games, ...games];
            } else {
                state.platforms[platform].games = games;
            }

            if (profile) {
                state.platforms[platform].profile = profile;
            }

            if (totalPlaytime !== undefined) {
                state.platforms[platform].totalPlaytime = totalPlaytime;
            }

            if (total) {
                state.platforms[platform].total = total;
            }

            // 同步到 localStorage
            const storageKey = `steamData_${state.username}`;
            localStorage.setItem(storageKey, JSON.stringify({
                games,
                profile,
                totalPlaytime,
                total,
                lastUpdated: Date.now()
            }));
        }
    },
});

export const { login, logout, setLastRoute, bindPlatform, updateGames } = authSlice.actions;
export default authSlice.reducer;