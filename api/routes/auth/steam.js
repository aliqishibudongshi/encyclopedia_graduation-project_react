const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../../models/User');
const authenticateToken = require('../../middleware/authenticateToken');

// 绑定初始化
router.get('/bind', authenticateToken, async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        //确保用户通过会话登录
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('请先登录');
        }

        req.session.save(err => {
            if (err) return res.status(500).send('Session保存失败');
            const params = new URLSearchParams({
                'openid.ns': 'http://specs.openid.net/auth/2.0',
                'openid.mode': 'checkid_setup',
                'openid.return_to': `${process.env.API_BASE}/api/auth/steam/callback`,
                'openid.realm': process.env.API_BASE,
                'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
                'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
            });
            res.redirect(`https://steamcommunity.com/openid/login?${params}`);
        });
    } else {
        try {
            const user = await User.findById(req.user.id);
            user.platforms.steam = {
                bound: true,
                steamId: process.env.STEAM_ID,
                linkedAt: new Date()
            };
            await user.save();

            res.json({
                success: true,
                steamId: process.env.STEAM_ID
            });
        } catch (error) {
            res.status(500).json({ error: '绑定失败' });
        }
    }
});

// 回调处理
router.get('/callback', async (req, res) => {
    //使用会话恢复用户ID。
    let userId = req.session.userId;

    if (!userId) {
        console.error("没有在session中找到用户ID");
        return res.redirect(`${process.env.CLIENT_BASE}/#/dashboard/profile?steam_error=1`);
    }

    try {
        //从req.query构建参数，然后覆盖OpenID.mode
        const params = new URLSearchParams(req.query);
        params.set('openid.mode', 'check_authentication');
        console.log("Verification params:", params.toString());

        // POST请求时明确指定Content-Type和较长的timeout
        const verification = await axios.post(
            'https://steamcommunity.com/openid/login',
            params.toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000  // 设置15秒超时
            }
        );
        console.log("Verification response:", verification.data);

        if (!verification.data.includes('is_valid:true')) {
            throw new Error('验证失败');
        }

        // 从openid.claimed_id中提取SteamID
        const steamId = req.query['openid.claimed_id'].split('/').pop();

        // 更新当前用户的Steam数据
        await User.findByIdAndUpdate(userId, {
            $set: {
                'platforms.steam': {
                    bound: true,
                    steamId,
                    linkedAt: new Date()
                }
            }
        });

        //重定向到客户端前端
        res.redirect(`${process.env.CLIENT_BASE}/#/dashboard/profile?steam_bound=1`);
    } catch (error) {
        console.error('Steam callback error:', error);
        res.redirect(`${process.env.CLIENT_BASE}/#/dashboard/profile?steam_error=1`);
    }
});

module.exports = router;