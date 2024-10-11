import { Button } from '@mui/material';
import './Header.css';

export default function Header(props: {forceSync: Function}) {
    return (
        <div className="Header">
            <h3>userthing</h3>
            <Button variant="contained" onClick={() => {
                props.forceSync();
            }}>
                Force Sync with Slack
            </Button>
        </div>
    );
}