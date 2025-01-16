import { Tabs, Progress } from "antd";
import "./index.css";
import Posts from "../../../components/Community/Posts";
export default function Profile() {

    const tabOnChange = (key) => {
        console.log(key);
    };
    const tabItems = [
        {
            key: '1',
            label: '进度',
            children: (
                <div className="progress">
                    <div className="progressWrapper">
                        <span className="progressName">每一个类别名</span>
                        <Progress
                            className="progressItem"
                            percent={50}
                            percentPosition={{
                                align: 'end',
                                type: 'inner',
                            }}
                            size={[100, 30]}
                            strokeColor="#4caf50"
                        />
                    </div>
                    <div className="progressWrapper">
                        <span className="progressName">每一个类别名</span>
                        <Progress
                            className="progressItem"
                            percent={50}
                            percentPosition={{
                                align: 'end',
                                type: 'inner',
                            }}
                            size={[100, 30]}
                            strokeColor="#4caf50"
                        />
                    </div>
                    <div className="progressWrapper">
                        <span className="progressName">每一个类别名</span>
                        <Progress
                            className="progressItem"
                            percent={50}
                            percentPosition={{
                                align: 'end',
                                type: 'inner',
                            }}
                            size={[100, 30]}
                            strokeColor="#4caf50"
                        />
                    </div>
                    <div className="progressWrapper">
                        <span className="progressName">每一个类别名</span>
                        <Progress
                            className="progressItem"
                            percent={50}
                            percentPosition={{
                                align: 'end',
                                type: 'inner',
                            }}
                            size={[100, 30]}
                            strokeColor="#4caf50"
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '2',
            label: '发帖',
            children: (
                <div className="posts">
                    <Posts />
                    <Posts />
                    <Posts />
                </div>
            ),
        },
    ];

    return (
        <div className='profile'>
            <div className="profileWrapper">
                <div className="profileTop">
                    <img className="profileImg" src="/images/defaultAvatar.jpg" alt="avatar" />
                    <span className="profileName">username</span>
                </div>

                <div className="profileBottom">
                    <Tabs
                        items={tabItems}
                        defaultActiveKey="1"
                        onChange={tabOnChange}
                        type="card"
                    />
                </div>
            </div>
        </div>
    )
}