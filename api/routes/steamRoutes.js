// api/routes/steamRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const axios = require('axios');
const User = require('../models/User');

router.get('/games/:steamId', authenticateToken, async (req, res) => {

    try {
        // 权限验证
        const user = await User.findById(req.user.id);
        if (!user?.platforms?.steam?.bound || String(user.platforms.steam.steamId) !== String(req.params.steamId)) {
            return res.status(403).json({ error: '无访问权限' });
        }

        // 并行获取基础数据(增加超时和重试）
        const [gamesRes, profileRes] = await Promise.all([
            axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${req.params.steamId}&include_appinfo=true`, {
                timeout: 10000,
                headers: { 'Retry-After': 3 }
            }),
            axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${req.params.steamId}`, { timeout: 10000 })
        ]);

        // 数据校验
        if (!gamesRes.data?.response?.games) {
            return res.json({
                profile: null,
                games: [],
                totalPlaytime: 0
            });
        }

        // 处理游戏数据
        const enhancedGames = [];
        const filteredGames = gamesRes.data.response.games
            .filter(g => g.playtime_forever > 0); // 过滤0分钟游戏

        // 带错误处理的成就获取
        for (const game of filteredGames) {
            try {
                const ratio = await getAchievementRatio(game.appid, req.params.steamId);
                enhancedGames.push({
                    appid: game.appid,
                    name: game.name,
                    playtime: game.playtime_forever,
                    img_url: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`,
                    achievement_ratio: ratio
                });
            } catch (error) {
                enhancedGames.push({
                    ...game,
                    achievement_ratio: 0
                });
            }
        }

        // 构建响应数据
        res.json({
            profile: {
                avatar: profileRes.data?.response?.players[0]?.avatarfull,
                username: profileRes.data?.response?.players[0]?.personaname
            },
            games: enhancedGames.sort((a, b) => b.playtime - a.playtime), // 按游玩时间排序
            totalPlaytime: gamesRes.data.response.games.reduce((sum, g) => sum + g.playtime_forever, 0),
        });
    } catch (error) {
        console.error('Steam API Error:', {
            message: error.message,
            url: error.config?.url, // 显示实际请求的URL
            status: error.response?.status,
            data: error.response?.data // Steam API 返回的具体错误信息
        });
        res.status(500).json({
            error: '数据获取失败',
            details: error.message
        });
    }
});

async function getAchievementRatio(appId, steamId) {
    try {
        const { data } = await axios.get(
            `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${appId}&key=${process.env.STEAM_API_KEY}&steamid=${steamId}`
        );

        // 处理无成就的游戏
        if (!data.playerstats?.achievements) return 0;

        const achieved = data.playerstats.achievements.filter(a => a.achieved).length;
        return achieved / data.playerstats.achievements.length;
    } catch (error) {
        if (error.response?.status === 404) {
            return 0; // 游戏没有成就系统
        }
        throw error;
    }
}

module.exports = router;