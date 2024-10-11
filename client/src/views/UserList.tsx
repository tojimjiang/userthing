import { useState, useEffect, useRef } from 'react';
import "./UserList.css";
import {
    Card,
    CardContent,
    CardHeader,
} from '@mui/material';
import Header from '../components/Header';
import EmojiConvertor from 'emoji-js';

var emoji = new EmojiConvertor();

function UserList() {
    const [userList, setUserList] = useState<Array<{
        id: string,
        team_id: string,
        name: string,
        real_name: string,
        status: {
            text: string,
            emoji: string,
            expiration: number,
        },
        email: string,
        profile_image: string
    }>>([]);

    const [timestamp, setTimestamp] = useState<number>(Date.now());
    let pollingIntervalId = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
        setupPolling();
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
    }, [])

    useEffect(() => {
        loadAPICall();
    }, [timestamp]);

    function setupPolling() {
        if (!pollingIntervalId.current) {
            // console.log("Set up polling");
            let newPollingIntervalId = setInterval(() => {
                setTimestamp(Date.now());
            }, 15000);
            pollingIntervalId.current = newPollingIntervalId;
        }
    }

    function clearPolling() {
        // console.log("tear down polling", pollingIntervalId);
        if (pollingIntervalId.current) {
            clearInterval(pollingIntervalId.current);
            pollingIntervalId.current = null;
        }
    }

    function onBlur() {
        clearPolling();
    }

    function onFocus() {
        loadAPICall();
        setupPolling();
    }

    function renderUserStatus(status: {
        text: string,
        emoji: string,
        expiration: number,
    }) {
        if (status.text.length || status.emoji.length) {
            if (status.expiration > 0) {
                if (status.expiration > timestamp) {
                    return <span>{emoji.replace_colons(status.emoji)} {status.text} - until {new Date(status.expiration).toLocaleTimeString()}</span>
                }
            }
            else {
                return <span>{emoji.replace_colons(status.emoji)} {status.text}</span>
            }
        }
        return <span className="user-no-status"><em>no current user status</em></span>
    }

    async function loadAPICall() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('/query', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            let response = await rawResponse.json();
            setUserList(response);
        })
    }

    async function forceSyncAPICall() {
        return new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('/sync', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            let response = await rawResponse.json();
        })
    }

    return (
        <>
            <Header forceSync={() => {
                forceSyncAPICall();
            }}/>
            <div className="user-list-page">
                <div className="user-list-title">
                    <h2>
                        jimjiangcom slack users
                    </h2>
                </div>
                <div className="user-list-container">
                    {userList.map((user) => {
                        return <Card key={user.id} id={user.id}>
                            <CardHeader
                                avatar={<img className="user-list-card-avatar" src={user.profile_image}></img>}
                                title={<span className="user-name"><b>{user.real_name}</b> [{user.name}]</span>}
                                subheader={user.email ? <span className="user-email">email: <em><a className="email-link" href={"mailto:" + user.email}>{user.email}</a></em></span> : <></>}
                            />
                            <CardContent>
                                <span>{renderUserStatus(user.status)}</span>
                            </CardContent>
                        </Card>
                    })}
                </div>
            </div>
        </>
    );
}

export default UserList;
